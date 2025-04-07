const db = require('../config/db');

const getAllByUserId = async (userId) => {
  return db('financial_data')
    .where('user_id', userId)
    .orderBy('start_date', 'desc');
};

const getFilteredByUserId = async (userId, filters) => {
  const query = db('financial_data').where('user_id', userId);

  if (filters.year) {
    query.andWhereRaw('EXTRACT(YEAR FROM start_date) = ?', [filters.year]);
  }
  if (filters.month) {
    query.andWhereRaw('EXTRACT(MONTH FROM start_date) = ?', [filters.month]);
  }
  if (filters.min_yield) {
    query.andWhere('yield_percent', '>=', filters.min_yield);
  }
  if (filters.max_yield) {
    query.andWhere('yield_percent', '<=', filters.max_yield);
  }

  return query.orderBy('start_date', 'desc');
};

const getAllData = async () => {
  return db('financial_data').orderBy('start_date', 'desc');
};

const getDataByUserId = async (userId) => {
  return db('financial_data').where('user_id', userId).orderBy('start_date', 'desc');
};

const addInvestment = async (data) => {
  return await db('financial_data').insert(data).returning('*');
};

const updateInvestment = async (id, data) => {
  return db('financial_data').where({ id }).update(data).returning('*');
};

const deleteInvestment = async (id) => {
  return db('financial_data').where({ id }).del();
};

const deleteAllByUserId = async (userId) => {
  return db('financial_data').where('user_id', userId).del();
};

const updateAllByUserId = async (userId, data) => {
  return db('financial_data').where('user_id', userId).update(data).returning('*');
};

const bulkUpdateByFilter = async (filters, updates) => {
  const query = db('financial_data');

  if (filters.year) {
    query.andWhereRaw('EXTRACT(YEAR FROM start_date) = ?', [filters.year]);
  }
  if (filters.month) {
    query.andWhereRaw('EXTRACT(MONTH FROM start_date) = ?', [filters.month]);
  }
  if (filters.user_id) {
    query.andWhere('user_id', filters.user_id);
  }

  return query.update(updates).returning('*');
};

const getLatestBalancesByUser = async () => {
  return db('financial_data')
    .select('user_id')
    .max('end_date as latest_date')
    .groupBy('user_id')
    .then(async (latestDates) => {
      const promises = latestDates.map(async ({ user_id, latest_date }) => {
        const row = await db('financial_data')
          .where({ user_id, end_date: latest_date })
          .first('balance_end');
        return {
          user_id,
          balance: row?.balance_end ?? 0,
        };
      });
      return Promise.all(promises);
    });
};

module.exports = {
  getAllByUserId,
  getFilteredByUserId,
  getAllData,
  getDataByUserId,
  addInvestment,
  updateInvestment,
  deleteInvestment,
  deleteAllByUserId,
  updateAllByUserId,
  bulkUpdateByFilter,
  getLatestBalancesByUser
};
