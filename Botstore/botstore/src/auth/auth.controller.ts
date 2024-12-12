import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    try {
      const result = await this.authService.login({ email, password });

      // AuthService already generates and returns the token, so no need for additional logic here
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
