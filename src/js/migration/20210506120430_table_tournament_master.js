
exports.up = function (knex) {
  return knex.schema.hasTable('tournament_master')
    .then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('tournament_master', table => {
          table.increments('tournament_id').primary();
          table.string('tournament_name', [45]).notNullable();
          table.string('tournament_desc', [1000]);
          table.timestamp('StartDate').notNullable();
          table.timestamp('EndDate').notNullable();
        })
      }
    })
};

exports.down = function (knex) {
  return knex.schema.hasTable('tournament_master')
    .then(function (exists) {
      if (exists) {
        return knex.schema.dropTable('tournament_master');
      }
    })
};
