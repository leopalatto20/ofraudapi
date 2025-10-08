import { ApiProperty } from '@nestjs/swagger';

export class EvaluateReportDto {
    @ApiProperty({
        example: 1,
        description: 'ID del reporte a evaluar'
    })
    reportId: number;
    @ApiProperty({
        example: 1,
        description: 'Id del status al que se quiere cambiar el reporte'
    })
    statusId: number;
}
