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

  async get(wallet: Wallet): Promise<Wallet> {
    const wallet_entity = await this.wallet_repository.findOneBy({
      user: { id: wallet.user_id },
      token: wallet.token
    });

    return wallet_entity.toProto();
  }

  async create(wallet: Wallet): Promise<boolean> {
    const wallet_entity = this.wallet_repository.create();
    wallet_entity.token = wallet.token;
    wallet_entity.balance = 0;
    wallet_entity.user = { id: wallet.user_id };

    await this.wallet_repository.save(wallet_entity);

    return true;
  }

  async update(wallet: Wallet): Promise<boolean> {
    const wallet_entity = await this.wallet_repository.findOneBy({
      id: wallet.id
    });

    wallet_entity.balance = wallet.balance;

    await this.wallet_repository.save(wallet_entity);

    return true;
  }
}
