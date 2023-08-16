
exports.up = function (knex) {
    return knex.schema.hasTable('team_players')
        .then(function (exists) {
            if (exists) {
                return knex.schema.alterTable('team_players', table => {
                    table.dropColumn('team_id')
                    table.integer('already_created_teams').notNullable();
                })
            }
        })
};

exports.down = function (knex) {

};