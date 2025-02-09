import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorator/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { RolesGuard } from '../auth/guards/role.guards';
import { Public } from '../auth/decorator/public.decorator';

@Controller('users')
@UseGuards( RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('merchant')
  async findAll() {
    return this.usersService.findAll();
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Request() req) {
    return req.user;
  }

}
