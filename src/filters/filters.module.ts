import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';

@Module({
  imports: [PrismaModule],
  controllers: [FiltersController],
  providers: [FiltersService],
  exports: [],
})
export class FiltersModule {}
