import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null); // user being edited
  const [editData, setEditData] = useState({ username: "", email: "" });
  const [showAddForm, setShowAddForm] = useState(false); // add user form visibility
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // shared fetch function to load users and balances
  const fetchAll = async () => {
    try {
      const [userRes, summaryRes] = await Promise.all([
        fetch("http://localhost:3001/users", { credentials: "include" }),
        fetch("http://localhost:3001/financial/summaries", {
          credentials: "include",
        }),
      ]);

      const usersData = await userRes.json();
      const summariesData = await summaryRes.json();

      const summaryMap = {};
      summariesData.forEach((s) => {
        summaryMap[s.user_id] = s.balance;
      });

      const merged = usersData.map((u) => ({
        ...u,
        balance: summaryMap[u.id] || 0,
      }));

      setUsers(merged);
    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleEditClick = (user) => {
    setEditUser(user);
    setEditData({ username: user.username, email: user.email });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:3001/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");

      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, ...editData } : u))
      );

      setEditUser(null);
    } catch (err) {
      console.error("Update failed:", err.message);
      alert("שגיאה בעדכון המשתמש");
    }
  };

  const handleDeleteUser = async (user) => {
    const confirm = window.confirm(
      `האם אתה בטוח שברצונך למחוק את המשתמש "${user.username}"?`
    );
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (editUser?.id === user.id) {
        setEditUser(null);
      }
    } catch (err) {
      console.error("Delete failed:", err.message);
      alert("שגיאה במחיקת המשתמש");
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUserData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Add failed");

      // Instead of adding manually, re-fetch full list including balance and created_at
      await fetchAll();

      setShowAddForm(false);
      setNewUserData({ username: "", email: "", password: "" });
    } catch (err) {
      console.error("Add user failed:", err.message);
      alert("שגיאה ביצירת המשתמש");
    }
  };

  const formatNumber = (num) =>
    Number(num).toLocaleString("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 2,
    });

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("he-IL");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">ממשק ניהול</h1>

      <div className="text-center mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          הוסף לקוח חדש
        </button>
      </div>

      {loading ? (
        <p className="text-center">טוען נתונים...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-center rtl">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">פעולות</th>
                <th className="p-2">מצב קופה נוכחי</th>
                <th className="p-2">תאריך הצטרפות</th>
                <th className="p-2">אימייל</th>
                <th className="p-2">שם</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">
				  <Link to={`/admin/user/${u.id}`} className="text-blue-600 hover:underline mr-2">
  השקעות
</Link>

                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteUser(u)}
                    >
                      מחק
                    </button>
                  </td>
                  <td className="p-2">{formatNumber(u.balance)}</td>
                  <td className="p-2">{formatDate(u.created_at)}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editUser && (
        <div className="bg-white shadow rounded-lg mt-6 p-4 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center">עריכת לקוח</h2>
          <div className="space-y-4 text-right">
            <div>
              <label className="block font-semibold mb-1">שם משתמש</label>
              <input
                className="border p-2 w-full rounded"
                value={editData.username}
                onChange={(e) =>
                  setEditData({ ...editData, username: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">אימייל</label>
              <input
                className="border p-2 w-full rounded"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            </div>
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={handleSaveEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                שמור
              </button>
              <button
                onClick={() => setEditUser(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white shadow rounded-lg mt-6 p-4 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center">הוספת לקוח חדש</h2>
          <div className="space-y-4 text-right">
            <div>
              <label className="block font-semibold mb-1">שם משתמש</label>
              <input
                className="border p-2 w-full rounded"
                value={newUserData.username}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, username: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">אימייל</label>
              <input
                className="border p-2 w-full rounded"
                type="email"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">סיסמה</label>
              <input
                className="border p-2 w-full rounded"
                type="password"
                value={newUserData.password}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, password: e.target.value })
                }
              />
            </div>
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={handleAddUser}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                הוסף
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
