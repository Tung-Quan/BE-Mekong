import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { IPositionRepository } from '../../domain/repositories/position.repository.interface';
import { Position, PositionData } from '../../domain/entities/position.entity';
import { PositionOrmEntity } from '../database/entities/position.orm-entity';
import { PositionDataOrmEntity } from '../database/entities/position-data.orm-entity';

@Injectable()
export class TypeOrmPositionRepository implements IPositionRepository {
  constructor(
    @InjectRepository(PositionOrmEntity)
    private readonly positionRepo: Repository<PositionOrmEntity>,
    @InjectRepository(PositionDataOrmEntity)
    private readonly dataRepo: Repository<PositionDataOrmEntity>,
  ) {}

  async getPositions(): Promise<Position[]> {
    const ormPositions = await this.positionRepo.find();
    
    // Map ORM Entity sang Domain Entity
    return ormPositions.map(p => ({
      id: p.id,
      name: p.name,
      latitude: p.latitude,
      longitude: p.longitude,
      distanceKm: p.distanceKm,
      type: p.type,
    }));
  }

  async getPositionDataByDateRange(
    date: string,
    startTime: string,
    endTime: string,
    positionId: string,
  ): Promise<PositionData[]> {
    // Ép chuỗi ngày giờ thành Date object để query
    const start = new Date(`${date}T${startTime}Z`);
    const end = new Date(`${date}T${endTime}Z`);

    const ormData = await this.dataRepo.find({
      where: {
        stationId: positionId,
        datetime: Between(start, end),
      },
      relations: ['position'], // Lấy luôn bảng cha (positions) để lấy tên trạm
      order: { datetime: 'ASC' },
    });

    // Map ORM Entity sang cấu trúc mà API/Frontend cần
    return ormData.map(d => ({
      id: d.id,
      station_id: d.stationId,
      station_name: d.position?.name,
      datetime: d.datetime.toISOString(),
      salinity: d.salinity,
      water_level: d.waterLevel,
    }));
  }
}
