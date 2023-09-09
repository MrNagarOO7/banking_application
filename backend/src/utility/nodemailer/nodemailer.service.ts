import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodeMailer from 'nodemailer';

@Injectable()
export class NodeMailerService {
  constructor(private readonly configService: ConfigService) {}

  sendMail = async (to: string, otp: string) => {
    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('gmail.email'),
        pass: this.configService.get<string>('gmail.password'),
      },
    });
    const mailOptions = {
      from: this.configService.get<string>('gmail.email'),
      to,
      subject: 'OTP for APP',
      text: `Your otp for login is ${otp}.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true, data: [], error: '' };
    } catch (e) {
      console.log('Error to send email as ', e);
      return { success: false, data: [], error: e };
    }
  };
}
