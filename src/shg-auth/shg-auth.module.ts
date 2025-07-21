import { Module } from '@nestjs/common';
import { ShgAuthController } from './shg-auth.controller';
import { ShgAuthService } from './shg-auth.service';
import { DbModule } from '@app/db';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles-guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DbModule, PassportModule, JwtModule],
  controllers: [ShgAuthController],
  providers: [ShgAuthService, JwtStrategy, RolesGuard],
  exports: [ShgAuthService, RolesGuard],
})
export class ShgAuthModule {}
