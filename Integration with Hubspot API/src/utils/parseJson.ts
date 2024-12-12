import { IncomingMessage, ServerResponse } from 'http';
import { sendResponse } from './error.js';

export const parseJson = (req: IncomingMessage, res: ServerResponse, callback: (req: IncomingMessage, res: ServerResponse) => void): void => {
    let body = '';

    req.on('data', (chunk: Buffer) => {
        body += chunk;
    });

    req.on('end', () => {
        try {
            (req as IncomingMessage & { body?: any }).body = JSON.parse(body); 
            callback(req, res);  
        } catch (error) {
            sendResponse(res, 400, { message: 'Error parsing JSON, invalid format' });
        }
    });

};
