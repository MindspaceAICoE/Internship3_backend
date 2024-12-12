import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://libinrockz21:1xFjv02guDFARAoQ@faith.l9ehq.mongodb.net/botstoremanagement?retryWrites=true&w=majority&appName=faith'),
    UserModule,
    AuthModule,
    CardModule,
    BotModule,
  ],
})
export class AppModule {}
