import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'Diego' })
    name: string;
    @ApiPropertyOptional({ example: 'Herrera' })
    lastName1: string;
    @ApiPropertyOptional({ example: 'Olmos' })
    lastName2: string;
    @ApiPropertyOptional({ example: 'A01652570@tec.mx' })
    email: string;
}
