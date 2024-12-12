import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() body: { email: string; password: string }): Promise<User> {
    return this.userService.createUser(body.email, body.password);
  }

  @Get(':email')
  async findUser(@Param('email') email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }
}
