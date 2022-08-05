import { Inject, Injectable } from '@nestjs/common';
import ImmudbClient from 'immudb-node';
import { Wallet, Transaction } from 'src/common/immu_wallet.dto';
import { DatabaseClient } from 'src/database/database.client';

@Injectable()
export class TransactionService {
  private table_name = 'transactions';

  constructor(private readonly db: DatabaseClient<Transaction>) {}

  async getAll(wallet: Wallet): Promise<Transaction[]> {
    return this.db.findBy(this.table_name, [
      { from_wallet_id: wallet.id },
      { to_wallet_id: wallet.id }
    ]);
  }

  async create(transaction: Transaction): Promise<boolean> {
    return this.db.create(this.table_name, {
      from_wallet_id: transaction.from.id,
      to_wallet_id: transaction.to.id,
      value: transaction.value,
      description: transaction.description,
    });

    return null;
  }
}
