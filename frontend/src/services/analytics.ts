import { api } from './api';
import {
  type SalaryByStack,
  type TopCompany,
  type TopTechnology,
} from '../types/analytics';

export async function getTopCompanies(city?: string) {
  const response = await api.get<TopCompany[]>('/analytics/top-companies', {
    params: city ? { city } : undefined,
  });

  return response.data;
}

export async function getTopTechnologies(limit = 10) {
  const response = await api.get<TopTechnology[]>('/analytics/top-technologies', {
    params: { limit },
  });

  return response.data;
}

export async function getSalaryByStack() {
  const response = await api.get<SalaryByStack[]>('/analytics/salary-by-stack');

  return response.data;
}
