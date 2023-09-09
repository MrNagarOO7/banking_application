import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum TransactionFilterType {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  MINISTATEMENT = 'ministatement',
}

export class FetchTransactionsDto {
  @ApiProperty({
    enum: TransactionFilterType,
    isArray: true,
  })
  @IsEnum(TransactionFilterType)
  duration: TransactionFilterType;
}
