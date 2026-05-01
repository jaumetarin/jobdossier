import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProcessedJobOffer } from './job-fetcher.interface';

type JobPersistenceSummary = {
  fetched: number;
  created: number;
  skipped: number;
};

@Injectable()
export class JobPersistenceService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveJobs(
    jobs: ProcessedJobOffer[],
  ): Promise<JobPersistenceSummary> {
    const result = await this.prismaService.jobOffer.createMany({
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
      })),
      skipDuplicates: true,
    });

    const created = result.count;
    const fetched = jobs.length;
    const skipped = fetched - created;

    return {
      fetched,
      created,
      skipped,
    };
  }
}
