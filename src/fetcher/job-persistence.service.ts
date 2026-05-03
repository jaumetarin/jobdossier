import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProcessedJobOffer } from './job-fetcher.interface';

type JobPersistenceSummary = {
  fetched: number;
  created: number;
  skipped: number;
  newJobs: {
    id: number;
    source: string;
    externalId: string | null;
    title: string;
    company: string;
    location: string | null;
    modality: string | null;
    salaryText: string | null;
    url: string;
    description: string | null;
    technologiesRaw: string | null;
    technologies: string[];
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

@Injectable()
export class JobPersistenceService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveJobs(
    jobs: ProcessedJobOffer[],
  ): Promise<JobPersistenceSummary> {
    const createdJobs = await this.prismaService.jobOffer.createManyAndReturn({
      data: jobs.map((job) => ({
        source: job.source,
        externalId: job.externalId,
        title: job.title,
        company: job.company,
        location: job.location,
        modality: job.modality,
        salaryText: job.salaryText,
        url: job.url,
        description: job.description,
        technologiesRaw: job.technologiesRaw,
        publishedAt: job.publishedAt,
        technologies: job.technologies,
      })),
      skipDuplicates: true,
    });

    const created = createdJobs.length;
    const fetched = jobs.length;
    const skipped = fetched - created;

    return {
      fetched,
      created,
      skipped,
      newJobs: createdJobs,
    };
  }
}
