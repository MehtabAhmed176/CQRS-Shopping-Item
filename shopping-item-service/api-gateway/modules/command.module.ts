// src/modules/command.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CommandService } from '../services/command.service';
import { CommandController } from '../controllers/command.controller';

@Module({
  imports: [HttpModule],
  controllers: [CommandController],
  providers: [CommandService],
})
export class CommandModule {}
