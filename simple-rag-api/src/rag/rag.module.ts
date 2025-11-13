import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { DatabaseModule } from '../database/database.module';
import { RbacModule } from '../rbac/rbac.module';
import { Instrument } from '../entities/instrument.entity';

@Module({
  imports: [
    DatabaseModule,
    RbacModule,
    TypeOrmModule.forFeature([Instrument]),
  ],
  providers: [RagService],
  controllers: [RagController],
  exports: [RagService],
})
export class RagModule {}
