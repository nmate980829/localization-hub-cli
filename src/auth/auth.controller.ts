import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginService: AuthService) {}

  @Post('login')
  create(@Body() body: LoginDto) {
    return this.loginService.login(body);
  }
}
