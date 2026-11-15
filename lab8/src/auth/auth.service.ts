import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { LoginDto, SignupDto } from './auth.dto';

interface User { id: string; name: string; email: string; passwordHash: string }

@Injectable()
export class AuthService {
  // DEMO STORAGE: lives in memory, resets when the server restarts.
  // Swap for a real DB (TypeORM / Prisma / Mongoose) later.
  private users: User[] = [];

  constructor(private readonly jwt: JwtService) {}

  async signup(dto: SignupDto) {
    const email = dto.email.trim().toLowerCase();
    if (this.users.some(u => u.email === email)) {
      throw new ConflictException('This email already has an account');
    }
    const user: User = {
      id: randomUUID(),
      name: dto.name.trim(),
      email,
      passwordHash: await bcrypt.hash(dto.password, 10), // never store plain passwords
    };
    this.users.push(user);
    return this.issueToken(user); // signup also logs the user in (like your frontend)
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = this.users.find(u => u.email === email);
    // Same message for both failures so attackers can't discover which emails exist
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    return this.issueToken(user);
  }

  private issueToken(user: User) {
    const token = this.jwt.sign({ sub: user.id, name: user.name, email: user.email });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}
