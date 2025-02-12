import { IsEnum, IsOptional, ValidateNested, IsArray, IsNumber, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../enums/enums';
import { CreateProductDto } from '../../products/dto/create-product.dto';

class UpdateOrderItemDto {
  @IsUUID()
  id: number;

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

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  @IsOptional()
  items?: UpdateOrderItemDto[];
}
