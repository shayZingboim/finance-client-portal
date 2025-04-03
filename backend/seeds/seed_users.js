exports.seed = async function(knex) {
	// למשל מחיקת כל משתמשים קיימים:
	await knex('users').del();
  
	// הוספת משתמשים חדשים
	await knex('users').insert([
	  {
		username: 'admin',
		email: 'admin@example.com',
		password: '$2b$10$7HK3BdAVuVOGKMDWVmC1yuWYtqm2.n/EW9e9ld1ZYkKUB0HLHmMz2', // סיסמה מוצפנת (אפשר לשים זמנית רגיל ולממש hash אחר כך)
		role: 'admin'
	  },
	  {
		username: 'user1',
		email: 'user1@example.com',
		password: '$2b$10$7HK3BdAVuVOGKMDWVmC1yuWYtqm2.n/EW9e9ld1ZYkKUB0HLHmMz2',
		role: 'client'
	  }
	]);
  };
  