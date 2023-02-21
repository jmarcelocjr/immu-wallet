import { Module } from '@nestjs/common';
import { databaseProviders } from './database.client';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
