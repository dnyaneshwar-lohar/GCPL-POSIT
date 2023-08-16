
exports.up = function (knex) {
    return knex.schema.hasTable('nostalgic_gallery')
        .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('nostalgic_gallery', table => {
                    table.increments('image_id').primary();
                    table.specificType('image', 'longblob').notNullable();
                    table.string('image_name', [255]).notNullable();
                    table.string('tournament_year').notNullable();
                })
            }
        })
};

exports.down = function (knex) {
    return knex.schema.hasTable('nostalgic_gallery')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable('nostalgic_gallery');
            }
        })
};
