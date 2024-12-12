import { Controller, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('/addcard')
  async addCard(@Body() body: any) {
    const card = await this.cardService.addCard(body);
    return { message: 'Card added successfully', card };
  }

  @Patch('defaultcard')
  async setDefaultCard(@Body() body: { userId: string; cardId: string }) {
    const { userId, cardId } = body;
    const updatedCard = await this.cardService.setDefaultCard(userId, cardId);
    return { message: 'Default card updated successfully', updatedCard };
  }

  @Delete(':cardId')
  async deleteCard(@Param('cardId') cardId: string) {
    const deletedCard = await this.cardService.deleteCard(cardId);
    return { message: 'Card deleted successfully', deletedCard };
  }
}
