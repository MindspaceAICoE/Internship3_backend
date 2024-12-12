import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ContactService {
  private readonly graphApiBaseUrl = 'https://graph.microsoft.com/v1.0/me/contacts';

  async createContact(accessToken: string, contactDetails: any): Promise<any> {
    try {
      const response = await axios.post(this.graphApiBaseUrl, contactDetails, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return { message: 'Contact created successfully.', data: response.data };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.error?.message || 'Error creating contact.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  async getContact(accessToken: string, contactId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.graphApiBaseUrl}/${contactId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {return null;}
  
      throw new HttpException(error.response?.data?.error?.message || 'Error fetching contact.',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,);
    }
  }
  

  async updateContact(accessToken: string, contactId: string, updateData: any): Promise<any> {
    try {
      const response = await axios.patch(`${this.graphApiBaseUrl}/${contactId}`, updateData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return { message: 'Contact updated successfully.', data: response.data };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.error?.message || 'Error updating contact.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteContact(accessToken: string, contactId: string): Promise<boolean> {
    try {
      await axios.delete(`${this.graphApiBaseUrl}/${contactId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return true; 
    } catch (error) {
      if (error.response?.status === 404) {return false;}
      throw new HttpException(
        error.response?.data?.error?.message || 'Error deleting contact.',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
}
