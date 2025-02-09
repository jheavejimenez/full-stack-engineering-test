import { IsDecimal, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDecimal()
    @Min(0)
    price: number;

    @IsInt()
    @Min(0)
    stock: number;
}
