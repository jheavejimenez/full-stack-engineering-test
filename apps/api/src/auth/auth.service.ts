import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignupRequestDto } from './dto/signup-request.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup({ email, password, name, role }: SignupRequestDto) {
    const existingUser = await this.usersService.isEmailTaken(email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = await this.usersService.createUser({
      email,
      password: hashedPassword,
      name,
      role,
    });
    return this.login(user);
  }
}
