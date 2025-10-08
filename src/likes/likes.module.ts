import { Module } from '@nestjs/common';
import { LikesRepository } from './likes.repository';

@Module({
    providers: [LikesRepository],
    exports: [LikesRepository]
})
export class LikesModule {}
