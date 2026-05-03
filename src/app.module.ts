import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FetcherModule } from './fetcher/fetcher.module';
import { BullModule } from '@nestjs/bullmq';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from "./auth/auth.module";
import { FiltersModule } from './filters/filters.module';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    PrismaModule,
    AuthModule,
    FiltersModule,
    OffersModule,
    FetcherModule,
    NotificationsModule,
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
