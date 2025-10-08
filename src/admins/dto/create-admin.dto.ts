import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
    @ApiProperty({ example: 'JorgeGamerXx' })
    username: string;
    @ApiProperty({ example: 'J0rg3g4mer#1' })
    password: string;
}
