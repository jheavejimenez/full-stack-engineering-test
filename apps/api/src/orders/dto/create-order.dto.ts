import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsUUID, Min, ValidateNested } from 'class-validator';
import { OrderStatus } from '../../enums/enums';
import { Type } from 'class-transformer';
import { CreateProductDto } from '../../products/dto/create-product.dto';

class CreateOrderItemDto {
  @ValidateNested()
  @Type(() => CreateProductDto)
  product: CreateProductDto;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsUUID()
  customerId: number;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
