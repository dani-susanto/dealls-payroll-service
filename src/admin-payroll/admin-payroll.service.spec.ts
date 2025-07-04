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

  const mockAdmin = {
    id: '5f238a66-5474-439d-8071-30d6d61251e6'
  }
  
  const mockPeriod = {
    id: '4232cafd-9a13-4fc3-aea5-37b332d5a8cf',
    start_date: new Date('2025-05-21'),
    end_date: new Date('2025-06-20'),
    status: PayrollPeriodStatus.DRAFT
  };

  const mockPeriods = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-01-31'),
      status: PayrollPeriodStatus.DRAFT,
      eligible_employee_count: 0,
      processed_employee_count: 0,
      failed_employee_count: 0,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  beforeEach(async () => {
    payrollPeriodRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockPeriods, 1])
      }))
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

      const result = await service.executePayroll(mockPeriod.id, mockAdmin.id);

      expect(result).toEqual({
        id: mockPeriod.id,
        status: PayrollPeriodStatus.PROCESSING
      });
      expect(payrollInitQueue.add).toHaveBeenCalledWith(
        'init-process-employee-payroll',
        { periodId: mockPeriod.id, adminId: mockAdmin.id }
      );
    });

    it('should throw NotFoundException when period not found', async () => {
      payrollPeriodRepository.findOneBy.mockResolvedValue(null);

      await expect(service.executePayroll('non-existent', mockAdmin.id))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw BadRequestException when period not in draft status', async () => {
      payrollPeriodRepository.findOneBy.mockResolvedValue({
        ...mockPeriod,
        status: PayrollPeriodStatus.COMPLETED
      });

      await expect(service.executePayroll(mockPeriod.id, mockAdmin.id))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('listPeriods', () => {
    it('should return list of periods with pagination', async () => {
      const result = await service.listPeriods({ page: 1, limit: 10 });

      expect(result).toEqual({
        data: mockPeriods,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          last_page: 1
        }
      });
      
      expect(payrollPeriodRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should filter by status when provided', async () => {
      const queryBuilder = {
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockPeriods, 1])
      };

      payrollPeriodRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await service.listPeriods({ page: 1, limit: 10 }, PayrollPeriodStatus.DRAFT);

      expect(queryBuilder.where).toHaveBeenCalledWith(
        'period.status = :status',
        { status: PayrollPeriodStatus.DRAFT }
      );
    });
  });
});
