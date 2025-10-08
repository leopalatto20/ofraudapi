import { Module } from '@nestjs/common';
import { AdminsModule } from '../admins/admins.module';
import { TokenService } from '../auth/tokens.service';
import { UsersModule } from '../users/users.module';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { StatusModule } from '../status/status.module';
import { CategoriesModule } from '../categories/categories.module';
import { ReportsRepository } from './reports.repository';
import { LikesModule } from 'src/likes/likes.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
    imports: [
        UsersModule,
        AdminsModule,
        StatusModule,
        CategoriesModule,
        LikesModule,
        CommentsModule
    ],
    providers: [TokenService, ReportsService, ReportsRepository],
    exports: [ReportsService],
    controllers: [ReportsController]
})
export class ReportsModule {}
