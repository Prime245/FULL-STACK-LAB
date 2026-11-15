import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser { sub: string; name: string; email: string }

// Usage: someMethod(@CurrentUser() user: AuthUser)
// Reads the user that JwtAuthGuard attached to the request.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser =>
    ctx.switchToHttp().getRequest().user,
);
