import { ApiHideProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit',
  CANCLE = 'cancle',
}

export class AddTransactionDto {
  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  accountNo: number;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  transactionId: string;

  @IsOptional()
  @IsString()
  receiverContactNo: string;

  @IsOptional()
  @IsNumber()
  receiverAccountNo: number;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  receiverTransactionId: string;

  @IsNumber()
  amount: number;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  type: string;
}
