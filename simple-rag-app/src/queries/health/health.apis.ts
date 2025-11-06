import { apiClient } from '@/lib/axios';
import type { HealthCheckResponse } from './health.typings';

export const fetchHealthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await apiClient.get<HealthCheckResponse>('/health');
  return response.data;
};
