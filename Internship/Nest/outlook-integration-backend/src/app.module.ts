import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './outlook/auth/auth.module';
import { AuthController } from './outlook/auth/auth.controller';
import { AuthService } from './outlook/auth/auth.service';
import { EmailModule } from './outlook/email/email.module';
import { EventModule } from './outlook/event/event.module';
import { ContactModule } from './outlook/contact/contact.module';
import { TodoModule } from './outlook/todo/todo.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    EmailModule,
    EventModule,
    ContactModule,
    TodoModule,
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AppModule {}

