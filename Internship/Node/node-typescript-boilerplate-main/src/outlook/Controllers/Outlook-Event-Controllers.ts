import axios from "axios";


export const getevents = async (accessToken: string): Promise<unknown[]> => {
    try {
        console.log('Fetching events via Graph API...');
        
        const response = await axios.get('https://graph.microsoft.com/v1.0/me/events', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Events fetched successfully!', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error fetching events: ' + (error.response?.data?.error_description || error.message));
    }
};

export const getSpecifiedEvent = async (accessToken: string, eventId: string, queryParams: string): Promise<unknown> => {
    try {
        const url = `https://graph.microsoft.com/v1.0/me/events/${eventId}${queryParams ? `?${queryParams}` : ''}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching event details:', error.response?.data || error.message);
        throw new Error('Error fetching event details.');
    }
};

export const createEvent = async (
    accessToken: string,
    subject: string,
    body: string,
    startDateTime: string,
    endDateTime: string,
    location: string,
    attendees: { address: string; name: string }[],
    timeZone: string = 'UTC',
    allowNewTimeProposals: boolean = true
): Promise<unknown> => {
    try {
        console.log('Creating event via Graph API...');

        const eventPayload = {
            subject: subject,
            body: {
                contentType: 'HTML',
                content: body,
            },
            start: {
                dateTime: startDateTime,
                timeZone: timeZone,
            },
            end: {
                dateTime: endDateTime,
                timeZone: timeZone,
            },
            location: {
                displayName: location,
            },
            attendees: attendees.map((attendee) => ({
                emailAddress: {
                    address: attendee.address,
                    name: attendee.name,
                },
                type: 'required',
            })),
            allowNewTimeProposals: allowNewTimeProposals,
            transactionId: '7E163156-7762-4BEB-A1C6-729EA81755A7',
        };

        const response = await axios.post('https://graph.microsoft.com/v1.0/me/events', eventPayload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                Prefer: 'outlook.timezone="Indian Standard Time"',
            },
        });

        console.log('Event created successfully!', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating event:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error creating event: ' + (error.response?.data?.error_description || error.message));
    }
};

export const updateEvent = async (
    accessToken: string,
    eventId: string,
    subject?: string,
    body?: string,
    startDateTime?: string,
    endDateTime?: string,
    location?: string,
    attendees?: { address: string; name: string }[],
    timeZone: string = 'UTC',
): Promise<unknown> => {
    try {
        console.log('Updating event via Graph API...');

        const eventPayload: Record<string, unknown> = {};

        if (subject) eventPayload.subject = subject;
        if (body) {
            eventPayload.body = {
                contentType: 'HTML',
                content: body,
            };
        }
        if (startDateTime) {
            eventPayload.start = {
                dateTime: startDateTime,
                timeZone: timeZone,
            };
        }
        if (endDateTime) {
            eventPayload.end = {
                dateTime: endDateTime,
                timeZone: timeZone,
            };
        }
        if (location) {
            eventPayload.location = {
                displayName: location,
            };
        }
        if (attendees) {
            eventPayload.attendees = attendees.map((attendee) => ({
                emailAddress: {
                    address: attendee.address,
                    name: attendee.name,
                },
                type: 'required',
            }));
        }

        const response = await axios.patch(
            `https://graph.microsoft.com/v1.0/me/events/${eventId}`,
            eventPayload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
            }
        );

        console.log('Event updated successfully!', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating event:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error updating event: ' + (error.response?.data?.error_description || error.message));
    }
};

export const deleteEvent = async (accessToken: string, eventId: string): Promise<void> => {
    try {
        console.log('Deleting event with ID:', eventId);

        const url = `https://graph.microsoft.com/v1.0/me/events/${eventId}`;
        await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Event deleted successfully!');
    } catch (error) {
        console.error('Error deleting event:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error deleting event: ' + (error.response?.data?.error_description || error.message));
    }
};