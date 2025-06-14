import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAdminAuthStrategy extends PassportStrategy(Strategy, 'jwt-admin-auth') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ADMIN_SECRET || 'jwt-admin-secret',
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, username: payload.username };
  }
}
