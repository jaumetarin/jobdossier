import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as cheerio from 'cheerio';
import {
  IJobFetcher,
  NormalizedJobOffer,
} from './job-fetcher.interface';
import { JobOfferNormalizerService } from './job-offer-normalizer.service';
import { JobPersistenceService } from './job-persistence.service';

@Injectable()
export class TecnoempleoService implements IJobFetcher {
  private readonly baseUrl = 'https://www.tecnoempleo.com/ofertas-trabajo';
  private readonly keywords = [
  'react',
  'angular',
  'frontend',
  'javascript',
  'typescript',
  'java',
  'spring',
  'python',
  'node',
  'backend',
  'fullstack',
  'software',
  'devops',
  'data',
  'qa',
];

  constructor(
    private readonly jobOfferNormalizerService: JobOfferNormalizerService,
    private readonly jobPersistenceService: JobPersistenceService,
  ) {}

  async fetchJobs(): Promise<NormalizedJobOffer[]> {
    const offers: NormalizedJobOffer[] = [];
    
    for (const keyword of this.keywords) {
    const url = `${this.baseUrl}/${keyword}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new InternalServerErrorException(
        `Tecnoempleo request failed with status ${response.status}`,
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);


    const jobLinks = $('a[href]').filter((_, element) => {
      const text = $(element).text().trim().replace(/\s+/g, ' ');
      const href = $(element).attr('href') ?? '';

      return (
        text.length > 25 &&
        href.startsWith('https://www.tecnoempleo.com') &&
        href.includes('/rf-')
      );
    });

    jobLinks.each((_, element) => {
      const jobLink = $(element);
      const jobCard = jobLink.parent().parent();

      const title = jobLink.text().trim().replace(/\s+/g, ' ');
      const url = jobLink.attr('href') ?? '';
      const company = jobCard
        .find('a.text-primary.link-muted')
        .first()
        .text()
        .trim();
      const locationText = jobCard
        .find('span.d-block.d-lg-none.text-gray-800')
        .first()
        .text()
        .trim()
        .replace(/\s+/g, ' ');
      const description = this.extractDescription(jobCard);
      const technologiesRaw = description
        ? `${title} ${description}`.trim()
        : title;
      const { location, publishedAt } =
        this.parseLocationAndDate(locationText);

      offers.push({
        source: 'tecnoempleo',
        title,
        company,
        location,
        url,
        description,
        technologiesRaw,
        publishedAt,
      });
    });
  }
    return offers;
  }

  private parseLocationAndDate(locationText?: string): {
    location?: string;
    publishedAt?: Date;
  } {
    if (!locationText) {
      return {};
    }

    const parts = locationText.split(' - ');

    if (parts.length < 2) {
      return {
        location: locationText.trim(),
      };
    }

    const location = parts[0].trim();
    const dateText = parts[1].trim();
    const [day, month, year] = dateText.split('/');

    if (!day || !month || !year) {
      return {
        location,
      };
    }

    const publishedAt = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    );

    if (Number.isNaN(publishedAt.getTime())) {
      return {
        location,
      };
    }

    return {
      location,
      publishedAt,
    };
  }

  private extractDescription(
    jobCard: cheerio.Cheerio<any>,
  ): string | undefined {
    const descriptionHtml =
      jobCard.find('span.hidden-md-down.text-gray-800').first().html() ?? '';

    if (!descriptionHtml) {
      return undefined;
    }

    const htmlBeforeBadges = descriptionHtml.split('<span class="badge')[0];
    const descriptionText = cheerio
      .load(`<div>${htmlBeforeBadges}</div>`)('div')
      .text()
      .trim()
      .replace(/\s+/g, ' ');

    return descriptionText || undefined;
  }

  async importJobs() {
    const jobs = await this.fetchJobs();
    const processedJobs = this.jobOfferNormalizerService.normalizeOffers(jobs);

    return this.jobPersistenceService.saveJobs(processedJobs);
  }
}
