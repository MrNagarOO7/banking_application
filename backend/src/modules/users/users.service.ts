import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { CommonResponse, randomString, NodeMailerService } from '../../utility';
import {
  CreateUserDto,
  LoginUserDto,
  SendOtpUserDto,
  RecieveOtpUserDto,
} from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly mailService: NodeMailerService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      let checkIdExist = true;
      let accountNo: string;

      const existEmailUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (existEmailUser) {
        return CommonResponse.getFailedResponse('USER_EMAIL_EXIST');
      }

      const existPhoneUser = await this.userModel.findOne({
        contactNo: createUserDto.contactNo,
      });
      if (existPhoneUser) {
        return CommonResponse.getFailedResponse('USER_PHONE_EXIST');
      }

      while (checkIdExist) {
        accountNo = randomString(16);
        const existUser = await this.userModel.findOne({ accountNo });
        if (!existUser) checkIdExist = false;
      }

      createUserDto.accountNo = accountNo;
      // Add Default balance
      createUserDto.balance = 100;
      const respData = (
        await new this.userModel(createUserDto).save()
      ).toObject();
      delete respData.password;
      return CommonResponse.getSuccessResponse(respData, 'SIGN_UP', 201);
    } catch (error) {
      return CommonResponse.getFailedResponse(null, null, error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const userExist = await this.userModel.findOne(
      { email: loginUserDto.email },
      null,
      { lean: true },
    );

    if (!userExist) return CommonResponse.getFailedResponse('NO_USER');

    const validPassword = await bcrypt.compare(
      loginUserDto.password,
      userExist.password,
    );

    if (!validPassword) {
      return CommonResponse.getFailedResponse('PASSWORD_INCORRECT');
    }

    const payload = { accountNo: userExist.accountNo, email: userExist.email };
    const accessToken = this.jwtService.sign(payload);

    return CommonResponse.getSuccessResponse(
      {
        email: userExist.email,
        accountNo: userExist.accountNo,
        accessToken,
        firstName: userExist.firstName,
        lastName: userExist.lastName,
        balance: userExist.balance,
      },
      'SIGN_IN',
      201,
    );
  }

  async sendOtp(sendOtpUserDto: SendOtpUserDto) {
    try {
      const userExist = await this.userModel.findOne(
        { contactNo: sendOtpUserDto.contactNo },
        null,
        { lean: true },
      );

      if (!userExist) return CommonResponse.getFailedResponse('NO_USER');

      const loginOtp = randomString(6);
      const updateUser = await this.userModel.updateOne(
        {
          accountNo: userExist.accountNo,
        },
        { loginOtp },
      );

      const result = await this.mailService.sendMail(userExist.email, loginOtp);
      if (result.success) {
        return CommonResponse.getSuccessResponse(updateUser, 'SENT_OTP', 201);
      }
      return CommonResponse.getFailedResponse(null, null, result.error);
    } catch (error) {
      return CommonResponse.getFailedResponse(null, null, error);
    }
  }

  async verifyOtp(recieveOtpUserDto: RecieveOtpUserDto) {
    try {
      const userExist = await this.userModel.findOne(
        {
          contactNo: recieveOtpUserDto.contactNo,
          loginOtp: recieveOtpUserDto.loginOtp,
        },
        null,
        { lean: true },
      );

      if (!userExist) return CommonResponse.getFailedResponse('INVALID_OTP');

      await this.userModel.updateOne(
        {
          accountNo: userExist.accountNo,
        },
        { loginOtp: '' },
      );

      const payload = {
        accountNo: userExist.accountNo,
        email: userExist.email,
      };
      const accessToken = this.jwtService.sign(payload);

      return CommonResponse.getSuccessResponse(
        {
          email: userExist.email,
          accountNo: userExist.accountNo,
          accessToken,
          firstName: userExist.firstName,
          lastName: userExist.lastName,
          balance: userExist.balance,
        },
        'SIGN_IN',
        201,
      );
    } catch (error) {
      return CommonResponse.getFailedResponse(null, null, error);
    }
  }

  async accountExist(accountNo: number, contactNo?: string) {
    const existAccount = await this.userModel.findOne(
      {
        $or: [{ accountNo }, { contactNo }],
      },
      null,
      { lean: true },
    );

    if (!existAccount) return { success: false, msg: 'NO_USER' };
    return { success: true, msg: 'USER_FOUND', data: existAccount };
  }

  async updateBalance(
    accountNo: number,
    amount: number,
    type: string,
    session: any,
  ) {
    if (type === 'debit') {
      amount = -1 * amount;
    }
    const existAccount = await this.userModel.findOneAndUpdate(
      { accountNo },
      { $inc: { balance: amount } },
      { lean: true, session, new: true },
    );

    if (!existAccount) return { success: false, msg: 'NO_USER' };
    return { success: true, msg: 'BALANCE_UPDATE', data: existAccount };
  }
}
