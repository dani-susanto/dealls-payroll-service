import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLog } from '../../entities/request-log.entity';

@Processor('process-request-logger')
export class ProcessRequestLoggerJob extends WorkerHost {
  constructor(
    @InjectRepository(RequestLog)
    private requestLogRepository: Repository<RequestLog>,
  ) {
    super();
  }

  async process(job: Job<RequestLog>): Promise<void> {
    await this.requestLogRepository.save(job.data);
  }
}
