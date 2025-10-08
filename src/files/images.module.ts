import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { TokenService } from '../auth/tokens.service';

@Module({
    controllers: [ImagesController],
    providers: [TokenService]
})
export class ImagesModule {}
