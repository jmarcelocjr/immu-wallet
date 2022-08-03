import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Response, User, Wallet, WalletList } from 'src/common/immu_wallet.dto';
import { WalletService } from './wallet.service';

@Controller()
export class WalletController {
  constructor(private wallet_service: WalletService) {}

  @GrpcMethod('ImmuWallet')
  getWallet(wallet: Wallet): Promise<Wallet> {
    return this.wallet_service.get(wallet);
  }

  @GrpcMethod('ImmuWallet')
  async getWallets(user: User): Promise<WalletList> {
    return {
      wallets: await this.wallet_service.getAll(user),
    };
  }

  @GrpcMethod('ImmuWallet')
  async registerWallet(wallet: Wallet): Promise<Response> {
    const _wallet = await this.wallet_service.get(wallet);

    if (typeof _wallet != 'undefined') {
      return {
        success: true,
        message: 'Already created',
      };
    }

    const result = await this.wallet_service.create(wallet);

    return {
      success: result,
      message: result ? 'Registered Successfully' : 'Something went wrong',
    };
  }
}
