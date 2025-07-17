import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-member.dto';
import { JwtService } from '@nestjs/jwt';
import { createMemberDto } from './dto/create-member.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserEntity } from '@app/common/db/entities';
import { DbService } from '@app/common/db/db.service';
import { UserRole } from '@app/common/db/enums/user-role.enum';
import { AdminLoginDto } from './dto/login-admin.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createMember(dto: createMemberDto) {
    const exists = await this.dbService.userRepo.findOneBy({
      phone: dto.phone,
    });
    if (exists) throw new ConflictException('Phone is already in use');

    const hash = await this.hashPassword(dto.password);
    const user = this.dbService.userRepo.create({
      ...dto,
      password: hash,
      role: UserRole.SHG_MEMBER,
    });
    await this.dbService.userRepo.save(user);
    return { message: 'Member created successfully' };
  }
  async createAdmin(createAdminDto: CreateAdminDto) {
    const exists = await this.dbService.userRepo.findOneBy({
      email: createAdminDto.email,
    });
    if (exists) throw new ConflictException('email already in use');

    const hash = await this.hashPassword(createAdminDto.password);
    const user = this.dbService.userRepo.create({
      ...createAdminDto,
      password: hash,
    });
    await this.dbService.userRepo.save(user);
    return { message: 'Admin created successfully' };
  }

  async loginMember(loginDto: LoginDto) {
    const user = await this.dbService.userRepo.findOneBy({
      phone: loginDto.phone,
    });

    if (
      !user ||
      ![UserRole.SHG_MEMBER, UserRole.VO_MEMBER, UserRole.CLF_MEMBER].includes(
        user.role,
      )
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await this.verifyPassword(loginDto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const tokens = this.generateTokens(user);
    return {
      ...tokens,
      user: {
        userId: user.userId,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }
  async loginAdmin(adminLoginDto: AdminLoginDto) {
    const user = await this.dbService.userRepo.findOneBy({
      phone: adminLoginDto.phone,
      email: adminLoginDto.email,
    });

    if (
      !user ||
      ![UserRole.BMMU_ADMIN, UserRole.DMMU_ADMIN, UserRole.NIC_ADMIN].includes(
        user.role,
      )
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await this.verifyPassword(
      adminLoginDto.password,
      user.password,
    );
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const tokens = this.generateTokens(user);
    return {
      ...tokens,
      user: {
        userId: user.userId,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.dbService.userRepo.findOneBy({ id: payload.sub });
      if (!user) throw new UnauthorizedException('Invalid refresh token');

      return { accessToken: this.generateAccessToken(user) };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getUserById(userId: string) {
    const user = await this.dbService.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async update(id: string, dto: Partial<createMemberDto>) {
    return await this.dbService.userRepo.update(id, dto);
  }

  async remove(id: string) {
    return await this.dbService.userRepo.delete(id);
  }

  private async hashPassword(pw: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(pw, saltRounds);
  }

  private async verifyPassword(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }

  private generateTokens(user: UserEntity) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: UserEntity): string {
    const payload = { sub: user.id, role: user.role, phone: user.phone };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRY') || '15m',
    });
  }

  private generateRefreshToken(user: UserEntity): string {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRY') || '7d',
    });
  }
}
