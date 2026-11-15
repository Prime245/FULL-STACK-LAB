import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { LoginDto, SignupDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>, // table "users"
    private readonly jwt: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const email = dto.email.trim().toLowerCase();
    if (await this.users.existsBy({ email })) {
      throw new ConflictException('This email already has an account');
    }
    const user = await this.users.save(
      this.users.create({
        name: dto.name.trim(),
        email,
        passwordHash: await bcrypt.hash(dto.password, 10), // never store plain passwords
      }),
    );
    return this.issueToken(user); // signup also logs the user in
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOneBy({ email: dto.email.trim().toLowerCase() });
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
