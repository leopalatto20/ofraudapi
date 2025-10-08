import { Module } from '@nestjs/common';
import { TokenService } from './tokens.service';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminsModule } from '../admins/admins.module';

@Module({
    imports: [UsersModule, AdminsModule],
    providers: [TokenService, AuthService],
    controllers: [AuthController],
    exports: [TokenService, AuthService]
})
export class AuthModule {}
