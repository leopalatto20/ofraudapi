import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import {
    Comment,
    DashboardReport,
    FeedReport,
    HistoryReport,
    SearchQueryReport,
    ShortReport
} from './types/report.types';
import { StatusRepository } from 'src/status/status.repository';
import { ReportsRepository } from './reports.repository';
import { EvaluateReportDto } from './dto/evaluate-report.dto';
import { LikesRepository } from 'src/likes/likes.repository';
import { CommentsRepository } from 'src/comments/comments.repository';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
    constructor(
        private readonly reportsRepository: ReportsRepository,
        private readonly statusRepository: StatusRepository,
        private readonly likesRepository: LikesRepository,
        private readonly commentsRepository: CommentsRepository
    ) {}

    async createReport(
        userId: number,
        createReportDto: CreateReportDto
    ): Promise<void> {
        const status = await this.statusRepository.findByName('Pendiente');

        if (!status) {
            throw new NotFoundException('No existe un estatus con ese nombre');
        }

        await this.reportsRepository.createReport(userId, {
            ...createReportDto,
            statusId: status.id
        });
    }

    async updateReport(
        userId: number,
        reportId: number,
        updateReportDto: UpdateReportDto
    ): Promise<void> {
        const newStatus = await this.statusRepository.findByName('Pendiente');

        if (!newStatus) {
            throw new NotFoundException('No existe un estatus con ese nombre');
        }

        await this.reportsRepository.updateReport({
            ...updateReportDto,
            userId,
            reportId,
            statusId: newStatus.id
        });
    }

    async getUserHistory(id: number): Promise<ShortReport[]> {
        return await this.reportsRepository.getUserHistory(id);
    }

    async getById(userId: number, reportId: number): Promise<HistoryReport> {
        const report = await this.reportsRepository.getById(userId, reportId);

        if (!report) {
            throw new NotFoundException('Reporte no encontrado');
        }

        if (report.image) {
            const baseUrl = process.env.BASE_URL;
            report.image = `${baseUrl}/public/uploads/${report.image}`;
        }

        return {
            ...report,
            category: report.category,
            status: report.status
        };
    }

    async searchReport(searchString: string): Promise<SearchQueryReport[]> {
        const status = await this.statusRepository.findByName('Aceptado');
        if (!status) {
            throw new NotFoundException('No existe un status con ese nombre');
        }
        return await this.reportsRepository.searchReport(
            searchString,
            status.id
        );
    }

    async getFeed(userId: number): Promise<FeedReport[]> {
        const status = await this.statusRepository.findByName('Aceptado');
        if (!status) {
            throw new NotFoundException('No existe un status con ese nombre');
        }

        const reports = await this.reportsRepository.getFeedReports(
            status.id,
            userId
        );

        return reports.map((report) => {
            if (report.image) {
                const baseUrl = process.env.BASE_URL;
                report.image = `${baseUrl}/public/uploads/${report.image}`;
            }
            return report;
        });
    }

    async getPendingReports(): Promise<DashboardReport[]> {
        const status = await this.statusRepository.findByName('Pendiente');
        if (!status) {
            throw new NotFoundException('No existe un status con ese nombre');
        }
        const reports = await this.reportsRepository.getPendingReports(
            status.id
        );

        return reports.map((report) => {
            if (report.image) {
                const baseUrl = process.env.BASE_URL;
                console.log(baseUrl);
                report.image = `${baseUrl}/public/uploads/${report.image}`;
            }
            return report;
        });
    }

    async evaluateReport(evaluateReportDto: EvaluateReportDto): Promise<void> {
        await this.reportsRepository.evaluateReport(
            evaluateReportDto.reportId,
            evaluateReportDto.statusId
        );
    }

    async likeReport(reportId: number, userId: number): Promise<void> {
        await this.likesRepository.likeReport(reportId, userId);
    }

    async unlikeReport(reportId: number, userId: number): Promise<void> {
        await this.likesRepository.unlikeReport(reportId, userId);
    }

    async commentReport(
        reportId: number,
        userId: number,
        content: string
    ): Promise<void> {
        await this.commentsRepository.commentReport(reportId, userId, content);
    }

    async getReportComments(reportId: number): Promise<Comment[]> {
        return await this.commentsRepository.getReportComments(reportId);
    }
}
