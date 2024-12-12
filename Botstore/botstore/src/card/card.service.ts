import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from './card.schema';

@Injectable()
export class CardService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  async addCard(data: any): Promise<Card> {
    const { userId, ...rest } = data;

    // Check if this is the user's first card
    const existingCards = await this.cardModel.find({ user: userId });

    const isDefault = existingCards.length === 0;

    // Ensure all other cards are not default if this is not the first
    if (!isDefault) {
      await this.cardModel.updateMany({ user: userId }, { isDefault: false });
    }

    const newCard = new this.cardModel({
      user: userId,
      ...rest,
      isDefault,
    });

    return newCard.save();
  }

  async setDefaultCard(userId: string, cardId: string): Promise<Card> {
    await this.cardModel.updateMany({ user: userId }, { isDefault: false });

    const updatedCard = await this.cardModel.findByIdAndUpdate(
      cardId,
      { isDefault: true },
      { new: true },
    );

    if (!updatedCard) {
      throw new NotFoundException('Card not found');
    }

    return updatedCard;
  }

  async deleteCard(cardId: string): Promise<Card> {
    const deletedCard = await this.cardModel.findByIdAndDelete(cardId);

    if (!deletedCard) {
      throw new NotFoundException('Card not found');
    }

    if (deletedCard.isDefault) {
      const otherCard = await this.cardModel.findOne({ user: deletedCard.user });
      if (otherCard) {
        otherCard.isDefault = true;
        await otherCard.save();
      }
    }

    return deletedCard;
  }
}
