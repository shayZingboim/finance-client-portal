const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financialController');
const { verifyToken, requireAdmin } = require('../middlewares/auth');

router.get('/my-data', verifyToken, financialController.getMyFinancialData);
router.get('/all', verifyToken, requireAdmin, financialController.getAllData);
router.get('/user/:userId', verifyToken, requireAdmin, financialController.getDataByUserId);
router.post('/', verifyToken, requireAdmin, financialController.addInvestment);
router.put('/:id', verifyToken, requireAdmin, financialController.updateInvestment);
router.delete('/:id', verifyToken, requireAdmin, financialController.deleteInvestment);
router.delete('/user/:userId', verifyToken, requireAdmin, financialController.deleteAllByUserId);
router.patch('/user/:userId', verifyToken, requireAdmin, financialController.updateAllByUserId);
router.patch('/bulk-update', verifyToken, requireAdmin, financialController.bulkUpdateByFilter);
router.get('/summaries', verifyToken, requireAdmin, financialController.getClientSummaries);


module.exports = router;
