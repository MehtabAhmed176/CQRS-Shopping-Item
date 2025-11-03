import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class QueryService {
  constructor(private readonly http: HttpService) { }

  async getItems() {
    console.log("requets reached")
    const url = 'http://localhost:4002/api/query/items';
    const response = await firstValueFrom(this.http.get(url));
    return response.data;
  }

  async getItemById(id: string) {
    const url = `http://localhost:4002/api/query/items/${id}`;
    console.log('🌐 API Gateway calling QueryService:', url);

    try {
      const response = await firstValueFrom(this.http.get(url));

      // Success path
      if (response.status === 200) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      // Unexpected non-error responses
      return {
        success: false,
        message: response.data.message || 'Unexpected response from Query Service',
        status: response.status,
      };
    } catch (error: any) {
      console.error('❌ Gateway error while fetching item:', error.message);

      // Handle known Axios response errors
      if (error.response) {
        const { status, data } = error.response;
        return {
          success: false,
          message: data?.message || 'Query Service responded with an error',
          status,
        };
      }

      // Handle network or timeout errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        return {
          success: false,
          message: 'Query Service is unreachable. Please try again later.',
          status: 503,
        };
      }

      // Fallback
      return {
        success: false,
        message: 'Internal error in API Gateway',
        error: error.message,
        status: 500,
      };
    }
  }

}
