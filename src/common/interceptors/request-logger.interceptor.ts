import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  constructor(
    @InjectQueue('process-request-logger')
    private requestLoggerQueue: Queue,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const requestId = request.headers['x-request-id'] || uuidv4();

    response.setHeader('X-Request-ID', requestId);

    const requestLog = {
      request_id: requestId,
      method: request.method,
      path: request.url,
      ip_address: request.ip,
      user_agent: request.get('user-agent'),
      request_body: JSON.stringify(request.body),
      user_id: request.user?.sub
    };

    return next.handle().pipe(
      tap(async (responseBody) => {
        await this.requestLoggerQueue.add('process-request-logger', {
          ...requestLog,
          response_code: response.statusCode,
          response_body: JSON.stringify(responseBody)
        }, {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 3,
        });
      }),
      catchError(async error => {
        await this.requestLoggerQueue.add('process-request-logger', {
          ...requestLog,
          response_code: error.status || 500,
          response_body: JSON.stringify(error.response),
          error_message: error.message
        });
        throw error;
      })
    );
  }
}
