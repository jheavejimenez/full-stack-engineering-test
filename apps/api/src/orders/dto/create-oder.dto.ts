import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsUUID, Min, ValidateNested } from 'class-validator';
import { OrderStatus } from '../../enums/enums';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: number;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
