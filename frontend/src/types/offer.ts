export type JobOffer = {
  id: number;
  title: string;
  company: string;
  location: string | null;
  modality: string | null;
  salaryText: string | null;
  url: string;
  technologies: string[];
  publishedAt: string | null;
};

export type OffersResponse = {
  items: JobOffer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type ImportOffersResponse = {
  sources: Record<string, unknown>;
  fetched: number;
  created: number;
  skipped: number;
  newJobs: JobOffer[];
};

export type OffersQuery = {
  page?: number;
  limit?: number;
  location?: string;
  modality?: string;
  technology?: string;
  search?: string;
};
