import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Recipe } from '../entities/recipe.entity';
import { RbacModule } from '../rbac/rbac.module';
import { RagModule } from '../rag/rag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), RbacModule, RagModule],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
