import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminsModule } from './admins/admins.module';
import { ImagesModule } from './files/images.module';
import { ReportsModule } from './reports/reports.module';
import { StatusModule } from './status/status.module';
import { CategoriesModule } from './categories/categories.module';
import { InitializationModule } from './initialization/initialization.module';
import { DbModule } from './db/db.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 20
            }
        ]),
        UsersModule,
        AuthModule,
        AdminsModule,
        ImagesModule,
        ReportsModule,
        StatusModule,
        CategoriesModule,
        InitializationModule,
        DbModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
