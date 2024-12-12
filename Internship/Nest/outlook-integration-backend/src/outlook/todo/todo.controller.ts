import { Controller, Get, Post, Patch, Delete, Body, Param, Headers, HttpCode } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todo/list')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get('all')
    async getAllTodoLists(@Headers('authorization') authorization: string) {
        const accessToken = authorization?.replace('Bearer ', '');
        const data = await this.todoService.getTodoLists(accessToken);
        if (data) {
            return { message: `Fetched ${data.value.length} todo lists.`, data };
        } else {
            return { message: 'Error fetching todo lists.' };
        }
    }

    @Post('new')
    async createTodoList(@Headers('authorization') authorization: string, @Body('displayName') displayName: string) {
        const accessToken = authorization?.replace('Bearer ', '');
        const result = await this.todoService.createTodoList(accessToken, displayName);
        if (result) {
            return { message: 'Todo list created successfully.', result };
        } else {
            return { message: 'Failed to create todo list.' };
        }
    }

    @Get(':id')
    async getTodoListById(@Headers('authorization') authorization: string, @Param('id') id: string) {
        const accessToken = authorization?.replace('Bearer ', '');
        const data = await this.todoService.getTodoListById(accessToken, id);
        if (data) {
            return { message: 'Todo list fetched successfully.', data };
        } else {
            return { message: 'Todo list not found with the given ID.' };
        }
    }

    @Patch(':id')
    async updateTodoList(
        @Headers('authorization') authorization: string,
        @Param('id') id: string,
        @Body('displayName') displayName: string,
    ) {
        const accessToken = authorization?.replace('Bearer ', '');
        const result = await this.todoService.updateTodoList(accessToken, id, displayName);
        if (result) {
            return { message: 'Todo list updated successfully.', result };
        } else {
            return { message: 'Todo list not found or update failed.' };
        }
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteTodoList(@Headers('authorization') authorization: string, @Param('id') id: string) {
        const accessToken = authorization?.replace('Bearer ', '');
        const success = await this.todoService.deleteTodoList(accessToken, id);
        if (success) {
            return { message: 'Todo list deleted successfully.' };
        } else {
            return { message: 'Todo list not found or deletion failed.' };
        }
    }

    // Task-related endpoints
    @Get(':listId/task/all')
    async getTasks(@Headers('authorization') authorization: string, @Param('listId') listId: string) {
        const accessToken = authorization?.replace('Bearer ', '');
        const data = await this.todoService.getTasks(accessToken, listId);
        if (data) {
            return { message: `Fetched ${data.value.length} tasks for list ${listId}.`, data };
        } else {
            return { message: `Error fetching tasks for list ${listId}.` };
        }
    }

    @Post(':listId/task/new')
    async createTask(@Headers('authorization') authorization: string, @Param('listId') listId: string, @Body() taskData: any) {
        const accessToken = authorization?.replace('Bearer ', '');
        const result = await this.todoService.createTask(accessToken, listId, taskData);
        if (result) {
            return { message: 'Task created successfully.', result };
        } else {
            return { message: 'Task creation failed.' };
        }
    }

    @Get(':listId/task/:taskId')
    async getTaskById(
        @Headers('authorization') authorization: string,
        @Param('listId') listId: string,
        @Param('taskId') taskId: string,
    ) {
        const accessToken = authorization?.replace('Bearer ', '');
        const data = await this.todoService.getTaskById(accessToken, listId, taskId);
        if (data) {
            return { message: 'Task fetched successfully.', data };
        } else {
            return { message: 'Task not found with the given ID.' };
        }
    }

    @Patch(':listId/task/:taskId')
    async updateTask(
        @Headers('authorization') authorization: string,
        @Param('listId') listId: string,
        @Param('taskId') taskId: string,
        @Body() updateData: any,
    ) {
        const accessToken = authorization?.replace('Bearer ', '');
        const result = await this.todoService.updateTask(accessToken, listId, taskId, updateData);
        if (result) {
            return { message: 'Task updated successfully.', result };
        } else {
            return { message: 'Task not found or update failed.' };
        }
    }

    @Delete(':listId/task/:taskId')
    @HttpCode(204)
    async deleteTask(
        @Headers('authorization') authorization: string,
        @Param('listId') listId: string,
        @Param('taskId') taskId: string,
    ) {
        const accessToken = authorization?.replace('Bearer ', '');
        const success = await this.todoService.deleteTask(accessToken, listId, taskId);
        if (success) {
            return { message: 'Task deleted successfully.' };
        } else {
            return { message: 'Task not found or deletion failed.' };
        }
    }
}
