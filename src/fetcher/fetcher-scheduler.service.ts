import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FetcherOrchestratorService } from './fetcher-orchestrator.service';

@Injectable()
export class FetcherSchedulerService {
  private readonly logger = new Logger(FetcherSchedulerService.name);

  constructor(
    private readonly fetcherOrchestratorService: FetcherOrchestratorService,
  ) {}

  @Cron('0 0 * * *', { timeZone: 'Europe/Madrid' })
  async importAllJobsDaily() {
    this.logger.log('Running scheduled import-all job');

    try {
      await this.fetcherOrchestratorService.importAllJobs();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Scheduled import-all job failed: ${message}`);
    }
  }
}
