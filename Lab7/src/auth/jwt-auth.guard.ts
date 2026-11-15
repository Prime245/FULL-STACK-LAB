import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Put @UseGuards(JwtAuthGuard) on any route that needs a logged-in user.
// Client must send:  Authorization: Bearer <token>
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const [type, token] = (req.headers.authorization ?? '').split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing Bearer token');
    }
    try {
      req.user = this.jwt.verify(token); // { sub, name, email, iat, exp }
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
