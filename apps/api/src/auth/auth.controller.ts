import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { SignupRequestDto } from './dto/signup-request.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req): Promise<LoginResponseDto | BadRequestException> {
    return this.authService.login(req.user);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupRequestDto): Promise<SignupResponseDto | BadRequestException> {
    return this.authService.signup(signupDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Request() req) {
    return req.user;
  }
}
