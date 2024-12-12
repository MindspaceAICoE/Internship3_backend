import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userService.findByEmail(email);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Validate password (ensure hashing in production)
    if (user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    // Generate JWT token
    const payload = { userId: user._id.toString(), email: user.email }; // Convert _id to string
    const token = this.jwtService.sign(payload);
  
    return {
      message: 'Login successful',
      token,
      userId: user._id.toString(),
    };
  }

}
  