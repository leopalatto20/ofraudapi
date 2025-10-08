import { ApiProperty } from '@nestjs/swagger';

export class CommentReportDto {
    @ApiProperty({
        example: 'A mi hijo tambien le paso',
        description: 'Contenido del comentario de la publicacion'
    })
    content: string;
}
