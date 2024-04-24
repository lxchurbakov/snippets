// import { escape } from '/plugins/core/database-connection/server';

// import DatabaseConnection from '/plugins/core/database-connection/server';
// import MigrationsManager from '/plugins/core/migrations-manager/server';

export type User = { id: number, name: string, email: string };

export default class Users {
  constructor (private db: DatabaseConnection, private migrations: MigrationsManager) {
    this.migrations.onCollectMigrations.on(() => ({ name: 'users/create', dependencies: [], cb: async () =>
      this.db.queryOne(`
        CREATE TABLE users (
          id serial PRIMARY KEY,
          email VARCHAR (100) NOT NULL,
          name VARCHAR (100) NOT NULL
        )
      `, [])
    }));
  }

  public create = async ({ email, name }: { email: string, name: string}) => {
    return this.db.queryOne(`INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *`, [email, name]);
  };

  // FIELDS, FILTERS, PAGINATION AND SORT
  // WHAT, JOIN, WHERE, SORT, PAGINATE

  public search = async (filter: { company_id?: number, name?: string, email?: string, id?: number }, pagination: { perPage: number, page: number }) => {
    let query = 'SELECT users.* FROM users';
    let values = [] as (string | number)[];

    // First of all we join what we need
    // if (filter.company_id) {
    //   query += ` JOIN users_companies ON users.id = users_companies.user_id`;
    // }

    // Then we build the where clause
    ;['id', 'name', 'email'].forEach((key) => {
      if (filter[key]) {
        values.push(filter[key]);
        query += ` AND users.${key} = $${values.length}`;
      }
    });

    // if (filter.company_id) {
    //   values.push(filter.company_id);
    //   query += ` AND users_companies.company_id = $${values.length}`;
    // }

    // In the end we add pagination params
    values.push(pagination.perPage);
    values.push(pagination.perPage * pagination.page);

    query += ` LIMIT $${values.length - 1} OFFSET $${values.length}`;

    // Execute the query
    return this.db.query(query, values);
  };
};
