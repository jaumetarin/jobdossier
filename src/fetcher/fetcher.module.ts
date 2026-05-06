import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdzunaService } from './adzuna.service';
import { FetcherController } from './fetcher.controller';
import { JobOfferNormalizerService } from './job-offer-normalizer.service';
import { JobPersistenceService } from './job-persistence.service';
import { TecnoempleoService } from './tecnoempleo.service';
import { FetcherOrchestratorService } from './fetcher-orchestrator.service';
import { FetcherSchedulerService } from './fetcher-scheduler.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [FetcherController],
  providers: [
    AdzunaService,
    JobOfferNormalizerService,
    JobPersistenceService,
    TecnoempleoService,
    FetcherOrchestratorService,
    FetcherSchedulerService,
  ],
  exports: [],
})
export class FetcherModule {}
