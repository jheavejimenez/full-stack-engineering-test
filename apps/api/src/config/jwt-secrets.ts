import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

// just to make it simple hard coding the secret and expiresIn
// not sure why jtw.strategy.ts is not able to read the values from .env file
export const jwtSecrets = {
  secret: configService.get<string>('JWT_SECRET') || 'secret',
  expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d',
};