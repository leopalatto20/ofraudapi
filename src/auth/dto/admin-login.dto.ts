import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
    @ApiProperty({ example: 'leotefortnite123' })
    username: string;
    @ApiProperty({ example: 'Soytwink51321' })
    password: string;
}
