import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // POST /api/auth/signup  -> { token, user }
  @Post('signup')
  signup(@Body() dto: SignupDto) { return this.auth.signup(dto); }

  // POST /api/auth/login   -> { token, user }
  @Post('login') @HttpCode(200)
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  // GET /api/auth/me       -> current user from token
  @Get('me') @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return { id: user.sub, name: user.name, email: user.email };
  }

  // POST /api/auth/logout
  // JWTs are stateless, so the real logout = frontend deletes its token.
  @Post('logout') @HttpCode(200) @UseGuards(JwtAuthGuard)
  logout() { return { message: 'Logged out. Discard the token on the client.' }; }
}
