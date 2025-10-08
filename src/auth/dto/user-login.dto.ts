import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
    @ApiProperty({ example: 'leote@gmail.com' })
    email: string;
    @ApiProperty({ example: 'megustanlosfemboys' })
    password: string;
}
