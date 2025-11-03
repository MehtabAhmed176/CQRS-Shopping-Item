import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommandService {
  constructor(private readonly http: HttpService) { }

  async createItem(data: any) {
    const url = 'http://localhost:4001/api/command/items';
    const response = await firstValueFrom(this.http.post(url, data));
    return response.data;
  }

  async updateItem(itemId: string, data: any) {
    const url = `http://localhost:4001/api/command/items/${itemId}`;
    console.log('🌐 Sending update request to:', url);

    try {
      const response = await firstValueFrom(this.http.put(url, data));
      console.log('✅ Item updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to update item:', error.message);

      if (error.response) {
        // Handle known HTTP errors gracefully
        const { status, data: errData } = error.response;
        return {
          success: false,
          status,
          message: errData?.message || 'Command Service responded with an error',
        };
      }

      return {
        success: false,
        status: 500,
        message: 'Internal error while calling Command Service',
      };
    }
  }

  async deleteItem(itemId: string) {
    const url = `http://localhost:4001/api/command/items/${itemId}`;
    const response = await firstValueFrom(this.http.delete(url));
    return response.data;
  }

}
