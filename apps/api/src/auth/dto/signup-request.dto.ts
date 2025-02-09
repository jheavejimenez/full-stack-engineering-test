import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class SignupRequestDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(['merchant', 'customer'])
  role: 'merchant' | 'customer';
}
