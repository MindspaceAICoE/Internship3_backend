import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Bot extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: [String] })
  features: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: [String] })
  useCases: string[];

  @Prop({ type: [String] })
  benefits: string[];

  @Prop()
  demoUrl?: string;
}

export const BotSchema = SchemaFactory.createForClass(Bot);
