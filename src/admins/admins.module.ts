import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TokenService } from '../auth/tokens.service';
import { AdminsRepository } from './admins.repository';

@Module({
    controllers: [AdminsController],
    providers: [AdminsService, TokenService, AdminsRepository],
    exports: [AdminsService, AdminsRepository]
})
export class AdminsModule {}
