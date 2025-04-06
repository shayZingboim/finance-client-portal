// src/components/MarketComparisonChart.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MarketComparisonChart({ data }) {
  // נניח תשואה ממוצעת מדומה של השוק
  const enrichedData = data.map((item) => ({
    date: new Date(item.start_date).toLocaleDateString("he-IL"),
    clientYield: parseFloat(item.yield_percent),
    marketAverage: 1.2, // תשואה מדומה, אפשר לעדכן בעתיד
  }));

  return (
    <div className="w-full h-80 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={enrichedData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="clientYield" stroke="#8884d8" name="תשואת לקוח" />
          <Line type="monotone" dataKey="marketAverage" stroke="#82ca9d" name="ממוצע שוק" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
