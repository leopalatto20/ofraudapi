import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
    CreateReportData,
    DashboardReport,
    FeedReport,
    HistoryReport,
    SearchQueryReport,
    ShortReport,
    UpdateReportData
} from './types/report.types';

@Injectable()
export class ReportsRepository {
    constructor(private readonly db: DbService) {}

    async createReport(
        userId: number,
        createReportData: CreateReportData
    ): Promise<void> {
        const sql = `
            INSERT INTO report(id_category, id_status, description, url, website,
                social_media, phone_number, id_user, image, username, email, anonymous)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`;
        await this.db
            .getPool()
            .query(sql, [
                createReportData.categoryId,
                createReportData.statusId,
                createReportData.description,
                createReportData.url,
                createReportData.website,
                createReportData.socialMedia,
                createReportData.phoneNumber,
                userId,
                createReportData.imageId,
                createReportData.username,
                createReportData.email,
                createReportData.anonymous
            ]);
    }

    async updateReport(updateReportData: UpdateReportData): Promise<void> {
        const sql = `
            UPDATE report SET 
                id_category = ?, 
                id_status = ?, 
                description = ?, 
                url = ?, 
                website = ?,
                social_media = ?, 
                phone_number = ?, 
                image = ?, 
                username = ?, 
                email = ?, 
                anonymous = ?
            WHERE id = ? AND id_user = ?;
        `;
        await this.db
            .getPool()
            .query(sql, [
                updateReportData.categoryId,
                updateReportData.statusId,
                updateReportData.description,
                updateReportData.url,
                updateReportData.website,
                updateReportData.socialMedia,
                updateReportData.phoneNumber,
                updateReportData.imageId,
                updateReportData.username,
                updateReportData.email,
                updateReportData.anonymous,
                updateReportData.reportId,
                updateReportData.userId
            ]);
    }

    async getUserHistory(id: number): Promise<ShortReport[]> {
        const sql = `
            SELECT r.id,
                r.description,
                r.url,
                r.website,
                r.social_media AS socialMedia,
                r.phone_number AS phoneNumber,
                r.created_at AS createdAt,
                r.username,
                r.email,
                c.name AS category,
                s.name AS status
            FROM report r
            INNER JOIN category c ON r.id_category = c.id
            INNER JOIN status s ON r.id_status = s.id
            WHERE r.id_user = ?
            ORDER BY r.created_at DESC;
        `;
        const [rows] = await this.db.getPool().query(sql, [id]);
        return rows as ShortReport[];
    }

    async getById(userId: number, reportId: number): Promise<HistoryReport> {
        const sql = `
            SELECT r.id,
                r.description,
                r.url,
                r.website,
                r.social_media AS socialMedia,
                r.phone_number AS phoneNumber,
                r.created_at AS createdAt,
                r.username,
                r.email,
                r.image,
                c.name AS category,
                s.name AS status
            FROM report r
            INNER JOIN category c ON r.id_category = c.id
            INNER JOIN status s ON r.id_status = s.id
            WHERE r.id_user = ? AND r.id = ?
            LIMIT 1;
        `;
        const [rows] = await this.db.getPool().query(sql, [userId, reportId]);
        return rows[0] as HistoryReport;
    }

    async searchReport(
        searchString: string,
        statusId: number
    ): Promise<SearchQueryReport[]> {
        const sql = `
            SELECT
                r.id,
                r.website,
                r.social_media AS socialMedia,
                r.email,
                r.phone_number AS phoneNumber
            FROM report r
            INNER JOIN status s ON r.id_status = s.id
            WHERE s.id = ?
            AND (r.description LIKE ?
            OR r.url LIKE ?
            OR r.website LIKE ?
            OR r.social_media LIKE ?
            OR r.phone_number LIKE ?
            OR r.username LIKE ?
            OR r.email LIKE ?)
            ORDER BY r.id ASC;
        `;
        const [rows] = await this.db
            .getPool()
            .query(sql, [
                statusId,
                `%${searchString}%`,
                `%${searchString}%`,
                `%${searchString}%`,
                `%${searchString}%`,
                `%${searchString}%`,
                `%${searchString}%`,
                `%${searchString}%`
            ]);
        return rows as SearchQueryReport[];
    }

    async getFeedReports(
        statusId: number,
        userId: number
    ): Promise<FeedReport[]> {
        const sql = `
        SELECT 
            CASE WHEN r.anonymous = TRUE THEN '' ELSE u.name END AS name,
            CASE WHEN r.anonymous = TRUE THEN '' ELSE u.last_name_1 END AS lastName,
            r.id,
            c.name AS category,
            r.created_at AS createdAt,
            r.description,
            r.image,
            r.url,
            r.website,
            r.social_media AS socialMedia,
            r.username,
            r.email,
            r.phone_number AS phoneNumber,
            (SELECT COUNT(*) 
            FROM \`like\` l 
            WHERE l.id_report = r.id) AS likesCount,
            (SELECT COUNT(*) 
            FROM comment cm 
            WHERE cm.id_report = r.id) AS commentsCount,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM \`like\` ul 
                    WHERE ul.id_report = r.id 
                      AND ul.id_user = ?
                ) THEN TRUE 
                ELSE FALSE 
            END AS userLiked
        FROM report r
        INNER JOIN category c ON r.id_category = c.id
        INNER JOIN status s ON r.id_status = s.id
        INNER JOIN \`user\` u ON r.id_user = u.id
        WHERE s.id = ?
        ORDER BY r.created_at DESC;
        `;
        const [rows] = await this.db.getPool().query(sql, [userId, statusId]);
        return rows as FeedReport[];
    }

    async getPendingReports(statusId: number): Promise<DashboardReport[]> {
        const sql = `
            SELECT r.id,
                CASE WHEN r.anonymous = TRUE THEN '' ELSE u.name END AS name,
                CASE WHEN r.anonymous = TRUE THEN '' ELSE u.last_name_1 END AS lastName,
                r.description,
                r.url,
                r.website,
                r.social_media AS socialMedia,
                r.phone_number AS phoneNumber,
                r.created_at AS createdAt,
                r.username,
                r.email,
                r.image,
                c.name AS category
            FROM report r
            INNER JOIN category c ON r.id_category = c.id
            INNER JOIN status s ON r.id_status = s.id
            INNER JOIN \`user\` u ON r.id_user = u.id
            WHERE s.id = ?
            ORDER BY r.created_at DESC;`;
        const [rows] = await this.db.getPool().query(sql, [statusId]);
        return rows as DashboardReport[];
    }

    async evaluateReport(reportId: number, statusId: number): Promise<void> {
        const sql = `
            UPDATE report
            SET id_status = ?
            WHERE id = ?;`;
        await this.db.getPool().query(sql, [statusId, reportId]);
    }
}
