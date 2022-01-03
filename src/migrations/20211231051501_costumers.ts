import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists("costumers", table => {
        table.increments("id").primary()
        table.text("name").notNullable()
        table.text("email").unique().notNullable()
        table.text("password").notNullable()
    })

    await knex.schema.createTableIfNotExists("products", table => {
        table.text("price").notNullable()
        table.text("image").notNullable()
        table.text("brand").notNullable()
        table.text("id").notNullable().primary()
        table.text("title").notNullable()
        table.text("review_score")
        table.text("costumer_id").unsigned()
            .references('costumers.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("costumers")
    await knex.schema.dropTable("products")
}

