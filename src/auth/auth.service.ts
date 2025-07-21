import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { DbService } from '@app/common/db/db.service';
import { CustomerEntity } from '@app/common/db/entities/customer.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.dbService.customerRepo.findOneBy({
      phone: dto.phone,
    });
    if (exists) throw new ConflictException('Phone already registered');

    const hash = await this.hashPassword(dto.password);
    const customer = this.dbService.customerRepo.create({
      ...dto,
      password: hash,
    });

    await this.dbService.customerRepo.save(customer);
    return { message: 'Customer registered successfully' };
  }

  async login(dto: LoginDto) {
    const customer = await this.dbService.customerRepo.findOneBy({
      phone: dto.phone,
    });

    if (!customer) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.verifyPassword(dto.password, customer.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = this.generateTokens(customer);

    return {
      ...tokens,
      user: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      },
    };
  }

  private async hashPassword(pw: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(pw, saltRounds);
  }

  private async verifyPassword(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }

  private generateTokens(user: CustomerEntity) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: CustomerEntity): string {
    const payload = { sub: user.id, phone: user.phone };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRY') || '15m',
    });
  }

  private generateRefreshToken(user: CustomerEntity): string {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRY') || '7d',
    });
  }
}
