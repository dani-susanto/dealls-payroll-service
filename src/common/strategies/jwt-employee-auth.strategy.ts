import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtEmployeeAuthStrategy extends PassportStrategy(Strategy, 'jwt-employee-auth') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_EMPLOYEE_SECRET || 'jwt-employee-secret',
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, username: payload.username };
  }
}
