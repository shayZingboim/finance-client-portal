const financialService = require('../services/financialService');

// This controller handles financial data operations

// This function retrieves the financial data for the authenticated user
const getMyFinancialData = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = req.query;
	// Check if filters are provided, if not, set to an empty object
    const data = await financialService.getMyFinancialData(userId, filters);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This function adds a new investment to the database
const addInvestment = async (req, res) => {
  try {
	// Validate the request body to ensure it contains the required fields
    const newData = await financialService.addInvestment(req.body);
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This function retrieves all financial data from the database
const getAllData = async (req, res) => {
  try {
	// Check if the user is an admin before allowing access to all data
    const data = await financialService.getAllData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This function retrieves financial data for a specific user by their ID
const getDataByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
	// Check if the user is an admin before allowing access to data by user ID
    const data = await financialService.getDataByUserId(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This function updates an existing investment in the database
const updateInvestment = async (req, res) => {
  try {
	// Validate the request body to ensure it contains the required fields
    const updated = await financialService.updateInvestment(req.params.id, req.body);
    // Check if the investment was found and updated
	if (updated.length === 0) {
      return res.status(404).json({ message: 'השקעה לא נמצאה' });
    }
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This function deletes an investment from the database
const deleteInvestment = async (req, res) => {
  try {
	// Validate the request body to ensure it contains the required fields
    const deleted = await financialService.deleteInvestment(req.params.id);
    if (deleted === 0) {
      return res.status(404).json({ message: 'השקעה לא נמצאה' });
    }
    res.json({ message: 'השקעה נמחקה בהצלחה' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This function deletes all financial data for a specific user by their ID
const deleteAllByUserId = async (req, res) => {
  try {
	// Validate the request body to ensure it contains the required fields
    const result = await financialService.deleteAllByUserId(req.params.userId);
    res.json({ message: `נמחקו ${result} רשומות.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This function updates all financial data for a specific user by their ID
const updateAllByUserId = async (req, res) => {
  try {
	// Validate the request body to ensure it contains the required fields
    const result = await financialService.updateAllByUserId(req.params.userId, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This function performs a bulk update on financial data based on a filter
const bulkUpdateByFilter = async (req, res) => {
  try {
	// Validate the request body to ensure it contains the required fields
    const { filter = {}, update = {} } = req.body;
	// Check if the user is an admin before allowing access to bulk update
    const result = await financialService.bulkUpdateByFilter(filter, update);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getClientSummaries = async (req, res) => {
	try {
	  const result = await financialService.getClientSummaries();
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
  bulkUpdateByFilter,
  getClientSummaries
};
