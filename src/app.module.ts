import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FetcherModule } from './fetcher/fetcher.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { FiltersModule } from './filters/filters.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    FiltersModule,
    OffersModule,
    FetcherModule,
    NotificationsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
