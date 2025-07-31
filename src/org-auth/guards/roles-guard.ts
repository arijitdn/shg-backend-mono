import { UserRole } from '@app/db/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    const hasRequiredRoles = requiredRoles.some((role) => user.role === role);

    if (!hasRequiredRoles) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
