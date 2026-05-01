import { Injectable } from '@nestjs/common';
import {
  NormalizedJobOffer,
  ProcessedJobOffer,
} from './job-fetcher.interface';
import { technologyAliases } from './technology-aliases';



@Injectable()
export class JobOfferNormalizerService {
  private readonly maxOfferAgeInDays = 120;

  

  normalizeOffers(jobs: NormalizedJobOffer[]): ProcessedJobOffer[] {
    const uniqueJobsByUrl = this.deduplicateByUrl(jobs);
    const processedJobs: ProcessedJobOffer[] = [];

    for (const job of uniqueJobsByUrl) {
      const processedJob = this.toProcessedJobOffer(job);

      if (this.isRecentEnough(processedJob)) {
        processedJobs.push(processedJob);
      }
    }

    return this.deduplicateByHeuristic(processedJobs);
  }

  private deduplicateByUrl(
    jobs: NormalizedJobOffer[],
  ): NormalizedJobOffer[] {
    const jobsByUrl = new Map<string, NormalizedJobOffer>();

    for (const job of jobs) {
      jobsByUrl.set(job.url, job);
    }

    return Array.from(jobsByUrl.values());
  }

  private toProcessedJobOffer(job: NormalizedJobOffer): ProcessedJobOffer {
    const title = this.cleanText(job.title) ?? job.title;
    const company = this.cleanText(job.company) ?? job.company;
    const location = this.cleanText(job.location);
    const modality = this.cleanText(job.modality);
    const salaryText = this.cleanText(job.salaryText);
    const description = this.cleanText(job.description);
    const technologiesRaw = this.cleanText(job.technologiesRaw);

    const heuristicKey = this.buildHeuristicKey(title, company);
    const technologies = this.extractTechnologies(
      title,
      description,
      technologiesRaw,
    );

    return {
      source: job.source,
      externalId: job.externalId,
      title,
      company,
      location,
      modality,
      salaryText,
      url: job.url,
      description,
      technologiesRaw,
      publishedAt: job.publishedAt,
      heuristicKey,
      technologies,
    };
  }

  private deduplicateByHeuristic(
    jobs: ProcessedJobOffer[],
  ): ProcessedJobOffer[] {
    const jobsByHeuristicKey = new Map<string, ProcessedJobOffer>();

    for (const job of jobs) {
      const currentJob = jobsByHeuristicKey.get(job.heuristicKey);

      if (!currentJob || this.isCandidateNewer(job, currentJob)) {
        jobsByHeuristicKey.set(job.heuristicKey, job);
      }
    }

    return Array.from(jobsByHeuristicKey.values());
  }

  private buildHeuristicKey(title: string, company: string): string {
    const normalizedTitle = this.normalizeForComparison(title);
    const normalizedCompany = this.normalizeForComparison(company);

    return `${normalizedTitle}::${normalizedCompany}`;
  }

  private extractTechnologies(
    title: string,
    description?: string,
    technologiesRaw?: string,
  ): string[] {
    const searchableText =
      `${title} ${description ?? ''} ${technologiesRaw ?? ''}`.trim();

    const technologies: string[] = [];

    for (const alias of technologyAliases) {
      const matches = alias.patterns.some((pattern) =>
        pattern.test(searchableText),
      );

      if (matches) {
        technologies.push(alias.canonical);
      }
    }

    return technologies;
  }

  private isRecentEnough(job: ProcessedJobOffer): boolean {
    if (!job.publishedAt || Number.isNaN(job.publishedAt.getTime())) {
      return true;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.maxOfferAgeInDays);

    return job.publishedAt >= cutoffDate;
  }

  private isCandidateNewer(
    candidate: ProcessedJobOffer,
    current: ProcessedJobOffer,
  ): boolean {
    if (
      !candidate.publishedAt ||
      Number.isNaN(candidate.publishedAt.getTime())
    ) {
      return false;
    }

    if (!current.publishedAt || Number.isNaN(current.publishedAt.getTime())) {
      return true;
    }

    return candidate.publishedAt > current.publishedAt;
  }

  private cleanText(value?: string): string | undefined {
    if (!value) {
      return undefined;
    }

    return value.replace(/\s+/g, ' ').trim();
  }

  private normalizeForComparison(value?: string): string {
    const cleanedValue = this.cleanText(value);

    if (!cleanedValue) {
      return '';
    }

    return cleanedValue
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
