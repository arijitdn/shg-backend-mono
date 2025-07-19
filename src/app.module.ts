import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClfModule } from './clf/clf.module';
import { CoreModule } from '@app/common/core';
import { ShgModule } from './shg/shg.module';
import { VoModule } from './vo/vo.module';
import { ProductsModule } from './products/products.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { OrderModule } from './order/order.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    ShgModule,
    VoModule,   
    ClfModule,
    ProductsModule,
    AnalyticsModule,
    OrderModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
