const userService = require('../services/userService');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// This controller handles user-related operations such as getting all users, getting a user by ID, creating a new user, updating a user, deleting a user, logging in, and logging out.
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This function retrieves a user by their ID from the database and returns it in the response. If the user is not found, it returns a 404 status code with an error message.
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

// This function creates a new user in the database using the data provided in the request body. If successful, it returns the newly created user with a 201 status code. If an error occurs, it returns a 500 status code with an error message.
const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This function updates an existing user in the database using the ID provided in the request parameters and the data provided in the request body. If successful, it returns the updated user. If the user is not found, it returns a 404 status code with an error message. If an error occurs, it returns a 500 status code with an error message.
const updateUser = async (req, res) => {
  try {
	// This function updates an existing user in the database using the ID provided in the request parameters and the data provided in the request body. If successful, it returns the updated user. If the user is not found, it returns a 404 status code with an error message. If an error occurs, it returns a 500 status code with an error message.
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

// This function deletes a user from the database using the ID provided in the request parameters. If successful, it returns a success message. If the user is not found, it returns a 404 status code with an error message. If an error occurs, it returns a 500 status code with an error message.
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

// This function handles user login by checking the provided email and password against the database. If successful, it generates a JWT token and sends it back in a secure cookie. If authentication fails, it returns a 401 status code with an error message.
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Login request:", { email });

    const user = await userService.authenticateUser(email, password);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600000
    });

    console.log("✅ Login successful for:", email);
    res.json({ message: 'התחברות מוצלחת' });

  } catch (err) {
    console.error("❌ Login failed:", err.message);
    res.status(401).json({ error: err.message });
  }
};

const logoutUser = (req, res) => {
	res.clearCookie('token', {
	  httpOnly: true,
	  sameSite: 'lax',
	  secure: false   
	});
	res.json({ message: 'התנתקת בהצלחה' });
};
  
//
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
