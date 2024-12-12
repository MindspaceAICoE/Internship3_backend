import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bot } from './bot.schema';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';

@Injectable()
export class BotService {
  constructor(@InjectModel(Bot.name) private botModel: Model<Bot>) {}

  async createBot(createBotDto: CreateBotDto): Promise<Bot> {
    const bot = new this.botModel(createBotDto);
    return bot.save();
  }

  async getAllBots(): Promise<Bot[]> {
    return this.botModel.find().exec();
  }

  async getBotById(id: string): Promise<Bot> {
    const bot = await this.botModel.findById(id).exec();
    if (!bot) {
      throw new NotFoundException('Bot not found');
    }
    return bot;
  }

  async updateBotById(id: string, updateBotDto: UpdateBotDto): Promise<Bot> {
    const updatedBot = await this.botModel
      .findByIdAndUpdate(id, updateBotDto, { new: true })
      .exec();
    if (!updatedBot) {
      throw new NotFoundException('Bot not found');
    }
    return updatedBot;
  }

  async deleteBotById(id: string): Promise<Bot> {
    const deletedBot = await this.botModel.findByIdAndDelete(id).exec();
    if (!deletedBot) {
      throw new NotFoundException('Bot not found');
    }
    return deletedBot;
  }
}
