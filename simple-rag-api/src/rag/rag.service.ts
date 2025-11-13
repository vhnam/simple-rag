import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { Instrument } from '../entities/instrument.entity';

interface ErrorDetail {
  code: string;
  message: string;
}
import {
  RAG_EMBEDDING_MODEL,
  RAG_LLM_MODEL,
  RAG_SIMILARITY_THRESHOLD,
} from '../constants/rag.constants';

interface InstrumentRow {
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
}

@Injectable()
export class RagService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RagService.name);
  private embeddings: OpenAIEmbeddings | null = null;
  private llm: ChatOpenAI | null = null;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Instrument)
    private instrumentRepository: Repository<Instrument>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  onModuleInit(): void {
    const openAiApiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!openAiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is missing.');
    }

    // Initialize OpenAI embeddings and LLM
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: openAiApiKey,
    });

    this.llm = new ChatOpenAI({
      openAIApiKey: openAiApiKey,
      modelName: RAG_LLM_MODEL,
      temperature: 1,
    });

    this.logger.log('RAG service initialized');
  }

  onModuleDestroy(): void {
    // TypeORM handles connection cleanup automatically
    this.logger.log('RAG service destroyed');
  }

  /**
   * Converts query to a search query embedding
   * Public method for use by other services
   */
  public async getQueryEmbedding(query: string): Promise<number[]> {
    if (!this.embeddings) {
      throw new Error('Embeddings not initialized');
    }
    const embedding = await this.embeddings.embedQuery(query);
    return embedding;
  }

  /**
   * Main method to recommend instruments based on user preferences
   * @param preferences - User's instrument preferences (already validated by controller)
   * @returns AI-generated instrument recommendations with instruments and metadata
   */
  public async ask(preferences: {
    budget: string;
    favoriteGenres: string[];
    airflowStrength: 'low' | 'medium' | 'high';
    tonePreference: 'bright' | 'warm' | 'mellow' | 'versatile';
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    playingEnvironment: 'home' | 'studio' | 'outdoor' | 'concert';
    weightTolerance: 'light' | 'medium' | 'heavy';
  }): Promise<{
    status: string;
    query: string;
    answer: object | null;
    instruments: InstrumentRow[];
    error?: ErrorDetail;
    meta: {
      retrievedCount: number | null;
      embeddingModel: string;
      llmModel: string;
      durationMs: number;
    };
    timestamp: string;
  }> {
    const start = performance.now();
    const embeddingModel = RAG_EMBEDDING_MODEL;
    const llmModel = RAG_LLM_MODEL;

    // Build a conversational query from structured preferences
    const budgetNum = parseInt(preferences.budget.replace(/[^\d]/g, ''), 10);
    const budgetText = budgetNum
      ? `budget around ${budgetNum.toLocaleString('en-US')} VND`
      : '';

    const queryParts = [
      `I'm a ${preferences.experienceLevel} player`,
      budgetText,
      `I enjoy ${preferences.favoriteGenres.join(', ')} music`,
      `I have ${preferences.airflowStrength} airflow strength`,
      `I prefer ${preferences.tonePreference} tone`,
      `I'll be playing in ${preferences.playingEnvironment} environment`,
      `I can handle ${preferences.weightTolerance} weight instruments`,
    ].filter(Boolean);

    const query = queryParts.join('. ') + '.';

    try {
      this.logger.log(`Processing instrument recommendation request: ${query}`);

      // Step 1: Create embedding for the query
      const queryEmbedding = await this.getQueryEmbedding(query);

      // Step 2: Search for similar instruments in the database
      const similarInstruments =
        await this.searchSimilarInstruments(queryEmbedding);

      this.logger.log(
        `Found ${similarInstruments.length} similar instruments in database`,
      );

      // Step 3: Generate AI recommendations based on query and similar instruments
      const recommendations = await this.generateInstrumentRecommendations(
        query,
        similarInstruments,
      );

      return {
        status: 'success',
        query,
        answer: recommendations,
        instruments: similarInstruments,
        meta: {
          retrievedCount: similarInstruments.length,
          embeddingModel,
          llmModel,
          durationMs: performance.now() - start,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      this.logger.error('Error generating instrument recommendations', error);
      const durationMs = performance.now() - start;

      // Structured error handling
      const errorDetail: ErrorDetail = (() => {
        if (
          error instanceof Error &&
          (error.message.includes('ECONNREFUSED') ||
            error.message.includes('timeout') ||
            error.message.includes('connect'))
        ) {
          return {
            code: 'VECTOR_STORE_UNAVAILABLE',
            message: 'Cannot connect to vector store. Please try again later.',
          };
        }
        if (error instanceof Error) {
          return {
            code: 'RAG_SERVICE_ERROR',
            message: error.message,
          };
        }
        return {
          code: 'UNKNOWN_ERROR',
          message: 'Unknown error occurred',
        };
      })();

      return {
        status: 'error',
        query,
        answer: null,
        instruments: [],
        error: errorDetail,
        meta: {
          retrievedCount: null,
          embeddingModel,
          llmModel,
          durationMs,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Searches for instruments similar to the query using vector similarity
   */
  private async searchSimilarInstruments(
    queryEmbedding: number[],
    limit: number = 5,
    similarityThreshold: number = RAG_SIMILARITY_THRESHOLD,
  ): Promise<InstrumentRow[]> {
    const embeddingString = `[${queryEmbedding.join(',')}]`;

    const query = `
      SELECT 
        id,
        name,
        family,
        difficulty_level,
        weight_category,
        volume_profile,
        airflow_requirement,
        embouchure_difficulty,
        typical_price_min,
        typical_price_max,
        description,
        recommended_beginners,
        1 - (embedding <=> $1::vector) AS similarity
      FROM instruments
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT $2
    `;

    try {
      const result = (await this.dataSource.query(query, [
        embeddingString,
        limit,
      ])) as unknown as InstrumentRow[];

      const filtered = result.filter(
        (instrument: InstrumentRow) =>
          (instrument.similarity as number) >= similarityThreshold,
      );

      return filtered;
    } catch (error) {
      this.logger.error('Error searching for instruments', error);
      if (error instanceof Error && error.message.includes('does not exist')) {
        this.logger.warn(
          'Instruments table does not exist. Returning empty results.',
        );
        return [];
      }
      throw error;
    }
  }

  /**
   * Generates instrument recommendations using LLM based on user query and similar instruments
   */
  private async generateInstrumentRecommendations(
    userQuery: string,
    similarInstruments: InstrumentRow[],
  ): Promise<object> {
    if (!this.llm) {
      throw new Error('LLM not initialized');
    }

    const instrumentContext = similarInstruments
      .map(
        (instrument, index) => `
          Instrument ${index + 1}: ${instrument.name}
          Family: ${instrument.family}
          Difficulty: ${instrument.difficulty_level}
          Weight: ${instrument.weight_category}
          Volume: ${instrument.volume_profile}
          Airflow: ${instrument.airflow_requirement}
          Embouchure: ${instrument.embouchure_difficulty}
          Price Range: $${instrument.typical_price_min} - $${instrument.typical_price_max}
          Recommended for Beginners: ${instrument.recommended_beginners ? 'Yes' : 'No'}
          Description: ${instrument.description || 'N/A'}
        `,
      )
      .join('\n---\n');

    const instrumentContextText =
      similarInstruments.length > 0
        ? instrumentContext
        : 'No similar instruments found in the database. Use your knowledge to suggest instruments.';

    const fullPrompt = `
        You are a helpful music instrument advisor AI.
        Your goal is to recommend musical instruments for beginners based on the user's query
        and optionally using related instruments from the database.
        
        ---
        
        User's query:
        ${userQuery}
        
        Similar instruments from database:
        ${instrumentContextText || '(none)'}
        
        ---
        
        TASK:
        1. First, check if the user's input is related to musical instruments, music learning, or instrument selection.
          - If the input is **not related to instruments or music** (for example, it's about cooking, weather, or other topics), 
            then respond with JSON:
            {
              "instruments": [],
              "error": {
                "code": "INVALID_INPUT",
                "message": "The input is not related to musical instruments or music learning."
              }
            }
        2. Otherwise, continue normally:
          - Recommend 2-4 instruments suitable for beginners based on the user's query.
          - Prioritize instruments marked as "recommended_beginners" and with "beginner" difficulty level.
          - Consider factors like weight, volume, airflow requirements, and embouchure difficulty.
          - If no instruments are found in the database, you may suggest common beginner instruments based on the query.
        3. Only output valid JSON. Do not include any explanation, introduction, markdown, or text outside the JSON.
        
        ---
        
        OUTPUT FORMAT (strict JSON, no markdown, no explanation, no text outside the JSON):
        {
          "instruments": [
            {
              "name": "string",
              "family": "string",
              "difficulty": "beginner" | "intermediate" | "advanced",
              "summary": "string",
              "relevanceScore": number,
              "whySuitable": "string",
              "reasons": ["string", "string", "string"],
              "priceRange": "string",
              "recommendedModels": [
                {
                  "brand": "string",
                  "model": "string",
                  "price": number,
                  "recommendedFor": "string",
                  "notes": "string"
                }
              ],
              "considerations": ["string", "string"]
            }
          ]
        }
        
        Rules:
        - Always respond in English (or the user's language if specified).
        - Do NOT include introductions, summaries, or follow-up questions.
        - Do NOT include backticks, markdown code fences, or any explanation.
        - Begin output directly with '{' and end with '}'.
        - Each instrument must have:
          * summary: A brief 1-2 sentence overview of the instrument
          * relevanceScore: A number between 0-100 indicating how well it matches the user's preferences
          * whySuitable: A detailed explanation (2-3 sentences) of why this instrument fits
          * reasons: An array of 3-5 bullet points explaining specific benefits
        - Include 2-4 recommended models (especially beginner-friendly models) for each instrument with brand, model name, price in VND, and notes.
        - The relevanceScore should be calculated based on how well the instrument matches: budget, genres, airflow, tone, experience level, environment, and weight tolerance.
        - Prioritize instruments that match the user's experience level and preferences.
        `;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await this.llm.invoke(fullPrompt);

      let text = '';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (Array.isArray(response.content)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        text = response.content
          .map((contentPart: { text: string }) => contentPart.text ?? '')
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .join('')
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .trim();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else if (typeof response.content === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        text = response.content.trim();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        text = String(response.content ?? '').trim();
      }

      // Parse JSON safely
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json = JSON.parse(text);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return json;
      } catch {
        this.logger.warn(
          'Model did not return valid JSON, returning raw text.',
        );
        return {
          instruments: [],
        };
      }
    } catch (error) {
      this.logger.error('Error generating instrument recommendations', error);
      throw error;
    }
  }

  /**
   * Recommends instruments for beginners based on user query
   * @param query - User's query about instrument preferences or needs
   * @returns AI-generated instrument recommendations
   */
  public async recommendInstruments(query: string): Promise<{
    status: string;
    query: string;
    answer: object | null;
    instruments: InstrumentRow[];
    error?: ErrorDetail;
    meta: {
      retrievedCount: number | null;
      embeddingModel: string;
      llmModel: string;
      durationMs: number;
    };
    timestamp: string;
  }> {
    const start = performance.now();
    const embeddingModel = RAG_EMBEDDING_MODEL;
    const llmModel = RAG_LLM_MODEL;

    try {
      this.logger.log(`Processing instrument recommendation request: ${query}`);

      // Step 1: Create embedding for the query
      const queryEmbedding = await this.getQueryEmbedding(query);

      // Step 2: Search for similar instruments in the database
      const similarInstruments =
        await this.searchSimilarInstruments(queryEmbedding);

      this.logger.log(
        `Found ${similarInstruments.length} similar instruments in database`,
      );

      // Step 3: Generate AI recommendations based on query and similar instruments
      const recommendations = await this.generateInstrumentRecommendations(
        query,
        similarInstruments,
      );

      return {
        status: 'success',
        query,
        answer: recommendations,
        instruments: similarInstruments,
        meta: {
          retrievedCount: similarInstruments.length,
          embeddingModel,
          llmModel,
          durationMs: performance.now() - start,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      this.logger.error('Error generating instrument recommendations', error);
      const durationMs = performance.now() - start;

      // Structured error handling
      const errorDetail: ErrorDetail = (() => {
        if (
          error instanceof Error &&
          (error.message.includes('ECONNREFUSED') ||
            error.message.includes('timeout') ||
            error.message.includes('connect'))
        ) {
          return {
            code: 'VECTOR_STORE_UNAVAILABLE',
            message: 'Cannot connect to vector store. Please try again later.',
          };
        }
        if (error instanceof Error) {
          return {
            code: 'RAG_SERVICE_ERROR',
            message: error.message,
          };
        }
        return {
          code: 'UNKNOWN_ERROR',
          message: 'Unknown error occurred',
        };
      })();

      return {
        status: 'error',
        query,
        answer: null,
        instruments: [],
        error: errorDetail,
        meta: {
          retrievedCount: null,
          embeddingModel,
          llmModel,
          durationMs,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Gets the status of the RAG system
   * @returns { ready: boolean; count: number }
   * - ready: true if the RAG system is ready to answer questions
   * - count: number of instruments in the database
   */
  public async getStatus(): Promise<{ ready: boolean; count: number }> {
    const count = await this.instrumentRepository.count();
    return {
      ready: count > 0,
      count,
    };
  }
}
