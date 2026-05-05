import { NotFoundException } from '@nestjs/common';
import { OffersService } from './offers.service';

describe('OffersService', () => {
  const prismaService = {
    jobOffer: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  let service: OffersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OffersService(prismaService as never);
  });

  it('builds the expected query and pagination for findAll', async () => {
    prismaService.jobOffer.findMany.mockResolvedValue([]);
    prismaService.jobOffer.count.mockResolvedValue(0);

    await service.findAll({
      page: '2',
      limit: '10',
      location: 'Madrid',
      modality: 'remote',
      technology: 'react',
      search: 'frontend',
    });

    expect(prismaService.jobOffer.findMany).toHaveBeenCalledWith({
      where: {
        location: {
          contains: 'Madrid',
          mode: 'insensitive',
        },
        modality: {
          contains: 'remote',
          mode: 'insensitive',
        },
        technologies: {
          has: 'react',
        },
        OR: [
          {
            title: {
              contains: 'frontend',
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: 'frontend',
              mode: 'insensitive',
            },
          },
          {
            technologiesRaw: {
              contains: 'frontend',
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: [
        {
          publishedAt: {
            sort: 'desc',
            nulls: 'last',
          },
        },
        { createdAt: 'desc' },
      ],
      skip: 10,
      take: 10,
    });

    expect(prismaService.jobOffer.count).toHaveBeenCalledWith({
      where: {
        location: {
          contains: 'Madrid',
          mode: 'insensitive',
        },
        modality: {
          contains: 'remote',
          mode: 'insensitive',
        },
        technologies: {
          has: 'react',
        },
        OR: [
          {
            title: {
              contains: 'frontend',
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: 'frontend',
              mode: 'insensitive',
            },
          },
          {
            technologiesRaw: {
              contains: 'frontend',
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  });

  it('clamps page and limit to safe values', async () => {
    prismaService.jobOffer.findMany.mockResolvedValue([]);
    prismaService.jobOffer.count.mockResolvedValue(0);

    const result = await service.findAll({
      page: '0',
      limit: '999',
    });

    expect(prismaService.jobOffer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 100,
      }),
    );

    expect(result.pagination).toEqual({
      page: 1,
      limit: 100,
      total: 0,
    });
  });

  it('returns the offer when findOne finds it', async () => {
    const offer = {
      id: 3,
      title: 'React Developer',
    };

    prismaService.jobOffer.findUnique.mockResolvedValue(offer);

    await expect(service.findOne(3)).resolves.toEqual(offer);
  });

  it('throws NotFoundException when findOne does not find the offer', async () => {
    prismaService.jobOffer.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
  });
});
