import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

/**
 * Protects a route and ensures only admin users can access it.
 */
export default function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null); // null = still checking

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await fetch("http://localhost:3001/users/me", {
          credentials: "include",
        });
        const profile = await res.json();
        setIsAdmin(profile.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    };

    checkRole();
  }, []);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        טוען הרשאות...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
