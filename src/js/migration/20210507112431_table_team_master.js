
exports.up = function (knex) {
    return knex.schema.hasTable('team_master')
        .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('team_master', table => {
                    table.increments('team_id').primary();
                    table.integer('team_category').unsigned().notNullable();
                    table.string('team_name', [255]).unique().notNullable();
                    table.string('team_short_name', [100]).notNullable();
                    table.string('sponsor_email_id', [100]).notNullable();
                    table.string('sponsor_player', [100]).notNullable();
                    table
                        .foreign('team_category')
                        .references('category_master.category_id')
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                    table
                        .foreign('sponsor_email_id')
                        .references('sponsors_master.email_id')
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');

                })
            }
        })
};

exports.down = function (knex) {
    return knex.schema.hasTable('team_master')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable('team_master')
            }
        })
};