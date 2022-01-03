import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists("customers", table => {
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
        table.integer("customer_id").unsigned()
            .references('customers.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("customers")
    await knex.schema.dropTable("products")
}

