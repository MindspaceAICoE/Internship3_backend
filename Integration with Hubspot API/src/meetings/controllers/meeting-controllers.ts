import { IncomingMessage, ServerResponse } from "http";
import { sendResponse } from "../../utils/error.js";
import fetch from "node-fetch";
import hubspot from '@hubspot/api-client';

const hubspotClient = new hubspot.Client({ "accessToken": process.env.ACCESS_TOKEN });

export const bookMeeting = async (req: IncomingMessage & { body: any }, res: ServerResponse) => {
    try {
    //format 
    //   {
    //     "properties": {
    //       "hs_timestamp": "2024-12-01T10:00:00Z",
    //       "hubspot_owner_id": "113734804",  
    //       "hs_meeting_title": "Minute Meeting",
    //       "hs_meeting_body": "Meeting to discuss topics",
    //       "hs_internal_meeting_notes": "Prepare talking points",
    //       "hs_meeting_external_url": "https://meetings.hubspot.com/tinuaju1923",
    //       "hs_meeting_location": "Virtual",
    //       "hs_meeting_start_time": "2024-12-01T10:00:00Z",
    //       "hs_meeting_end_time": "2024-12-01T10:30:00Z",
    //       "hs_meeting_outcome": "SCHEDULED"
    //     },
    //     "associations": [
    //       {
    //         "to": {
    //           "id": "80911650427"
    //         },
    //         "types": [
    //           {
    //             "associationCategory": "HUBSPOT_DEFINED",
    //             "associationTypeId": 200
    //           }
    //         ]
    //       }
    //     ],
    //     "invitees": 
    //       {
    //       "emailId": 183342961217,
    //       "message": {
    //           "cc": ["tinuaju1923@gmail.com"],
    //           "bcc": ["tinuaju1923@gmail.com"],
    //           "replyTo": ["tinuaju1923@gmail.com"],
    //           "from": "tinuaju1923@gmail.com",
    //           "to": ["tinuaju1923@gmail.com","tinuv.bca1922@saintgits.org"]
    //       },
    //       "contactProperties": {
    //           "lastname": "Varghese",
    //           "firstname": "Tinu"
    //       }
    //       }
    //   }
      
      const { properties, associations, invitees } = req.body;
  
      const meetingResponse = await hubspotClient.crm.objects.meetings.basicApi.create({properties,associations});
        
      const emailResponse = await fetch("https://api.hubapi.com/marketing/v4/email/single-send", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${process.env.ACCESS_TOKEN}`, 
        },
        body: JSON.stringify(invitees)
      });
  
      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        return sendResponse(res, emailResponse.status, {message: "Error booking meeting",data: errorData});
      }
  
      const emaildata = await emailResponse.json();  
    
      sendResponse(res, 201, { meeting: meetingResponse,email: emaildata });
    } catch (error) {
      sendResponse(res, 500, {message: "Unexpected server error",error: error.message});
    }
  };

export const getAllMeetings = async (req: IncomingMessage, res: ServerResponse) => {
    const queryParams = new URLSearchParams(req.url?.split('?')[1]);
    const limit = parseInt(queryParams.get('limit'));  

    try {
        const apiResponse = await hubspotClient.crm.objects.meetings.basicApi.getPage(limit);
        sendResponse(res, 200, { data: apiResponse });
    } catch (error) {
        sendResponse(res, 404, { message: "Error Found", error: error.message });
    }
};

export const getMeetingById = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const apiResponse = await hubspotClient.crm.objects.meetings.basicApi.getById((req as any).id);
        sendResponse(res, 200, { data: apiResponse });
    } catch (error) {
        sendResponse(res, 404, { message: "Error Found", error: error.message });
    }
};

export const updateMeeting = async (req: IncomingMessage & { body: any } , res: ServerResponse) => {
    try {
        const apiResponse = await hubspotClient.crm.objects.meetings.basicApi.update((req as any).id, req.body);
        sendResponse(res, 200, { message: "Updated Successfully", data: apiResponse });
    } catch (error) {
        sendResponse(res, 404, { message: "Error Found", error: error.message });
    }
};

  
export const deletebook = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        await hubspotClient.crm.objects.meetings.basicApi.archive((req as any).id);
        sendResponse(res, 200, { message: "Deleted Successfully" });
    } catch (error) {
        sendResponse(res, 404, { message: "Error Found", error: error.message });
    }
};