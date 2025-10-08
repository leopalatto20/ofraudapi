import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UsersAuthGuard } from '../common/guards/users-auth.guard';

@ApiTags('Modulo de carga de imagenes')
@Controller({ version: '1', path: 'images' })
export class ImagesController {
    @Post('/upload')
    @UseGuards(UsersAuthGuard)
    @ApiOperation({
        summary: 'Endpoint para subir la imagen de un reporte'
    })
    @ApiResponse({
        status: 400,
        description: 'No hay una imagen valida en el request'
    })
    @ApiResponse({ status: 401, description: 'No autorizado por jwt' })
    @ApiResponse({ status: 201, description: 'Imagen guardada correctamente' })
    @ApiBearerAuth()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: join(__dirname, '../../public/uploads'),
                filename: (_req, file, cb) => {
                    const ext = extname(file.originalname);
                    const baseName = Date.now();
                    cb(null, `${baseName}${ext}`);
                }
            }),
            // TODO: Agregar limite de tamanio para subida de archivos
            limits: { fileSize: 7 * 1024 * 1024 },
            fileFilter: (_req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return cb(
                        new BadRequestException('Solo se permiten imagenes'),
                        false
                    );
                }
                cb(null, true);
            }
        })
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No se encontro un archivo');
        }
        const baseUrl = process.env.BASE_URL;
        return {
            fileKey: file.filename,
            url: `${baseUrl}/public/uploads/${file.filename}`
        };
    }
}
