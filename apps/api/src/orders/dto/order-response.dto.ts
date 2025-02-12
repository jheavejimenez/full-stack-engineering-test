import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { OrderStatus } from '../../enums/enums';

class OrderItemResponseDto {
  @IsNumber()
  productId: number;

  @IsString()
  productName: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  total: number;
}

export class OrderResponseDto {
  @IsUUID()
  id: string;

  @IsUUID()
  customerId: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNumber()
  totalPrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];
}
