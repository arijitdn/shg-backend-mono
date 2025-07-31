import { Module } from '@nestjs/common';
import { OrgAuthController } from './org-auth.controller';
import { OrgAuthService } from './org-auth.service';
import { DbModule } from '@app/db';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles-guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DbModule, PassportModule, JwtModule],
  controllers: [OrgAuthController],
  providers: [OrgAuthService, JwtStrategy, RolesGuard],
  exports: [OrgAuthService, RolesGuard],
})
export class OrgAuthModule {}
