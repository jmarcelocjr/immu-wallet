import { Injectable } from '@nestjs/common';
import { Transfer } from 'src/common/immuWallet.dto';
import { TransactionService } from 'src/transactions/transaction.service';
import { WalletService } from 'src/wallets/wallet.service';
import { DataSource } from 'typeorm';

@Injectable()
export class TransferService {
  constructor(
    private readonly wallet_service: WalletService,
    private readonly transaction_service: TransactionService
  ) {}

  async transfer(transfer: Transfer): Promise<boolean> {
    const [from_wallet, to_wallet] = await Promise.all([
      this.wallet_service.get(transfer.from),
      this.wallet_service.get(transfer.to)
    ]);

    if (typeof from_wallet == 'undefined' || typeof to_wallet == 'undefined') {
      throw new Error('from or to wallet not found');
    }

    if (from_wallet.token != to_wallet.token) {
      throw new Error('Tokens does not match between the wallets');
    }

    if (from_wallet.balance ?? 0 < transfer.value) {
      throw new Error("from wallet balance isn't enough for this transaction");
    }

    this.wallet_service.withdraw(from_wallet.id, transfer.value);

    const results = await Promise.all([
      this.wallet_service.deposit(to_wallet.id, transfer.value),
      this.transaction_service.create(transfer),
    ]);

    return true;
  }
}
