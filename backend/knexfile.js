// backend/knexfile.js
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg', // ← THIS IS VERY IMPORTANT
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
