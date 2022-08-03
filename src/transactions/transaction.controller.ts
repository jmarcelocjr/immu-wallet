import { Controller } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { Transaction, Wallet } from 'src/common/immu_wallet.dto';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transaction_service: TransactionService) {}

  @GrpcStreamMethod('ImmuWallet')
  async getTransactions(wallet: Wallet): Promise<Transaction[]> {
    return this.transaction_service.getAll(wallet);
  }
}
