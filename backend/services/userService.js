const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');


const getAllUsers = async () => {
  return await userModel.getAllUsers();
};

const getUserById = async (id) => {
  return await userModel.getUserById(id);
};

const getUserByEmail = async (email) => {
	  return await userModel.getUserByEmail(email);
};

const createUser = async (userData) => {
	const hashedPassword = await bcrypt.hash(userData.password, 10);
	const newUser = { ...userData, password: hashedPassword };
	return userModel.createUser(newUser);
};

const authenticateUser = async (email, password) => {
	const user = await userModel.getUserByEmail(email);
	if (!user) {
	  throw new Error('משתמש לא נמצא');
	}
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
	  throw new Error('סיסמה שגויה');
	}
	return user;
};

const updateUser = async (id, userData) => {
  return await userModel.updateUser(id, userData);
};

const deleteUser = async (id) => {
  return await userModel.deleteUser(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  authenticateUser,
  updateUser,
  deleteUser,
};
