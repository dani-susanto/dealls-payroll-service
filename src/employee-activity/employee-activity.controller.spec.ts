import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EmployeeActivityController } from './employee-activity.controller';
import { EmployeeActivityService } from './employee-activity.service';

describe('EmployeeActivityController', () => {
  let controller: EmployeeActivityController;
  let service: EmployeeActivityService;
  
  const mockEmployeeActivityService = {
    submitAttendance: jest.fn(),
    submitOvertime: jest.fn(),
    submitReimbursement: jest.fn(),
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeActivityController],
      providers: [
        {
          provide: EmployeeActivityService,
          useValue: mockEmployeeActivityService,
        },
      ],
    }).compile();
    
    controller = module.get<EmployeeActivityController>(EmployeeActivityController);
    service = module.get<EmployeeActivityService>(EmployeeActivityService);
  });

  
  describe('submitAttendance', () => {
    it('should submit attendance successfully', async () => {
      const mockAttendance = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        employee_id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
        attendance_date: '2024-01-15',
        created_at: new Date(),
        updated_at: new Date(),
        employee: {
          id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
          name: 'Employee', 
        },
      };
      
      jest.spyOn(service, 'submitAttendance').mockResolvedValue(mockAttendance as any);
      
      const result = await controller.submitAttendance({ user: { sub: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb' } });
      expect(result).toBe(mockAttendance);
      expect(service.submitAttendance).toHaveBeenCalledWith('6f96a537-e6b5-40fb-b9b5-1b98ae184dfb');
    });
    
    it('should return existing attendance if already submitted', async () => {
      const mockExistingAttendance = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        employee_id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
        attendance_date: '2024-01-15',
        created_at: new Date(),
        updated_at: new Date(),
        employee: {
          id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
          name: 'John Doe',
        },
      };
      
      jest.spyOn(service, 'submitAttendance').mockResolvedValue(mockExistingAttendance as any);
      
      const result = await controller.submitAttendance({ user: { sub: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb' } });
      expect(result).toBe(mockExistingAttendance);
    });
    
    it('should throw BadRequestException on weekend submission', async () => {
      jest.spyOn(service, 'submitAttendance').mockRejectedValue(
        new BadRequestException('Cannot submit attendance on weekends')
      );
      
      await expect(controller.submitAttendance({ user: { sub: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb' } }))
      .rejects
      .toThrow(BadRequestException);
    });
  });
  
  describe('submitOvertime', () => {
    it('should submit overtime successfully', async () => {
      const mockOvertime = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        employee_id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
        overtime_date: '2024-01-15',
        extra_hour: 2,
        created_at: new Date(),
        updated_at: new Date(),
         employee: {
          id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
          name: 'Employee', 
        },
      };

      jest.spyOn(service, 'submitOvertime').mockResolvedValue(mockOvertime as any);

      const result = await controller.submitOvertime(
        { user: { sub: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb' } },
        { extra_hour: 2 }
      );

      expect(result).toBe(mockOvertime);
      expect(service.submitOvertime).toHaveBeenCalledWith('6f96a537-e6b5-40fb-b9b5-1b98ae184dfb', 2);
    });

    it('should throw BadRequestException when submitting before 5 PM', async () => {
      jest.spyOn(service, 'submitOvertime').mockRejectedValue(
        new BadRequestException('On weekdays, overtime can only be submitted after 5 PM')
      );

      await expect(controller.submitOvertime(
        { user: { sub: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb' } },
        { extra_hour: 2 }
      )).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when overtime already submitted', async () => {
      jest.spyOn(service, 'submitOvertime').mockRejectedValue(
        new BadRequestException('Overtime already submitted for today')
      );

      await expect(controller.submitOvertime(
        { user: { sub: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb' } },
        { extra_hour: 2 }
      )).rejects.toThrow(BadRequestException);
    });
  });
  
  describe('submitReimbursement', () => {
    it('should submit reimbursement successfully', async () => {
      const mockReimbursement = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        employee_id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
        reimbursement_date: '2024-01-15',
        amount: 50000,
        description: 'Taxi fare for client meeting',
        created_at: new Date(),
        updated_at: new Date(),
        employee: {
          id: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
          name: 'Dealls Employee',
        },
      };

      jest.spyOn(service, 'submitReimbursement').mockResolvedValue(mockReimbursement as any);

      const result = await controller.submitReimbursement(
        { user: { sub: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb' } },
        { amount: 50000, description: 'Taxi fare for client meeting' }
      );

      expect(result).toBe(mockReimbursement);
      expect(service.submitReimbursement).toHaveBeenCalledWith(
        '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb',
        50000,
        'Taxi fare for client meeting'
      );
    });

    it('should throw BadRequestException when amount is invalid', async () => {
      jest.spyOn(service, 'submitReimbursement').mockRejectedValue(
        new BadRequestException('Amount must be greater than 0')
      );

      await expect(controller.submitReimbursement(
        { user: { sub: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb' } },
        { amount: 0, description: 'Invalid amount' }
      )).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when description is empty', async () => {
      jest.spyOn(service, 'submitReimbursement').mockRejectedValue(
        new BadRequestException('Description is required')
      );

      await expect(controller.submitReimbursement(
        { user: { sub: '6f96a537-e6b5-40fb-b9b5-1b98ae184dfb' } },
        { amount: 50000, description: '' }
      )).rejects.toThrow(BadRequestException);
    });
  });
});
