import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService, private usersService: UsersService) {
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async signup({email, password, name, role}: SignupDto) {
    const existingUser = await this.usersService.isEmailTaken(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({ name, email, password: hashedPassword, role });
    const { password: _, ...result } = user;
    return result;

  }

}
