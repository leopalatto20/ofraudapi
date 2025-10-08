import {
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { checkHash, createHash } from '../utils/hash/hash.util';
import { AdminsRepository } from './admins.repository';
import { AdminData } from './types/admin.types';

@Injectable()
export class AdminsService {
    constructor(private readonly adminsRepository: AdminsRepository) {}

    async countAdmins(): Promise<number> {
        return await this.adminsRepository.count();
    }

    async createDefaultAdmin(): Promise<void> {
        const defaultUsername = process.env.DEFAULT_USER;
        const defaultPassword = process.env.DEFAULT_PASSWORD;

        if (!defaultUsername || !defaultPassword) return;

        const existingAdmin =
            await this.adminsRepository.findByUsername(defaultUsername);

        if (existingAdmin) {
            return;
        }

        const hashedPassword = await createHash(defaultPassword);
        const salt = 'salt';

        await this.adminsRepository.createAdmin({
            username: defaultUsername,
            passwordHash: hashedPassword,
            salt: salt
        });
    }

    async createAdmin(createAdminDto: CreateAdminDto): Promise<void> {
        const existingAdmin = await this.adminsRepository.findByUsername(
            createAdminDto.username
        );

        if (existingAdmin) {
            throw new ConflictException('Username already in use');
        }

        const hashed_password = await createHash(createAdminDto.password);
        const salt = 'salt';

        await this.adminsRepository.createAdmin({
            username: createAdminDto.username,
            passwordHash: hashed_password,
            salt: salt
        });
    }

    async validateAdmin(
        username: string,
        password: string
    ): Promise<AdminData | null> {
        const admin = await this.adminsRepository.findByUsername(username);
        if (!admin) return null;
        const hashedPassword = admin.password;
        const success = await checkHash(hashedPassword, password);
        if (!success) return null;
        return admin;
    }

    async deleteAdmin(id: number): Promise<void> {
        await this.adminsRepository.deleteAdmin(id);
    }

    async getProfile(id: number): Promise<AdminData> {
        const admin = await this.adminsRepository.getProfile(id);
        if (!admin) {
            throw new NotFoundException('Administrador no encontrado');
        }

        return admin;
    }

    async findById(id: number): Promise<AdminData | null> {
        return await this.adminsRepository.findById(id);
    }

    async getAdminList(id: number): Promise<AdminData[]> {
        return await this.adminsRepository.getAdmins(id);
    }

    async getRefreshToken(id: number): Promise<string> {
        return await this.adminsRepository.getRefreshToken(id);
    }

    async setRefreshToken(id: number, refreshToken: string): Promise<void> {
        return await this.adminsRepository.setRefreshToken(id, refreshToken);
    }

    async clearRefreshToken(id: number): Promise<void> {
        return await this.adminsRepository.clearRefreshToken(id);
    }
}
