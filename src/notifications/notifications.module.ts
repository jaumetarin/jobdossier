import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { AuthModule } from '../auth/auth.module';
import { OfferNotificationService } from './offer-notification.service';
import { OfferMatchingService } from './offer-matching.service';  
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [
    NotificationsGateway,
    OfferNotificationService,
    OfferMatchingService
  ],
  exports: [NotificationsGateway, OfferNotificationService],
})
export class NotificationsModule {}
