import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Function to list emails (fetch emails from Zoho Mail)
export const listEmails = async (token: string): Promise<unknown> => {
  try {
    const response = await axios.get(
      `https://mail.zoho.in/api/accounts/${process.env.ZOHO_ID}/messages/view`, // Use Zoho email address/account ID
      {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization header with Bearer token
        },
      }
    );

    console.log('Emails fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error listing emails:', error.response?.data || error.message);
    throw new Error('Failed to fetch emails');
  }
};

// Function to send an email (as an example, if needed)
export const sendEmail = async (
  token: string,
  fromAddress: string,
  toAddress: string,
  subject: string,
  content: string
): Promise<unknown> => {
  try {
    const response = await axios.post(
      `https://mail.zoho.in/api/accounts/${process.env.ZOHO_ID}/messages`,
      {
        fromAddress,
        toAddress,
        subject,
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization header with Bearer token
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    throw new Error('Failed to send email');
  }
};