// analytics.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AnalyticsService {
  private readonly client;

  constructor(private readonly configService: ConfigService) {
    const baseURL = this.configService.get<string>('ANALYTICS_SERVICE_URL');
    if (!baseURL) throw new Error('Missing ANALYTICS_SERVICE_URL');
    this.client = axios.create({ baseURL, timeout: 5000 });
  }

  async getTopCompanies(city?: string) {
    const { data } = await this.client.get('/analytics/top-companies', { params: { city } });
    return data;
  }

  async getTopTechnologies(limit = 10) {
    const { data } = await this.client.get('/analytics/top-technologies', { params: { limit } });
    return data;
  }

  async getSalaryByStack() {
    const { data } = await this.client.get('/analytics/salary-by-stack');
    return data;
  }
}
