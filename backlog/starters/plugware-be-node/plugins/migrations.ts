import { EventEmitter } from '/libs/events';
import DatabaseConnection from '/plugins/core/database-connection/server';
import logger from '/libs/logger';

export type Migration = { name: string; dependencies: string[]; cb: () => Promise<void>; };

export default class MigrationsManager {
  public onCollectMigrations = new EventEmitter();

  constructor (private db: DatabaseConnection) {
    setTimeout(() => {
      const migrations = this.onCollectMigrations.emitps(null) as Migration[];

      logger.info('migrations:start...')
      this.migrate(migrations).then(() => {
        logger.info('migrations:completed');
      }).catch((e) => {
        logger.error(`Error while doing migrations`, e);
      });
    }, 0);
  }

  //
  private getPreviouslyCompletedMigrations = async () => {
    // First of all we prepare for the migration by checking if the migrations table exists
    const tables = await this.db.query(`SELECT * FROM information_schema.tables`, []);

    // Check if the table we need does not exist, we create it
    if (!tables.find((t) => t.table_name === '__migrations')) {
      await this.db.queryOne(`CREATE TABLE __migrations (name VARCHAR (255) UNIQUE NOT NULL, completed_at TIMESTAMP NOT NULL)`, []);
    }

    // After that we grab completed migrations list from the table
    return await this.db.query(`SELECT * FROM __migrations`, []).then((rows) => rows.map((row) => row.name)) as string[];
  };

  //
  private migrate = async (migrations: Migration[]) => {
    let previouslyCompletedMigrations = await this.getPreviouslyCompletedMigrations();
    let currentlyCompletedMigrations = [] as string[];
    let somethingWasRun = true;

    while (somethingWasRun) {
      somethingWasRun = false;

      await migrations.reduce(async (acc, { name, dependencies, cb }: Migration) => {
        await acc;
        const completedMigrations = ([] as string[]).concat(previouslyCompletedMigrations).concat(currentlyCompletedMigrations);

        if (!completedMigrations.includes(name) && dependencies.every(d => completedMigrations.includes(d))) {
          logger.info(`migrations:${name}:run...`);
          await cb();
          currentlyCompletedMigrations.push(name);
          somethingWasRun = true;
          logger.info(`migrations:${name}:completed...`);
        }
      }, Promise.resolve());
    }

    await Promise.all(currentlyCompletedMigrations.map(async (name) => {
      return this.db.queryOne(`INSERT INTO __migrations (name, completed_at) VALUES ($1, $2)`, [name, new Date()]);
    }));

    if (previouslyCompletedMigrations.length + currentlyCompletedMigrations.length < migrations.length) {
      logger.error('Could not complete all migrations');
    }
  };
};
