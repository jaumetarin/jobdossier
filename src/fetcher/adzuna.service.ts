import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IJobFetcher,
  NormalizedJobOffer,
} from './job-fetcher.interface';
import { JobOfferNormalizerService } from './job-offer-normalizer.service';
import { JobPersistenceService } from './job-persistence.service';



type AdzunaJob = {
  id: string | number;
  title: string;
  description?: string;
  redirect_url: string;
  created?: string;
  company?: {
    display_name?: string;
  };
  location?: {
    display_name?: string;
    area?: string[];
  };
  salary_min?: number;
  salary_max?: number;
  contract_time?: string;
};

type AdzunaSearchResponse = {
  results: AdzunaJob[];
};

type AdzunaQueryConfig = {
  what: string;
  whatExclude?: string;
};

@Injectable()
export class AdzunaService implements IJobFetcher {
  private readonly baseUrl = 'https://api.adzuna.com/v1/api/jobs';
  private readonly country = 'es';
  private readonly page = 1;
  private readonly queries: AdzunaQueryConfig[] = [
  { what: 'react developer' },
  { what: 'angular developer' },
  { what: 'frontend developer' },
  { what: 'javascript developer', whatExclude: 'java' },
  { what: 'typescript developer' },

  { what: 'java developer' },
  { what: 'spring boot developer' },
  { what: 'python developer' },
  { what: 'node.js developer' },
  { what: '.net developer' },
  { what: 'backend developer' },

  { what: 'full stack developer' },
  { what: 'software engineer' },
  { what: 'devops engineer' },
  { what: 'data engineer' },
  { what: 'qa automation engineer' },
];

  constructor(
    private readonly configService: ConfigService,
    private readonly jobOfferNormalizerService: JobOfferNormalizerService,
    private readonly jobPersistenceService: JobPersistenceService,
  ) {}

async fetchJobs(): Promise<NormalizedJobOffer[]> {
  const appId = this.configService.get<string>('ADZUNA_APP_ID');
  const appKey = this.configService.get<string>('ADZUNA_APP_KEY');

  if (!appId || !appKey) {
    throw new InternalServerErrorException(
      'Missing ADZUNA_APP_ID or ADZUNA_APP_KEY',
    );
  }

  const allJobs: AdzunaJob[] = [];

  for (const queryConfig of this.queries) {
    const url = new URL(
      `${this.baseUrl}/${this.country}/search/${this.page}`,
    );

    url.searchParams.set('app_id', appId);
    url.searchParams.set('app_key', appKey);
    url.searchParams.set('what', queryConfig.what);
    url.searchParams.set('results_per_page', '20');

    if (queryConfig.whatExclude) {
      url.searchParams.set('what_exclude', queryConfig.whatExclude);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new InternalServerErrorException(
        `Adzuna request failed with status ${response.status}`,
      );
    }

    const data = (await response.json()) as AdzunaSearchResponse;

    allJobs.push(...data.results);
  }

   const normalizedJobs = allJobs.map((job) => ({
    source: 'adzuna',
    externalId: String(job.id),
    title: job.title,
    company: job.company?.display_name ?? 'Unknown company',
    location: job.location?.display_name,
    modality: job.contract_time,
    salaryText: this.buildSalaryText(job.salary_min, job.salary_max),
    url: job.redirect_url,
    description: job.description,
   technologiesRaw: `${job.title} ${job.description ?? ''}`.trim(),
    publishedAt: job.created ? new Date(job.created) : undefined,
  }));

return normalizedJobs;


}

  private buildSalaryText(
    salaryMin?: number,
    salaryMax?: number,
  ): string | undefined {
    if (salaryMin && salaryMax) {
      return `${salaryMin} - ${salaryMax}`;
    }

    if (salaryMin) {
      return `${salaryMin}`;
    }

    if (salaryMax) {
      return `${salaryMax}`;
    }

    return undefined;
  }

  async importJobs() {
  const jobs = await this.fetchJobs();
  const processedJobs = this.jobOfferNormalizerService.normalizeOffers(jobs);

  return this.jobPersistenceService.saveJobs(processedJobs);
}


}
