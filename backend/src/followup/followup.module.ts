import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Followup } from './entities/followup.entity';
import { FollowupService } from './services/followup.service';

@Module({
  imports: [TypeOrmModule.forFeature([Followup])],
  providers: [FollowupService],
  exports: [FollowupService],
})
export class FollowupModule {}
