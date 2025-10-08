import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusService } from './status.service';

@ApiTags('Modulo de utilidades de status')
@Controller({ path: 'status', version: '1' })
export class StatusController {
    constructor(private readonly statusesService: StatusService) {}

    @Get('/list')
    @ApiOperation({
        summary: 'Endpoint para obtener los status de reportes'
    })
    @ApiResponse({
        status: 200,
        description: 'Status obtenidos correctamente',
        example: [
            {
                id: 1,
                name: 'Pendiente'
            },
            {
                id: 2,
                name: 'Aceptado'
            },
            {
                id: 3,
                name: 'Rechazado'
            }
        ]
    })
    @ApiResponse({ status: 500, description: 'Error en base de datos' })
    async getStatusList() {
        return await this.statusesService.listStatuses();
    }
}
