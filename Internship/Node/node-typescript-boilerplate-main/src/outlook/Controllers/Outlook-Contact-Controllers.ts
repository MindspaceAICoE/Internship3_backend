import axios from "axios";

export const createContact = async (
    accessToken: string,
    contactDetails: {
        givenName: string;
        surname: string;
        emailAddresses: { address: string; name: string }[];
        businessPhones: string[];
    }
): Promise<unknown> => {
    try {
        console.log('Creating contact via Graph API...');

        const response = await axios.post(
            'https://graph.microsoft.com/v1.0/me/contacts',
            {
                givenName: contactDetails.givenName,
                surname: contactDetails.surname,
                emailAddresses: contactDetails.emailAddresses,
                businessPhones: contactDetails.businessPhones,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Contact created successfully!', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating contact:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error creating contact: ' + (error.response?.data?.error_description || error.message));
    }
};



export const getContact = async (accessToken: string, contactId: string): Promise<unknown> => {
    try {
        console.log(`Fetching contact with ID: ${contactId} via Graph API...`);

        const response = await axios.get(`https://graph.microsoft.com/v1.0/me/contacts/${contactId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Contact fetched successfully!', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error fetching contact: ' + (error.response?.data?.error_description || error.message));
    }
};




export const updateContact = async (
    accessToken: string,
    contactId: string,
    updateData: Record<string, unknown>
): Promise<unknown> => {
    try {
        console.log(`Updating contact with ID: ${contactId} via Graph API...`);

        const response = await axios.patch(
            `https://graph.microsoft.com/v1.0/me/contacts/${contactId}`,
            updateData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Contact updated successfully!', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating contact:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error updating contact: ' + (error.response?.data?.error_description || error.message));
    }
};

export const deleteContact = async (accessToken: string, contactId: string): Promise<void> => {
    try {
        console.log(`Deleting contact with ID: ${contactId} via Graph API...`);

        await axios.delete(`https://graph.microsoft.com/v1.0/me/contacts/${contactId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Contact deleted successfully!');
    } catch (error) {
        console.error('Error deleting contact:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error deleting contact: ' + (error.response?.data?.error_description || error.message));
    }
};

