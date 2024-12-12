import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { BotService } from './bot.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';

@Controller('bots')
export class BotController {
  constructor(private readonly botService: BotService) {}

  // Create a new bot
  @Post()
  async createBot(@Body() createBotDto: CreateBotDto) {
    try {
      return await this.botService.createBot(createBotDto);
    } catch (error) {
      throw new HttpException('Error creating bot', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get all bots
  @Get()
  async getAllBots() {
    try {
      return await this.botService.getAllBots();
    } catch (error) {
      throw new HttpException('Error fetching bots', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get a bot by ID
  @Get(':id')
  async getBotById(@Param('id') id: string) {
    try {
      const bot = await this.botService.getBotById(id);
      if (!bot) {
        throw new HttpException('Bot not found', HttpStatus.NOT_FOUND);
      }
      return bot;
    } catch (error) {
      throw new HttpException('Error fetching bot', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Update a bot by ID
  @Put(':id')
  async updateBotById(@Param('id') id: string, @Body() updateBotDto: UpdateBotDto) {
    try {
      const updatedBot = await this.botService.updateBotById(id, updateBotDto);
      if (!updatedBot) {
        throw new HttpException('Bot not found', HttpStatus.NOT_FOUND);
      }
      return updatedBot;
    } catch (error) {
      throw new HttpException('Error updating bot', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete a bot by ID
  @Delete(':id')
  async deleteBotById(@Param('id') id: string) {
    try {
      const deletedBot = await this.botService.deleteBotById(id);
      if (!deletedBot) {
        throw new HttpException('Bot not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Bot deleted successfully' };
    } catch (error) {
      throw new HttpException('Error deleting bot', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
