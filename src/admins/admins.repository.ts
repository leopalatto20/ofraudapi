import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
    AdminData,
    CreateAdminData,
    AdminDb,
    RefreshTokenResponse
} from './types/admin.types';

@Injectable()
export class AdminsRepository {
    constructor(private readonly db: DbService) {}

    async createAdmin(adminData: CreateAdminData): Promise<void> {
        const sql = `INSERT INTO admin(username, password)
        VALUES(?,?);`;

        await this.db
            .getPool()
            .query(sql, [adminData.username, adminData.passwordHash]);
    }

    async count(): Promise<number> {
        const sql = `SELECT count(*) as count from admin;`;
        const [rows] = await this.db.getPool().query(sql);
        const result = rows as { count: number }[];
        return result[0]['count'];
    }

    async getProfile(id: number): Promise<AdminData> {
        const sql = `SELECT id, username FROM admin WHERE id = ? LIMIT 1;`;
        const [rows] = await this.db.getPool().query(sql, [id]);
        const result = rows as AdminData[];
        return result[0];
    }

    async findById(id: number): Promise<AdminDb | null> {
        const sql = `SELECT * FROM admin WHERE id = ? LIMIT 1;`;
        const [rows] = await this.db.getPool().query(sql, [id]);
        const result = rows as AdminDb[];
        return result[0] || null;
    }

    async findByUsername(username: string): Promise<AdminDb | null> {
        const sql = `SELECT * FROM admin WHERE username = ? LIMIT 1;`;
        const [rows] = await this.db.getPool().query(sql, [username]);
        const result = rows as AdminDb[];
        return result[0] || null;
    }

    async deleteAdmin(id: number): Promise<void> {
        const sql = `DELETE FROM admin WHERE id = ?;`;
        await this.db.getPool().query(sql, [id]);
    }

    async getAdmins(id: number): Promise<AdminData[]> {
        const sql = `SELECT id, username FROM admin WHERE id <> ?;`;
        const [rows] = await this.db.getPool().query(sql, [id]);
        return rows as AdminData[];
    }

    async getRefreshToken(id: number): Promise<string> {
        const sql = `SELECT refresh_token AS refreshToken FROM admin WHERE id = ? LIMIT 1;`;
        const [rows] = await this.db.getPool().query(sql, [id]);
        const result = rows as RefreshTokenResponse[];
        return result[0].refreshToken || '';
    }

    async setRefreshToken(id: number, refreshToken: string): Promise<void> {
        const sql = `UPDATE admin SET refresh_token = ? WHERE id = ?;`;
        await this.db.getPool().query(sql, [refreshToken, id]);
    }

    async clearRefreshToken(id: number): Promise<void> {
        const sql = `UPDATE admin SET refresh_token = NULL WHERE id = ?;`;
        await this.db.getPool().query(sql, [id]);
    }
}
