
exports.up = function (knex) {
    return knex.schema.hasTable('match_details')
        .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('match_details', table => {
                    table.increments('match_id').primary();
                    table.integer('tournament_id').notNullable().unsigned();
                    table.date('match_date').notNullable();
                    table.string('first_team', [255]).notNullable();
                    table.string('second_team', [255]).notNullable();
                    table.string('match_time').notNullable();
                    table.string('match_venue', [255]).notNullable();

                    table
                        .foreign('tournament_id')
                        .references('tournament_master.tournament_id')
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                })
            }
        })
};

exports.down = function (knex) {
    return knex.schema.hasTable('match_details')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable('match_details');
            }
        })
};
