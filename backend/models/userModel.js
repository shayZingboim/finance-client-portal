const db = require('../config/db');

const getAllUsers = () => {
  return db('users').select('*');
};

const getUserById = (id) => {
  return db('users').where({ id }).first();
};

const getUserByEmail = (email) => {
	return db('users').where({ email }).first();
};

const createUser = (user) => {
  return db('users').insert(user).returning('*');
};

const updateUser = (id, user) => {
  return db('users').where({ id }).update(user).returning('*');
};

const deleteUser = (id) => {
  return db('users').where({ id }).del();
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
