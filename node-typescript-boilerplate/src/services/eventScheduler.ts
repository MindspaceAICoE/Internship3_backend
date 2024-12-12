import cron from 'node-cron';
import { sendEmail } from '../mailchimp.js';

export const scheduleEventNotification = (email: string, eventDate: string, subject: string, body: string): void => {
    const eventTime = new Date(eventDate);

    if (isNaN(eventTime.getTime())) {
        console.error('Invalid event date:', eventDate);
        return;
    }

    // Cron expression to trigger at the correct date/time for the event
    const eventCronExpression = `0 8 ${eventTime.getDate()} ${eventTime.getMonth() + 1} *`;

    cron.schedule(eventCronExpression, async () => {
        try {
            await sendEmail(subject, body, email);
            console.log('Event email sent successfully!');
        } catch (error) {
            console.error('Failed to send event email:', error.message);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Use IST timezone
    });

    // Reminder email: 1 day before the event
    const reminderDate = new Date(eventTime.getTime() - (24 * 60 * 60 * 1000)); // 1 day before the event
    const reminderCronExpression = `0 8 ${reminderDate.getDate()} ${reminderDate.getMonth() + 1} *`;

    cron.schedule(reminderCronExpression, async () => {
        try {
            const reminderSubject = `Reminder: ${subject} is tomorrow!`;
            const reminderBody = `Just a friendly reminder that your event: ${subject} will occur tomorrow. \n\nDetails: \n${body}`;
            await sendEmail(reminderSubject, reminderBody, email);
            console.log('Reminder email sent successfully!');
        } catch (error) {
            console.error('Failed to send reminder email:', error.message);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
};
