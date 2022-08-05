import { Module } from '@nestjs/common';
import { DatabaseClient } from './database.client';

@Module({
  providers: [DatabaseClient],
  exports: [DatabaseClient],
})
export class DatabaseModule {}
