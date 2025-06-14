import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtEmployeeAuthGuard } from './jwt-employee-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, EmployeeStatus } from '../../entities/employee.entity';

@Injectable()
export class JwtEmployeeActiveAuthGuard extends JwtEmployeeAuthGuard {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isJwtValid = await super.canActivate(context);
    if (!isJwtValid) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;

    const employee = await this.employeeRepository.findOne({
      where: { id: userId },
      select: ['status']
    });

    if (!employee || employee.status !== EmployeeStatus.ACTIVE) {
      throw new UnauthorizedException('Employee is not active');
    }

    return true;
  }
}
