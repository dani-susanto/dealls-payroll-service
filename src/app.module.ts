import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { EmployeeAuthModule } from './employee-auth/employee-auth.module';
import { AdminPayrollModule } from './admin-payroll/admin-payroll.module';
import { EmployeeActivityModule } from './employee-activity/employee-activity.module';
import { EmployeePayrollModule } from './employee-payroll/employee-payroll.module';
import { BullModule } from '@nestjs/bullmq';
import { RequestLoggerInterceptor } from './common/interceptors/request-logger.interceptor';
import { RequestLog } from './entities/request-log.entity';
import { ProcessRequestLoggerJob } from './common/jobs/process-request-logger.job';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    BullModule.registerQueue({
      name: 'process-request-logger',
    }),
    TypeOrmModule.forFeature([RequestLog]),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true
      },
      interceptor: {
        mount: true
      },
    }),
    AdminAuthModule,
    EmployeeAuthModule,
    AdminPayrollModule,
    EmployeeActivityModule,
    EmployeePayrollModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
    ProcessRequestLoggerJob,
  ],
})
export class AppModule {}
