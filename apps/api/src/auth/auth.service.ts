import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignupRequestDto } from './dto/signup-request.dto';
import { UserResponseDto, UserWithPasswordDto } from '../users/dto/user-response.dto';
import { CreateUserDto } from '../users/dto/create-users.dto';
import { plainToInstance } from 'class-transformer';
import { UserRole } from '../enums/enums';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }
    return plainToInstance(UserResponseDto, user);
  }


  async login(user: UserResponseDto) {
    const payload = {
      email: user.email,
      name: user.name,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  async signup(signupRequestDto: SignupRequestDto) {
    const { email, password, name, role } = signupRequestDto;

    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException('Invalid role specified');
    }

    const existingUser = await this.usersService.isEmailTaken(email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createUserDto = new CreateUserDto();
    createUserDto.email = email;
    createUserDto.password = hashedPassword;
    createUserDto.name = name;
    createUserDto.role = role as UserRole;

    const user = await this.usersService.createUser(createUserDto);
    return this.login(plainToInstance(UserResponseDto, user));
  }

}
