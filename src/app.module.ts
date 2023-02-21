import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transactions/transaction.module';
import { TransferModule } from './transfers/transfer.module';
import { UserModule } from './users/user.module';
import { WalletModule } from './wallets/wallet.module';

@Module({
  imports: [
    UserModule,
    WalletModule,
    TransferModule,
    TransactionModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/entities/*.entity.{js,ts}'],
      synchronize: process.env.ENV != 'production',
    }),
],
  controllers: [],
  providers: [],
})
export class AppModule {}
