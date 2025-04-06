const userService = require('../services/userService');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');


const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'משתמש לא נמצא' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'משתמש לא נמצא' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (deleted) {
      res.json({ message: 'משתמש נמחק' });
    } else {
      res.status(404).json({ message: 'משתמש לא נמצא' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const loginUser = async (req, res) => {
	try {
	  const { email, password } = req.body;
	  const user = await userService.authenticateUser(email, password);
  
	  const token = jwt.sign(
		{ id: user.id, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	  );
  
	  // שליחת הטוקן בתוך cookie מאובטח
	  res.cookie('token', token, {
		httpOnly: true,
		secure: false, // שנה ל־true רק כשהאתר באינטרנט עם https
		sameSite: 'lax', // או 'strict' או 'none' לפי הצורך
		maxAge: 3600000 // שעה
	  });
  
	  res.json({ message: 'התחברות מוצלחת' });
	} catch (err) {
	  res.status(401).json({ error: err.message });
	}
};

const logoutUser = (req, res) => {
	res.clearCookie('token', {
	  httpOnly: true,
	  sameSite: 'lax', // כמו בהגדרה של login
	  secure: false    // אם עברת ל־https תחליף ל־true
	});
	res.json({ message: 'התנתקת בהצלחה' });
};
  

const getMyProfile = async (req, res) => {
	try {
	  const user = await userModel.getUserById(req.user.id);
	  if (user) {
		res.json(user);
	  } else {
		res.status(404).json({ message: 'משתמש לא נמצא' });
	  }
	} catch (err) {
	  res.status(500).json({ error: err.message });
	}
};
  


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  getMyProfile
};
