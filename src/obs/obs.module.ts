import { Module } from '@nestjs/common';
import { ObsService } from './obs.service';
import { ObsController } from './obs.controller';

@Module({
  providers: [ObsService],
  controllers: [ObsController],
})
export class ObsModule {}
