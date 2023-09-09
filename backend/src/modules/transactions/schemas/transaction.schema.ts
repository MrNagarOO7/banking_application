import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit',
  CANCLE = 'cancle',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  accountNo: number;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  receiverContactNo: string;

  @Prop({ required: true })
  receiverAccountNo: number;

  @Prop()
  receiverTransactionId: string;

  @Prop({ type: String, enum: TransactionType })
  type: TransactionType;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
