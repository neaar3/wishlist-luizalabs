import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists("customers", table => {
        table.increments("id").primary()
        table.text("name").notNullable()
        table.text("email").unique().notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("customers")
}

