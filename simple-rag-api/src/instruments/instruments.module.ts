import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentsController } from './instruments.controller';
import { InstrumentsService } from './instruments.service';
import { Instrument } from '../entities/instrument.entity';
import { RbacModule } from '../rbac/rbac.module';
import { RagModule } from '../rag/rag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Instrument]), RbacModule, RagModule],
  controllers: [InstrumentsController],
  providers: [InstrumentsService],
  exports: [InstrumentsService],
})
export class InstrumentsModule {}

