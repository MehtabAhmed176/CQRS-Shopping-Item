// src/controllers/query.controller.ts
import { Controller, Get } from '@nestjs/common';
import { QueryService } from '../services/query.service';

@Controller('api/query/items')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Get()
  async getItems() {
    return this.queryService.getItems();
  }
}
