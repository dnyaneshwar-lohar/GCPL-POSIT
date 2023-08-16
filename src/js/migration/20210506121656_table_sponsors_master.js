
exports.up = function (knex) {
    return knex.schema.hasTable('sponsors_master')
        .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('sponsors_master', table => {
                    table.string('sponsor_name', [100]).notNullable();
                    table.string('sponsor_short_name', [50]).notNullable();
                    table.string('sponsor_description', [1000]).notNullable();
                    table.string('contact_no', [50]).notNullable();
                    table.string('email_id', [100]).primary();
                    table.string('website', [100]).notNullable();
                    table.string('gcpl_accociation_from', [4]).notNullable();
                    table.string('owner', [3]).notNullable();
                    table.string('agc_residence_year_from', [4]).notNullable();
                    table.specificType('is_active', 'tinyint(1)').notNullable().defaultTo(0);
                    table.timestamp('update_date').defaultTo(knex.fn.now()).notNullable();
                    table.integer('sponsorship_amount').notNullable();
                })
            }
        })
};

exports.down = function (knex) {
    return knex.schema.hasTable('sponsors_master')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable('sponsors_master');
            }
        })
};
