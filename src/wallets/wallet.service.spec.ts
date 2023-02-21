import 'dotenv/config';
import { Test } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/entities/Wallet.entity';
import { User } from 'src/entities/User.entity';
import { UserService } from 'src/users/user.service';

describe('WalletService', () => {
  let wallet_service: WalletService;
  let user: User;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
          TypeOrmModule.forFeature([Wallet, User]),
          TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: 'test',
            entities: [__dirname + '/../entities/*.entity.{js,ts}'],
            synchronize: true,
          })
      ],
      providers: [WalletService, UserService]
    }).compile();

    wallet_service = module.get<WalletService>(WalletService);

    user = await module.get<UserService>(UserService).create({
      id: 1
    });
  })

  beforeEach(async () => {
  });

  it('should create a wallet', async () => {
    // jest.spyOn(wallet_service, 'get').mockImplementation(async () => undefined);
    // jest.spyOn(wallet_service, 'create').mockImplementation(async () => true);

    const result = await wallet_service.create({
        user_id: user.id,
        token: "BRL"
    });

    expect(result).toBe(true);
  });

});
