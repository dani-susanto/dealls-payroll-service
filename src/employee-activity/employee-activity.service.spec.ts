import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { EmployeeActivityService } from './employee-activity.service';
import { EmployeeAttendance } from '../entities/employee-attendance.entity';
import { EmployeeOvertime } from '../entities/employee-overtime.entity';
import { EmployeeReimbursement } from '../entities/employee-reimbursement.entity';

describe('EmployeeActivityService', () => {
  let service: EmployeeActivityService;
  let mockRepository: any;

  const mockAttendance = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    employee_id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
    attendance_date: new Date('2024-01-15'),
    created_at: new Date(),
    updated_at: new Date()
  };

  const mockOvertime = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    employee_id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
    overtime_date: new Date('2024-01-15'),
    extra_hour: 2,
    created_at: new Date(),
    updated_at: new Date()
  };

  const mockReimbursement = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    employee_id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
    reimbursement_date: new Date('2024-01-15'),
    amount: 50000,
    description: 'Taxi fare',
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeActivityService,
        {
          provide: getRepositoryToken(EmployeeAttendance),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(EmployeeOvertime),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(EmployeeReimbursement),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeeActivityService>(EmployeeActivityService);

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('submitAttendance', () => {
    it('should create new attendance record on weekday', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockAttendance);
      mockRepository.save.mockResolvedValue(mockAttendance);

      const result = await service.submitAttendance('6f96a537-e6b5-40fb-b9b5-1b98ae184dfb');
      expect(result).toEqual(mockAttendance);
    });

    it('should return existing attendance if already submitted today', async () => {
      mockRepository.findOne.mockResolvedValue(mockAttendance);

      const result = await service.submitAttendance('6f96a537-e6b5-40fb-b9b5-1b98ae184dfb');
      expect(result).toEqual(mockAttendance);
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException on weekend submission', async () => {
      jest.setSystemTime(new Date('2024-01-14'));

      await expect(service.submitAttendance('6f96a537-e6b5-40fb-b9b5-1b98ae184dfb'))
        .rejects
        .toThrow(new BadRequestException('Cannot submit attendance on weekends'));
    });
  });

  describe('submitOvertime', () => {
    it('should submit overtime successfully', async () => {
      jest.setSystemTime(new Date('2024-01-13T18:00:00'));
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue(mockOvertime);

      const result = await service.submitOvertime('6f96a537-e6b5-40fb-b9b5-1b98ae184dfb', 2);
      expect(result).toEqual(mockOvertime);
    });

    it('should throw BadRequestException when overtime already submitted', async () => {
      jest.setSystemTime(new Date('2024-01-13T18:00:00'));
      mockRepository.findOne.mockResolvedValue(mockOvertime);
      await expect(service.submitOvertime('6f96a537-e6b5-40fb-b9b5-1b98ae184dfb', 2))
        .rejects
        .toThrow(new BadRequestException('Overtime already submitted for today'));
    });

    it('should throw BadRequestException when submitting before 5 PM', async () => {
      jest.setSystemTime(new Date('2024-01-15T15:00:00'));

      await expect(service.submitOvertime('6f96a537-e6b5-40fb-b9b5-1b98ae184dfb', 2))
        .rejects
        .toThrow(new BadRequestException('On weekdays, overtime can only be submitted after 5 PM'));
    });
  });

  describe('submitReimbursement', () => {
    it('should submit reimbursement successfully', async () => {
      mockRepository.save.mockResolvedValue(mockReimbursement);

      const result = await service.submitReimbursement('6f96a537-e6b5-40fb-b9b5-1b98ae184dfb', 50000, 'Taxi fare');
      expect(result).toEqual(mockReimbursement);
      expect(mockRepository.save).toHaveBeenCalledWith({
        employee_id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
        amount: 50000,
        description: 'Taxi fare',
        reimbursement_date: expect.any(Date)
      });
    });
  });
});
