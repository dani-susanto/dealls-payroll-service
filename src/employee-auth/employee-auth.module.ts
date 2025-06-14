import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../entities/employee.entity';
import { EmployeeAuthController } from './employee-auth.controller';
import { EmployeeAuthService } from './employee-auth.service';
import { JwtEmployeeAuthStrategy } from '../common/strategies/jwt-employee-auth.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    JwtModule.register({
      secret: process.env.JWT_EMPLOYEE_SECRET,
      signOptions: { 
        expiresIn: process.env.JWT_EMPLOYEE_EXPIRED_IN  || '15m' 
      },
    }),
  ],
  controllers: [EmployeeAuthController],
  providers: [EmployeeAuthService, JwtEmployeeAuthStrategy],
})
export class EmployeeAuthModule {}
