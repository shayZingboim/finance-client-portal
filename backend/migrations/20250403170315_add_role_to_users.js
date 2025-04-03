exports.up = function(knex) {
	return knex.schema.alterTable('users', function(table) {
	  table.string('role').notNullable().defaultTo('client');
	});
  };
  
  exports.down = function(knex) {
	return knex.schema.alterTable('users', function(table) {
	  table.dropColumn('role');
	});
  };
  