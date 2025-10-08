import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../../auth/tokens.service';
import { AuthenticatedRequest } from '../interfaces/authenticated-requests';

@Injectable()
export class AdminsAuthGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<AuthenticatedRequest>();

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Token no encontrado');
        }

        const payload = await this.tokenService.verifyAccessToken(token);

        if (payload.actor !== 'admin') {
            throw new ForbiddenException('Tipo de usuario no admitido');
        }

        request.user = {
            id: payload.sub,
            actor: payload.actor
        };
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
