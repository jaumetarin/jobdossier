import { Injectable } from '@nestjs/common';
import { AdzunaService } from './adzuna.service';
import { TecnoempleoService } from './tecnoempleo.service';
import { OfferNotificationService } from '../notifications/offer-notification.service';

@Injectable()
export class FetcherOrchestratorService {
  constructor(
    private readonly adzunaService: AdzunaService,
    private readonly tecnoempleoService: TecnoempleoService,
    private readonly offerNotificationService: OfferNotificationService,
  ) {}

  async importAllJobs() {
  const sources: Record<string, any> = {};
  let fetched = 0;
  let created = 0;
  let skipped = 0;
  let newJobs: any[] = [];

  try {
    const result = await this.adzunaService.importJobs();

    sources.adzuna = result;
    fetched += result.fetched;
    created += result.created;
    skipped += result.skipped;
    newJobs.push(...result.newJobs);
  } catch (error) {
    sources.adzuna = {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  try {
    const result = await this.tecnoempleoService.importJobs();

    sources.tecnoempleo = result;
    fetched += result.fetched;
    created += result.created;
    skipped += result.skipped;
    newJobs.push(...result.newJobs);
  } catch (error) {
    sources.tecnoempleo = {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  await this.offerNotificationService.notifyUsersAboutNewOffers(newJobs);

  return {
    sources,
    fetched,
    created,
    skipped,
    newJobs,
  };
}

}
