import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { compare } from 'bcrypt';
import { AuthResponseDto } from 'src/common/dtos/auth-response.dto';

@Injectable()
export class EmployeeAuthService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<AuthResponseDto> {
    const employee = await this.employeeRepository.findOne({ where: { username } });
    if (!employee) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, employee.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (employee.status !== 'ACTIVE') {
      throw new UnauthorizedException('Employee is not active');
    }

    const payload = { sub: employee.id, username: employee.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getProfile(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ 
      where: { id },
      select: ['id', 'name', 'username']
    });
    
    if (!employee) {
      throw new UnauthorizedException('Employee not found');
    }
    
    return employee;
  }
}
