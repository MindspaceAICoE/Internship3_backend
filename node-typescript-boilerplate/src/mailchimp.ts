import axios from 'axios';
import dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config();

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || '';
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || '';
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || 'us10'; 

const API_URL = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;
const authHeader = {
    Authorization: `Bearer ${MAILCHIMP_API_KEY}`
};

// Type for the user payload to Mailchimp
interface MailchimpUser {
    email_address: string;
    status: 'subscribed' | 'pending'; // 'subscribed' for regular or 'pending' for double opt-in
    merge_fields: {
        FNAME: string;
        LNAME: string;
        PHONE: string; 
    };
}

// Function to hash the email for Mailchimp's API
export const hashEmail = (email: string): string => {
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
};

// Function to add user to Mailchimp list
export const addUserToMailchimp = async (email: string, firstName: string, lastName: string, contactNumber: string): Promise<any> => {
    const userPayload: MailchimpUser = {
        email_address: email,
        status: 'subscribed', // Change to 'pending' if you want to implement double opt-in
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
            PHONE: contactNumber // Ensure this is correctly mapped
        }
    };

    try {
        const response = await axios.post(API_URL, userPayload, { headers: authHeader });
        return response.data;
    } catch (error: any) {
        throw new Error(`Mailchimp API Error: ${error.response?.data?.detail || error.message}`);
    }
};

// Function to send an email using Mailchimp API (Transactional emails)
export const sendEmail = async (subject: string, body: string, recipient: string): Promise<any> => {
    const emailPayload = {
        message: {
            subject: subject,
            from_email: "your-email@example.com", // Update with the actual sender's email
            from_name: "Your Team",
            to: [{ email: recipient, type: "to" }],
            text: body
        }
    };

    try {
        const response = await axios.post(
            `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/messages/send`,
            emailPayload,
            { headers: authHeader }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(`Mailchimp API Error: ${error.response?.data?.detail || error.message}`);
    }
};



export const addTaskToMailchimpCalendar = async (task: string, startDate: string, endDate: string) => {
    const API_URL = `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/calendars`;

    const authHeader = {
        Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,  // Make sure this API key is correct.
    };

    const calendarEventPayload = {
        event: {
            summary: task,
            start: {
                dateTime: startDate,
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: endDate,
                timeZone: 'Asia/Kolkata',
            },
        },
    };

    try {
        const response = await axios.post(API_URL, calendarEventPayload, { headers: authHeader });
        return response.data;
    } catch (error) {
        throw new Error(`Mailchimp API Error: ${error.response?.data?.detail || error.message}`);
    }
};
