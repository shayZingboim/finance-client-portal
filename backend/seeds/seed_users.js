exports.seed = function(knex) {
	// מוחק את כל הנתונים הקיימים בטבלה
	return knex('users').del()
	  .then(function () {
		// מוסיף נתונים חדשים
		return knex('users').insert([
		  { username: 'user1', email: 'user1@example.com', password: 'hashed_password1' },
		  { username: 'user2', email: 'user2@example.com', password: 'hashed_password2' },
		  { username: 'user3', email: 'user3@example.com', password: 'hashed_password3' }
		]);
	  });
  };
  