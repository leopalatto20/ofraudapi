import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class LikesRepository {
    constructor(private readonly db: DbService) {}

    async likeReport(reportId: number, userId: number): Promise<void> {
        const sql = `
            INSERT INTO \`like\` (id_report, id_user)
            VALUES (?, ?);`;
        await this.db.getPool().query(sql, [reportId, userId]);
    }

    async unlikeReport(reportId: number, userId: number): Promise<void> {
        const sql = `
            DELETE FROM \`like\`
            WHERE id_report = ? AND id_user = ?;`;
        await this.db.getPool().query(sql, [reportId, userId]);
    }
}
