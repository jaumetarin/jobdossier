// analytics.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-companies')
  getTopCompanies(@Query('city') city?: string) {
    return this.analyticsService.getTopCompanies(city);
  }

  @Get('top-technologies')
  getTopTechnologies(@Query('limit') limit?: string) {
    return this.analyticsService.getTopTechnologies(Number(limit ?? 10));
  }

  @Get('salary-by-stack')
  getSalaryByStack() {
    return this.analyticsService.getSalaryByStack();
  }
}
