import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-oder.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {
  }

  @Get()
  async findAll(@Req() req) {
    return this.ordersService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req) {
    return await this.ordersService.findOne(id, req.user.id);
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.ordersService.createOrder(createOrderDto, req.user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    return this.ordersService.updateOrder(id, req.user.id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    return this.ordersService.removeOrder(id, req.user.id);
  }
}
