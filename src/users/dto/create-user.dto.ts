import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'Diego' })
    name: string;
    @ApiProperty({ example: 'Herrera' })
    lastName1: string;
    @ApiProperty({ example: 'Olmos' })
    lastName2: string;
    @ApiProperty({ example: 'A01652570@tec.mx' })
    email: string;
    @ApiProperty({ example: 'megustanlosfemboys123' })
    password: string;
}
