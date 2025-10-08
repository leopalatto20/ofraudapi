import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    let testEmail: string;
    const testPassword = '12345678';
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        testEmail = `test-${Date.now()}@example.com`;
    });

    afterAll(async () => {
        await app.close();
    });

    it('should register a user', async () => {
        const res = await request
            .default(app.getHttpServer())
            .post('/users/register')
            .send({
                name: 'Test',
                lastName1: 'Fortnite',
                lastName2: 'Fortnite',
                email: testEmail,
                password: testPassword
            });

        expect(res.status).toBe(201);
    });

    it('should not register a duplicated user', async () => {
        const res = await request
            .default(app.getHttpServer())
            .post('/users/register')
            .send({
                name: 'Test',
                lastName1: 'Fortnite',
                lastName2: 'Fortnite',
                email: testEmail,
                password: testPassword
            });

        expect(res.status).toBe(409);
    });

    it('should login the new user', async () => {
        const res = await request
            .default(app.getHttpServer())
            .post('/auth/users/login')
            .send({
                email: testEmail,
                password: testPassword
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
        refreshToken = res.body.refreshToken;
    });

    it('should not login an incorrect user', async () => {
        const res = await request
            .default(app.getHttpServer())
            .post('/auth/users/login')
            .send({
                email: testEmail,
                password: testPassword + 'aaa'
            });

        expect(res.status).toBe(401);
    });

    it('should refresh the access token of a user', async () => {
        const res = await request
            .default(app.getHttpServer())
            .post('/auth/users/refresh')
            .send({
                refreshToken: refreshToken
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('accessToken');
        accessToken = res.body.accessToken;
    });

    it('should get the profile of the user', async () => {
        const res = await request
            .default(app.getHttpServer())
            .get('/users/profile')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('lastName1');
    });

    it('should not accept an incorrect token type', async () => {
        const res = await request
            .default(app.getHttpServer())
            .get('/users/profile')
            .set('Authorization', `Bearer ${refreshToken}`);

        expect(res.status).toBe(401);
    });

    it('should modify the data of a user', async () => {
        const res = await request
            .default(app.getHttpServer())
            .patch('/users/update')
            .send({
                name: 'TestModify'
            })
            .set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
    });

    it('should deactivate a user', async () => {
        const res = await request
            .default(app.getHttpServer())
            .patch('/users/deactivate')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
    });
});
