exports.seed = async function(knex) {
	await knex('users').del();
  
	await knex('users').insert([
	  {
		id: 1,
		username: 'admin',
		email: 'admin@example.com',
		password: '$2b$10$7HK3BdAVuVOGKMDWVmC1yuWYtqm2.n/EW9e9ld1ZYkKUB0HLHmMz2', // סיסמה: 12345678
		role: 'admin'
	  },
	  {
		id: 2,
		username: 'user1',
		email: 'user1@example.com',
		password: '$2b$10$7HK3BdAVuVOGKMDWVmC1yuWYtqm2.n/EW9e9ld1ZYkKUB0HLHmMz2', // סיסמה: 12345678
		role: 'client'
	  }
	]);
  
	// אפס את הספירה כדי להבטיח שה-id הבא יהיה 3
	await knex.raw("SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM users))");
};
  