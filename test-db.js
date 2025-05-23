const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://postgres:ziv1234@localhost:5432/investment_db'
});

client.connect()
  .then(() => {
    console.log('✅ Connected to DB successfully');
    return client.end();
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB:', err.message);
  });
