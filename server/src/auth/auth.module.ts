import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'PUl4BQiEUPTERIdmTaW8bA1qYUkkwsunDd3CQO30KlLmNqXOOQr5dZYFmPLt3AZlkbpofYfO2aqWpO9C2MQ3zKyK764xzr3SU9IUpBfafjyDFd8v47a6AhjPXhnwSntwkEKIeehKPUpYB6FGLSAHIiio79ZXrmEV0Zh2AeuANUFGeWOXPHSWqEdgbHcbYIlXw5s6MVgJdTIdd7stMJnU9dU0SWb8OjsPffhxSRCWOPPKRE0ngElgrR86dkcivhbY', 
      signOptions: { expiresIn: '3h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}