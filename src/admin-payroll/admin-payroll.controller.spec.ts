import { Test, TestingModule } from '@nestjs/testing';
import { AdminPayrollController } from './admin-payroll.controller';
import { AdminPayrollService } from './admin-payroll.service';
import { PayrollPeriodStatus } from '../entities/payroll-period.entity';
import { BadRequestException } from '@nestjs/common';

describe('AdminPayrollController', () => {
  let controller: AdminPayrollController;
  let service: AdminPayrollService;

  const mockPayrollService = {
    createPayrollPeriod: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPayrollController],
      providers: [
        {
          provide: AdminPayrollService,
          useValue: mockPayrollService,
        },
      ],
    }).compile();

    controller = module.get<AdminPayrollController>(AdminPayrollController);
    service = module.get<AdminPayrollService>(AdminPayrollService);
  });

  describe('createPayrollPeriod', () => {
    it('should create a new payroll period', async () => {
      const createDto = {
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-01-31'),
      };

      const expectedResult = {
        id: 'd10ef372-9e21-4113-914f-8e535284de04',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-01-31'),
        status: PayrollPeriodStatus.DRAFT,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'createPayrollPeriod').mockResolvedValue(expectedResult as any);

      const result = await controller.createPayrollPeriod(createDto);
      expect(result).toBe(expectedResult);
      expect(service.createPayrollPeriod).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException when dates overlap', async () => {
      const createDto = {
        start_date: new Date('2024-01-31'),
        end_date: new Date('2024-01-01'),
      };

      jest.spyOn(service, 'createPayrollPeriod').mockRejectedValue(
        new BadRequestException('Date range overlaps with existing payroll period')
      );

      await expect(controller.createPayrollPeriod(createDto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException when end date is before start date', async () => {
      const createDto = {
        start_date: new Date('2024-01-31'),
        end_date: new Date('2024-01-01'),
      };

      jest.spyOn(service, 'createPayrollPeriod').mockRejectedValue(
        new BadRequestException('End date must be after start date')
      );

      await expect(controller.createPayrollPeriod(createDto))
        .rejects
        .toThrow(BadRequestException);
    });
  });
});
