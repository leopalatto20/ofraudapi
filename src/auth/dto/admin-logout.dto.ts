import { ApiProperty } from '@nestjs/swagger';

export class AdminLogoutDto {
    @ApiProperty({
        description: 'Refresh token del administrador',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    refreshToken: string;
}
