import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe, Req, ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '../auth/decorator/public.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Req() req): Promise<Product> {
    return this.productsService.createProduct(createProductDto, req.user.id);
  }

  @Get()
  @Public()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: number): Promise<Product> {
    return this.productsService.findProductById(id);
  }

  @Get('merchant')
  async findByMerchant(@Req() req): Promise<Product[]> {
    return this.productsService.findProductsByMerchant(req.user.id);
  }

  @Get(':id/merchant')
  async findProductByMerchant(
    @Param('id', ParseUUIDPipe) id: number,
    @Req() req,
  ): Promise<Product> {
    return this.productsService.findProductByMerchant(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: number,
    @Req() req,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return this.productsService.update(id, req.user.id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: number, @Req() req): Promise<void> {
    return this.productsService.remove(id, req.user.id);
  }
}
