import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class FetcherSchedulerService implements OnModuleInit {
  constructor(
    @InjectQueue('fetcher')
    private readonly fetcherQueue: Queue,
  ) {}

 async onModuleInit() {
      await this.fetcherQueue.upsertJobScheduler(
     'import-all-daily-midnight',
     {
     pattern: '0 0 * * *',
    },
     {
     name: 'import-all',
        data: {},
    },
    );

  }
}
