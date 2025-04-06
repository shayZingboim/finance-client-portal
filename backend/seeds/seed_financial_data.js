exports.seed = async function(knex) {
	await knex('financial_data').del();
  
	await knex('financial_data').insert([
	  {
		user_id: 2, // מתאים ל־user1
		week_number: 1,
		start_date: '2024-03-18',
		end_date: '2024-03-23',
		balance_start: 20000,
		balance_end: 21000,
		yield_percent: 5.0,
		deposit: 2000,
		withdrawal: 0,
		fees: 50,
		notes: 'שבוע ראשון מצוין'
	  },
	  {
		user_id: 2,
		week_number: 2,
		start_date: '2024-03-24',
		end_date: '2024-03-30',
		balance_start: 21000,
		balance_end: 21300,
		yield_percent: 1.43,
		deposit: 0,
		withdrawal: 0,
		fees: 20,
		notes: 'שבוע רגוע'
	  }
	]);
  };
  