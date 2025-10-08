import { Request } from 'express';

export interface AuthenticatedUser {
    id: number;
    actor: 'user' | 'admin';
}

export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}
