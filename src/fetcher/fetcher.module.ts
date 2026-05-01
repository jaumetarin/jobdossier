import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdzunaService } from './adzuna.service';
import { FetcherController } from './fetcher.controller';
import { JobOfferNormalizerService } from './job-offer-normalizer.service';
import { JobPersistenceService } from './job-persistence.service';
import { TecnoempleoService } from './tecnoempleo.service';

@Module({
  imports: [PrismaModule],
  controllers: [FetcherController],
  providers: [
    AdzunaService, 
    JobOfferNormalizerService,
    JobPersistenceService,
    TecnoempleoService],
  exports: [],
})
export class FetcherModule {}
