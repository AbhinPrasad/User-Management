import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { msg } from '../constants/message.constants';

function matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
  return requiredRoles.some((role) => userRoles.includes(role));
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      throw new ForbiddenException(msg.accessDenied);
    }
    if (!matchRoles(roles, user.role)) {
      throw new ForbiddenException(msg.accessDenied);
    }
    return true;
  }
}
