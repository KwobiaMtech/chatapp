import { JwtAuthGuard } from './../../auth/guards/auth.guard';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('menu/items')
export class ItemsController {
  constructor() {}

  //@UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<any> {
    return { response: 'received' };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async find(@Param('id') id: number): Promise<any> {
    return `params ${id}`;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body('item') item: any): Promise<void> {
    console.log(`created body ${item}`);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body('item') item: any): Promise<void> {
    console.log('item updated');
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    console.log('item deleted');
  }
}
