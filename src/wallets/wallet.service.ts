import { Inject, Injectable } from '@nestjs/common';
import ImmudbClient from 'immudb-node';
import { User, Wallet } from 'src/common/immu_wallet.dto';

@Injectable()
export class WalletService {
  private table_name = 'wallets';

  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: ImmudbClient,
  ) {}

  async getAll(user: User): Promise<Wallet[]> {
    const result = await this.db.SQLQuery({
      sql: `SELECT * FROM ${this.table_name} WHERE user_id = @user_id`,
      params: { user_id: user.id },
    });

    return result as unknown as Wallet[];
  }

  async get(wallet: Wallet): Promise<Wallet> {
    const result = await this.db.SQLQuery({
      sql: `SELECT * FROM ${this.table_name} WHERE user_id = @user_id and token = @token`,
      params: { user_id: wallet.user_id, token: wallet.token },
    });

    return result.shift() as unknown as Wallet;
  }

  async create(wallet: Wallet): Promise<boolean> {
    return await this.db
      .SQLExec({
        sql: `INSERT INTO ${this.table_name} (user_id, token, balance) VALUES (@user_id, @token, 0)`,
        params: { user_id: wallet.user_id, token: wallet.token },
      })
      .then(() => true)
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  async update(wallet: Wallet): Promise<boolean> {
    return await this.db
      .SQLExec({
        sql: `UPDATE ${this.table_name} SET balance = @balance WHERE id = @id token`,
        params: { id: wallet.id, balance: wallet.balance },
      })
      .then(() => true)
      .catch((error) => {
        console.log(error);
        return false;
      });
  }
}
