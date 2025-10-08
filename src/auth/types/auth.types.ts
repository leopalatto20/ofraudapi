export type ActorType = 'user' | 'admin';

export interface AccessTokenPayload {
    sub: number;
    type: 'access';
    actor: ActorType;
}

export interface RefreshTokenPayload {
    sub: number;
    type: 'refresh';
    actor: ActorType;
}

export type TokenPair = {
    accessToken: string;
    refreshToken: string;
};

export type RefreshResponse = {
    accessToken: string;
};

export interface DecodedToken {
    sub: number;
    type: string;
    actor: string;
    iat: number;
    exp: number;
}
