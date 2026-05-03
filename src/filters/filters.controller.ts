import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FiltersService } from './filters.service';
import { CreateFilterDto } from './dto/create-filter.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('filters')
@UseGuards(JwtAuthGuard)
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Post()
  create(
    @Req() request: Request & { user: { id: number; email: string } },
    @Body() createFilterDto: CreateFilterDto,
  ) {
    return this.filtersService.create(request.user.id, createFilterDto);
  }

  @Get()
  findAll(
    @Req() request: Request & { user: { id: number; email: string } },
  ) {
    return this.filtersService.findAllByUser(request.user.id);
  }

  @Delete(':id')
  remove(
    @Req() request: Request & { user: { id: number; email: string } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.filtersService.remove(request.user.id, id);
  }
}
