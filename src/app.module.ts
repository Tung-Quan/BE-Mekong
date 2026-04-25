import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PositionController } from './presentation/controllers/position.controller';
import { PositionUseCases } from './application/use-cases/position.use-cases';
import { IPositionRepositoryToken } from './domain/repositories/position.repository.interface';

// Import ORM & TypeORM Repository
import { PositionOrmEntity } from './infrastructure/database/entities/position.orm-entity';
import { PositionDataOrmEntity } from './infrastructure/database/entities/position-data.orm-entity';
import { TypeOrmPositionRepository } from './infrastructure/repositories/typeorm-position.repository';

@Module({
  imports: [
    // 1. Load file .env
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Cấu hình kết nối PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [PositionOrmEntity, PositionDataOrmEntity],
      synchronize: false, // Để false vì chúng ta đã tạo bảng bằng init.sql trong Docker
    }),

    // 3. Đăng ký Entities cho Repository
    TypeOrmModule.forFeature([PositionOrmEntity, PositionDataOrmEntity]),
  ],
  controllers: [PositionController],
  providers: [
    PositionUseCases,
    {
      // Tráo đổi sự phụ thuộc: Từ nay khi app gọi Token này, nó sẽ dùng TypeOrmPositionRepository
      provide: IPositionRepositoryToken,
      useClass: TypeOrmPositionRepository,
    },
  ],
})
export class AppModule {}
