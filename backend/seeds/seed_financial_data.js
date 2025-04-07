exports.seed = async function (knex) {
	await knex("financial_data").del();
  
	const records = [];
	const today = new Date();
	const weekMs = 7 * 24 * 60 * 60 * 1000;
  
	for (let userId = 2; userId <= 101; userId++) {
	  let balance = 10000 + Math.random() * 10000;
  
	  for (let week = 1; week <= 30; week++) {
		const start = new Date(today.getTime() - (week + 1) * weekMs);
		const end = new Date(start.getTime() + weekMs - 1);
  
		const deposit = Math.floor(Math.random() * 1000);
		const withdrawal = Math.floor(Math.random() * 500);
		const fees = Math.floor(Math.random() * 50);
		const yieldPercent = parseFloat((Math.random() * 3 - 1).toFixed(2));
  
		const balanceStart = balance;
		const balanceEnd =
		  balanceStart + deposit - withdrawal - fees + (balanceStart * yieldPercent) / 100;
  
		balance = balanceEnd;
  
		records.push({
		  user_id: userId,
		  week_number: week,
		  start_date: start.toISOString().slice(0, 10),
		  end_date: end.toISOString().slice(0, 10),
		  deposit,
		  withdrawal,
		  fees,
		  balance_start: balanceStart.toFixed(2),
		  balance_end: balanceEnd.toFixed(2),
		  yield_percent: yieldPercent,
		  notes: `שבוע ${week}`,
		});
	  }
	}
  
	await knex("financial_data").insert(records);
	await knex.raw(
	  "SELECT setval('financial_data_id_seq', (SELECT MAX(id) FROM financial_data))"
	);
  };
  