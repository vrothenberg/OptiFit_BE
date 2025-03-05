import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Creates a TypeORM module for testing with a PostgreSQL database
 * @param entities Array of entity classes to include in the connection
 * @returns TypeOrmModule for testing
 */
export const createTestDatabaseModule = (entities: any[]) => {
  return TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      url: configService.get<string>('DATABASE_URL'),
      entities,
      synchronize: true, // Auto-create tables in test environment
      dropSchema: true, // Drop tables before tests
      logging: false,
    }),
  });
};

/**
 * Creates a TypeORM module for testing with an in-memory SQLite database
 * @param entities Array of entity classes to include in the connection
 * @returns TypeOrmModule for testing
 */
export const createInMemoryDatabaseModule = (entities: any[]) => {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities,
    synchronize: true,
    dropSchema: true,
    logging: false,
  });
};

/**
 * Utility function to clear all tables in the database
 * @param connection TypeORM connection
 */
export const clearDatabase = async (connection: any) => {
  const entities = connection.entityMetadatas;
  
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
  }
};
