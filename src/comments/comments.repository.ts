import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Comment } from 'src/reports/types/report.types';

@Injectable()
export class CommentsRepository {
    constructor(private readonly db: DbService) {}

    async commentReport(
        reportId: number,
        userId: number,
        content: string
    ): Promise<void> {
        const sql = `
            INSERT INTO comment(id_report, id_user, content)
            VALUES(?,?,?);
        `;
        await this.db.getPool().query(sql, [reportId, userId, content]);
    }

    async getReportComments(reportId: number): Promise<Comment[]> {
        const sql = `
            SELECT
                cm.id,
                cm.content,
                u.name,
                u.last_name_1 AS lastName,
                cm.created_at AS createdAt
                FROM comment cm
                INNER JOIN \`user\` u ON cm.id_user = u.id
                WHERE cm.id_report = ?
                ORDER BY cm.created_at DESC;
        `;
        const [rows] = await this.db.getPool().query(sql, [reportId]);
        return rows as Comment[];
    }
}
