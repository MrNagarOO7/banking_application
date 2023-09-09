import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  LoginUserDto,
  SendOtpUserDto,
  RecieveOtpUserDto,
} from './dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('sign-in')
  signIn(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Post('send-otp')
  sendOtp(@Body() sendOtpUserDto: SendOtpUserDto) {
    return this.usersService.sendOtp(sendOtpUserDto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() recieveOtpUserDto: RecieveOtpUserDto) {
    return this.usersService.verifyOtp(recieveOtpUserDto);
  }
}
