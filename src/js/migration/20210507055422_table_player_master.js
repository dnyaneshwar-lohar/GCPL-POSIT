
exports.up = function (knex) {
    return knex.schema.hasTable('player_master')
        .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('player_master', table => {
                    table.increments('player_id').primary();
                    table.integer('account_id').unsigned().notNullable();
                    table.string('player_first_name', [100]).notNullable();
                    table.string('player_last_name', [100]).notNullable();
                    table.string('mobile_no', [50]).notNullable();
                    table.string('birth_year', [10]).notNullable();
                    table.specificType('player_photo', 'longblob').notNullable();
                    table.specificType('is_active', 'tinyint(1)').notNullable().defaultTo(0);
                    table.timestamp('update_date').notNullable().defaultTo(knex.fn.now());
                    table.string('gender', [6]).notNullable();
                    table
                        .foreign('account_id')
                        .references('account_master.account_id')
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                })
            }
        })
};

exports.down = function (knex) {
    return knex.schema.hasTable('player_master')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable('player_master');
            }
        })
};
