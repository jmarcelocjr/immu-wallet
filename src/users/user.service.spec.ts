import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';

describe('UserService', () => {
  let user_service: UserService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
          TypeOrmModule.forFeature([User]),
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            entities: [__dirname + '/../entities/*.entity.{js,ts}'],
            synchronize: true,
          })
      ],
      providers: [UserService]
    }).compile();

    user_service = module.get<UserService>(UserService);
  })

  beforeEach(async () => {
  });

  it('should create an user', async () => {
    // jest.spyOn(user_service, 'get').mockImplementation(async () => undefined);
    // jest.spyOn(user_service, 'create').mockImplementation(async () => true);

    const result = await user_service.create({
        id: 1
    });

    expect(result.id).toBe(1);
  });

});
