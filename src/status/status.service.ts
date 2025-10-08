import { Injectable } from '@nestjs/common';
import { StatusRepository } from './status.repository';

@Injectable()
export class StatusService {
    constructor(private readonly statusRepository: StatusRepository) {}

    async listStatuses() {
        return await this.statusRepository.getStatus();
    }
}
