
exports.up = function (knex) {
    return knex.schema.hasTable('role_master')
        .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('role_master', table => {
                    table.integer('user_group').notNullable().unsigned();
                    table.string('web_page', [255]).notNullable();
                    table
                        .foreign('user_group')
                        .references('user_group_master.user_group_id')
                })
            }
        })
};

exports.down = function (knex) {
    return knex.schema.hasTable('role_master')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable('role_master');
            }
        })
};
