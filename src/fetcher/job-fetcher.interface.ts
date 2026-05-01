export type NormalizedJobOffer = {
  source: string;
  externalId?: string;
  title: string;
  company: string;
  location?: string;
  modality?: string;
  salaryText?: string;
  url: string;
  description?: string;
  technologiesRaw?: string;
  publishedAt?: Date;
};

export interface IJobFetcher {
  fetchJobs(): Promise<NormalizedJobOffer[]>;
}

export type ProcessedJobOffer = NormalizedJobOffer & {
  heuristicKey: string;
  technologies: string[];
};
