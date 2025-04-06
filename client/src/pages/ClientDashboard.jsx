import { useEffect, useState } from "react";

export default function ClientDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/financial/my-data", {
      credentials: "include", // שולח את ה-cookie לשרת
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "שגיאה בטעינת הנתונים");
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10">טוען נתונים...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">הנתונים הפיננסיים שלך</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm text-right rtl text-gray-700">
          <thead className="bg-gray-200 text-gray-700 font-bold">
            <tr>
              <th className="p-2 border">תאריך התחלה</th>
              <th className="p-2 border">תאריך סיום</th>
              <th className="p-2 border">הפקדה</th>
              <th className="p-2 border">משיכה</th>
              <th className="p-2 border">יתרה התחלתית</th>
              <th className="p-2 border">יתרה סופית</th>
              <th className="p-2 border">תשואה %</th>
              <th className="p-2 border">עמלות</th>
              <th className="p-2 border">הערות</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-100">
                <td className="p-2 border">{row.start_date?.slice(0, 10)}</td>
                <td className="p-2 border">{row.end_date?.slice(0, 10)}</td>
                <td className="p-2 border">{row.deposit}</td>
                <td className="p-2 border">{row.withdrawal}</td>
                <td className="p-2 border">{row.balance_start}</td>
                <td className="p-2 border">{row.balance_end}</td>
                <td className="p-2 border">{row.yield_percent}%</td>
                <td className="p-2 border">{row.fees}</td>
                <td className="p-2 border">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
	