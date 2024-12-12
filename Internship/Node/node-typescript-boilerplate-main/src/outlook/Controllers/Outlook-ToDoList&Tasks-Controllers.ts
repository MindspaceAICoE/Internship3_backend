import axios from "axios";

export const getTodoLists = async (accessToken: string): Promise<unknown> => {
    try {
        console.log('Fetching To-Do lists via Graph API...');

        const response = await axios.get('https://graph.microsoft.com/v1.0/me/todo/lists', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('To-Do lists fetched successfully!', response.data);
        return response.data; // Returns the fetched lists
    } catch (error) {
        console.error('Error fetching To-Do lists:', error);
        console.error('Error response:', error.response?.data || error.message);

        throw new Error('Error fetching To-Do lists: ' + (error.response?.data?.error_description || error.message));
    }
};

export const createTodoList = async (accessToken: string, displayName: string): Promise<unknown> => {
    try {
        const response = await axios.post('https://graph.microsoft.com/v1.0/me/todo/lists', 
            { displayName },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error response:', error.response?.data || error.message);
        throw new Error('Error creating To-Do list: ' + (error.response?.data?.error_description || error.message));
    }
};

export const getTodoListById = async (accessToken: string, id: string): Promise<unknown> => {
    try {
        const response = await axios.get(`https://graph.microsoft.com/v1.0/me/todo/lists/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error response:', error.response?.data || error.message);
        throw new Error('Error fetching To-Do list: ' + (error.response?.data?.error_description || error.message));
    }
};

export const updateTodoList = async (accessToken: string, id: string, displayName: string): Promise<unknown> => {
    try {
        const response = await axios.patch(`https://graph.microsoft.com/v1.0/me/todo/lists/${id}`, 
            { displayName },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error response:', error.response?.data || error.message);
        throw new Error('Error updating To-Do list: ' + (error.response?.data?.error_description || error.message));
    }
};

export const deleteTodoList = async (accessToken: string, id: string): Promise<void> => {
    try {
        await axios.delete(`https://graph.microsoft.com/v1.0/me/todo/lists/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error response:', error.response?.data || error.message);
        throw new Error('Error deleting To-Do list: ' + (error.response?.data?.error_description || error.message));
    }
};









export const getTasks = async (accessToken: string, listId: string): Promise<unknown> => {
    try {
        const response = await axios.get(`https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error response:', error.response?.data || error.message);
        throw new Error('Error fetching tasks: ' + (error.response?.data?.error_description || error.message));
    }
};


export const createTask = async (
    accessToken: string,
    listId: string,
    title: string,
    categories?: string[],
    linkedResources?: { webUrl: string; applicationName: string; displayName: string }[],
    dueDateTime?: { dateTime: string; timeZone: string },
    isReminderOn?: boolean,
    reminderDateTime?: { dateTime: string; timeZone: string },
    importance?: string
): Promise<unknown> => {
    try {
        const taskData: Record<string, unknown> = {
            title,
            categories,
            linkedResources,
            dueDateTime,
            importance,
            isReminderOn,
        };

        if (isReminderOn) {
            taskData.reminderDateTime = reminderDateTime;
        }

        const response = await axios.post(
            `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks`,
            taskData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error response:', error.response?.data || error.message);
        throw new Error('Error creating task: ' + (error.response?.data?.error_description || error.message));
    }
};



export const getTaskById = async (accessToken: string, listId: string, taskId: string): Promise<unknown> => {
    try {
        const response = await axios.get(`https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error response:', error.response?.data || error.message);
        throw new Error('Error fetching task: ' + (error.response?.data?.error_description || error.message));
    }
};

export const updateTask = async (
    accessToken: string,
    listId: string,
    taskId: string,
    data: {
        importance?: string;
        title?: string;
        categories?: string[];
        dueDateTime?: { dateTime: string; timeZone: string };
        isReminderOn?: boolean;
        reminderDateTime?: { dateTime: string; timeZone: string };
        status?: string;
    }
): Promise<unknown> => {
    try {
        const response = await axios.patch(
            `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks/${taskId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error response:', error.response?.data || error.message);
        throw new Error('Error updating task: ' + (error.response?.data?.error_description || error.message));
    }
};

export const deleteTask = async (accessToken: string, listId: string, taskId: string): Promise<void> => {
    try {
        await axios.delete(`https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error response:', error.response?.data || error.message);
        throw new Error('Error deleting task: ' + (error.response?.data?.error_description || error.message));
    }
};

