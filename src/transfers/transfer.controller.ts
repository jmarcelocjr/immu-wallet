import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Response, Transfer } from 'src/common/immuWallet.dto';
import { TransferService } from './transfer.service';

@Controller()
export class TransferController {
  constructor(private readonly transfer_service: TransferService) {}

  @GrpcMethod('ImmuWallet')
  async transfer(transfer: Transfer): Promise<Response> {
    const result = await this.transfer_service.transfer(transfer);

    return {
      success: result,
      message: result ? 'Registered Successfully' : 'Something went wrong',
    };
  }
}
