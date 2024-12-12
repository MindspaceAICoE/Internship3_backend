import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('auth')
  @Redirect()
  getAuth() {
    try {
      const authUrl = this.authService.getAuthorizationUrl();
      return { url: authUrl };
    } catch (error) {
      throw new Error('Error generating authorization URL: ' + error.message);
    }
  }

  @Get('callback')
  async callback(@Query('code') code: string) {
    console.log('AuthCode:', code);
    try {
      const accessToken = await this.authService.getAccessToken(code);
      return { message: 'Access token obtained successfully!', accessToken };
    } catch (error) {
      throw new Error('Error during authentication: ' + error.message);
    }
  }
}
