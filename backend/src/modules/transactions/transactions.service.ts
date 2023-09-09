import { Injectable } from '@nestjs/common';
import { AddTransactionDto } from './dto';
import {
  Transaction,
  TransactionDocument,
  TransactionType,
} from './schemas/transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonResponse, randomString } from '../../utility';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly userService: UsersService,
  ) {}
  async addTransaction(addTransactionDto: AddTransactionDto) {
    try {
      let checkIdExist = true;
      // Recevier or Payee Transaction Id
      let checkRecIdExist = true;
      let transactionId: string;
      let transactionRecId: string;

      const existAccountResult = await this.userService.accountExist(
        addTransactionDto.accountNo,
      );

      if (!existAccountResult.success) {
        return CommonResponse.getFailedResponse(existAccountResult.msg);
      }

      const existAccount = existAccountResult.data;

      if (
        existAccount.accountNo === addTransactionDto.receiverAccountNo ||
        existAccount.contactNo === addTransactionDto.receiverContactNo
      ) {
        return CommonResponse.getFailedResponse('SAME_PAYEE');
      }

      if (addTransactionDto.amount <= 0) {
        return CommonResponse.getFailedResponse('INVALID_AMOUNT');
      }

      if (existAccount.balance < addTransactionDto.amount) {
        return CommonResponse.getFailedResponse('LOW_BALANCE');
      }

      const existRecAccountResult = await this.userService.accountExist(
        addTransactionDto.receiverAccountNo,
        addTransactionDto.receiverContactNo,
      );

      if (!existRecAccountResult.success) {
        return CommonResponse.getFailedResponse('PAYEE_NOT_EXIST');
      }

      // Receiver Account Info
      const existRecAccount = existRecAccountResult.data;

      while (checkIdExist) {
        transactionId = randomString(8);
        const existTransaction = await this.transactionModel.findOne({
          transactionId,
        });
        if (!existTransaction) checkIdExist = false;
      }

      addTransactionDto.transactionId = transactionId;
      addTransactionDto.type = addTransactionDto?.type
        ? addTransactionDto?.type
        : 'debit';
      addTransactionDto.receiverAccountNo = existRecAccount.accountNo;
      addTransactionDto.receiverContactNo = existRecAccount.contactNo;

      const session = await this.transactionModel.startSession();
      try {
        session.startTransaction();

        const respData = (
          await new this.transactionModel(addTransactionDto).save({ session })
        ).toObject();

        while (checkRecIdExist) {
          transactionRecId = randomString(8);
          const existRecTransaction = await this.transactionModel.findOne({
            transactionRecId,
          });
          if (!existRecTransaction) checkRecIdExist = false;
        }

        const receiverTransactionDto = {
          transactionId: transactionRecId,
          accountNo: existRecAccount.accountNo,
          amount: addTransactionDto.amount,
          type: addTransactionDto.type === 'debit' ? 'credit' : 'debit',
          receiverAccountNo: existAccount.accountNo,
          receiverContactNo: existAccount.contactNo,
          receiverTransactionId: addTransactionDto.transactionId,
        };

        await new this.transactionModel(receiverTransactionDto).save({
          session,
        });

        // Update Balance of Payer
        const updateUserAccount = await this.userService.updateBalance(
          existAccount.accountNo,
          addTransactionDto.amount,
          addTransactionDto.type,
          session,
        );

        if (updateUserAccount.success) {
          respData['balance'] = updateUserAccount?.data?.balance;
        }

        // Update Balance of Payee
        await this.userService.updateBalance(
          existRecAccount.accountNo,
          addTransactionDto.amount,
          receiverTransactionDto.type,
          session,
        );

        await session.commitTransaction();
        session.endSession();

        return CommonResponse.getSuccessResponse(
          respData,
          'TRANSFER_SUCCESS',
          201,
        );
      } catch (e) {
        await session.abortTransaction();
        return CommonResponse.getFailedResponse(null, null, e);
      }
    } catch (error) {
      return CommonResponse.getFailedResponse(null, null, error);
    }
  }

  async listTransactions(accountNo: number, duration: string) {
    try {
      const matchCondition = {
        accountNo,
      };

      const today = new Date();
      if (duration === 'weekly') {
        matchCondition['createdAt'] = {
          $gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          $lt: today,
        };
      } else if (duration === 'monthly') {
        matchCondition['createdAt'] = {
          $gt: new Date(today.getFullYear(), today.getMonth() - 1, 1),
          $lt: today,
        };
      }

      const aggregateCondition: any = [
        {
          $match: matchCondition,
        },
        { $sort: { createdAt: -1 } },
      ];

      if (duration === 'ministatement') {
        aggregateCondition.push({
          $limit: 5,
        });
      }

      const listData = await this.transactionModel.aggregate(
        aggregateCondition,
      );

      return CommonResponse.getSuccessResponse(
        { listData },
        'LIST_TRANSACTION',
        201,
      );
    } catch (error) {
      return CommonResponse.getFailedResponse(null, null, error);
    }
  }

  async cancleTransaction(id: string, accountNo: number) {
    try {
      const existTransaction = await this.transactionModel.findOne(
        { transactionId: id },
        null,
        {
          lean: true,
        },
      );

      if (!existTransaction) {
        return CommonResponse.getFailedResponse('NO_TRANSACTION');
      }

      // Already Canceled
      if (existTransaction.type == TransactionType.CANCLE) {
        return CommonResponse.getFailedResponse('CANCELED_TRANSACTION');
      }

      // Cancled by another account or token
      if (existTransaction.accountNo !== accountNo) {
        return CommonResponse.getFailedResponse('NO_ACCESS');
      }

      const transactionTimestamp = new Date(
        existTransaction['createdAt'],
      ).getTime();
      const currentTimestamp = new Date().getTime();
      const timeDiff = currentTimestamp - transactionTimestamp;

      // Time befor 1 hour
      if (timeDiff < 0 || timeDiff > 60 * 60 * 100) {
        return CommonResponse.getFailedResponse('FAILED_CANCLE_TRANSACTION');
      }

      const session = await this.transactionModel.startSession();
      try {
        session.startTransaction();
        if (existTransaction['type'] == TransactionType.DEBIT) {
          await this.userService.updateBalance(
            existTransaction.accountNo,
            existTransaction.amount,
            TransactionType.CREDIT,
            session,
          );
          await this.userService.updateBalance(
            existTransaction.receiverAccountNo,
            existTransaction.amount,
            TransactionType.DEBIT,
            session,
          );
        } else {
          await this.userService.updateBalance(
            existTransaction.accountNo,
            existTransaction.amount,
            TransactionType.DEBIT,
            session,
          );
          await this.userService.updateBalance(
            existTransaction.receiverAccountNo,
            existTransaction.amount,
            TransactionType.CREDIT,
            session,
          );
        }

        // Parent Transaction Id
        let receiverTransactionId = id;
        if (existTransaction?.receiverTransactionId) {
          receiverTransactionId = existTransaction.receiverTransactionId;
        }
        const updateTask = await this.transactionModel.updateMany(
          { $or: [{ transactionId: id }, { receiverTransactionId }] },
          { type: TransactionType.CANCLE },
          { new: true, session },
        );

        await session.commitTransaction();
        session.endSession();

        return CommonResponse.getSuccessResponse(
          updateTask,
          'CANCELE_TRANSACTION',
        );
      } catch (e) {
        await session.abortTransaction();
        return CommonResponse.getFailedResponse(null, null, e);
      }
    } catch (error) {
      return CommonResponse.getFailedResponse(null, null, error);
    }
  }
}
