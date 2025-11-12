import { apiClient } from '@/lib/axios';

import type { HealthCheckResponse } from './health.types';

export const fetchHealthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await apiClient.get<HealthCheckResponse>('/health');
  return response.data;
};
