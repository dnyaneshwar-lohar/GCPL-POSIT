
exports.up = function (knex) {
    return knex.schema.hasTable('user_master')
        .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('user_master', table => {
                    table.increments('user_id').primary();
                    table.string('user_name', [255]).notNullable();
                    table.string('password', [256]).notNullable();
                    table.integer('user_group_id', [255]).notNullable().unsigned();
                    table.string('email_id', [100]).notNullable();
                    table.string('phone_no', [50]).notNullable();
                    table.specificType('approve_status', 'tinyint(1)').notNullable();
                    table.string('reset_password_token', [256]);
                    table
                        .foreign('user_group_id')
                        .references('user_group_master.user_group_id')
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');

                })
            }
        })
};

exports.down = function (knex) {
    return knex.schema.hasTable('user_master')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable('user_master');
            }
        })
};
