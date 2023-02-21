import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

describe('AppController (e2e)', () => {
  // let app: INestApplication;

  // beforeAll(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [AppModule],
  //   }).compile();

  //   app = module.createNestApplication();

  //   app.connectMicroservice({
  //     transport: Transport.GRPC,
  //     options: {
  //       url: process.env.GRPC_URL,
  //       package: 'immuWallet',
  //       protoPath: join(__dirname, '/../proto/app.proto'),
  //       loader: { keepCase: true },
  //       credentials: null,
  //     }
  //   });

  // });

  // beforeEach(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [AppModule],
  //   }).compile();

  //   app = moduleFixture.createNestApplication();
  //   await app.init();
  // });

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });

  const pessoa = ({ name }: { name: string }) => {
    console.log(name);
  }

  pessoa({ name: "a"});

});
