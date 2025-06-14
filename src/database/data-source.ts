import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migration/*.{ts,js}'],
  synchronize: false,
  logging: true,
  seeds: [__dirname + '/seed/*.{ts,js}'],
  factories: [__dirname + '/factory/*.{ts,js}'],
};

export const AppDataSource = new DataSource(options);

