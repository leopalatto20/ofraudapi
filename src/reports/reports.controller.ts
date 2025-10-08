import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Req,
    UseGuards
} from '@nestjs/common';
import { UsersAuthGuard } from '../common/guards/users-auth.guard';
import { CreateReportDto } from './dto/create-report.dto';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-requests';
import { ReportsService } from './reports.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { AdminsAuthGuard } from 'src/common/guards/admins-auth.guard';
import { EvaluateReportDto } from './dto/evaluate-report.dto';
import { CommentReportDto } from './dto/comment-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@ApiTags('Modulo de reportes')
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}
    @Post('/create')
    @UseGuards(UsersAuthGuard)
    @ApiOperation({ summary: 'Endpoint para crear un nuevo reporte' })
    @ApiResponse({ status: 201, description: 'Reporte creado correctamente' })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    @ApiResponse({ status: 404, description: 'La categoria no existe' })
    @ApiBearerAuth()
    async createReport(
        @Req() req: AuthenticatedRequest,
        @Body() createReportDto: CreateReportDto
    ) {
        await this.reportsService.createReport(req.user.id, createReportDto);
    }

    @Put('/update/:reportId')
    @UseGuards(UsersAuthGuard)
    @ApiOperation({ summary: 'Endpoint para modificar un reporte' })
    @ApiResponse({
        status: 200,
        description: 'Reporte modificado correctamente'
    })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    @ApiBearerAuth()
    async updateReport(
        @Req() req: AuthenticatedRequest,
        @Param('reportId') reportId: number,
        @Body() updateReportDto: UpdateReportDto
    ) {
        await this.reportsService.updateReport(
            req.user.id,
            reportId,
            updateReportDto
        );
    }

    @Get('/history')
    @UseGuards(UsersAuthGuard)
    @ApiOperation({
        summary: 'Endpoint para obtener el historial de reportes de un usuario'
    })
    @ApiResponse({
        status: 200,
        description: 'Historial obtenido correctamente',
        example: [
            {
                id: 4,
                description: 'Aaaaaaaa 121212121 asdasdad holahola',
                url: 'https:estafas.com',
                website: 'estafasgeimer',
                socialMedia: 'Instagram',
                phoneNumber: '121212121',
                createdAt: '2025-10-02T21:58:42.000Z',
                username: 'leotefortnite',
                email: 'A01665462@tec.mx',
                category: 'Página de internet',
                status: 'Pendiente'
            },
            {
                id: 3,
                description: 'Aaaaaaaa 121212121 asdasdad holahola',
                url: 'https:estafas.com',
                website: 'estafotas',
                socialMedia: 'Instagram',
                phoneNumber: '121212121',
                createdAt: '2025-10-02T21:58:37.000Z',
                username: 'leotefortnite',
                email: 'A01665462@tec.mx',
                category: 'Página de internet',
                status: 'Pendiente'
            }
        ]
    })
    @ApiResponse({ status: 401, description: 'No autorizado por JWT' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiBearerAuth()
    async getUserHistory(@Req() req: AuthenticatedRequest) {
        return await this.reportsService.getUserHistory(req.user.id);
    }

    @Get('/feed')
    @UseGuards(UsersAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Endpoint para obtener el feed de reportes' })
    @ApiResponse({
        status: 200,
        description: 'Feed obtenido correctamente',
        example: [
            {
                id: 2,
                category: 'Página de internet',
                createdAt: '2025-10-02T21:58:31.000Z',
                description: 'Aaaaaaaa 121212121 asdasdad asdasdasd',
                image: 'http://localhost:3000/public/uploads/1231231.jpg',
                url: 'https:estafas.com',
                website: 'estafotas',
                socialMedia: 'Instagram',
                username: 'leotefortnite',
                email: 'A01665462@tec.mx',
                phoneNumber: '121212121',
                likesCount: 0,
                commentsCount: 0,
                userLiked: 0
            },
            {
                id: 1,
                category: 'Red social',
                createdAt: '2025-10-02T21:58:27.000Z',
                description: 'Aaaaaaaa asdjalkfjasf asdasdad asdasdasd',
                image: 'http://localhost:3000/public/uploads/1231231.jpg',
                url: 'https:estafas.com',
                website: 'estafotas',
                socialMedia: 'Instagram',
                username: 'leotefortnite',
                email: 'A01665462@tec.mx',
                phoneNumber: '121212121',
                likesCount: 0,
                commentsCount: 0,
                userLiked: 0
            }
        ]
    })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    async getFeed(@Req() req: AuthenticatedRequest) {
        return this.reportsService.getFeed(req.user.id);
    }

    @Get('/search/:search')
    @UseGuards(UsersAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Endpoint para buscar en los reportes' })
    @ApiResponse({
        status: 200,
        description: 'Reportes obtenidos correctamente',
        example: [
            {
                id: 2,
                website: 'estafotas',
                socialMedia: 'Instagram',
                email: 'A01665462@tec.mx',
                phoneNumber: '1231231'
            }
        ]
    })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    async searchReport(@Param('search') searchString: string) {
        return this.reportsService.searchReport(searchString);
    }

    @Get('/pending')
    @UseGuards(AdminsAuthGuard)
    @ApiOperation({
        summary: 'Endpoint para obtener los reportes pendientes'
    })
    @ApiResponse({
        status: 200,
        description: 'Reportes obtenidos correctamente',
        example: [
            {
                id: 4,
                description: 'Aaaaaaaa 121212121 asdasdad holahola',
                url: 'https:estafas.com',
                website: 'estafasgeimer',
                socialMedia: 'Instagram',
                phoneNumber: '121212121',
                createdAt: '2025-10-02T21:58:42.000Z',
                username: 'leotefortnite',
                email: 'A01665462@tec.mx',
                image: 'http://localhost:3000/public/uploads/1231231.jpg',
                category: 'Página de internet'
            }
        ]
    })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    @ApiBearerAuth()
    async getPendingReports() {
        return this.reportsService.getPendingReports();
    }

    @Get('/comments/:reportId')
    @ApiOperation({
        summary: 'Endpoint para obtener los comentarios de un reporte'
    })
    @ApiResponse({
        status: 200,
        description: 'Comentarios obtenidos correctamente',
        example: [
            {
                id: 1,
                content: 'Me paso lo mismo',
                createdAt: '2025-10-02T22:05:00.000Z',
                username: 'leotefortnite'
            }
        ]
    })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    @ApiBearerAuth()
    @UseGuards(UsersAuthGuard)
    async getComments(@Param('reportId') reportId: number) {
        return this.reportsService.getReportComments(reportId);
    }

    @Patch('/evaluate')
    @ApiOperation({
        summary: 'Endpoint para cambiar el status de un reporte'
    })
    @ApiResponse({ status: 200, description: 'Reporte evaluado correctamente' })
    @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    @ApiBearerAuth()
    @UseGuards(AdminsAuthGuard)
    async evaluateReport(@Body() evaluateReportDto: EvaluateReportDto) {
        return this.reportsService.evaluateReport(evaluateReportDto);
    }

    @Post('/like/:reportId')
    @ApiOperation({
        summary: 'Endpoint para dar like a un reporte'
    })
    @ApiResponse({ status: 200, description: 'Like agregado correctamente' })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    @ApiBearerAuth()
    @UseGuards(UsersAuthGuard)
    async likeReport(
        @Param('reportId') reportId: number,
        @Req() req: AuthenticatedRequest
    ) {
        return this.reportsService.likeReport(reportId, req.user.id);
    }

    @Post('/unlike/:reportId')
    @ApiOperation({
        summary: 'Endpoint para quitar like a un reporte'
    })
    @ApiResponse({ status: 200, description: 'Like quitado correctamente' })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    @ApiBearerAuth()
    @UseGuards(UsersAuthGuard)
    async unlikeReport(
        @Param('reportId') reportId: number,
        @Req() req: AuthenticatedRequest
    ) {
        return this.reportsService.unlikeReport(reportId, req.user.id);
    }

    @Post('/comment/:reportId')
    @ApiOperation({ summary: 'Endpoint para comentar un reporte' })
    @ApiResponse({
        status: 201,
        description: 'Reporte comentado correctamente'
    })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    @ApiBearerAuth()
    @UseGuards(UsersAuthGuard)
    async commentReport(
        @Param('reportId') reportId: number,
        @Req() req: AuthenticatedRequest,
        @Body() commentReportDto: CommentReportDto
    ) {
        await this.reportsService.commentReport(
            reportId,
            req.user.id,
            commentReportDto.content
        );
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Endpoint para obtener un reporte completo del historial'
    })
    @ApiResponse({
        status: 200,
        description: 'Reporte obtenido correctamente',
        example: {
            id: 1,
            category: 'Llamada',
            status: 'Pendiente',
            createdAt: '2025-09-29T02:24:10.000Z',
            description: 'Me mataron amigos ayuda',
            image: 'http://localhost:3000/public/uploads/1758854167272.jpeg',
            url: 'https:estafas.com',
            website: 'fortnite',
            socialMedia: 'Instagram',
            username: 'leotefortnitej',
            email: 'leopalatto@fortnite.com',
            phoneNumber: '123213123'
        }
    })
    @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    @ApiBearerAuth()
    @UseGuards(UsersAuthGuard)
    async getReport(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
        return this.reportsService.getById(req.user.id, id);
    }
}
