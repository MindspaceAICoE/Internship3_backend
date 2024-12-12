import express, { Request, Response } from 'express';
import { getTodoLists, createTodoList, getTodoListById, updateTodoList, deleteTodoList,
    getTasks, createTask, getTaskById, updateTask, deleteTask } from '../Controllers/Outlook-ToDoList&Tasks-Controllers.js'; 


const todolist_task_router = express.Router();

todolist_task_router.get('/all', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    try {
        const todoLists = await getTodoLists(accessToken);
        res.status(200).json(todoLists);
    } catch (error) {
        console.error('Error fetching To-Do lists:', error);
        res.status(500).json({ error: 'Error fetching To-Do lists.' });
    }
});

todolist_task_router.post('/new', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const { displayName } = req.body;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    if (!displayName) {
        res.status(400).json({ error: 'Display name is required.' });
        return;
    }

    try {
        const todoList = await createTodoList(accessToken, displayName);
        res.status(201).json(todoList);
    } catch (error) {
        console.error('Error creating To-Do list:', error);
        res.status(500).json({ error: 'Error creating To-Do list.' });
    }
});

todolist_task_router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const { id } = req.params;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    try {
        const todoList = await getTodoListById(accessToken, id);
        res.status(200).json(todoList);
    } catch (error) {
        console.error('Error fetching To-Do list:', error);
        res.status(500).json({ error: 'Error fetching To-Do list.' });
    }
});

todolist_task_router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const { id } = req.params;
    const { displayName } = req.body;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    if (!displayName) {
        res.status(400).json({ error: 'Display name is required.' });
        return;
    }

    try {
        const updatedTodoList = await updateTodoList(accessToken, id, displayName);
        res.status(200).json(updatedTodoList);
    } catch (error) {
        console.error('Error updating To-Do list:', error);
        res.status(500).json({ error: 'Error updating To-Do list.' });
    }
});

todolist_task_router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const { id } = req.params;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    try {
        await deleteTodoList(accessToken, id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting To-Do list:', error);
        res.status(500).json({ error: 'Error deleting To-Do list.' });
    }
});









todolist_task_router.get('/:listId/task/all', async (req: Request, res: Response) => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const { listId } = req.params;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    try {
        const tasks = await getTasks(accessToken, listId);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks.' });
    }
});

todolist_task_router.post('/:listId/task/new', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const { listId } = req.params;
    const { title, categories, linkedResources, dueDateTime, isReminderOn, reminderDateTime, importance } = req.body;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    if (!title) {
        res.status(400).json({ error: 'Task title is required.' });
        return;
    }

    if (importance && !["low", "normal", "high"].includes(importance.toLowerCase())) {
        res.status(400).json({ warning: `Importance must be one of 'low', 'normal', or 'high'. Provided: ${importance}` });
        return;
    }

    if (isReminderOn && !reminderDateTime) {
        res.status(400).json({ warning: 'Reminder is enabled, but no reminderDateTime is provided.' });
        return;
    }

    try {
        const task = await createTask(accessToken, listId, title, categories, linkedResources, dueDateTime, isReminderOn, reminderDateTime, importance);
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Error creating task.' });
    }
});


todolist_task_router.get('/:listId/task/:taskId', async (req: Request, res: Response) => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const { listId, taskId } = req.params;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    try {
        const task = await getTaskById(accessToken, listId, taskId);
        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Error fetching task.' });
    }
});

todolist_task_router.patch('/:listId/task/:taskId', async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const { listId, taskId } = req.params;
    const {
        importance,
        title,
        categories,
        dueDateTime,
        isReminderOn,
        reminderDateTime,
        status
    } = req.body;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    if (!importance && !title && !categories && !dueDateTime && !isReminderOn && !reminderDateTime && !status) {
        res.status(400).json({ warning: 'No data provided for update. At least one field must be specified.' });
        return;
    }


    if (importance && !["low", "normal", "high"].includes(importance.toLowerCase())) {
        res.status(400).json({ warning: `Importance must be one of 'low', 'normal', or 'high'. Provided: ${importance}` });
        return;
    }

    if (status && !['inProgress', 'completed'].includes(status)) {
        res.status(400).json({ warning: 'Invalid status. Valid values are inProgress, completed.' });
        return;
    }

    if (isReminderOn && !reminderDateTime) {
        res.status(400).json({ warning: 'reminderDateTime is required when isReminderOn is true.' });
        return;
    }

    try {
        const updatedTask = await updateTask(
            accessToken,
            listId,
            taskId,
            {
                importance,
                title,
                categories,
                dueDateTime,
                isReminderOn,
                reminderDateTime,
                status
            }
        );
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task.' });
    }
});


todolist_task_router.delete('/:listId/task/:taskId', async (req: Request, res: Response) => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');
    const { listId, taskId } = req.params;

    if (!accessToken) {
        res.status(400).json({ error: 'Access token is required.' });
        return;
    }

    try {
        await deleteTask(accessToken, listId, taskId);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task.' });
    }
});

export default todolist_task_router;

