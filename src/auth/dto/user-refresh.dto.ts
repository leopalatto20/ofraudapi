import { ApiProperty } from '@nestjs/swagger';

export class UserRefreshDto {
    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOCIsInR5cGUiOiJh',
        description: 'Refresh token de usuario asignado en login'
    })
    refreshToken: string;
}
