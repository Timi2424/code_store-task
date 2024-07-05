import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/movies (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/movies')
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Buffer);
  });

  it('/movies/:id (GET)', async () => {
    const movieId = 20;
    const response = await request(app.getHttpServer())
      .get(`/movies/${movieId}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Buffer);
  });
});