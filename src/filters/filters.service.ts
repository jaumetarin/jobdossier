import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFilterDto } from './dto/create-filter.dto';

@Injectable()
export class FiltersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: number, createFilterDto: CreateFilterDto) {
    const { keyword, location, modality } = createFilterDto;

    const isEmptyFilter =
      !keyword?.trim() &&
      !location?.trim() &&
      !modality?.trim();

    if (isEmptyFilter) {
      throw new BadRequestException(
        'At least one filter field must be provided',
      );
    }

    return this.prismaService.userFilter.create({
      data: {
        userId,
        keyword: keyword?.trim(),
        location: location?.trim(),
        modality: modality?.trim(),
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.prismaService.userFilter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(userId: number, filterId: number) {
    const filter = await this.prismaService.userFilter.findUnique({
      where: { id: filterId },
    });

    if (!filter || filter.userId !== userId) {
      throw new NotFoundException(`Filter with id ${filterId} not found`);
    }

    await this.prismaService.userFilter.delete({
      where: { id: filterId },
    });

    return {
      message: 'Filter deleted successfully',
    };
  }
}
