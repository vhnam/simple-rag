import { apiClient } from '@/lib/axios';
import type { RagStatusResponse } from './rag.typings';

export const fetchRagStatus = async (): Promise<RagStatusResponse> => {
  const response = await apiClient.get<RagStatusResponse>('/rag/status');
  return response.data;
};
