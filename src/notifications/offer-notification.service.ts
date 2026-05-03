import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { OfferMatchingService } from './offer-matching.service';

@Injectable()
export class OfferNotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly offerMatchingService: OfferMatchingService,
  ) {}

  async notifyUsersAboutNewOffers(newJobs: any[]) {
    if (newJobs.length === 0) {
      return;
    }

    const filters = await this.prismaService.userFilter.findMany();

    for (const job of newJobs) {
      const notifiedUserIds = new Set<number>();

      for (const filter of filters) {
        const matches = this.offerMatchingService.matchesFilter(filter, job);

        if (!matches) {
          continue;
        }

        if (notifiedUserIds.has(filter.userId)) {
          continue;
        }

        this.notificationsGateway.emitNewOfferToUser(filter.userId, job);
        notifiedUserIds.add(filter.userId);
      }
    }
  }
}
