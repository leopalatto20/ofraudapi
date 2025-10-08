import { ApiProperty } from '@nestjs/swagger';

export class UserLogoutDto {
    @ApiProperty({
        description: 'Refresh token del usuario',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    refreshToken: string;
}
