import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdzunaService } from './adzuna.service';
import { FetcherController } from './fetcher.controller';
import { JobOfferNormalizerService } from './job-offer-normalizer.service';
import { JobPersistenceService } from './job-persistence.service';
import { TecnoempleoService } from './tecnoempleo.service';
import { FetcherOrchestratorService } from './fetcher-orchestrator.service';
import { BullModule } from '@nestjs/bullmq';
import { FetcherProcessor } from './fetcher.processor';
import { FetcherSchedulerService } from './fetcher-scheduler.service';

@Module({
  imports: [PrismaModule,BullModule.registerQueue({
  name: 'fetcher',
}),
],
  controllers: [FetcherController],
  providers: [
    AdzunaService, 
    JobOfferNormalizerService,
    JobPersistenceService,
    TecnoempleoService,
    FetcherOrchestratorService,
    FetcherProcessor,
    FetcherSchedulerService],
  exports: [],
})
export class FetcherModule {}
