import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile/:userId')
  getProfile(@Param('userId') userId: string) {
    return this.authService.getProfileById({ userId });
  }

  @Get('check-auth')
  @UseGuards(JwtAuthGuard)
  checkAuth(@Req() req: any) {
    return {
      success: true,
      user: req.user,
    };
  }
}
