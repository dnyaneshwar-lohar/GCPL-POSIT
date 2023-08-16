
exports.up = function (knex) {
    return knex.schema.hasTable('team_players')
        .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('team_players', table => {
                    table.increments('team_id').primary();
                    table.string('category_name', [50]).notNullable();
                    table.integer('category_id').notNullable().unsigned();
                    table.integer('team_length').notNullable();
                    table.integer('registered_players').notNullable();
                    table.integer('total_buffer_players').notNullable();
                    table.integer('total_teams_admin').notNullable();
                    table
                        .foreign('category_id')
                        .references('category_master.category_id')
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                })
            }
        })
};

exports.down = function (knex) {
    return knex.schema.hasTable('team_players')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable('team_players');
            }
        })
};
