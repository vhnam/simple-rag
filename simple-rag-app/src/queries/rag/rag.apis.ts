import type { RagStatusResponse } from './rag.types';
import { apiClient } from '@/lib/axios';

export const fetchRagStatus = async (): Promise<RagStatusResponse> => {
  const response = await apiClient.get<RagStatusResponse>('/rag/status');
  return response.data;
};
