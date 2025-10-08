export interface BaseUser {
    name: string;
    lastName1: string;
    lastName2: string;
    email: string;
}

export interface CreateUserData extends BaseUser {
    passwordHash: string;
    salt: string;
}

export interface UserData extends BaseUser {
    id: number;
}

export interface UserDb extends UserData {
    password: string;
    salt: string;
    active: boolean;
}

export type UpdateUserData = BaseUser;
