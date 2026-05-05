import { api } from './api';
import {
  type CreateFilterInput,
  type DeleteFilterResponse,
  type UserFilter,
} from '../types/filter';

export async function getFilters() {
  const response = await api.get<UserFilter[]>('/filters');
  return response.data;
}

export async function createFilter(input: CreateFilterInput) {
  const response = await api.post<UserFilter>('/filters', input);
  return response.data;
}

export async function deleteFilter(filterId: number) {
  const response = await api.delete<DeleteFilterResponse>(`/filters/${filterId}`);
  return response.data;
}
