import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { WalletService } from 'src/wallets/wallet.service';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
