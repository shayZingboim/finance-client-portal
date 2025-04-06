const financialModel = require('../models/financialModel');

const getMyFinancialData = async (userId, filters = {}) => {
  if (Object.keys(filters).length > 0) {
    return await financialModel.getFilteredByUserId(userId, filters);
  }
  return await financialModel.getAllByUserId(userId);
};

const addInvestment = async (data) => {
  return await financialModel.addInvestment(data);
};

const getAllData = async () => {
  return await financialModel.getAllData();
};

const getDataByUserId = async (userId) => {
  return await financialModel.getDataByUserId(userId);
};

const updateInvestment = async (id, data) => {
  return await financialModel.updateInvestment(id, data);
};

const deleteInvestment = async (id) => {
  return await financialModel.deleteInvestment(id);
};

const deleteAllByUserId = async (userId) => {
  return await financialModel.deleteAllByUserId(userId);
};

const updateAllByUserId = async (userId, data) => {
  return await financialModel.updateAllByUserId(userId, data);
};

const bulkUpdateByFilter = async (filters, updates) => {
  return await financialModel.bulkUpdateByFilter(filters, updates);
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
