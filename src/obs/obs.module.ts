import { Module } from '@nestjs/common';
import { ObsService } from './obs.service';
import { ObsController } from './obs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObsStreamKeyEntity } from './entities/obs.entity';
import { ObsStreamKeyRepository } from 'src/interface/impl/obs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ObsStreamKeyEntity])],
  providers: [
    ObsService,
    {
      provide: 'IObsStreamKeyRepository',
      useClass: ObsStreamKeyRepository,
    },
  ],
  controllers: [ObsController],
})
export class ObsModule {}
