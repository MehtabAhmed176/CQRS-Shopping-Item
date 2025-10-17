// src/modules/query.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QueryService } from '../services/query.service';
import { QueryController } from '../controllers/query.controller';

@Module({
  imports: [HttpModule],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
