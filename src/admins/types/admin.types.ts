export interface BaseAdmin {
    username: string;
}

export interface CreateAdminData extends BaseAdmin {
    passwordHash: string;
}

export interface AdminData extends BaseAdmin {
    id: number;
}

export interface AdminDb extends AdminData {
    password: string;
}

export interface RefreshTokenResponse {
    refreshToken: string;
}
