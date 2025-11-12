import type { HealthCheckResponse } from './health.types';
import { apiClient } from '@/lib/axios';

export const fetchHealthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await apiClient.get<HealthCheckResponse>('/health');
  return response.data;
};
