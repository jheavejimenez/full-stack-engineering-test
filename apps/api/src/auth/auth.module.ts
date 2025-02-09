import { Module } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecrets } from '../config/jwt-secrets';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecrets.secret,
      signOptions: { expiresIn: jwtSecrets.expiresIn },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
