import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { Admin } from '../entities/admin.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AdminAuthService', () => {
  let service: AdminAuthService;
  let jwtService: JwtService;
  let mockRepository: any;

  const mockAdmin = {
    id: '5f238a66-5474-439d-8071-30d6d61251e6	',
    username: 'dealls_admin',
    password: '$2b$10$uZS/lULvevTtikJN1PdGxuHndRmVuUCsr1cVzmVK0tv/XKVkqQDMW',
    name: 'Dealls Admin'
  };

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminAuthService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjIzOGE2Ni01NDc0LTQzOWQtODA3MS0zMGQ2ZDYxMjUxZTYiLCJ1c2VybmFtZSI6ImRlYWxzc19hZG1pbiIsImlhdCI6MTc0OTg3NDIwMywiZXhwIjoxNzQ5ODc1MTAzfQ.fXJAdHSZZmG2YsI8LBNuep4yxjE_FTZjBhn0CkkO0oQ'),
          },
        },
      ],
    }).compile();

    service = module.get<AdminAuthService>(AdminAuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      mockRepository.findOne.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('dealls_admin', 'dealls_admin123+');

      expect(result).toEqual({
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjIzOGE2Ni01NDc0LTQzOWQtODA3MS0zMGQ2ZDYxMjUxZTYiLCJ1c2VybmFtZSI6ImRlYWxzc19hZG1pbiIsImlhdCI6MTc0OTg3NDIwMywiZXhwIjoxNzQ5ODc1MTAzfQ.fXJAdHSZZmG2YsI8LBNuep4yxjE_FTZjBhn0CkkO0oQ',
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.login('wrong', 'password'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockRepository.findOne.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('admin', 'wrongpass'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return admin profile when found', async () => {
      const expectedProfile = {
         id: '5f238a66-5474-439d-8071-30d6d61251e6',
         username: 'dealls_admin',
         name: 'Dealls Admin'
      };
      mockRepository.findOne.mockResolvedValue(expectedProfile);

      const result = await service.getProfile('5f238a66-5474-439d-8071-30d6d61251e6');
      expect(result).toEqual(expectedProfile);
    });

    it('should throw UnauthorizedException when admin not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile('5f238a66-5474-439d-8071-30d6d61251e6'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});
