
exports.up = function (knex) {
    return knex.schema.hasTable('player_stats')
        .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('player_stats', table => {
                    table.string('year', [8]).notNullable();
                    table.string('team_category', [50]).notNullable();
                    table.string('player_name', [255]).notNullable();
                    table.string('team_name', [255]).notNullable();
                    table.string('opposit_team_name', [255]).notNullable();
                    table.integer('runs').notNullable();
                    table.integer('no_of_fours').notNullable();
                    table.integer('no_of_sixes').notNullable();
                    table.integer('not_out').notNullable();
                    table.integer('overs').notNullable();
                    table.integer('maden').notNullable();
                    table.integer('wickets').notNullable();
                    table.integer('player_id').notNullable().unsigned();
                    table
                        .foreign('player_id')
                        .references('player_master.player_id')
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                })
            }
        })
};

exports.down = function (knex) {
    return knex.schema.hasTable('player_stats')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable('player_stats');
            }
        })
};
