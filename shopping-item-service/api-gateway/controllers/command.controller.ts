// src/controllers/command.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CommandService } from '../services/command.service';

@Controller('api/command/items')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @Post()
  async createItem(@Body() data: any): Promise<unknown> {
    return await this.commandService.createItem(data);
  }
}
