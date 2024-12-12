export enum Delays {
  Short = 500,
  Medium = 2000,
  Long = 5000,
}

/**
 * Returns a Promise<string> that resolves after a given time.
 *
 * @param {string} name - A name.
 * @param {number=} [delay=Delays.Medium] - A number of milliseconds to delay resolution of the Promise.
 * @returns {Promise<string>}
 */
function delayedHello(
  name: string,
  delay: number = Delays.Medium,
): Promise<string> {
  return new Promise((resolve: (value?: string) => void) =>
    setTimeout(() => resolve(`Hello, ${name}`), delay),
  );
}

export async function greeter(name: any) {
  
  return await delayedHello(name, Delays.Long);
}





import router from './zoho/routes/mailRoutes.js'
import axios from 'axios';
import crypto from 'crypto';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use('/api', router);

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to Zoho!');
});

app.get('/auth', (_req: Request, res: Response): void => {
    try {
        const clientId = process.env.ZOHO_CLIENT_ID;
        const redirectUri = process.env.ZOHO_REDIRECT_URI;
        const scope = process.env.ZOHO_SCOPE


        if (!clientId || !redirectUri) {
            throw new Error('Missing CLIENT_ID or REDIRECT_URI in environment variables.');
        }

        const state = crypto.randomBytes(16).toString('hex');
        const authUrl =
            `https://accounts.zoho.in/oauth/v2/auth?` +
            `response_type=code&` +
            `client_id=${clientId}&` +
            `scope=${scope}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `state=${state}`;

        console.log('Generated Authorization URL:', authUrl);
        res.status(200).send(authUrl);
    } catch (error) {
        console.error('Error generating authorization URL:', error);
        res.status(500).send('Error generating authorization URL: ' + error.message);
    }
});


app.get('/callback', async (req: Request, res: Response) => {
  const authorizationCode = req.query.code;

  if (!authorizationCode) {
    return res.status(400).send('Authorization code is missing.');
  }
  console.log("Auth Code",authorizationCode)

  const tokenUrl = `https://accounts.zoho.in/oauth/v2/token`;

  if (!process.env.ZOHO_CLIENT_ID || !process.env.ZOHO_CLIENT_SECRET || !process.env.ZOHO_REDIRECT_URI || !process.env.ZOHO_SCOPE) {
      throw new Error('Missing CLIENT_ID, CLIENT_SECRET, REDIRECT_URI or SCOPE in environment variables.');
  }

  const data = new URLSearchParams();
  data.append('code', authorizationCode);
  data.append('grant_type', 'authorization_code');
  data.append('client_id', process.env.ZOHO_CLIENT_ID);
  data.append('client_secret', process.env.ZOHO_CLIENT_SECRET);
  data.append('redirect_uri', process.env.ZOHO_REDIRECT_URI);
  data.append('scope', process.env.ZOHO_SCOPE);

  try {
    const response = await axios.post(tokenUrl, data);
    console.log('Access Token Response:', response.data); 
    console.log('Access Token:', response.data.access_token); 

    return response.data.access_token;
  } catch (error) {
      throw new Error('Error fetching access token: ' + error.response?.data?.error_description || error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on https://localhost:${port}`);
});

