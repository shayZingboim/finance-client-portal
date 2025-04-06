import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
  } from "recharts";
  
  export default function ClientYieldChart({ data }) {
	if (!Array.isArray(data) || data.length === 0) {
	  return <p className="text-center mt-4">אין נתונים להצגה בגרף</p>;
	}
  
	const chartData = data.map((item) => ({
	  date: new Date(item.end_date).toLocaleDateString("he-IL"),
	  yield: parseFloat(item.yield_percent),
	}));
  
	return (
		<div className="w-full h-80 p-2">
		<ResponsiveContainer width="100%" height="100%">
		  <LineChart data={chartData}>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="date" />
			<YAxis domain={["auto", "auto"]} />
			<Tooltip />
			<Line type="monotone" dataKey="yield" stroke="#8884d8" strokeWidth={2} />
		  </LineChart>
		</ResponsiveContainer>
	  </div>
	);
}
  