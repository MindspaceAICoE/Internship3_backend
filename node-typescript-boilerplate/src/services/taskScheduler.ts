import cron from 'node-cron';
import { sendEmail } from '../mailchimp.js';  // Use the same sendEmail function

// Function to schedule task notifications and reminder email
export const scheduleTaskNotification = (task: string, dueDate: string): void => {
    const taskTime = new Date(dueDate); // Using the due date as the task time

    // Ensure the taskTime is valid
    if (isNaN(taskTime.getTime())) {
        console.error('Invalid task due date:', dueDate);
        return;
    }

    console.log(`Task Due Date: ${taskTime}`);

    // Schedule a notification email at the time of the task
    const taskCronExpression = `0 8 ${taskTime.getDate()} ${taskTime.getMonth() + 1} *`;
    console.log(`Task Cron Expression: ${taskCronExpression}`);

    cron.schedule(taskCronExpression, async () => {
        try {
            const subject = `Task Due: ${task}`;
            const body = `This is a reminder that your task: "${task}" is due today.`;
            await sendEmail(subject, body, 'user-email@example.com');  // Use the actual recipient email
            console.log('Task notification sent successfully!');
        } catch (error) {
            console.error('Failed to send task notification email:', error.message);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"  // Ensure cron runs in IST timezone
    });

    // Send a reminder email 1 day before the task due date
    const reminderDate = new Date(taskTime.getTime() - (24 * 60 * 60 * 1000)); // 1 day before the task
    console.log(`Task Reminder Date: ${reminderDate}`);

    const reminderCronExpression = `0 8 ${reminderDate.getDate()} ${reminderDate.getMonth() + 1} *`;
    console.log(`Reminder Cron Expression: ${reminderCronExpression}`);

    cron.schedule(reminderCronExpression, async () => {
        try {
            const reminderSubject = `Reminder: Task "${task}" is tomorrow!`;
            const reminderBody = `This is a reminder that your task: "${task}" is due tomorrow.`;
            await sendEmail(reminderSubject, reminderBody, 'user-email@example.com');  // Use the actual recipient email
            console.log('Task reminder email sent successfully!');
        } catch (error) {
            console.error('Failed to send task reminder email:', error.message);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"  // Ensure cron runs in IST timezone
    });
};
