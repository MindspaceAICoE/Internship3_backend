import axios from "axios";
 
export async function readEmail(
    accessToken: string, 
    query?: string
): Promise<unknown[]> {
    try {
        console.log(`Fetching email via Graph API...`);

        const baseUrl = 'https://graph.microsoft.com/v1.0/me/messages';
        const url = query ? `${baseUrl}?${query}` : baseUrl;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Email fetched successfully!', response.data);
        return response.data.value;
    } catch (error) {
        console.error('Error fetching emails:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error fetching emails: ' + (error.response?.data?.error_description || error.message));
    }
}

export const sendEmail = async (
    accessToken: string,
    recipient: string,
    ccRecipient: string | null,
    subject: string,
    body: string,
    saveToSentItems: boolean = false
): Promise<void> => {
    try {
        console.log('Preparing email payload...');
        
        const emailPayload = {
            message: {
                subject: subject,
                body: {
                    contentType: 'Text', 
                    content: body,
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: recipient,
                        },
                    },
                ],
                ccRecipients: ccRecipient
                    ? [
                          {
                              emailAddress: {
                                  address: ccRecipient,
                              },
                          },
                      ]
                    : [],
            },
            saveToSentItems: saveToSentItems.toString(),
        };

        console.log('Sending email via Graph API...');
        const response = await axios.post('https://graph.microsoft.com/v1.0/me/sendMail', emailPayload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Email sent successfully!', response.data);
    } catch (error) {
        console.error('Error sending email:', error.response?.data || error.message); 
        
        throw new Error('Error sending email: ' + (error.response?.data?.error_description || error.message));
    }
};

export async function getSpecifiedEmail(
    accessToken: string, 
    emailIdOrUrl: string, 
    queryParams: string
): Promise<unknown> {
    try {
        console.log(`Fetching specified email via Graph API...`);

        const baseUrl = 'https://graph.microsoft.com/v1.0/me/messages/';
        const url = emailIdOrUrl.startsWith('http') ? emailIdOrUrl : `${baseUrl}${emailIdOrUrl}`;

        const finalUrl = queryParams ? `${url}?${queryParams}` : url;

        const response = await axios.get(finalUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Specified email fetched successfully!', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching specified email:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error fetching specified email: ' + (error.response?.data?.error_description || error.message));
    }
}

export async function deleteEmail(
    accessToken: string, 
    emailIdOrUrl: string
): Promise<unknown> {
    try {
        console.log(`Fetching specified email via Graph API(Delete)...`);

        const baseUrl = 'https://graph.microsoft.com/v1.0/me/messages/';
        const url = emailIdOrUrl.startsWith('http') ? emailIdOrUrl : `${baseUrl}${emailIdOrUrl}`;

        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Specified email deleted successfully!', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleted specified email:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error deleted specified email: ' + (error.response?.data?.error_description || error.message));
    }
}