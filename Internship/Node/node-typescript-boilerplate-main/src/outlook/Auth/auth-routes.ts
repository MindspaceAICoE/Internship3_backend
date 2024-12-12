import express, { Request, Response } from 'express';
import { getAuthorizationUrl, getAccessToken } from './auth.js';

const router = express.Router();

router.get('/auth', (_req: Request, res: Response) => {
    try {
        const authUrl = getAuthorizationUrl();
        res.redirect(authUrl); 
    } catch (error) {
        res.status(500).send('Error generating authorization URL: ' + error.message);
    }
});

router.get('/callback', async (req: Request, res: Response) => {
    const authorizationCode = req.query.code as string;
    console.log("AuthCode",authorizationCode)
    try {
        const accessToken = await getAccessToken(authorizationCode);
        res.send(`Access token obtained successfully! Access Token: ${accessToken}`);
    } catch (error) {
        res.status(500).send('Error during authentication: ' + error.message);
    }
});

export default router;
