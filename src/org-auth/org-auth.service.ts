import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-member.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateMemberDto } from './dto/create-member.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { TRLMAdminEntity, TRLMLevel, UserEntity } from '@app/db/entities';
import { DbService } from '@app/db/db.service';
import { UserRole } from '@app/db/enums/user-role.enum';
import { AdminLoginDto } from './dto/login-admin.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrgAuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createMember(dto: CreateMemberDto) {
    const exists = await this.dbService.userRepo.findOneBy({
      phone: dto.phone,
    });
    if (exists) throw new ConflictException('Phone is already in use');

    const hash = await this.hashPassword(dto.password);
    const user = this.dbService.userRepo.create({
      ...dto,
      password: hash,
    });
    await this.dbService.userRepo.save(user);
    return { message: 'Member created successfully' };
  }
  async createAdmin(createAdminDto: CreateAdminDto) {
    const exists = await this.dbService.trlmRepo.findOneBy({
      email: createAdminDto.email,
    });
    if (exists) throw new ConflictException('Email already in use');

    const hash = await this.hashPassword(createAdminDto.password);
    const user = this.dbService.trlmRepo.create({
      ...createAdminDto,
      level: createAdminDto.role,
      password: hash,
    });
    await this.dbService.trlmRepo.save(user);
    return { message: `TRLM employee created successfully` };
  }

  async login(loginDto: LoginDto) {
    const { userId, password: providedPassword, role } = loginDto;

    if (['SHG', 'VO', 'CLF'].includes(role)) {
      if (!userId) {
        throw new BadRequestException(
          'Please provide a valid User ID to login',
        );
      }

      const user = await this.dbService.userRepo.findOneBy({
        userId,
        role: role as UserRole,
      });

      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isValidPassword = await this.verifyPassword(
        providedPassword,
        user.password,
      );

      if (!isValidPassword)
        throw new UnauthorizedException('Invalid credentials');

      const tokens = this.generateTokens(user);

      const { password, ...userData } = user;

      return {
        ...tokens,
        user: userData,
      };
    } else {
      const { email, password: providedPassword, role } = loginDto;

      if (['BMMU', 'DMMU', 'NIC'].includes(role)) {
        if (!email) {
          throw new BadRequestException(
            'Please provide a valid email address to login',
          );
        }

        const user = await this.dbService.trlmRepo.findOneBy({
          email,
          level: role as TRLMLevel,
        });

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isValidPassword = await this.verifyPassword(
          providedPassword,
          user.password,
        );

        if (!isValidPassword)
          throw new UnauthorizedException('Invalid credentials');

        const tokens = this.generateTokens(user);

        const { password, ...userData } = user;

        return {
          ...tokens,
          user: userData,
        };
      }
    }
  }

  async getDetails(userId: string, shgId: string) {
    const user = await this.dbService.userRepo.findOneBy({
      userId,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const shg = await this.dbService.shgRepo.findOneBy({
      groupId: shgId,
    });

    if (!shg) {
      throw new UnauthorizedException('SHG not found');
    }

    return {
      username: user.name,
      shgName: shg.name,
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

  async update(id: string, dto: Partial<CreateMemberDto>) {
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

  private generateTokens(user: UserEntity | TRLMAdminEntity): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: UserEntity | TRLMAdminEntity): string {
    const payload: any = { sub: user.id };
    if ('role' in user) {
      payload.role = user.role;
    } else if ('level' in user) {
      payload.role = user.level;
    }
    if ('phone' in user) {
      payload.phone = user.phone;
    }
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRY') || '15m',
    });
  }

  private generateRefreshToken(user: UserEntity | TRLMAdminEntity): string {
    const payload: any = { sub: user.id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRY') || '7d',
    });
  }
}
