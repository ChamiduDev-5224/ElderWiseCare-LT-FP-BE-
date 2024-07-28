import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class EssentialService {
  constructor(private readonly dataSource: DataSource) {}
  async getDataFromTable(): Promise<any> {
    const provincesQuery = 'SELECT * FROM provinces';
    const districtsQuery = 'SELECT * FROM districts';
    const citiesQuery = 'SELECT * FROM cities';

    const provinces = await this.dataSource.query(provincesQuery);
    const districts = await this.dataSource.query(districtsQuery);
    const cities = await this.dataSource.query(citiesQuery);

    return {
      provinces,
      districts,
      cities,
    };
  }
}
