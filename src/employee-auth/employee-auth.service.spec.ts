import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { EmployeeAuthService } from './employee-auth.service';
import { Employee } from '../entities/employee.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('EmployeeAuthService', () => {
  let service: EmployeeAuthService;
  let jwtService: JwtService;
  let mockRepository: any;

  const mockEmployee = {
    id: '1',
    username: 'dealls_employee',
    password: '$2b$10$uZS/lULvevTtikJN1PdGxuHndRmVuUCsr1cVzmVK0tv/XKVkqQDMW',
    name: 'Dealls Employee',
    status: 'ACTIVE',
  };

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeAuthService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4OThkNzQ5OS02ODkyLTRjOGUtOWM4MS01MzE0NDM3NGFlOGMiLCJ1c2VybmFtZSI6Imp1bmUzMyIsImlhdCI6MTc0OTg3MjczMiwiZXhwIjoxNzQ5OTU5MTMyfQ.9ewXPzn2vBp103om06mD75a69PReN_4b48ee3jJh62U'),
          },
        },
      ],
    }).compile();

    service = module.get<EmployeeAuthService>(EmployeeAuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmployee);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('dealls_employee', 'dealls_employee123+');

      expect(result).toEqual({
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4OThkNzQ5OS02ODkyLTRjOGUtOWM4MS01MzE0NDM3NGFlOGMiLCJ1c2VybmFtZSI6Imp1bmUzMyIsImlhdCI6MTc0OTg3MjczMiwiZXhwIjoxNzQ5OTU5MTMyfQ.9ewXPzn2vBp103om06mD75a69PReN_4b48ee3jJh62U',
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.login('dealls_employee_404', 'password'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmployee);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('dealls_employee', 'wrongpass'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return employee profile when found', async () => {
      const expectedProfile = {
        id: '1',
        name: 'Dealls Employee',
        username: 'dealls_employee'
      };
      mockRepository.findOne.mockResolvedValue(expectedProfile);

      const result = await service.getProfile('6f96a537-e6b5-40fb-b9b5-1b98ae184dfb');
      expect(result).toEqual(expectedProfile);
    });

    it('should throw UnauthorizedException when employee not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile('6f96a537-e6b5-40fb-b9b5-1b98ae184dfb'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});
