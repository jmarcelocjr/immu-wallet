import { Inject, Injectable } from '@nestjs/common';
import ImmudbClient from 'immudb-node';
import { Wallet, Transaction } from 'src/common/immu_wallet.dto';

@Injectable()
export class TransactionService {
  private table_name = 'transactions';

  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: ImmudbClient,
  ) {}

  async getAll(wallet: Wallet): Promise<Transaction[]> {
    const result = await this.db.SQLQuery({
      sql: `SELECT * FROM ${this.table_name} WHERE from_wallet_id = @wallet_id OR to_wallet_id = @wallet_id`,
      params: { wallet_id: wallet.id },
    });

    return result as unknown as Transaction[];
  }

  async create(transaction: Transaction): Promise<boolean> {
    return await this.db
      .SQLExec({
        sql: `INSERT INTO ${this.table_name} (from_wallet_id, to_wallet_id, value, description) VALUES (@from_wallet_id, @to_wallet_id, @value, @description)`,
        params: {
          from_wallet_id: transaction.from.id,
          to_wallet_id: transaction.to.id,
          value: transaction.value,
          description: transaction.description,
        },
      })
      .then(() => true)
      .catch((error) => {
        console.log(error);
        return false;
      });
  }
}
