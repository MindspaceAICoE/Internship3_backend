import express, { Request, Response } from 'express';
import 'ts-node/register';  // Automatically compiles TypeScript code
import dotenv from 'dotenv';
import { SubscriptionController } from './controllers/subscriptionController.js';
import { scheduleEventNotification } from './services/eventScheduler.js';
import TaskController from './controllers/taskController.js'; 


dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Built-in JSON parser in Express, no need for body-parser

// Route to send email manually
app.post('/send-email', SubscriptionController.send);

// Route for user signup and adding to Mailchimp list
app.post('/signup', SubscriptionController.signup);

// Route to schedule event notifications
app.post('/schedule-event', (req: Request, res: Response) => {
    const { email, eventDate, subject, body } = req.body;

    if (!email || !eventDate || !subject || !body) {
        return res.status(400).json({ error: 'Email, eventDate, subject, and body are required.' });
    }

    try {
        // Call the function to schedule the event notification
        scheduleEventNotification(email, eventDate, subject, body);

        return res.status(200).json({ message: 'Event notification scheduled successfully.' });
    } catch (error) {
        console.error('Error scheduling event notification:', error.message);
        return res.status(500).json({ error: 'Failed to schedule event notification.' });
    }
});

// Task routes
app.get('/tasks', TaskController.getTasks); // Retrieve all tasks
app.post('/tasks', TaskController.addTask); // Add a new task
app.post('/tasks/complete/:taskId', TaskController.completeTask); // Mark task as completed

// Optional: Add a delete route for tasks if needed
app.delete('/tasks/:taskId', TaskController.deleteTask); // Delete a task

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
