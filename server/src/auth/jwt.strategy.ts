import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'PUl4BQiEUPTERIdmTaW8bA1qYUkkwsunDd3CQO30KlLmNqXOOQr5dZYFmPLt3AZlkbpofYfO2aqWpO9C2MQ3zKyK764xzr3SU9IUpBfafjyDFd8v47a6AhjPXhnwSntwkEKIeehKPUpYB6FGLSAHIiio79ZXrmEV0Zh2AeuANUFGeWOXPHSWqEdgbHcbYIlXw5s6MVgJdTIdd7stMJnU9dU0SWb8OjsPffhxSRCWOPPKRE0ngElgrR86dkcivhbY',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}