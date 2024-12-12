import { IncomingMessage, ServerResponse } from 'http';
import { sendResponse } from '../../utils/error.js';
import hubspot from '@hubspot/api-client';

const hubspotClient = new hubspot.Client({ "accessToken": process.env.ACCESS_TOKEN });

export const create = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const apiResponse = await hubspotClient.crm.contacts.basicApi.create({ properties: (req as any).body });
        sendResponse(res, 201, { data: apiResponse });
    } catch (error) {
        sendResponse(res, 500, { message: "Error creating contact", error: error.message });
    }
};

export const get = async (req: IncomingMessage, res: ServerResponse) => {
    const queryParams = new URLSearchParams(req.url?.split('?')[1]);
    const limit = parseInt(queryParams.get('limit'));  

    try {
        const apiResponse = await hubspotClient.crm.contacts.basicApi.getPage(limit);
        sendResponse(res, 200, { data: apiResponse });
    } catch (error) {
        sendResponse(res, 404, { message: "Error Found", error: error.message });
    }
};

export const getbyId = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const apiResponse = await hubspotClient.crm.contacts.basicApi.getById((req as any).id);
        sendResponse(res, 200, { data: apiResponse });
    } catch (error) {
        sendResponse(res, 404, { message: "Error Found", error: error.message });
    }
};

export const update = async (req: IncomingMessage , res: ServerResponse) => {
    try {
        const apiResponse = await hubspotClient.crm.contacts.basicApi.update((req as any).id, { properties: (req as any).body });
        sendResponse(res, 200, { message: "Updated Successfully", data: apiResponse });
    } catch (error) {
        sendResponse(res, 404, { message: "Error Found", error: error.message });
    }
};

export const remove = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        await hubspotClient.crm.contacts.basicApi.archive((req as any).id);
        sendResponse(res, 200, { message: "Deleted Successfully" });
    } catch (error) {
        sendResponse(res, 404, { message: "Error Found", error: error.message });
    }
};
