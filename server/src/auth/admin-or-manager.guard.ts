import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from 'src/users/user.entity';

@Injectable()
export class AdminOrManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && (user.role === UserRole.ADMIN || user.role === UserRole.PROJECT_MANAGER)) {
      return true;
    }

    throw new ForbiddenException('You do not have permission to access this resource.');
  }
}