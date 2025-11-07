import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { DatabaseModule } from '../database/database.module';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [DatabaseModule, RbacModule],
  providers: [RagService],
  controllers: [RagController],
  exports: [RagService],
})
export class RagModule {}
