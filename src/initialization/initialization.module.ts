import { Module } from '@nestjs/common';
import { InitializationService } from './initialization.service';
import { AdminsModule } from '../admins/admins.module';
import { StatusModule } from 'src/status/status.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
    providers: [InitializationService],
    imports: [AdminsModule, StatusModule, CategoriesModule],
    exports: [InitializationService]
})
export class InitializationModule {}
