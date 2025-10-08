import { ApiProperty } from '@nestjs/swagger';

export class AdminRefreshDto {
    @ApiProperty({
        example: '01923shkjfdlaskfa',
        description: 'Refresh token de admin asignado en el login'
    })
    refreshToken: string;
}
