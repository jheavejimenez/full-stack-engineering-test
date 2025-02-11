import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../enums/enums';

export class SignupRequestDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
