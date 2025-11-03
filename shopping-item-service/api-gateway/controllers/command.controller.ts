import { Controller, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { CommandService } from '../services/command.service';

@Controller('api/command/items')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @Post()
  async createItem(@Body() data: any) {
    return this.commandService.createItem(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const updated = await this.commandService.updateItem(id,body);
    return { success: true, data: updated };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.commandService.deleteItem(id);
    return { success: true, data: deleted };
  }
  
}
