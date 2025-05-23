import { useEffect, useState } from "react";
import ClientYieldChart from "../components/ClientYieldChart";
import MarketComparisonChart from "../components/MarketComparisonChart";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function ClientDashboard() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [currency, setCurrency] = useState("ILS");
  const [rates, setRates] = useState({ USD: 1, EUR: 1, ILS: 1 });
  const [lastUpdated, setLastUpdated] = useState("");

  const fallbackRates = {
    USD: 3.8,
    EUR: 4.1,
    ILS: 1,
  };

  useEffect(() => {
    fetch(`${BASE_URL}/financial/my-data`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        const sorted = [...json].sort(
          (a, b) => new Date(b.start_date) - new Date(a.start_date)
        );
        setAllData(sorted);
        setData(sorted);
        setLoading(false);
      });

    fetch("https://open.er-api.com/v6/latest/ILS")
      .then((res) => res.json())
      .then((json) => {
        console.log("Full API response:", json);
        if (!json || !json.rates) throw new Error("No rates found");
        const ilsToOthers = {
          USD: json.rates.USD,
          EUR: json.rates.EUR,
          ILS: 1,
        };
        setRates(ilsToOthers);
        setLastUpdated(json.time_last_update_utc);
      })
      .catch((err) => {
        console.warn("Using fallback currency rates due to error:", err);
        setCurrency("ILS");
        setRates(fallbackRates);
      });
  }, []);

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      setData(allData);
      return;
    }
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const filtered = allData.filter((item) => {
      const itemDate = new Date(item.start_date);
      return itemDate >= from && itemDate <= to;
    });
    setData(filtered);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("he-IL");

  const formatNumber = (num) => {
    const parsed = parseFloat(num);
    if (isNaN(parsed)) return "";

    const rate = rates[currency] ?? 1;
    const converted = parsed * rate;

    return converted.toLocaleString("he-IL", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    });
  };

  const totalDeposit = data.reduce((sum, i) => sum + parseFloat(i.deposit), 0);
  const totalWithdrawal = data.reduce(
    (sum, i) => sum + parseFloat(i.withdrawal),
    0
  );
  const totalFees = data.reduce((sum, i) => sum + parseFloat(i.fees), 0);
  const totalStart = data.reduce(
    (sum, i) => sum + parseFloat(i.balance_start),
    0
  );
  const totalEnd = data.reduce((sum, i) => sum + parseFloat(i.balance_end), 0);
  const avgYield =
    data.length > 0
      ? (
          data.reduce((sum, i) => sum + parseFloat(i.yield_percent), 0) /
          data.length
        ).toFixed(2)
      : "0.00";

  const minStartDate =
    data.length > 0
      ? formatDate(
          data.reduce((min, i) =>
            new Date(i.start_date) < new Date(min.start_date) ? i : min
          ).start_date
        )
      : "-";

  const maxEndDate =
    data.length > 0
      ? formatDate(
          data.reduce((max, i) =>
            new Date(i.end_date) > new Date(max.end_date) ? i : max
          ).end_date
        )
      : "-";

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        הנתונים הפיננסיים שלך
      </h2>

      <div className="flex flex-col md:flex-row-reverse gap-4 justify-center items-end mb-6">
        <div className="flex flex-col items-center">
          <label htmlFor="fromDate" className="font-semibold text-center mb-1">
            מתאריך
          </label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="toDate" className="font-semibold text-center mb-1">
            עד תאריך
          </label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2 md:mt-6"
        >
          סנן
        </button>
      </div>

      <div className="flex justify-end mb-2 gap-4 items-center">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="ILS">ש"ח</option>
          <option value="USD">דולר</option>
          <option value="EUR">אירו</option>
        </select>
        {lastUpdated && (
          <span className="text-xs text-gray-500">עודכן: {new Date(lastUpdated).toLocaleString("he-IL")}</span>
        )}
      </div>

      {loading ? (
        <p>טוען נתונים...</p>
      ) : (
        <>
          <div className="border rounded shadow overflow-x-auto mb-6">
            <table className="min-w-full text-center text-sm bg-white rtl">
              <thead className="bg-gray-100 sticky top-0 z-10 text-sm font-bold">
                <tr>
                  <th className="p-2">הערות</th>
                  <th className="p-2">עמלות</th>
                  <th className="p-2">% תשואה</th>
                  <th className="p-2">יתרה סופית</th>
                  <th className="p-2">יתרה התחלתית</th>
                  <th className="p-2">משיכה</th>
                  <th className="p-2">הפקדה</th>
                  <th className="p-2">תאריך סיום</th>
                  <th className="p-2">תאריך התחלה</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-2">{row.notes}</td>
                    <td className="p-2">{formatNumber(row.fees)}</td>
                    <td className="p-2">{row.yield_percent}%</td>
                    <td className="p-2">{formatNumber(row.balance_end)}</td>
                    <td className="p-2">{formatNumber(row.balance_start)}</td>
                    <td className="p-2">{formatNumber(row.withdrawal)}</td>
                    <td className="p-2">{formatNumber(row.deposit)}</td>
                    <td className="p-2">{formatDate(row.end_date)}</td>
                    <td className="p-2">{formatDate(row.start_date)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 sticky bottom-0 z-10 font-semibold">
                <tr>
                  <td className="p-2">סה"כ</td>
                  <td className="p-2">{formatNumber(totalFees)}</td>
                  <td className="p-2">{avgYield}%</td>
                  <td className="p-2">{formatNumber(totalEnd)}</td>
                  <td className="p-2">{formatNumber(totalStart)}</td>
                  <td className="p-2">{formatNumber(totalWithdrawal)}</td>
                  <td className="p-2">{formatNumber(totalDeposit)}</td>
                  <td className="p-2">{maxEndDate}</td>
                  <td className="p-2">{minStartDate}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-start mt-8">
            <div className="flex-1 min-w-[300px] max-w-[600px]">
              <h2 className="text-center text-lg font-bold mb-2">תשואת הלקוח לאורך זמן</h2>
              <div className="h-96">
                <ClientYieldChart data={data} />
              </div>
            </div>
            <div className="flex-1 min-w-[300px] max-w-[600px]">
              <h2 className="text-center text-lg font-bold mb-2">השוואה לתשואת שוק</h2>
              <div className="h-96">
                <MarketComparisonChart data={data} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
