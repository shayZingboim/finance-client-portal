const bcrypt = require('bcrypt');

const run = async () => {
  const hash = await bcrypt.hash('12345678', 10);
  console.log('הסיסמה המוצפנת:', hash);
};

run();
