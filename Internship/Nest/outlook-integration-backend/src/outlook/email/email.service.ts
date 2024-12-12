import { Injectable, HttpException, HttpStatus  } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EmailService {
  private readonly baseUrl = 'https://graph.microsoft.com/v1.0/me/messages';
  
  async readEmail(accessToken: string, query?: string): Promise<any> {
    try {
      const url = query ? `${this.baseUrl}?${query}` : this.baseUrl;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const totalMessages = response.data.value.length;
      const messages = response.data.value;

      return {totalMessages, messages,};
    } catch (error) {
      console.log(error)
      const errorMessage =
        error.response?.data?.error_description || error.message || 'Error fetching emails';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  async sendEmail(
    accessToken: string,
    recipient: string,
    ccRecipient: string | null,
    subject: string,
    body: string,
    saveToSentItems: boolean = false
  ): Promise<string> { 
    try {
      const emailPayload = {
        message: {
          subject: subject,
          body: {
            contentType: 'Text',
            content: body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: recipient,
              },
            },
          ],
          ccRecipients: ccRecipient
            ? [
                {
                  emailAddress: {
                    address: ccRecipient,
                  },
                },
              ]
            : [],
        },
        saveToSentItems: saveToSentItems.toString(),
      };
  
      await axios.post('https://graph.microsoft.com/v1.0/me/sendMail', emailPayload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      return 'Email sent successfully.';
    } catch (error) {
      throw new Error('Error sending email: ' + (error.response?.data?.error_description || error.message));
    }
  }

  async getSpecifiedEmail(accessToken: string, emailId: string, queryParams: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/${emailId}${queryParams ? `?${queryParams}` : ''}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data) {
        return { message: 'Email found successfully.', data: response.data,};
      } else {
        console.log(`Email with ID ${emailId} not found.`);
        return {message: 'No email found with the given ID.',};
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`Email with ID ${emailId} not found.`);
        return {message: 'No email found with the given ID.',};
      } else {
        console.log(`Error fetching email with ID ${emailId}:`, error);
        throw new Error('Error fetching specified email: ' + (error.response?.data?.error_description || error.message));
      }
    }
  }
  

  async deleteEmail(accessToken: string, emailId: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/${emailId}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 204) {
        return {message: 'Email deleted successfully.',};
      } else {
        return {message: 'Email deletion unsuccessful.',};
      }
    } catch (error) {
      throw new Error('Error deleting email: ' + (error.response?.data?.error_description || error.message));
    }
  }
  
}
