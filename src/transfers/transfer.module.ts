import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TransactionModule } from 'src/transactions/transaction.module';
import { WalletModule } from 'src/wallets/wallet.module';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
  imports: [DatabaseModule, WalletModule, TransactionModule],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
