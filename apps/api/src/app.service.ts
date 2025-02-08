import { Injectable } from '@nestjs/common';
import * as process from 'process';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.env.PORT);
    return  'Hello World!';
  }
}
