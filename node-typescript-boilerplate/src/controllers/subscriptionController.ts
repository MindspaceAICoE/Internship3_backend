import { Request, Response } from 'express';
import { addUserToMailchimp, sendEmail } from '../mailchimp.js';

export class SubscriptionController {

    // Handle sending email via Mailchimp API
    static async send(req: Request, res: Response): Promise<Response> {
        try {
            const { recipient, subject, body } = req.body;
            if (!recipient || !subject || !body) {
                return res.status(400).json({ error: 'Recipient, subject, and body are required.' });
            }

            const result = await sendEmail(subject, body, recipient);
            return res.status(200).json({ message: 'Email sent successfully', result });
        } catch (error: any) {
            console.error('Error in sendEmail:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    // New signup method to add users to Mailchimp
    static async signup(req: Request, res: Response): Promise<Response> {
        try {
            const { email, firstName, lastName, contactNumber } = req.body;

            if (!email || !firstName || !lastName || !contactNumber) {
                return res.status(400).json({ error: 'Email, firstName, and lastName are required.' });
            }

            // Add user to Mailchimp list
            const result = await addUserToMailchimp(email, firstName, lastName, contactNumber);
            return res.status(200).json({ message: 'User added to Mailchimp list', result });
        } catch (error: any) {
            console.error('Error in signup:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }
}
