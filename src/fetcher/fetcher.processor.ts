import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { FetcherOrchestratorService } from './fetcher-orchestrator.service';

@Processor('fetcher')
export class FetcherProcessor extends WorkerHost {
  constructor(
    private readonly fetcherOrchestratorService: FetcherOrchestratorService,
  ) {
    super();
  }

  async process(job: Job) {
    if (job.name === 'import-all') {
      return this.fetcherOrchestratorService.importAllJobs();
    }

    return null;
  }
}
