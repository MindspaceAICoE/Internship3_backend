import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type CardDocument = HydratedDocument<Card>;

@Schema({ timestamps: true })
export class Card {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  expiryDate: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  pincode: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  country: string;

  @Prop({ default: false })
  isDefault: boolean;
}

export const CardSchema = SchemaFactory.createForClass(Card);
