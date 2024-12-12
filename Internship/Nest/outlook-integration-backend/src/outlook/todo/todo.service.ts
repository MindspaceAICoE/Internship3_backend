import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TodoService {
    private readonly baseUrl = 'https://graph.microsoft.com/v1.0/me/todo';

    private getHeaders(accessToken: string) {
        return {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
    }

    async getTodoLists(accessToken: string): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/lists`, {
                headers: this.getHeaders(accessToken),
            });
            if (response.data.value.length > 0) {
                return response.data;
            }
            return { message: 'No todo lists found.' };
        } catch (error) {
            this.handleAxiosError(error, 'Error fetching To-Do lists');
        }
    }

    async createTodoList(accessToken: string, displayName: string): Promise<any> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/lists`,
                { displayName },
                { headers: this.getHeaders(accessToken) },
            );
            return response.data;
        } catch (error) {
            this.handleAxiosError(error, 'Failed to create To-Do list');
        }
    }

    async getTodoListById(accessToken: string, id: string): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/lists/${id}`, {
                headers: this.getHeaders(accessToken),
            });
            return response.data;
        } catch (error) {
            this.handleAxiosError(error, 'To-Do list not found or failed to fetch');
        }
    }

    async updateTodoList(accessToken: string, id: string, displayName: string): Promise<any> {
        try {
            const response = await axios.patch(
                `${this.baseUrl}/lists/${id}`,
                { displayName },
                { headers: this.getHeaders(accessToken) },
            );
            return response.data;
        } catch (error) {
            this.handleAxiosError(error, 'Failed to update To-Do list');
        }
    }

    async deleteTodoList(accessToken: string, id: string): Promise<any> {
        try {
            await axios.delete(`${this.baseUrl}/lists/${id}`, {
                headers: this.getHeaders(accessToken),
            });
            return { message: 'Todo list deleted successfully' };
        } catch (error) {
            this.handleAxiosError(error, 'To-Do list not found or failed to delete');
        }
    }

    async getTasks(accessToken: string, listId: string): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/lists/${listId}/tasks`, {
                headers: this.getHeaders(accessToken),
            });
            return response.data;
        } catch (error) {
            this.handleAxiosError(error, 'Failed to fetch tasks');
        }
    }

    async createTask(accessToken: string, listId: string, taskData: any): Promise<any> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/lists/${listId}/tasks`,
                taskData,
                { headers: this.getHeaders(accessToken) },
            );
            return response.data;
        } catch (error) {
            this.handleAxiosError(error, 'Failed to create task');
        }
    }

    async getTaskById(accessToken: string, listId: string, taskId: string): Promise<any> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/lists/${listId}/tasks/${taskId}`,
                { headers: this.getHeaders(accessToken) },
            );
            return response.data;
        } catch (error) {
            this.handleAxiosError(error, 'Task not found or failed to fetch');
        }
    }

    async updateTask(accessToken: string, listId: string, taskId: string, updateData: any): Promise<any> {
        try {
            const response = await axios.patch(
                `${this.baseUrl}/lists/${listId}/tasks/${taskId}`,
                updateData,
                { headers: this.getHeaders(accessToken) },
            );
            return response.data;
        } catch (error) {
            this.handleAxiosError(error, 'Failed to update task');
        }
    }

    async deleteTask(accessToken: string, listId: string, taskId: string): Promise<any> {
        try {
            await axios.delete(`${this.baseUrl}/lists/${listId}/tasks/${taskId}`, {
                headers: this.getHeaders(accessToken),
            });
            return { message: 'Task deleted successfully.' };
        } catch (error) {
            this.handleAxiosError(error, 'Task not found or failed to delete');
        }
    }

    private handleAxiosError(error: any, defaultMessage: string): void {
        if (error.response) {
            throw new HttpException(
                error.response.data.error?.message || defaultMessage,
                error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        } else {
            throw new HttpException(defaultMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
