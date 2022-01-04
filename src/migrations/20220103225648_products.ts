import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists("products", table => {
        table.decimal("price").notNullable()
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
    await knex.schema.dropTable("products")
}


