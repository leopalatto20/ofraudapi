import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { StatusData } from './types/status.types';

@Injectable()
export class StatusRepository {
    constructor(private readonly db: DbService) {}

    async createStatus(name: string): Promise<void> {
        const sql = `INSERT INTO status(name)
        VALUES(?);`;

        await this.db.getPool().query(sql, [name]);
    }

    async getStatus(): Promise<StatusData[]> {
        const sql = `SELECT id, name FROM status;`;
        const [rows] = await this.db.getPool().query(sql);
        return rows as StatusData[];
    }

    async findByName(name: string): Promise<StatusData | null> {
        const sql = `SELECT * FROM status WHERE name = ? LIMIT 1;`;
        const [rows] = await this.db.getPool().query(sql, [name]);
        const result = rows as StatusData[];
        return result[0] || null;
    }
}
