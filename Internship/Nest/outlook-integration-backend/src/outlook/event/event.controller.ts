import {Controller,Get,Post,Patch,Delete,Body,Param,Query,Headers,HttpException,HttpStatus,} from '@nestjs/common';
import { EventService } from './event.service';
  
  @Controller('event') // Base path: /events
  export class EventController {
    constructor(private readonly eventService: EventService) {}
  
    @Get('all')
  async getAllEvents(@Headers('authorization') authHeader: string) {
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      throw new HttpException('Access token is required.', HttpStatus.BAD_REQUEST);
    }

    const result = await this.eventService.getEvents(accessToken);
    return result; 
  }

  
  @Get(':id')
  async getSpecifiedEvent(
    @Headers('authorization') authHeader: string,
    @Param('id') eventId: string,
    @Query('$select') select?: string,
    @Query('Prefer') prefer?: string,
  ) {
    const accessToken = authHeader?.replace('Bearer ', '');
  
    if (!accessToken) {
      throw new HttpException('Access token is required.', HttpStatus.BAD_REQUEST);
    }
    const queryParams = new URLSearchParams();
    if (select) queryParams.append('$select', select);
    if (prefer) queryParams.append('Prefer', prefer);

    const result = await this.eventService.getSpecifiedEvent(accessToken, eventId, queryParams.toString());

    if (result.message === 'Event found successfully.') {
      return result;
    } else {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }
  }
  

  @Post('new')
  async createEvent(
    @Headers('authorization') authHeader: string,
    @Body() body: any,
  ) {
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      throw new HttpException('Access token is required.', HttpStatus.BAD_REQUEST);
    }

    if (!body || typeof body !== 'object') {
      throw new HttpException('Invalid request body.', HttpStatus.BAD_REQUEST);
    }

    const createEventDto = {
      subject: body.subject,
      body: body.body,
      start: body.start,
      end: body.end,
      location: body.location,
      attendees: body.attendees,
      allowNewTimeProposals: body.allowNewTimeProposals,
    };

    return await this.eventService.createEvent(accessToken, createEventDto);
  }

  
  @Patch(':id')
  async updateEvent(
    @Headers('authorization') authHeader: string,
    @Param('id') eventId: string,
    @Body() body: any,
  ) {
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      throw new HttpException('Access token is required.', HttpStatus.BAD_REQUEST);
    }

    if (!eventId) {
      throw new HttpException('Event ID is required.', HttpStatus.BAD_REQUEST);
    }

    if (!body || typeof body !== 'object') {
      throw new HttpException('Invalid request body.', HttpStatus.BAD_REQUEST);
    }

    const updateEventDto = {
      subject: body.subject,
      body: body.body,
      start: body.start,
      end: body.end,
      location: body.location,
      attendees: body.attendees,
      allowNewTimeProposals: body.allowNewTimeProposals,
    };


    return await this.eventService.updateEvent(accessToken, eventId, updateEventDto);
  }

  @Delete(':id')
  async deleteEvent(
    @Headers('authorization') authHeader: string,
    @Param('id') eventId: string,
  ) {
    const accessToken = authHeader?.replace('Bearer ', '');
  
    if (!accessToken) {
      throw new HttpException('Access token is required.', HttpStatus.BAD_REQUEST);
    }
  
    const result = await this.eventService.deleteEvent(accessToken, eventId);
    return result;
  }
}
  