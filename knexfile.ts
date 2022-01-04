require("dotenv").config();

export = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
  },
  migrations: {
      tableName: "knex_migrations",
      directory: "src/migrations",
      extention: "ts",
  },


  // test: {
  //   client: 'pg',
  //   connection: {
  //     host: process.env.DB_HOST,
  //     port: parseInt(process.env.DB_PORT ?? "5432", 10),
  //     user: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DATABASE+"_test"
  //   },
  //   migrations: {
  //       tableName: "knex_migrations",
  //       directory: "src/migrations",
  //       extention: "ts",
  //   },
  // }
};