exports.up = function(knex) {
	return knex.schema.createTable('financial_data', function(table) {
	  table.increments('id').primary();
	  table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
	  table.integer('week_number');
	  table.date('start_date');
	  table.date('end_date');
	  table.decimal('balance_start', 15, 2);
	  table.decimal('balance_end', 15, 2);
	  table.decimal('yield_percent', 5, 2);
	  table.decimal('deposit', 15, 2);
	  table.decimal('withdrawal', 15, 2);
	  table.decimal('fees', 15, 2);
	  table.text('notes');
	  table.timestamps(true, true);
	});
  };
  
  exports.down = function(knex) {
	return knex.schema.dropTableIfExists('financial_data');
  };
  