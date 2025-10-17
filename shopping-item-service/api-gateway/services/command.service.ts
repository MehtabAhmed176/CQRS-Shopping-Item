// src/services/command.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class CommandService {
  constructor(private readonly httpService: HttpService) {}

  async createItem(data: Record<string, unknown>): Promise<unknown> {
    const commandServiceUrl = 'http://localhost:4001/api/items'; // Command Service URL
    const response: AxiosResponse<unknown> = await lastValueFrom(
      this.httpService.post(commandServiceUrl, data),
    );
    return response.data;
  }
}
