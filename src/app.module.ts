import { Module } from '@nestjs/common';
import { TransactionModule } from './transactions/transaction.module';
import { TransferModule } from './transfers/transfer.module';
import { WalletModule } from './wallets/wallet.module';

@Module({
  imports: [WalletModule, TransferModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
