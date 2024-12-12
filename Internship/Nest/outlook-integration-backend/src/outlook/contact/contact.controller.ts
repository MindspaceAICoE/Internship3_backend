import {Controller,Post,Get,Patch,Delete,Body,Param,Headers,HttpException,HttpStatus,} from '@nestjs/common';
import { ContactService } from './contact.service';
  
  @Controller('contact')
  export class ContactController {
    constructor(private readonly contactService: ContactService) {}
  
    @Post('new')
    async createContact(
      @Headers('authorization') authorization: string,
      @Body() contactDetails: any,
    ): Promise<any> {
    const accessToken = authorization?.replace('Bearer ', '');
    if (!accessToken) {
      throw new HttpException('Access token is required.', HttpStatus.BAD_REQUEST);
    }

    let parsedDetails;
    try {
      parsedDetails = typeof contactDetails === 'string' ? JSON.parse(contactDetails) : contactDetails;
    } catch (error) {
      throw new HttpException('Invalid JSON format.', HttpStatus.BAD_REQUEST);
    }

    const { givenName, surname, emailAddresses, businessPhones, mobilePhone } = parsedDetails;

    if (!givenName || !surname) {
      throw new HttpException('Both "givenName" and "surname" are required.', HttpStatus.BAD_REQUEST,);
    }
    if (!emailAddresses || !Array.isArray(emailAddresses) || emailAddresses.length === 0) {
      throw new HttpException('At least one valid email address is required.', HttpStatus.BAD_REQUEST,);
    }

    emailAddresses.forEach((email: any, index: number) => {
      if (!email?.address || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.address)) {
        throw new HttpException( `Invalid email format at index ${index}: ${email?.address || 'undefined'}`,HttpStatus.BAD_REQUEST, );
      }
    });

    const phoneRegex = /^(\+?\d{1,3}-)?\d{7,15}$/;
    if (businessPhones && !Array.isArray(businessPhones)) {
      throw new HttpException('BusinessPhones must be an array of phone numbers.', HttpStatus.BAD_REQUEST,);
    }

    if (businessPhones && businessPhones.some((phone) => !phoneRegex.test(phone))) {
      throw new HttpException('All business phone numbers must be valid numbers with an optional country code and dash.', HttpStatus.BAD_REQUEST,
      );
    }

    if (mobilePhone && !phoneRegex.test(mobilePhone)) {
      throw new HttpException( 'Mobile phone number must be a valid number with an optional country code and dash. e.g., +91-1234567890', HttpStatus.BAD_REQUEST,
      );
    }

    return this.contactService.createContact(accessToken, parsedDetails);
    }

  
    @Get(':id')
    async getContact(
      @Headers('authorization') authorization: string,
      @Param('id') contactId: string,
    ): Promise<any> {
      const accessToken = authorization?.replace('Bearer ', '');
      if (!accessToken) {
        throw new HttpException('Access token is required.', HttpStatus.BAD_REQUEST);
      }
      const contact = await this.contactService.getContact(accessToken, contactId);
      
      if (!contact) {
        throw new HttpException(`No contact found with the ID: ${contactId}.`,HttpStatus.NOT_FOUND,);
      }
      return {message: 'Contact found successfully.',data: contact, };
    }

  
    @Patch(':id')
    async updateContact(
      @Headers('authorization') authorization: string,
      @Param('id') contactId: string,
      @Body() updateData: any,
    ): Promise<any> {
      const accessToken = authorization?.replace('Bearer ', '');
      if (!accessToken) {
        throw new HttpException('Access token is required.', HttpStatus.BAD_REQUEST);
      }

      let parsedData;
      try {
        parsedData = typeof updateData === 'string' ? JSON.parse(updateData) : updateData;
      } catch (error) {
        throw new HttpException('Invalid JSON format.', HttpStatus.BAD_REQUEST);
      }
    
      if (Object.keys(parsedData).length === 0) {
        throw new HttpException('No updates provided.', HttpStatus.BAD_REQUEST);
      }
    
      const { emailAddresses, businessPhones, mobilePhone } = parsedData;
    
      if (emailAddresses) {
        if (!Array.isArray(emailAddresses)) {
          throw new HttpException('"emailAddresses" must be an array.', HttpStatus.BAD_REQUEST);
        }
    
        emailAddresses.forEach((email: any, index: number) => {
          if (!email?.address || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.address)) {
            throw new HttpException( `Invalid email format at index ${index}: ${email?.address || 'undefined'}`,HttpStatus.BAD_REQUEST, );
          }
        });
      }
    
      const phoneRegex = /^\+?[0-9]{1,3}-[0-9]{7,15}$/;
      if (businessPhones) {
        if (!Array.isArray(businessPhones)) {
          throw new HttpException( '"businessPhones" must be an array of phone numbers.', HttpStatus.BAD_REQUEST,);
        }
    
        businessPhones.forEach((phone, index) => {
          if (!phoneRegex.test(phone)) {
            throw new HttpException(`Invalid business phone number at index ${index}: ${phone}`, HttpStatus.BAD_REQUEST,);
          }
        });
      }
    
      if (mobilePhone && !phoneRegex.test(mobilePhone)) {
        throw new HttpException('Mobile phone number must be a valid number with an optional country code and dash. e.g., +91-1234567890', HttpStatus.BAD_REQUEST,);
      }
      return this.contactService.updateContact(accessToken, contactId, parsedData);
    }
    

  
    @Delete(':id')
    async deleteContact(
      @Headers('authorization') authorization: string,
      @Param('id') contactId: string,
    ): Promise<{ message: string }> {
      const accessToken = authorization?.replace('Bearer ', '');
      if (!accessToken) {
        throw new HttpException('Access token is required.', HttpStatus.BAD_REQUEST);
      }
      const result = await this.contactService.deleteContact(accessToken, contactId);
      if (!result) {
        throw new HttpException(`No contact found with the ID: ${contactId}.`,HttpStatus.NOT_FOUND, );
      }
      return { message: 'Contact deleted successfully.' };
    }

  }
  