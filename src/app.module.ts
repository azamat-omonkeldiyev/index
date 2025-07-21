import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { EnumModule } from './enum/enum.module';
import { MulterController } from './multer/multer.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ConsultationModule } from './consultation/consultation.module';
import { SiteModule } from './site/site.module';

@Module({
  imports: [AdminModule, PrismaModule, EnumModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
    ProductModule,
    CategoryModule,
    OrderModule,
    ConsultationModule,
    SiteModule,
  ],
  controllers: [AppController, MulterController],
  providers: [AppService],
})
export class AppModule {}
