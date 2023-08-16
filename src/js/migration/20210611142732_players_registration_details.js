
exports.up = function (knex) {
    return knex.schema.hasTable('players_registration_details')
        .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('players_registration_details', table => {
                    table.string('tournament_year', [8]).notNullable();
                    table.timestamp('registration_date').notNullable().defaultTo(knex.fn.now());
                    table.increments('registration_no').primary();
                    table.integer('player_id').notNullable().unique().unsigned();
                    table.integer('category_id').notNullable().unsigned();
                    table.integer('t_shirt_size').notNullable();
                    table.integer('participation_fees').notNullable();
                    table.string('verify_by', [100]);
                    table.timestamp('verify_date');
                    table.specificType('approve_status', 'tinyint(1)').notNullable().defaultTo(0);
                    table.string('game_id', [100]).notNullable();
                    table.integer('tournament_id').unsigned();
                    table
                        .foreign('category_id')
                        .references('category_master.category_id')
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                    table
                        .foreign('tournament_id')
                        .references('tournament_master.tournament_id')
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
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
    return knex.schema.hasTable('players_registration_details')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable('players_registration_details');
            }
        })
};
