import {
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { checkHash, createHash } from '../utils/hash/hash.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { UpdateUserData, UserData, UserDb } from './types/user.types';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async createUser(createUserDto: CreateUserDto): Promise<void> {
        const existingUser = await this.usersRepository.findByEmail(
            createUserDto.email
        );

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await createHash(createUserDto.password);
        const salt = 'test';

        await this.usersRepository.createUser({
            name: createUserDto.name,
            lastName1: createUserDto.lastName1,
            lastName2: createUserDto.lastName2,
            email: createUserDto.email,
            passwordHash: hashedPassword,
            salt
        });
    }

    async getProfile(id: number): Promise<UserData> {
        const user = await this.usersRepository.getProfile(id);

        if (!user) {
            throw new NotFoundException('El usuario no fue encontrado');
        }
        return user;
    }

    async findById(id: number): Promise<UserDb | null> {
        const user = await this.usersRepository.findById(id);
        if (!user) return null;
        return user;
    }

    async validateUser(
        email: string,
        password: string
    ): Promise<UserDb | null> {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) return null;
        const hashedPassword = user.password;
        const correct = await checkHash(hashedPassword, password);
        if (!correct) return null;
        if (!user.active) return null;
        return user;
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const updateUserData: UpdateUserData = { ...updateUserDto };
        if (!updateUserDto.name) {
            updateUserData.name = user.name;
        }
        if (!updateUserDto.lastName1) {
            updateUserData.lastName1 = user.lastName1;
        }
        if (!updateUserDto.lastName2) {
            updateUserData.lastName2 = user.lastName2;
        }
        if (!updateUserDto.email) {
            updateUserData.email = user.email;
        }

        await this.usersRepository.updateUser(id, updateUserData);
    }

    async deactivateUser(id: number): Promise<void> {
        await this.usersRepository.deactivateUser(id);
    }

    async getRefreshToken(id: number): Promise<string> {
        return await this.usersRepository.getRefreshToken(id);
    }

    async setRefreshToken(id: number, token: string): Promise<void> {
        await this.usersRepository.setRefreshToken(id, token);
    }

    async clearRefreshToken(id: number): Promise<void> {
        await this.usersRepository.clearRefreshToken(id);
    }
}
