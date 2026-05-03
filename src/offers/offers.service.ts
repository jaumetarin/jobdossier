import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetOffersQueryDto } from './dto/get-offers-query.dto';

@Injectable()
export class OffersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: GetOffersQueryDto) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (safePage - 1) * safeLimit;
  
    const where: any = {};

    if (query.location?.trim()) {
     where.location = {
      contains: query.location.trim(),
      mode: 'insensitive',
    };
    }

    if (query.modality?.trim()) {
      where.modality = {
       contains: query.modality.trim(),
        mode: 'insensitive',
    };
  }

  if (query.technology?.trim()) {
    where.technologies = {
      has: query.technology.trim().toLowerCase(),
    };
  }

  if (query.search?.trim()) {
    const search = query.search.trim();

    where.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        technologiesRaw: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }
    const [items, total] = await Promise.all([
      this.prismaService.jobOffer.findMany({
        where,
        orderBy: [
          { publishedAt: {
            sort: 'desc',
            nulls: 'last',
          } },
          { createdAt: 'desc' },
        ],
        skip,
        take: safeLimit,
      }),
      this.prismaService.jobOffer.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
      },
    };
  }

  async findOne(id: number) {
    const offer = await this.prismaService.jobOffer.findUnique({
      where: { id },
    });

    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found`);
    }

    return offer;
  }
}
