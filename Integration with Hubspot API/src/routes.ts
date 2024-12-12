import { IncomingMessage, ServerResponse } from 'http';
import { create, get, getbyId, update, remove } from './contacts/controllers/contact-controllers.js';
import { parseJson } from './utils/parseJson.js';
import { sendResponse } from './utils/error.js';
import { getAllMeetings, getMeetingById, deletebook, bookMeeting, updateMeeting } from './meetings/controllers/meeting-controllers.js'

export const contactroutes = (req: IncomingMessage, res: ServerResponse): void => {
    if (req.url === "/api/contact/create" && req.method === "POST") {
        parseJson(req, res, create);
    }
    else if (req.url?.match(/^\/api\/contact\?/) && req.method === "GET") {
        get(req, res);
    }
    else if (req.url?.match(/api\/contact\/[0-9]{11}$/)) {
        (req as any).id = req.url.split('/')[3];

        if (req.method === "GET") {
            getbyId(req, res);
        }
        else if (req.method === "PATCH") {
            parseJson(req, res, update);
        }
        else if (req.method === "DELETE") {
            remove(req, res);
        }
    }
    else{
        sendResponse(res, 404, { message: 'Endpoint not found' });  
    }
};

export const meetingroutes = (req: IncomingMessage, res: ServerResponse): void => {
    if (req.url === "/api/meeting/book" && req.method === "POST") {
        parseJson(req, res, bookMeeting);
    }
    else if (req.url?.match(/^\/api\/meeting\?/) && req.method === "GET") {
        getAllMeetings(req, res);
    }  
    else if (req.url?.match(/api\/meeting\/[0-9]{11}$/)) {
        (req as any).id = req.url.split('/')[3];

        if (req.method === "GET") {
            getMeetingById(req, res);
        }
        else if (req.method === "PATCH") {
            parseJson(req, res, updateMeeting);
        }
        else if (req.method === "DELETE") {
            deletebook(req, res);
        }
    }
    else{
        sendResponse(res, 404, { message: 'Endpoint not found' });  
    }
};