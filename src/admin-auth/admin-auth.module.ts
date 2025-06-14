import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { JwtAdminAuthStrategy } from '../common/strategies/jwt-admin.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ADMIN_SECRET || 'super-secret',
      signOptions: { 
        expiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '15m' 
      },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, JwtAdminAuthStrategy],
})
export class AdminAuthModule {}
