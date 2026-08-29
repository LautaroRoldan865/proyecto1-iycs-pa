import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';

async function migrate() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  await dataSource.runMigrations();

  console.log('Migraciones ejecutadas correctamente');

  await app.close();
}

migrate().catch((error) => {
  console.error('Error ejecutando migraciones:', error);
  process.exit(1);
});

//yarn ts-node -r tsconfig-paths/register src/migrate.ts
