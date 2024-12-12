import { Controller, Get, Post, Body, Param, Query, Delete, Headers } from '@nestjs/common';
import { EmailService } from './email.service';

import { UnauthorizedException, BadRequestException } from '@nestjs/common';

@Controller('/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  @Get('all')
  async getAllEmails(
    @Headers('authorization') authHeader: string,
    @Query('query') query?: string
  ): Promise<any> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing.');
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('Authorization token missing.');
    }
    try {
      return await this.emailService.readEmail(accessToken, query);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('send')
  async sendEmail(
    @Headers('authorization') authHeader: string,
    @Body() emailDetails: {
      recipient: string;
      ccRecipient?: string;
      subject: string;
      body: string;
      saveToSentItems?: boolean;
    }
  ): Promise<string> { 
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) {
      throw new BadRequestException('Authorization token missing.');
    }
    const { recipient, ccRecipient, subject, body, saveToSentItems } = emailDetails;
    if (!this.isValidEmail(recipient)) {
      throw new BadRequestException('Invalid recipient email format.');
    }
    if (ccRecipient && !this.isValidEmail(ccRecipient)) {
      throw new BadRequestException('Invalid CC recipient email format.');
    }
    if (!recipient || !subject || !body) {
      throw new BadRequestException('Recipient, subject, and body are required.');
    }

    return await this.emailService.sendEmail(
      accessToken,
      recipient,
      ccRecipient || null,
      subject,
      body,
      saveToSentItems ?? false
    );
  }
  

  @Get(':id')
  async getSpecifiedEmail(
    @Headers('authorization') authHeader: string,
    @Param('id') emailId: string,
    @Query() queryParams: Record<string, string>
  ): Promise<any> {
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) {
      throw new BadRequestException('Authorization token missing.');
    }
    const queryParamsString = new URLSearchParams(queryParams).toString();
    const result = await this.emailService.getSpecifiedEmail(accessToken, emailId, queryParamsString);
    return result;
  }

  @Delete(':id')
  async deleteEmail(
    @Headers('authorization') authHeader: string,
    @Param('id') emailId: string
  ): Promise<any> {
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) {
      throw new BadRequestException('Authorization token missing.');
    }
    if (!emailId) {
      throw new BadRequestException('Email ID is required.');
    }
    const result = await this.emailService.deleteEmail(accessToken, emailId);
    return result;
  }
}
