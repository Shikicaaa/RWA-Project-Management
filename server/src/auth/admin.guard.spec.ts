import { AdminGuard } from './admin.guard';
import { ExecutionContext } from '@nestjs/common';
import { User, UserRole } from '../users/user.entity';
import { ForbiddenException } from '@nestjs/common';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  const createMockExecutionContext = (user: Partial<User> | null): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user: user,
        }),
      }),
    } as ExecutionContext;
  };

  beforeEach(() => {
    guard = new AdminGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true for a user with ADMIN role', () => {

    const adminUser: Partial<User> = { role: UserRole.ADMIN };
    const context = createMockExecutionContext(adminUser);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException for a user with MEMBER role', () => {
    const memberUser: Partial<User> = { role: UserRole.MEMBER };
    const context = createMockExecutionContext(memberUser);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if there is no user on the request', () => {
    const context = createMockExecutionContext(null);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});