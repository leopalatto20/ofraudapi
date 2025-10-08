import {
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersService } from '../users/users.service';
import { TokenService } from './tokens.service';
import { AdminsService } from '../admins/admins.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UserRefreshDto } from './dto/user-refresh.dto';
import { RefreshResponse, TokenPair } from './types/auth.types';
import { checkHash, createHash } from 'src/utils/hash/hash.util';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly tokenService: TokenService,
        private readonly adminsService: AdminsService
    ) {}

    async loginUser(userLoginDto: UserLoginDto): Promise<TokenPair> {
        const user = await this.usersService.validateUser(
            userLoginDto.email,
            userLoginDto.password
        );
        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        const accessToken = await this.tokenService.generateAccessToken(
            user.id,
            'user'
        );
        const refreshToken = await this.tokenService.generateRefreshToken(
            user.id,
            'user'
        );

        const hashedToken = await createHash(refreshToken);

        await this.usersService.setRefreshToken(user.id, hashedToken);

        return {
            accessToken,
            refreshToken
        };
    }

    async refreshUserToken(
        refreshTokenDto: UserRefreshDto
    ): Promise<RefreshResponse> {
        const payload = await this.tokenService.verifyRefreshToken(
            refreshTokenDto.refreshToken
        );

        if (payload.actor !== 'user') {
            throw new UnauthorizedException('Tipo de usuario no permitido');
        }

        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const refreshToken = await this.usersService.getRefreshToken(user.id);
        if (
            refreshToken == '' ||
            !(await checkHash(refreshToken, refreshTokenDto.refreshToken))
        ) {
            throw new UnauthorizedException('Token inválido');
        }

        const accessToken = await this.tokenService.generateAccessToken(
            user.id,
            'user'
        );

        return {
            accessToken
        };
    }

    async logoutUser(refreshToken: string): Promise<void> {
        try {
            const payload = this.tokenService.decodeRefreshToken(refreshToken);
            if (payload && payload.sub) {
                await this.usersService.clearRefreshToken(payload.sub);
            } else {
                throw new UnauthorizedException('Refresh token inválido');
            }
        } catch {
            throw new UnauthorizedException('Refresh token inválido');
        }
    }

    async loginAdmin(dto: AdminLoginDto): Promise<TokenPair> {
        const admin = await this.adminsService.validateAdmin(
            dto.username,
            dto.password
        );
        if (!admin) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const accessToken = await this.tokenService.generateAccessToken(
            admin.id,
            'admin'
        );
        const refreshToken = await this.tokenService.generateRefreshToken(
            admin.id,
            'admin'
        );

        const hashedToken = await createHash(refreshToken);

        await this.adminsService.setRefreshToken(admin.id, hashedToken);

        return {
            accessToken,
            refreshToken
        };
    }

    async refreshAdminToken(
        refreshTokenDto: UserRefreshDto
    ): Promise<RefreshResponse> {
        const payload = await this.tokenService.verifyRefreshToken(
            refreshTokenDto.refreshToken
        );

        if (payload.actor !== 'admin') {
            throw new UnauthorizedException('Tipo de usuario no permitido');
        }

        const admin = await this.adminsService.findById(payload.sub);
        if (!admin) {
            throw new NotFoundException('Administrador no encontrado');
        }

        const refreshToken = await this.adminsService.getRefreshToken(admin.id);
        if (
            refreshToken == '' ||
            !(await checkHash(refreshToken, refreshTokenDto.refreshToken))
        ) {
            throw new UnauthorizedException('Token inválido');
        }

        const accessToken = await this.tokenService.generateAccessToken(
            admin.id,
            'admin'
        );

        return {
            accessToken
        };
    }

    async logoutAdmin(refreshToken: string): Promise<void> {
        try {
            const payload = this.tokenService.decodeRefreshToken(refreshToken);
            if (payload && payload.sub) {
                await this.adminsService.clearRefreshToken(payload.sub);
            } else {
                throw new UnauthorizedException('Refresh token inválido');
            }
        } catch {
            throw new UnauthorizedException('Refresh token inválido');
        }
    }
}
