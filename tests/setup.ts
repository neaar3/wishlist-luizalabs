import faker from "faker";

import Knex from "knex";

import knexConfig from "../knexfile";

jest.setTimeout(20000);

const masterConn = Knex(knexConfig);
const databaseName = `test_${faker.random.alphaNumeric(8)}`;

const testKnexConfig = JSON.parse(
  JSON.stringify(knexConfig)
) as typeof knexConfig;


const knex = Knex(testKnexConfig);

beforeAll(async () => {
  try {
    await masterConn.raw(`CREATE DATABASE ${databaseName};`);
    testKnexConfig.connection.database = databaseName;
    await knex.migrate.latest();
  } catch (err) {
    process.stderr.write(
      `${err instanceof Error ? err.stack : JSON.stringify(err)}\n`
    );
    process.exit(1);
  }
});

afterAll(async () => {
  await knex.destroy();
  await masterConn.raw(`DROP DATABASE ${databaseName};`);
  await masterConn.destroy();
});