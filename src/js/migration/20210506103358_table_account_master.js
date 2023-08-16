
exports.up = function (knex) {
  return knex.schema.hasTable('account_master')
    .then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('account_master', table => {
          table.increments('account_id').primary();
          table.string('mobile_no', [12]).notNullable();
          table.string('password', [256]).notNullable();
          table.string('user_first_name', [100]).notNullable();
          table.string('user_last_name', [100]).notNullable();
          table.string('phase_no', [50]).notNullable();
          table.string('building_no', [50]).notNullable();
          table.string('flat_no', [50]).notNullable();
          table.string('owner', [3]).notNullable();
          table.string('email_id', [100]).notNullable();
          table.string('birth_year', [10]).notNullable();
          table.specificType('is_active', 'tinyint(1)').notNullable().defaultTo(0);
          table.timestamp('update_date').notNullable().defaultTo(knex.fn.now());
          table.string('verify_by', [100]);
          table.timestamp('verify_date');
          table.specificType('approve_status', 'tinyint(1)').notNullable().defaultTo(0);
          table.string('gender', [6]).notNullable();
          table.string('reset_password_token', [256]);
        })
      }
    })
};

exports.down = function (knex) {
  return knex.schema.hasTable('account_master')
    .then(function (exists) {
      if (exists) {
        return knex.schema.dropTable('account_master');
      }
    })
};
