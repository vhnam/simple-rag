import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class RagService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RagService.name);
  private pool: Pool | null = null;

  constructor(private configService: ConfigService) {}

  onModuleInit(): void {
    const dbHost = this.configService.get<string>('DB_HOST');
    const dbUser = this.configService.get<string>('DB_USER');
    const dbPassword = this.configService.get<string>('DB_PASSWORD');
    const dbName = this.configService.get<string>('DB_NAME');
    const dbPort = this.configService.get<string>('DB_PORT');

    if (!dbHost || !dbUser || !dbPassword || !dbName || !dbPort) {
      throw new Error(
        'One or more required PostgreSQL environment variables are missing.',
      );
    }

    const poolConfig = {
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: Number.parseInt(dbPort, 10),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    this.pool = new Pool(poolConfig);

    this.pool.on('error', (err: Error) => {
      this.logger.error('Unexpected error on idle client', err);
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('Database connection pool closed');
    }
  }

  public async ask(question: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(question);
    });
  }
}
