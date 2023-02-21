import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Wallet } from 'src/common/immuWallet.dto';
import { Wallet as WalletEntity } from 'src/entities/Wallet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {

  constructor(
    @InjectRepository(WalletEntity)
    private readonly wallet_repository: Repository<WalletEntity>) {}

  async getAll(user: User): Promise<Wallet[]> {
    const wallets = await this.wallet_repository.findBy({
      user: user
    });

    return wallets.map(wallet => wallet.toProto());
  }

  async get(wallet: Wallet): Promise<Wallet | undefined> {
    const wallet_entity = await this.wallet_repository.findOneBy({
      user: { id: wallet.user_id },
      token: wallet.token
    });

    return wallet_entity.toProto() ?? undefined;
  }

  async create(wallet: Wallet): Promise<boolean> {
    const wallet_entity = this.wallet_repository.create();
    wallet_entity.token = wallet.token;
    wallet_entity.balance = 0;
    wallet_entity.user = { id: wallet.user_id };

    await this.wallet_repository.save(wallet_entity);

    return true;
  }

  async deposit(id: number, value: number): Promise<number> {
    const wallet_entity = await this.wallet_repository.findOneBy({
      id: id
    });

    wallet_entity.balance += value;

    await this.wallet_repository.save(wallet_entity);

    return wallet_entity.balance;
  }

  async withdraw(id: number, value: number): Promise<number> {
    const wallet_entity = await this.wallet_repository.findOneBy({
      id: id
    });

    if (wallet_entity.balance < value) {
      throw new Error(`wallet #${wallet_entity.id} balance isn't enough for this transaction`);
    }

    wallet_entity.balance -= value;

    await this.wallet_repository.save(wallet_entity);

    return wallet_entity.balance;
  }
}
