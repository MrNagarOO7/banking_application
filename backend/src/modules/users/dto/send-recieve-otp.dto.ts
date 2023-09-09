import { IsPhoneNumber, IsString } from 'class-validator';

export class SendOtpUserDto {
  @IsPhoneNumber('IN')
  contactNo: string;
}

export class RecieveOtpUserDto {
  @IsPhoneNumber('IN')
  contactNo: string;

  @IsString()
  loginOtp: string;
}
