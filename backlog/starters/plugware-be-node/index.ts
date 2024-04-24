import { config } from 'dotenv';

config();

// import EntryPoint from '/plugins/core/entry-point/server';
// import ApiBridge from '/plugins/core/api-bridge/server';
// import DatabaseConnection from '/plugins/core/database-connection/server';
// import MigrationsManager from '/plugins/core/migrations-manager/server';
//
// import UsersModel from '/plugins/basics/users-model/server';
// import AuthCore from '/plugins/basics/auth-core/server';
// import CompanySelector from '/plugins/basics/company-selector/server';
//
// import UsersManagement from '/plugins/features/users-management/server';

// const entry = new EntryPoint();
// const bridge = new ApiBridge(entry);
// const db = new DatabaseConnection();
// const migrations = new MigrationsManager(db);
//
// const users = new UsersModel(db, migrations);
// const auth = new AuthCore(bridge, users);
// const company = new CompanySelector(db, migrations, auth);
//
// const userswtf = new UsersManagement(db, company, users);
