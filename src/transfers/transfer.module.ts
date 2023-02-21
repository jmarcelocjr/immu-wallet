import { Module } from '@nestjs/common';
import { TransactionModule } from 'src/transactions/transaction.module';
import { WalletModule } from 'src/wallets/wallet.module';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
  imports: [WalletModule, TransactionModule],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
