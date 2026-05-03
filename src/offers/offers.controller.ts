import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { OffersService } from './offers.service';
import { GetOffersQueryDto } from './dto/get-offers-query.dto';


@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
findAll(@Query() query: GetOffersQueryDto) {
  return this.offersService.findAll(query);
}


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.findOne(id);
  }
}
