const financialService = require('../services/financialService');

const getMyFinancialData = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = req.query;
    const data = await financialService.getMyFinancialData(userId, filters);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addInvestment = async (req, res) => {
  try {
    const newData = await financialService.addInvestment(req.body);
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllData = async (req, res) => {
  try {
    const data = await financialService.getAllData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDataByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await financialService.getDataByUserId(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateInvestment = async (req, res) => {
  try {
    const updated = await financialService.updateInvestment(req.params.id, req.body);
    if (updated.length === 0) {
      return res.status(404).json({ message: 'השקעה לא נמצאה' });
    }
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteInvestment = async (req, res) => {
  try {
    const deleted = await financialService.deleteInvestment(req.params.id);
    if (deleted === 0) {
      return res.status(404).json({ message: 'השקעה לא נמצאה' });
    }
    res.json({ message: 'השקעה נמחקה בהצלחה' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAllByUserId = async (req, res) => {
  try {
    const result = await financialService.deleteAllByUserId(req.params.userId);
    res.json({ message: `נמחקו ${result} רשומות.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAllByUserId = async (req, res) => {
  try {
    const result = await financialService.updateAllByUserId(req.params.userId, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const bulkUpdateByFilter = async (req, res) => {
  try {
    const { filter = {}, update = {} } = req.body;
    const result = await financialService.bulkUpdateByFilter(filter, update);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMyFinancialData,
  addInvestment,
  getAllData,
  getDataByUserId,
  updateInvestment,
  deleteInvestment,
  deleteAllByUserId,
  updateAllByUserId,
  bulkUpdateByFilter
};
