import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';

describe('AdminAuthController', () => {
  let controller: AdminAuthController;
  let service: AdminAuthService;

  const mockRepository = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuthController],
      providers: [
        AdminAuthService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AdminAuthController>(AdminAuthController);
    service = module.get<AdminAuthService>(AdminAuthService);
  });

  describe('login', () => {
    it('should return access token', async () => {
      const result = { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjIzOGE2Ni01NDc0LTQzOWQtODA3MS0zMGQ2ZDYxMjUxZTYiLCJ1c2VybmFtZSI6ImRlYWxzc19hZG1pbiIsImlhdCI6MTc0OTg3NDIwMywiZXhwIjoxNzQ5ODc1MTAzfQ.fXJAdHSZZmG2YsI8LBNuep4yxjE_FTZjBhn0CkkO0oQ' };
      jest.spyOn(service, 'login').mockResolvedValue(result);

      expect(await controller.login({ username: 'dealls_admin', password: 'dealls_admin123+' }))
        .toEqual(result);
    });
  });

  describe('me', () => {
    it('should return admin profile', async () => {
      const result = {
        id: '5f238a66-5474-439d-8071-30d6d61251e6',
        name: 'Dealls Admin',
        username: 'dealls_admin',
        password: '$2b$10$uZS/lULvevTtikJN1PdGxuHndRmVuUCsr1cVzmVK0tv/XKVkqQDMW',
        created_at: new Date(),
        updated_at: new Date()
      };
      jest.spyOn(service, 'getProfile').mockResolvedValue(result);

      expect(await controller.me({ user: { sub: '5f238a66-5474-439d-8071-30d6d61251e6' } }))
        .toEqual(result);
    });
  });
});
