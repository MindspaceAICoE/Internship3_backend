import express, { Request, Response } from 'express';
import { createContact, getContact, updateContact, deleteContact} from '../Controllers/Outlook-Contact-Controllers.js'; 

const contactrouter = express.Router();

contactrouter.post('/new', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const { givenName, surname, emailAddresses, businessPhones } = req.body;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    if (!givenName || !surname || !emailAddresses || !businessPhones) {
        res.status(400).json({ error: 'Missing required contact details.' });
        return;
    }

    try {
        const contact = await createContact(accessToken, {
            givenName,
            surname,
            emailAddresses,
            businessPhones,
        });

        res.status(201).json(contact);
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: 'Error creating contact.' });
    }
});



contactrouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const contactId = req.params.id;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    if (!contactId) {
        res.status(400).json({ error: 'Contact ID is required.' });
        return;
    }

    try {
        const contact = await getContact(accessToken, contactId);
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ error: 'Error fetching contact.' });
    }
});

contactrouter.patch('/:id', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const contactId = req.params.id;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    if (!contactId) {
        res.status(400).json({ error: 'Contact ID is required.' });
        return;
    }

    const updateData = req.body;

    // Validate that at least one property is being updated
    if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'No updates provided. Please include at least one property to update.' });
        return;
    }

    try {
        const updatedContact = await updateContact(accessToken, contactId, updateData);
        res.status(200).json(updatedContact);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Error updating contact.' });
    }
});

contactrouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const contactId = req.params.id;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    if (!contactId) {
        res.status(400).json({ error: 'Contact ID is required.' });
        return;
    }

    try {
        await deleteContact(accessToken, contactId);
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Error deleting contact.' });
    }
});


export default contactrouter;