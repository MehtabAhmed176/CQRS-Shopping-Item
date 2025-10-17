// src/services/query.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class QueryService {
  constructor(private readonly httpService: HttpService) {}

  async getItems() {
    const queryServiceUrl = 'http://localhost:4002/api/items'; // Query Service URL
    const response: AxiosResponse<unknown> = await lastValueFrom(
      this.httpService.get(queryServiceUrl),
    );
    return response.data;
  }
}
