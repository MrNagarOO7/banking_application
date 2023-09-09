import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NodeMailerService } from './nodemailer.service';

@Module({
  imports: [ConfigModule],
  providers: [NodeMailerService],
  exports: [NodeMailerService],
})
export class NodeMailerModule {}
