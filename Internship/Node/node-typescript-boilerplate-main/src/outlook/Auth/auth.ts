import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export const getAuthorizationUrl = (): string => {
    const clientId = process.env.CLIENT_ID;
    const redirectUri = process.env.REDIRECT_URI;

    if (!clientId || !redirectUri) {
        throw new Error('Missing CLIENT_ID, or REDIRECT_URI in environment variables.');
    }

    const state = crypto.randomBytes(16).toString('hex');
    const authUrl =
        `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=Tasks.Read Tasks.ReadWrite Contacts.Read Contacts.ReadWrite Calendars.ReadBasic Calendars.Read Calendars.ReadWrite Mail.Read Mail.ReadBasic Mail.ReadWrite Mail.Send User.Read offline_access&` +
        `state=${state}`;

    console.log('Generated Authorization URL:', authUrl);
    return authUrl;
};


export const getAccessToken = async (code: string): Promise<string> => {
    const tokenUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;

    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URI) {
        throw new Error('Missing CLIENT_ID, CLIENT_SECRET, or REDIRECT_URI in environment variables.');
    }

    const data = new URLSearchParams();
    data.append('client_id', process.env.CLIENT_ID);
    data.append('client_secret', process.env.CLIENT_SECRET);
    data.append('code', code);
    data.append('redirect_uri', process.env.REDIRECT_URI);
    data.append('grant_type', 'authorization_code');

    try {
        const response = await axios.post(tokenUrl, data);
        console.log('Access Token Response:', response.data); 
        return response.data.access_token;
    } catch (error) {
        throw new Error('Error fetching access token: ' + error.response?.data?.error_description || error.message);
    }
};