import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ClientYieldChart from "../components/ClientYieldChart";
import MarketComparisonChart from "../components/MarketComparisonChart";

export default function AdminClientInvestments() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    start_date: "",
    end_date: "",
    deposit: "",
    withdrawal: "",
    balance_start: "",
    balance_end: "",
    fees: "",
    yield_percent: "",
    notes: "",
  });

  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    const res = await fetch(`http://localhost:3001/financial/user/${id}`, {
      credentials: "include",
    });
    const json = await res.json();
    const sorted = [...json].sort(
      (a, b) => new Date(b.start_date) - new Date(a.start_date)
    );
    setAllData(sorted);
    setData(sorted);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Format a date to Hebrew locale
const formatDate = (dateStr) =>
	new Date(dateStr).toLocaleDateString("he-IL");
  
  // Format a number to Hebrew locale with up to 2 decimal digits
  const formatNumber = (num) => {
	const parsed = parseFloat(num);
	return isNaN(parsed)
	  ? ""
	  : parsed.toLocaleString("he-IL", { maximumFractionDigits: 2 });
  };
  

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

  const addInvestment = async () => {
    try {
      const res = await fetch("http://localhost:3001/financial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...newInvestment, user_id: id }),
      });

      if (!res.ok) throw new Error("Add failed");
      setShowAddForm(false);
      setNewInvestment({
        start_date: "",
        end_date: "",
        deposit: "",
        withdrawal: "",
        balance_start: "",
        balance_end: "",
        fees: "",
        yield_percent: "",
        notes: "",
      });

      setLoading(true);
      await fetchData();
    } catch (err) {
      console.error("Add investment failed:", err.message);
      alert("שגיאה בהוספת השקעה");
    }
  };

  const startEdit = (row) => {
    setEditRowId(row.id);
    setEditData({ ...row });
  };

  const cancelEdit = () => {
    setEditRowId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/financial/${editRowId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(editData),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      setEditRowId(null);
      setEditData({});
      await fetchData();
    } catch (err) {
      console.error("Update failed:", err.message);
      alert("שגיאה בעדכון ההשקעה");
    }
  };

  const deleteInvestment = async (id) => {
    const confirm = window.confirm("האם אתה בטוח שברצונך למחוק השקעה זו?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3001/financial/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");
      await fetchData();
    } catch (err) {
      console.error("Delete failed:", err.message);
      alert("שגיאה במחיקת ההשקעה");
    }
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
      <div className="mb-4">
        <Link to="/admin" className="text-blue-600 hover:underline">
          ← חזרה לרשימת הלקוחות
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">
        השקעות של לקוח #{id}
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

      <div className="border rounded shadow overflow-x-auto mb-6">
        <table className="min-w-full text-center text-sm bg-white rtl">
          <thead className="bg-gray-100 sticky top-0 z-10 text-sm font-bold">
            <tr>
              <th className="p-2">פעולות</th>
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
            {data.map((row) =>
              editRowId === row.id ? (
                <tr key={row.id} className="bg-yellow-100 border-t">
                  <td className="p-2 flex gap-2 justify-center">
  <button onClick={saveEdit} className="text-green-600 hover:underline">
    שמור
  </button>
  <button onClick={cancelEdit} className="text-gray-600 hover:underline">
    ביטול
  </button>
</td>



                  {[
                    "notes",
                    "fees",
                    "yield_percent",
                    "balance_end",
                    "balance_start",
                    "withdrawal",
                    "deposit",
                    "end_date",
                    "start_date",
                  ].map((field) => (
                    <td key={field} className="p-2">
                      <input
                        type={
                          field.includes("date")
                            ? "date"
                            : field === "notes"
                            ? "text"
                            : "number"
                        }
                        value={
                          field.includes("date")
                            ? editData[field]?.slice(0, 10) || ""
                            : editData[field]
                        }
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            [field]: e.target.value,
                          })
                        }
                        className="border p-1 rounded w-full"
                      />
                    </td>
                  ))}
                </tr>
              ) : (
                <tr key={row.id} className="border-t">
                  <td className="p-2 flex gap-2 justify-center">
  <button onClick={() => startEdit(row)} className="text-blue-600 hover:underline">
    ערוך
  </button>
  <button onClick={() => deleteInvestment(row.id)} className="text-red-600 hover:underline">
    מחק
  </button>
</td>


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
              )
            )}
          </tbody>
          <tfoot className="bg-gray-100 sticky bottom-0 z-10 font-semibold">
            <tr>
              <td className="p-2">סה"כ</td>
              <td className="p-2" colSpan="1"></td>
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
          <h2 className="text-center text-lg font-bold mb-2">
            תשואת הלקוח לאורך זמן
          </h2>
          <div className="h-96">
            <ClientYieldChart data={data} />
          </div>
        </div>
        <div className="flex-1 min-w-[300px] max-w-[600px]">
          <h2 className="text-center text-lg font-bold mb-2">
            השוואה לתשואת שוק
          </h2>
          <div className="h-96">
            <MarketComparisonChart data={data} />
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-3xl mx-auto bg-white p-6 rounded shadow">
        {!showAddForm ? (
          <div className="text-center">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              הוסף השקעה חדשה
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">
              השקעה חדשה
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "תאריך התחלה", name: "start_date", type: "date" },
                { label: "תאריך סיום", name: "end_date", type: "date" },
                { label: "הפקדה", name: "deposit" },
                { label: "משיכה", name: "withdrawal" },
                { label: "יתרה התחלתית", name: "balance_start" },
                { label: "יתרה סופית", name: "balance_end" },
                { label: "עמלות", name: "fees" },
                { label: "% תשואה", name: "yield_percent" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block font-semibold mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "number"}
                    value={newInvestment[field.name]}
                    onChange={(e) =>
                      setNewInvestment({
                        ...newInvestment,
                        [field.name]: e.target.value,
                      })
                    }
                    className="border p-2 w-full rounded"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">הערות</label>
                <textarea
                  value={newInvestment.notes}
                  onChange={(e) =>
                    setNewInvestment({
                      ...newInvestment,
                      notes: e.target.value,
                    })
                  }
                  className="border p-2 w-full rounded"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={addInvestment}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                שמור
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
              >
                ביטול
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
  );
}


