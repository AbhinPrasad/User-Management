import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/db.config';
import appConfig from './config/app.config';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './common/filters/error.filter';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [appConfig, dbConfig],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: ErrorFilter }],
})
export class AppModule {}
