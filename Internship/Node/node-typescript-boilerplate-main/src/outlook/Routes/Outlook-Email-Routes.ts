import express, { Request, Response } from 'express';
import { readEmail, sendEmail, getSpecifiedEmail, deleteEmail} from '../Controllers/Outlook-Email-Controllers.js'; 


const emailrouter = express.Router();

emailrouter.get('/all', async (req: Request, res: Response): Promise<void> => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if (!accessToken) {
            res.status(400).send('Authorization token missing.');
            return;
        }

        const query = req.query.query as string | undefined;

        const emails = await readEmail(accessToken, query);
        res.json(emails);
    } catch (error) {
        res.status(500).send('Error fetching emails: ' + (error as Error).message);
    }
});


emailrouter.post('/send', async (req: Request, res: Response): Promise<void> => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"
        if (!accessToken) {
            res.status(400).send('Authorization token missing.');
            return;
        }

        const { recipient, ccRecipient, subject, body, saveToSentItems } = req.body;

        if (!recipient || !subject || !body) {
            res.status(400).send('Recipient, subject, and body are required.');
            return;
        }

        await sendEmail(
            accessToken,
            recipient,
            ccRecipient || null,
            subject,
            body,
            saveToSentItems ?? false 
        );

        res.send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email: ' + error.message);
    }
});


emailrouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if (!accessToken) {
            res.status(400).send('Authorization token missing.');
            return;
        }
        const emailId = req.params.id; 

        const select = req.query.$select as string | undefined;
        const prefer = req.query.Prefer as string | undefined;

        let queryParams = '';
        if (select) {
            queryParams += `$select=${select}`;
        }
        if (prefer) {
            queryParams += queryParams ? `&Prefer=${prefer}` : `Prefer=${prefer}`;
        }

        const email = await getSpecifiedEmail(accessToken, emailId, queryParams);
        res.json(email);
    } catch (error) {
        res.status(500).send('Error fetching specified email: ' + (error as Error).message);
    }
});


emailrouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if (!accessToken) {
            res.status(400).send('Authorization token missing.');
            return;
        }

        const emailId = req.params.id; 
        if(!emailId){
            res.status(400).send('Id is missing.');
            return;
        }

        const email = await deleteEmail(accessToken, emailId);
        res.json(email);
    } catch (error) {
        res.status(500).send('Error deleting specified email: ' + (error as Error).message);
    }
});

export default emailrouter;
