import {
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { genSalt, sha256 } from '../utils/hash/hash.util';
import { AdminsRepository } from './admins.repository';
import { AdminData } from './types/admin.types';

@Injectable()
export class AdminsService {
    constructor(private adminsRepository: AdminsRepository) {}

    async countAdmins(): Promise<number> {
        return await this.adminsRepository.count();
    }

    async createDefaultAdmin(): Promise<void> {
        const defaultUsername = 'admin';
        const defaultPassword = 'admin';

        const existingAdmin =
            await this.adminsRepository.findByUsername(defaultUsername);

        if (existingAdmin) {
            return;
        }

        const hash = sha256(defaultPassword);
        const salt = genSalt();
        const hashed_password = sha256(hash + salt);

        await this.adminsRepository.createAdmin({
            username: defaultUsername,
            passwordHash: hashed_password,
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

        const hash = sha256(createAdminDto.password);
        const salt = genSalt();
        const hashed_password = sha256(hash + salt);

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
        const salt = admin.salt;
        const hash = sha256(password);
        const newHash = sha256(hash + salt);
        if (newHash !== hashedPassword) return null;
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
