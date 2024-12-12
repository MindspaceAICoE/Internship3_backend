import 'dotenv/config';
import http, { IncomingMessage, ServerResponse } from 'http';
import { sendResponse } from './utils/error.js';
import { contactroutes, meetingroutes } from './routes.js';


http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.url.startsWith("/api/contact")) {
        contactroutes(req, res);
    }else if (req.url.startsWith("/api/meeting")) {
        meetingroutes(req, res);
    }
     else {
        sendResponse(res, 404, { message: 'Endpoint not found' });
    }
}).listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

