import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { DataSource } from 'typeorm';
import { PayrollPeriod, PayrollPeriodStatus } from '../entities/payroll-period.entity';
import { PayrollSummary } from '../entities/payroll-summary.entity';
import { PayrollSummaryComponent } from '../entities/payroll-summary-component.entity';
import { Employee } from '../entities/employee.entity';
import { EmployeeAttendance } from '../entities/employee-attendance.entity';
import { EmployeeOvertime } from '../entities/employee-overtime.entity';
import { EmployeeReimbursement } from '../entities/employee-reimbursement.entity';
import { AdminPayrollService } from './admin-payroll.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AdminPayrollService', () => {
  let service: AdminPayrollService;
  let payrollInitQueue: Queue;
  let payrollPeriodRepository: any;

  const mockPeriod = {
    id: '4232cafd-9a13-4fc3-aea5-37b332d5a8cf',
    start_date: new Date('2025-05-21'),
    end_date: new Date('2025-06-20'),
    status: PayrollPeriodStatus.DRAFT
  };

  beforeEach(async () => {
    payrollPeriodRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminPayrollService,
        {
          provide: 'BullQueue_init-process-employee-payroll',
          useValue: {
            add: jest.fn()
          }
        },
        {
          provide: DataSource,
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              setParameters: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            })
          }
        },
        {
          provide: getRepositoryToken(PayrollPeriod),
          useValue: payrollPeriodRepository
        },
        {
          provide: getRepositoryToken(PayrollSummary),
          useValue: {}
        },
        {
          provide: getRepositoryToken(PayrollSummaryComponent),
          useValue: {}
        },
        {
          provide: getRepositoryToken(Employee),
          useValue: {}
        },
        {
          provide: getRepositoryToken(EmployeeAttendance),
          useValue: {}
        },
        {
          provide: getRepositoryToken(EmployeeOvertime),
          useValue: {}
        },
        {
          provide: getRepositoryToken(EmployeeReimbursement),
          useValue: {}
        },
      ],
    }).compile();

    service = module.get<AdminPayrollService>(AdminPayrollService);
    payrollInitQueue = module.get<Queue>('BullQueue_init-process-employee-payroll');
  });

  describe('createPayrollPeriod', () => {
    it('should create a new payroll period', async () => {
      payrollPeriodRepository.findOne.mockResolvedValue(null);
      payrollPeriodRepository.create.mockReturnValue(mockPeriod);
      payrollPeriodRepository.save.mockResolvedValue(mockPeriod);

      const result = await service.createPayrollPeriod({
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-01-31')
      });

      expect(result).toEqual(mockPeriod);
    });

    it('should throw BadRequestException when end date is before start date', async () => {
      await expect(service.createPayrollPeriod({
        start_date: new Date('2024-01-31'),
        end_date: new Date('2024-01-01')
      })).rejects.toThrow(new BadRequestException('End date must be after start date'));
    });

    it('should throw BadRequestException when dates overlap with existing period', async () => {
      payrollPeriodRepository.findOne.mockResolvedValue(mockPeriod);

      await expect(service.createPayrollPeriod({
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-02-15')
      })).rejects.toThrow(new BadRequestException('Date range overlaps with existing payroll period'));
    });
  });

  describe('executePayroll', () => {
    it('should add job to init queue and return processing status', async () => {
      payrollPeriodRepository.findOneBy.mockResolvedValue(mockPeriod);
      payrollPeriodRepository.save.mockResolvedValue({
        ...mockPeriod,
        status: PayrollPeriodStatus.PROCESSING
      });

      const result = await service.executePayroll(mockPeriod.id);

      expect(result).toEqual({
        id: mockPeriod.id,
        status: PayrollPeriodStatus.PROCESSING
      });
      expect(payrollInitQueue.add).toHaveBeenCalledWith(
        'init-process-employee-payroll',
        { periodId: mockPeriod.id }
      );
    });

    it('should throw NotFoundException when period not found', async () => {
      payrollPeriodRepository.findOneBy.mockResolvedValue(null);

      await expect(service.executePayroll('non-existent'))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw BadRequestException when period not in draft status', async () => {
      payrollPeriodRepository.findOneBy.mockResolvedValue({
        ...mockPeriod,
        status: PayrollPeriodStatus.COMPLETED
      });

      await expect(service.executePayroll(mockPeriod.id))
        .rejects
        .toThrow(BadRequestException);
    });
  });
});
