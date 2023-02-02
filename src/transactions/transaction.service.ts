import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet, Transaction } from 'src/common/immuWallet.dto';
import { Wallet as WalletEntity } from 'src/entities/Wallet.entity';
import { Transaction as TransactionEntity } from 'src/entities/Transaction.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(WalletEntity)
    private readonly wallet_repository: Repository<WalletEntity>,
    private readonly transaction_repository: Repository<TransactionEntity>,
    private data_source: DataSource) {}

  async getAll(wallet: Wallet): Promise<Transaction[]> {
    const transactions = await this.transaction_repository.createQueryBuilder('t')
      .innerJoin('t.wallet', 'w')
      .where('w.id = :id', { id: wallet.id})
      .getMany();

    return transactions.map(transaction => transaction.toProto());
  }

  async create(transaction: Transaction): Promise<boolean> {
    const [from_wallet, to_wallet] = await Promise.all([
      this.wallet_repository.findOneBy({id: transaction.from.id}),
      this.wallet_repository.findOneBy({id: transaction.to.id})
    ]);

    const from_transaction = new TransactionEntity();
    from_transaction.wallet = from_wallet;
    from_transaction.related_wallet = to_wallet;
    from_transaction.type = 'debit';
    from_transaction.value = transaction.value * (-1);
    from_transaction.description = transaction.description;

    const to_transaction = new TransactionEntity();
    to_transaction.wallet = to_wallet;
    to_transaction.related_wallet = from_wallet;
    to_transaction.type = 'credit';
    to_transaction.value = transaction.value;
    to_transaction.description = transaction.description;

    await this.data_source.transaction(async (entity_manager) => {
      await entity_manager.save([from_transaction, to_transaction]);
    });

    return true;
  }
}
