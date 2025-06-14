import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeAuthController } from './employee-auth.controller';
import { EmployeeAuthService } from './employee-auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee } from '../entities/employee.entity';
import { AuthResponseDto } from '../common/dtos/auth-response.dto';

describe('EmployeeAuthController', () => {
  let controller: EmployeeAuthController;
  let service: EmployeeAuthService;
  
  const mockRepository = {
    findOne: jest.fn(),
  };
  
  const mockJwtService = {
    signAsync: jest.fn(),
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeAuthController],
      providers: [
        EmployeeAuthService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    
    controller = module.get<EmployeeAuthController>(EmployeeAuthController);
    service = module.get<EmployeeAuthService>(EmployeeAuthService);
  });
  
  describe('login', () => {
    it('should return access token', async () => {
      const result: AuthResponseDto = { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4OThkNzQ5OS02ODkyLTRjOGUtOWM4MS01MzE0NDM3NGFlOGMiLCJ1c2VybmFtZSI6Imp1bmUzMyIsImlhdCI6MTc0OTg3MjczMiwiZXhwIjoxNzQ5OTU5MTMyfQ.9ewXPzn2vBp103om06mD75a69PReN_4b48ee3jJh62U' };
      jest.spyOn(service, 'login').mockResolvedValue(result);

      expect(await controller.login({ username: 'dealls_employee', password: 'dealls_employee123+' }))
      .toEqual(result);
    });
  });
  
  describe('me', () => {
    it('should return employee profile', async () => {
      const result = {
        id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
        name: 'Dealls Employee',
        username: 'dealls_employee',
        password: '$2b$10$uZS/lULvevTtikJN1PdGxuHndRmVuUCsr1cVzmVK0tv/XKVkqQDMW',
        basic_salary_amount: 50000000,
        created_at: new Date(),
        updated_at: new Date(),
        attendances: [],
      };

      jest.spyOn(service, 'getProfile').mockResolvedValue(result as any);

      expect(await controller.me({ user: { sub: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb' } }))
      .toEqual(result);
    });
  });
  
});
