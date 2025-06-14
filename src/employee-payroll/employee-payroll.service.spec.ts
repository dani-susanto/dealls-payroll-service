import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { EmployeePayrollService } from './employee-payroll.service';
import { PayrollPeriod, PayrollPeriodStatus } from '../entities/payroll-period.entity';
import { PayrollSummary } from '../entities/payroll-summary.entity';
import { PayrollSummaryComponentPaymentType } from '../entities/payroll-summary-component.entity';

describe('EmployeePayrollService', () => {
  let service: EmployeePayrollService;
  let payrollPeriodRepository: any;
  let payrollSummaryRepository: any;

  const mockPeriod = {
    id: '4232cafd-9a13-4fc3-aea5-37b332d5a8cf',
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-01-31'),
    status: PayrollPeriodStatus.COMPLETED
  };

  const mockSummary = {
    id: '8b918f20-0517-46f7-b717-e5d56903bf40',
    take_home_pay_amount: 93478.28,
    components: [
      {
        payment_type: PayrollSummaryComponentPaymentType.SALARY,
        amount: 43478.28
      },
      {
        payment_type: PayrollSummaryComponentPaymentType.OVERTIME,
        amount: 25000.00
      },
      {
        payment_type: PayrollSummaryComponentPaymentType.REIMBURSEMENT,
        amount: 25000.00
      }
    ]
  };

  beforeEach(async () => {
    payrollPeriodRepository = {
      findOne: jest.fn(),
    };

    payrollSummaryRepository = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(22),
        getRawOne: jest.fn().mockResolvedValue({ total: 10 })
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeePayrollService,
        {
          provide: getRepositoryToken(PayrollPeriod),
          useValue: payrollPeriodRepository,
        },
        {
          provide: getRepositoryToken(PayrollSummary),
          useValue: payrollSummaryRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeePayrollService>(EmployeePayrollService);
  });

  describe('getLatestPayslip', () => {
    it('should return payslip for latest completed period', async () => {
      payrollPeriodRepository.findOne.mockResolvedValue(mockPeriod);
      payrollSummaryRepository.findOne.mockResolvedValue(mockSummary);

      const result = await service.getLatestPayslip('898d7499-6892-4c8e-9c81-53144374ae8c');

      expect(result).toEqual({
        start_date: mockPeriod.start_date,
        end_date: mockPeriod.end_date,
        attendance_count: 22,
        overtime_hours: 10,
        components: mockSummary.components.map(c => ({
          ...c,
          amount: Number(c.amount)
        })),
        take_home_pay_amount: Number(mockSummary.take_home_pay_amount)
      });
    });

    it('should throw NotFoundException when no completed period exists', async () => {
      payrollPeriodRepository.findOne.mockResolvedValue(null);

      await expect(service.getLatestPayslip('898d7499-6892-4c8e-9c81-53144374ae8c'))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw NotFoundException when no payslip found for period', async () => {
      payrollPeriodRepository.findOne.mockResolvedValue(mockPeriod);
      payrollSummaryRepository.findOne.mockResolvedValue(null);

      await expect(service.getLatestPayslip('898d7499-6892-4c8e-9c81-53144374ae8c'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
