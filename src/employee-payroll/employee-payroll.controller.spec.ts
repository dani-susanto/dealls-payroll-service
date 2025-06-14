import { Test, TestingModule } from '@nestjs/testing';
import { EmployeePayrollController } from './employee-payroll.controller';
import { EmployeePayrollService } from './employee-payroll.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PayrollPeriod } from '../entities/payroll-period.entity';
import { PayrollSummary } from '../entities/payroll-summary.entity';
import { PayrollSummaryComponentPaymentType } from '../entities/payroll-summary-component.entity';

describe('EmployeePayrollController', () => {
  let controller: EmployeePayrollController;
  let service: EmployeePayrollService;

  const mockPayslip = {
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-01-31'),
    attendance_count: 22,
    overtime_hours: 10,
    components: [
      {
        payment_type: PayrollSummaryComponentPaymentType.SALARY,
        amount: 5000000
      },
      {
        payment_type: PayrollSummaryComponentPaymentType.OVERTIME,
        amount: 500000
      },
      {
        payment_type: PayrollSummaryComponentPaymentType.REIMBURSEMENT,
        amount: 100000
      }
    ],
    take_home_pay_amount: 5600000
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeePayrollController],
      providers: [
        {
          provide: EmployeePayrollService,
          useValue: {
            getLatestPayslip: jest.fn().mockResolvedValue(mockPayslip)
          }
        },
        {
          provide: getRepositoryToken(PayrollPeriod),
          useValue: {}
        },
        {
          provide: getRepositoryToken(PayrollSummary),
          useValue: {}
        }
      ],
    }).compile();

    controller = module.get<EmployeePayrollController>(EmployeePayrollController);
    service = module.get<EmployeePayrollService>(EmployeePayrollService);
  });

  describe('getLatestPayslip', () => {
    it('should return latest payslip', async () => {
      const result = await controller.getLatestPayslip({ 
        user: { sub: '898d7499-6892-4c8e-9c81-53144374ae8c' } 
      });
      
      expect(result).toEqual(mockPayslip);
      expect(service.getLatestPayslip).toHaveBeenCalledWith('898d7499-6892-4c8e-9c81-53144374ae8c');
    });
  });
});
