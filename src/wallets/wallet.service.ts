import { Injectable } from '@nestjs/common';
import { User, Wallet } from 'src/common/immuWallet.dto';
import { DatabaseClient } from 'src/database/database.client';

@Injectable()
export class WalletService {
  private table_name = 'wallets';

  constructor(private readonly db: DatabaseClient<Wallet>) {}

  async getAll(user: User): Promise<Wallet[]> {
    return this.db.findBy(this.table_name, {
      user_id: user.id
    });

  }

  async get(wallet: Wallet): Promise<Wallet> {
    return this.db.findOneBy(this.table_name, {
      user_id: wallet.user_id,
      token: wallet.token
    });
  }

  async create(wallet: Wallet): Promise<boolean> {
    return this.db.create(this.table_name, {
      user_id: wallet.user_id,
      token: wallet.token,
      balance: 0
    });
  }

  async update(wallet: Wallet): Promise<boolean> {
    return this.db.update(
      this.table_name,
      {
        balance: wallet.balance
      },
      {
        id: wallet.id
      }
    );
  }
}
