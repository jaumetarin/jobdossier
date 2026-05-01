import { Controller, Get, Post } from '@nestjs/common';
import { AdzunaService } from './adzuna.service';
import { TecnoempleoService } from './tecnoempleo.service'; 

@Controller('fetcher')
export class FetcherController {
  constructor(
    private readonly adzunaService: AdzunaService,
    private readonly tecnoempleoService: TecnoempleoService,
  ) {}

  @Get('adzuna/test')
  testAdzuna() {
    return this.adzunaService.fetchJobs();
  }

  @Post('adzuna/import')
  importAdzunaJobs() {
    return this.adzunaService.importJobs();
  }
  @Get('tecnoempleo/test')
testTecnoempleo() {
  return this.tecnoempleoService.fetchJobs();
}
@Post('tecnoempleo/import')
  importTecnoempleoJobs() {
    return this.tecnoempleoService.importJobs();
  }
}
