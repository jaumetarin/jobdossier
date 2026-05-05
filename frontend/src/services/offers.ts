import { api } from './api';
import { type OffersQuery, type OffersResponse } from '../types/offer';

export async function getOffers(query: OffersQuery = {}) {
  const response = await api.get<OffersResponse>('/offers', {
    params: query,
  });

  return response.data;
}
