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
    listPeriods: jest.fn(),
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

  describe('listPeriods', () => {
    it('should return list of periods', async () => {
      const mockResponse = {
        data: [{
          id: '123e4567-e89b-12d3-a456-426614174000',
          start_date: new Date('2024-01-01'),
          end_date: new Date('2024-01-31'),
          status: PayrollPeriodStatus.DRAFT,
          eligible_employee_count: 0,
          processed_employee_count: 0,
          failed_employee_count: 0
        }],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          last_page: 1
        }
      };

      jest.spyOn(service, 'listPeriods').mockResolvedValue(mockResponse);

      const result = await controller.listPeriods({ page: 1, limit: 10 });
      expect(result).toEqual(mockResponse);
      expect(service.listPeriods).toHaveBeenCalledWith({ page: 1, limit: 10 }, undefined);
    });

    it('should filter by status when provided', async () => {
      const mockResponse = {
        data: [{
          id: '123e4567-e89b-12d3-a456-426614174000',
          start_date: new Date('2024-01-01'),
          end_date: new Date('2024-01-31'),
          status: PayrollPeriodStatus.DRAFT,
          eligible_employee_count: 0,
          processed_employee_count: 0,
          failed_employee_count: 0
        }],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          last_page: 1
        }
      };

      jest.spyOn(service, 'listPeriods').mockResolvedValue(mockResponse);

      const result = await controller.listPeriods(
        { page: 1, limit: 10 }, 
        PayrollPeriodStatus.DRAFT
      );

      expect(result).toEqual(mockResponse);
      expect(service.listPeriods).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        PayrollPeriodStatus.DRAFT
      );
    });
  });
});
