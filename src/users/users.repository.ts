import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
    CreateUserData,
    UpdateUserData,
    UserData,
    UserDb
} from './types/user.types';

@Injectable()
export class UsersRepository {
    constructor(private readonly db: DbService) {}

    async createUser(userData: CreateUserData): Promise<void> {
        const sql = `INSERT INTO user (name, last_name_1, last_name_2, email, password) 
            VALUES (?,?,?,?,?);`;
        await this.db
            .getPool()
            .query(sql, [
                userData.name,
                userData.lastName1,
                userData.lastName2,
                userData.email,
                userData.passwordHash
            ]);
    }

    async getProfile(id: number): Promise<UserData | null> {
        const sql = `SELECT 
        id, 
        name, 
        last_name_1 as lastName1, 
        last_name_2 as lastName2, 
        email 
    FROM user WHERE id = ? LIMIT 1;`;
        const [rows] = await this.db.getPool().query(sql, [id]);
        const result = rows as UserData[];
        return result[0] || null;
    }

    async findById(id: number): Promise<UserDb | null> {
        const sql = `SELECT 
        id,
        name,
        last_name_1 as lastName1,
        last_name_2 as lastName2,
        email,
        password,
        active
    FROM user WHERE id = ?;`;
        const [rows] = await this.db.getPool().query(sql, [id]);
        const result = rows as UserDb[];
        return result[0] || null;
    }

    async findByEmail(email: string): Promise<UserDb | null> {
        const sql = `SELECT 
        id,
        name,
        last_name_1 as lastName1,
        last_name_2 as lastName2,
        email,
        password,
        active
    FROM user WHERE email = ?;`;
        const [rows] = await this.db.getPool().query(sql, [email]);
        const result = rows as UserDb[];
        return result[0] || null;
    }

    async deactivateUser(id: number): Promise<void> {
        const sql = `UPDATE user SET active = FALSE WHERE id = ?`;
        await this.db.getPool().query(sql, [id]);
    }

    async updateUser(
        id: number,
        updateUserData: UpdateUserData
    ): Promise<void> {
        const sql = `UPDATE user SET name = ?, last_name_1 = ?, last_name_2 = ?, email = ? 
            WHERE id = ?`;
        await this.db
            .getPool()
            .query(sql, [
                updateUserData.name,
                updateUserData.lastName1,
                updateUserData.lastName2,
                updateUserData.email,
                id
            ]);
    }

    async getRefreshToken(id: number): Promise<string> {
        const sql = `SELECT refresh_token AS refreshToken FROM user WHERE id = ? LIMIT 1;`;
        const [rows] = await this.db.getPool().query(sql, [id]);
        const result = rows as { refreshToken: string }[];
        return result[0].refreshToken || '';
    }

    async setRefreshToken(id: number, token: string): Promise<void> {
        const sql = `UPDATE user SET refresh_token = ? WHERE id = ?;`;
        await this.db.getPool().query(sql, [token, id]);
    }

    async clearRefreshToken(id: number): Promise<void> {
        const sql = `UPDATE user SET refresh_token = NULL WHERE id = ?;`;
        await this.db.getPool().query(sql, [id]);
    }
}
