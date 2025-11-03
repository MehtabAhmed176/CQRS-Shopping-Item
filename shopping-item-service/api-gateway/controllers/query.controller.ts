import { Controller, Get, Param } from '@nestjs/common';
import { QueryService } from '../services/query.service';

@Controller('api/query/items')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Get()
  async getItems() {
    return this.queryService.getItems();
  }

  @Get(':id')
  async getItem(@Param('id') id: string) {
    return this.queryService.getItemById(id);
  }
}
