import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLog } from '../../entities/request-log.entity';
import { ClsService } from 'nestjs-cls';

@Processor('process-request-logger')
export class ProcessRequestLoggerJob extends WorkerHost {
  constructor(
    @InjectRepository(RequestLog)
    private requestLogRepository: Repository<RequestLog>,
    private readonly cls: ClsService
  ) {
    super();
  }

  async process(job: Job<RequestLog>): Promise<void> {

    await this.cls.run(async () => {
      if (job.data.user_id) {
        this.cls.set('userId', job.data.user_id);
      }

      const log = this.requestLogRepository.create(job.data);
      await this.requestLogRepository.save(log);
    });
  }
}
