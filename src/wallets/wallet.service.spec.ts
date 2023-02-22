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
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
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

    await wallet_service.create({
      user_id: 1,
      token: "USD"
    })
  })

  beforeEach(async () => {
  });

  it('should create a wallet', async () => {
    const result = await wallet_service.create({
        user_id: user.id,
        token: "BRL"
    });

    expect(result).toBe(true);
  });

  it('should deposit a value to a wallet', async () => {
    const wallet = await wallet_service.get({
      user_id: user.id,
      token: "USD"
    });

    const result = await wallet_service.deposit(wallet.id, 100);

    expect(result).toBe(wallet.balance + 100);
  });

  it('should withdraw a value to a wallet', async () => {
    const wallet = await wallet_service.get({
      user_id: user.id,
      token: "USD"
    });

    const deposit = await wallet_service.deposit(wallet.id, 100);
    const withdraw = await wallet_service.withdraw(wallet.id, 50);

    expect(withdraw).toBe(deposit - 50);
  });

  it('should throw error when withdraw higher than current balance', async () => {
    const wallet = await wallet_service.get({
      user_id: 1,
      token: "USD"
    });

    await expect(wallet_service.withdraw(wallet.id, 999999999999)).rejects.toThrow(`wallet #${wallet.id} balance isn't enough for this transaction`);
  })

});
