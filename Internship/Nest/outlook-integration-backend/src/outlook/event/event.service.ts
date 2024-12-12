import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { error } from 'console';
import * as moment from 'moment';  // Import moment.js for date validation

@Injectable()
export class EventService {
  private readonly graphApiBaseUrl = 'https://graph.microsoft.com/v1.0/me/events';

  async getEvents(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(this.graphApiBaseUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        totalEvents: response.data.value.length, 
        events: response.data.value,
      };
    } catch (error) {
      this.handleError(error);
    }
  }
  
  async getSpecifiedEvent(accessToken: string, eventId: string, queryParams: string): Promise<any> {
    try {
      const url = `${this.graphApiBaseUrl}/${eventId}${queryParams ? `?${queryParams}` : ''}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data) {
        return {message: 'Event found successfully.',data: response.data,};
      } else {
        return {message: `No event found with the specified ID ${eventId}.`,};
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return {message: `No event found with the specified ID ${eventId}.`,};
      } else {
        this.handleError(error);
        return {message: 'An error occurred while fetching the event.',error: error.message,};
      }
    }
  }
  async createEvent(accessToken: string, createEventDto: any): Promise<any> {
    const { subject, body, start, end, location, attendees, allowNewTimeProposals } = createEventDto;
  
    // Validate required fields
    if (!subject || !body || !start || !end || !location || !attendees || attendees.length === 0) {
      throw new HttpException(
        'All fields (subject, body, start, end, location, attendees) are required.',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    // Validate body content
    if (!body.content || body.contentType !== 'HTML') {
      throw new HttpException('Body content must be provided, and contentType must be "HTML".', HttpStatus.BAD_REQUEST);
    }
  
    // Validate dateTime format for start and end
    if (!moment(start.dateTime, moment.ISO_8601, true).isValid()) {
      throw new HttpException('Invalid start dateTime format. It must follow ISO 8601 format.', HttpStatus.BAD_REQUEST);
    }
    if (!moment(end.dateTime, moment.ISO_8601, true).isValid()) {
      throw new HttpException('Invalid end dateTime format. It must follow ISO 8601 format.', HttpStatus.BAD_REQUEST);
    }
  
    // Ensure start dateTime is before end dateTime
    if (moment(start.dateTime).isAfter(moment(end.dateTime))) {
      throw new HttpException('Start dateTime must be before end dateTime.', HttpStatus.BAD_REQUEST);
    }
  
    // Validate attendees
    const invalidEmails = attendees.filter(
      (attendee) => !this.isValidEmail(attendee.emailAddress?.address),
    );
    if (invalidEmails.length > 0) {
      throw new HttpException(
        `Invalid email address(es): ${invalidEmails.map((attendee) => attendee.emailAddress.address).join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  
    // Correctly structure the event payload
    const eventPayload = {
      subject,
      body: {
        contentType: body.contentType,
        content: body.content,
      },
      start: { dateTime: start.dateTime, timeZone: start.timeZone || 'UTC' },
      end: { dateTime: end.dateTime, timeZone: end.timeZone || 'UTC' },
      location: { displayName: location.displayName },
      attendees: attendees.map((attendee) => ({
        emailAddress: attendee.emailAddress,
        type: attendee.type || 'required',
      })),
      allowNewTimeProposals: allowNewTimeProposals || true,
    };
  
    try {
      const response = await axios.post(this.graphApiBaseUrl, eventPayload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Prefer: 'outlook.timezone="UTC"',
        },
      });
  
      return {
        message: 'Event created successfully.',
        data: response.data,
      };
    } catch (error) {
      this.handleError(error);
      throw new HttpException(
        `Event creation failed: ${error.response?.data?.error_description || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  // Helper function to validate email address
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }
  
  


  async updateEvent(accessToken: string, eventId: string, updateEventDto: any): Promise<any> {
    const { subject, body, start, end, location, attendees, allowNewTimeProposals } = updateEventDto;
  
    // Validate start and end dateTime formats if provided
    if (start && !moment(start.dateTime, moment.ISO_8601, true).isValid()) {
      throw new HttpException('Invalid start dateTime format. It must follow ISO 8601 format.', HttpStatus.BAD_REQUEST);
    }
    if (end && !moment(end.dateTime, moment.ISO_8601, true).isValid()) {
      throw new HttpException('Invalid end dateTime format. It must follow ISO 8601 format.', HttpStatus.BAD_REQUEST);
    }
  
    // Ensure start dateTime is before end dateTime if both are provided
    if (start && end && moment(start.dateTime).isAfter(moment(end.dateTime))) {
      throw new HttpException('Start dateTime must be before end dateTime.', HttpStatus.BAD_REQUEST);
    }
  
    // Validate attendees if provided
    if (attendees) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = attendees.filter((attendee) => !emailRegex.test(attendee.emailAddress?.address));
      if (invalidEmails.length > 0) {
        throw new HttpException(
          `Invalid email format for attendee(s): ${invalidEmails
            .map((attendee) => attendee.emailAddress.address)
            .join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    // Prevent updating dates if allowNewTimeProposals is set to false
    if (allowNewTimeProposals === false && (start || end)) {
      throw new HttpException(
        'Cannot update the dates because allowNewTimeProposals is set to false.',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    // Prepare the event payload for the update
    const eventPayload: any = {};
    if (subject) eventPayload.subject = subject;
    if (body) eventPayload.body = { contentType: 'HTML', content: body };
    if (start) eventPayload.start = { dateTime: start.dateTime, timeZone: start.timeZone || 'UTC' };
    if (end) eventPayload.end = { dateTime: end.dateTime, timeZone: end.timeZone || 'UTC' };
    if (location) eventPayload.location = { displayName: location.displayName };
    if (attendees) {
      eventPayload.attendees = attendees.map((attendee) => ({
        emailAddress: { address: attendee.emailAddress?.address, name: attendee.emailAddress?.name },
        type: attendee.type || 'required',
      }));
    }
    if (allowNewTimeProposals !== undefined) eventPayload.allowNewTimeProposals = allowNewTimeProposals;
  
    try {
      const response = await axios.patch(
        `${this.graphApiBaseUrl}/${eventId}`,
        eventPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return { message: 'Event updated successfully.', data: response.data };
    } catch (error) {
      console.error('Error updating event:', error.response?.data || error.message);
      throw new HttpException(
        `Error updating event: ${error.response?.data?.error_description || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

async deleteEvent(accessToken: string, eventId: string): Promise<any> {
  try {
    const response = await axios.delete(`${this.graphApiBaseUrl}/${eventId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 204) {
      return { message: 'Event deleted successfully.' };
    } else {
      throw new Error('Unexpected response when deleting event.');
    }
  } catch (error) {
    console.log('Error deleting event:', error);
    return {
      message: 'Error deleting event.',
      error: error.response?.data?.error_description || error.message,
    };
  }
}

private handleError(error: any): void {
  const errorMessage = error.response?.data?.error?.message || error.message;
  throw new HttpException(errorMessage, error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
}
}
