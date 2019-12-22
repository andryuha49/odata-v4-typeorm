import {createConnection as createTypeOrmConnection} from 'typeorm';

export function createConnection(entities: any[] = [], migrations: any[] = [], dbConfig: any) {
  const entitiesArray = []
    .concat(entities);
  const migrationsArray = ['migrations/*.js'].concat(migrations);

  return new Promise((resolve, reject) => {
    try {
      const conf = {
        migrationsTableName: '_migrations',
        migrations: migrationsArray,
        autoSchemaSync: true,
        synchronize: true,
        migrationsRun: true,
        entities: entitiesArray,

        ...dbConfig,
      };
      createTypeOrmConnection(conf).then((connection) => {
        resolve(connection);
      }).catch((e) => {
        reject(e);
      });

    } catch (e) {
      return reject(e);
    }
  });
}
