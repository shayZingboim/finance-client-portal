exports.seed = async function (knex) {
  await knex("financial_data").del();
  await knex("users").del();

  const passwordHash =
    "$2b$10$7HK3BdAVuVOGKMDWVmC1yuWYtqm2.n/EW9e9ld1ZYkKUB0HLHmMz2"; // 12345678

  const users = [
    {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      password: passwordHash,
      role: "admin",
    },
  ];

  for (let i = 2; i <= 101; i++) {
    users.push({
      id: i,
      username: `user${i}`,
      email: `user${i}@example.com`,
      password: passwordHash,
      role: "client",
    });
  }

  await knex("users").insert(users);
  await knex.raw(
    "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))"
  );
};
