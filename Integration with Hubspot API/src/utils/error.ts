import { ServerResponse } from 'http';

export const sendResponse = (res: ServerResponse, statusCode: number, data: object) => {
    if (!res.writableEnded) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }
};
