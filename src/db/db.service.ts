import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    onModuleInit(): void {
        this.pool = createPool({
            port: Number(process.env.DB_PORT),
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    }

    async onModuleDestroy(): Promise<void> {
        await this.pool.end();
    }

    getPool(): Pool {
        return this.pool;
    }
}
