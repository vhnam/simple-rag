export interface RagStatusResponse {
  ready: boolean;
  count: number;
}

export type InstrumentMeta = {
  retrievedCount: number | null;
  embeddingModel: string;
  llmModel: string;
  durationMs: number;
};

export type InstrumentStatus = 'success' | 'error';

export type InstrumentErrorDetail = {
  code: 'INVALID_INPUT' | 'VECTOR_STORE_UNAVAILABLE' | 'RAG_SERVICE_ERROR' | 'UNKNOWN_ERROR';
  message: string;
};

export type RecommendedModel = {
  brand: string;
  model: string;
  price?: number;
  recommendedFor?: string;
  notes?: string;
};

export type RecommendedInstrument = {
  name: string;
  family: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  whySuitable: string; // Lý do phù hợp
  summary?: string; // Summary description
  relevanceScore?: number; // Relevance score (0-100)
  reasons?: Array<string>; // Bullet list of reasons
  priceRange: string;
  recommendedModels?: Array<RecommendedModel>; // Gợi ý model phù hợp (beginner models)
  considerations?: Array<string>;
};

export type InstrumentRow = {
  id: string;
  name: string;
  family: string;
  difficulty_level: string;
  weight_category: string;
  volume_profile: string;
  airflow_requirement: string;
  embouchure_difficulty: string;
  typical_price_min: number;
  typical_price_max: number;
  description: string | null;
  recommended_beginners: boolean;
  similarity?: number;
};

export type AskInstrumentResponse = {
  status: InstrumentStatus;
  query: string;
  answer: {
    instruments?: Array<RecommendedInstrument>;
    error?: InstrumentErrorDetail;
  } | null;
  instruments: Array<InstrumentRow>;
  error?: InstrumentErrorDetail;
  meta: InstrumentMeta;
  timestamp: string;
};
