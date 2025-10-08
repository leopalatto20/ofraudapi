import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('Modulo de utilidades de categorias')
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
    constructor(private readonly statusesService: CategoriesService) {}

    @Get('/list')
    @ApiOperation({
        summary: 'Endpoint para obtener las categorias de reportes'
    })
    @ApiResponse({
        status: 200,
        description: 'Categorias obtenidos correctamente',
        example: [
            {
                id: 1,
                name: 'Página de internet'
            },
            {
                id: 2,
                name: 'Red social'
            },
            {
                id: 3,
                name: 'Mensaje'
            },
            {
                id: 4,
                name: 'Llamada'
            },
            {
                id: 5,
                name: 'Correo electrónico'
            }
        ]
    })
    @ApiResponse({ status: 500, description: 'Error en base de datos' })
    async getCategoriesList() {
        return await this.statusesService.listCategories();
    }
}
