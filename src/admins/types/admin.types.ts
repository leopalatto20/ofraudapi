export interface BaseAdmin {
    username: string;
}

export interface CreateAdminData extends BaseAdmin {
    passwordHash: string;
    salt: string;
}

export interface AdminData extends BaseAdmin {
    id: number;
}

export interface AdminDb extends AdminData {
    password: string;
    salt: string;
}

export interface RefreshTokenResponse {
    refreshToken: string;
}
