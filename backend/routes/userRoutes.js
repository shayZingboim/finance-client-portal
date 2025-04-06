const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middlewares/auth');

// operations for all users
router.post('/login', userController.loginUser);
router.get('/me', verifyToken, userController.getMyProfile);
router.post('/logout', userController.logoutUser);



// operations only for admins
router.post('/', verifyToken, requireAdmin, userController.createUser);
router.get('/', verifyToken, requireAdmin, userController.getAllUsers);
router.get('/:id', verifyToken, requireAdmin, userController.getUserById);
router.put('/:id', verifyToken, requireAdmin, userController.updateUser);
router.delete('/:id', verifyToken, requireAdmin, userController.deleteUser);

module.exports = router;
