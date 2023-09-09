import {
  Controller,
  UseGuards,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { AddTransactionDto, FetchTransactionsDto } from './dto';
import { TransactionGuard } from './transactions.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('transactions')
@UseGuards(TransactionGuard)
export class TransactionsController {
  constructor(private readonly service: TransactionService) {}

  @Post()
  transfer(@Request() req, @Body() addTransactionDto: AddTransactionDto) {
    const accountNo = req.user.accountNo;
    addTransactionDto.accountNo = accountNo;
    return this.service.addTransaction(addTransactionDto);
  }

  @Get()
  list(@Request() req, @Query() fetchTransactionsDto: FetchTransactionsDto) {
    const accountNo = req.user.accountNo;
    return this.service.listTransactions(
      accountNo,
      fetchTransactionsDto.duration,
    );
  }

  @Patch(':id')
  cancle(@Request() req, @Param('id') id: string) {
    const accountNo = req.user.accountNo;
    return this.service.cancleTransaction(id, accountNo);
  }
}
