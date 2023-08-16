
const category_master_result = [];
const csv = require('csv-parser');
const fs = require('fs');
exports.up = async function (knex) {
    await fs.createReadStream('./src/js/datafiles/category_master.csv')
        .pipe(csv())
        .on('data', (row) => {
            category_master_result.push(row)
        })
        .on('end', () => {
            console.log('CSV for category successfully processed');
        });

    return await Promise.all([
        knex.schema.hasTable('category_master')
            .then(function (exists) {
                if (!exists) {
                    knex.schema.createTable('category_master', table => {
                        table.increments("category_id").primary();
                        table.string("category_name", [100]).notNullable().unique();
                        table.string("category_gender", [10]).notNullable();
                        table.integer("min_age").notNullable();
                        table.integer("max_age").notNullable();
                        table.integer("participation_fees").notNullable();
                        table.integer("sponsorship_amount").notNullable();
                        table.specificType('is_active', 'tinyint(1)').notNullable().defaultTo(0);
                        table.timestamp("update_date").defaultTo(knex.fn.now()).notNullable();
                    })
                        .then(async function () {
                            return await knex("category_master").insert(category_master_result);
                        })
                }
            })
    ]);
};

exports.down = function (knex) {
    return knex.schema.hasTable('category_master')
        .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable("category_master")
            }
        })
};

