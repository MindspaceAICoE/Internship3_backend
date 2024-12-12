import express, { Request, Response } from 'express';
import { getevents, createEvent, getSpecifiedEvent, updateEvent, deleteEvent} from '../Controllers/Outlook-Event-Controllers.js'; 

const eventrouter = express.Router();

eventrouter.get('/all', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return 
    }

    try {
        const calendars = await getevents(accessToken);
        res.json(calendars);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Error fetching events.' });
    }
});


eventrouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if (!accessToken) {
            res.status(400).send('Authorization token missing.');
            return;
        }
        const eventId = req.params.id;

        const select = req.query.$select as string | undefined;
        const prefer = req.query.Prefer as string | undefined;

        let queryParams = '';
        if (select) {
            queryParams += `$select=${select}`;
        }
        if (prefer) {
            queryParams += queryParams ? `&Prefer=${prefer}` : `Prefer=${prefer}`;
        }

        const event = await getSpecifiedEvent(accessToken, eventId, queryParams);

        res.json(event);
    } catch (error) {
        console.error('Error fetching specified event:', error);
        res.status(500).send('Error fetching specified event: ' + (error as Error).message);
    }
});




eventrouter.post('/new', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    const { subject, body, start, end, location, attendees } = req.body;

    if (!subject || !body || !start || !end || !location || !attendees) {
        res.status(400).json({ error: 'Missing required event details.' });
        return;
    }

    try {
        const event = await createEvent(
            accessToken,
            subject,
            body.content,
            start.dateTime, 
            end.dateTime, 
            location.displayName,
            attendees 
        );
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Error creating event.' });
    }
});


eventrouter.patch('/:id', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const eventId = req.params.id;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    if (!eventId) {
        res.status(400).json({ error: 'Event ID is required.' });
        return;
    }

    const { subject, body, start, end, location, attendees } = req.body;

    if (!subject && !body && !start && !end && !location && !attendees) {
        res.status(400).json({ error: 'At least one field to update is required.' });
        return;
    }

    try {
        const updatedEvent = await updateEvent(
            accessToken,
            eventId,
            subject,
            body?.content,
            start?.dateTime,
            end?.dateTime,
            location?.displayName,
            attendees
        );
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Error updating event.' });
    }
});


eventrouter.delete('/:eventId', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const { eventId } = req.params;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    if (!eventId) {
        res.status(400).json({ error: 'Event ID is required.' });
        return;
    }

    try {
        await deleteEvent(accessToken, eventId);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Error deleting event.' });
    }
});

export default eventrouter;
