import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addTaskToMailchimpCalendar, sendEmail } from '../mailchimp.js';

// Define the structure of a task
interface Task {
    id: string;
    task: string;
    completed: boolean;
    dueDate: string;
}

// Define the shape of the request body for adding a task
interface AddTaskRequestBody {
    task: string;
    dueDate: string;
}

// Define the params structure for routes that involve taskId
interface Params {
    taskId: string;
}

// In-memory storage for tasks (just for the sake of example)
let tasks: Task[] = [];

class TaskController {
    // Get all tasks
    static getTasks(_: Request, res: Response): Response {
        return res.status(200).json({ tasks });
    }
    

    // Add a new task
    static async addTask(req: Request<{}, {}, AddTaskRequestBody>, res: Response): Promise<Response> {
        const { task, dueDate } = req.body;

        // Validate that both task and dueDate are provided
        if (!task || !dueDate) {
            return res.status(400).json({ error: 'Task description and dueDate are required.' });
        }

        // Create a new task with a unique ID
        const taskId = uuidv4();
        const newTask: Task = { id: taskId, task, completed: false, dueDate };

        // Add the task to the in-memory array
        tasks.push(newTask);

        // Add the task to the Mailchimp calendar
        try {
            const startDate = new Date(dueDate).toISOString();
            const endDate = new Date(new Date(dueDate).getTime() + 3600000).toISOString(); // Task duration 1 hour

            await addTaskToMailchimpCalendar(newTask.task, startDate, endDate);
        } catch (error) {
            console.error('Error adding task to Mailchimp calendar:', error.message);
        }

        // Send email notification to the subscriber
        try {
            const notificationSubject = 'New Task Added';
            const notificationBody = `A new task has been added: ${newTask.task}. Due Date: ${newTask.dueDate}`;
            await sendEmail(notificationSubject, notificationBody, 'subscriber@example.com');
        } catch (error) {
            console.error('Error sending subscription email:', error.message);
        }

        // Return the newly added task
        return res.status(201).json({ message: 'Task added successfully', task: newTask });
    }

    // Mark a task as completed
    static completeTask(req: Request<Params, {}, {}>, res: Response): Response {
        const { taskId } = req.params;

        // Find the task by taskId
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        // If the task is not found, return an error
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        // Mark the task as completed
        tasks[taskIndex].completed = true;

        // Return a success message
        return res.status(200).json({ message: 'Task marked as completed.' });
    }

    // Delete a task
    static deleteTask(req: Request<Params, {}, {}>, res: Response): Response {
        const { taskId } = req.params;

        // Find the task by taskId
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        // If the task is not found, return an error
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        // Remove the task from the in-memory array
        tasks.splice(taskIndex, 1);

        // Return a success message
        return res.status(200).json({ message: 'Task deleted successfully.' });
    }
}

export default TaskController;
