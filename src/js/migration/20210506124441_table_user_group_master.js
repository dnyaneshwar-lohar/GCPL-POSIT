const user_group_master_result = [];
const csv = require('csv-parser');
const fs = require('fs');
exports.up = async function (knex) {
    await fs.createReadStream('./src/js/datafiles/user_group_master.csv')
        .pipe(csv())
        .on('data', (row) => {
            user_group_master_result.push(row)
        })
        .on('end', () => {
            console.log('CSV for user group successfully processed');
        });

    return await Promise.all([
        knex.schema.hasTable('user_group_master')
            .then(function (exists) {
                if (!exists) {
                    knex.schema.createTable('user_group_master', table => {
                        table.increments('user_group_id').primary();
                        table.string('user_group_name', [255]).notNullable();
                    }).then(async function () {
                        return await knex("user_group_master").insert(user_group_master_result);
                    })
                }
            })

    ])
};

exports.down = function (knex) {
    return knex.schema.hasTable('user_group_master')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable('user_group_master');
            }
        })
};
