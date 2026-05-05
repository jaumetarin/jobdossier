export type UserFilter = {
  id: number;
  userId: number;
  keyword: string | null;
  location: string | null;
  modality: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateFilterInput = {
  keyword?: string;
  location?: string;
  modality?: string;
};

export type DeleteFilterResponse = {
  message: string;
};
