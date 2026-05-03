import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdzunaService } from './adzuna.service';
import { TecnoempleoService } from './tecnoempleo.service';
import { FetcherOrchestratorService } from './fetcher-orchestrator.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('fetcher')
export class FetcherController {
  constructor(
    private readonly adzunaService: AdzunaService,
    private readonly fetcherOrchestratorService: FetcherOrchestratorService,
    private readonly tecnoempleoService: TecnoempleoService,
  ) {}

  @Get('adzuna/test')
  testAdzuna() {
    return this.adzunaService.fetchJobs();
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('adzuna/import')
  importAdzunaJobs() {
    return this.adzunaService.importJobs();
  }

  @Get('tecnoempleo/test')
  testTecnoempleo() {
    return this.tecnoempleoService.fetchJobs();
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('tecnoempleo/import')
  importTecnoempleoJobs() {
    return this.tecnoempleoService.importJobs();
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('import-all')
  importAllJobs() {
    return this.fetcherOrchestratorService.importAllJobs();
  }
}
