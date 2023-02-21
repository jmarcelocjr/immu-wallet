import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/immuWallet.dto';
import { User as UserEntity } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly user_repository: Repository<UserEntity>
  ) {}

  async create(user: User): Promise<UserEntity> {
    let user_entity = await this.user_repository.findOneBy({
        id: user.id
    });

    if (user_entity instanceof UserEntity) {
        return user_entity;
    }

    user_entity = this.user_repository.create({
        id: user.id
    });

    await this.user_repository.save(user_entity);

    return user_entity;
  }
}
