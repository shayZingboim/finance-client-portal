import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
  
	const handleLogin = async (e) => {
	  e.preventDefault();
	  setLoading(true);
	  setError("");
  
	  try {
		const res = await fetch("http://localhost:3001/users/login", {
		  method: "POST",
		  credentials: "include",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ email, password }),
		});
  
		const contentType = res.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
		  const text = await res.text();
		  throw new Error(`Unexpected response: ${text}`);
		}
  
		const data = await res.json();
		if (!res.ok) {
		  throw new Error(data.error || data.message || "שגיאה בהתחברות");
		}
  
		// ✅ בקשת פרופיל כדי לבדוק את התפקיד
		const profileRes = await fetch("http://localhost:3001/users/me", {
		  credentials: "include",
		});
		const profile = await profileRes.json();
  
		if (profile.role === "admin") {
		  navigate("/admin");
		} else {
		  navigate("/dashboard");
		}
	  } catch (err) {
		setError(err.message);
	  } finally {
		setLoading(false);
	  }
	};
  
	return (
	  <div className="min-h-screen flex items-center justify-center bg-gray-100">
		<Card className="w-full max-w-sm shadow-xl">
		  <CardContent className="p-6">
			<h2 className="text-2xl font-bold mb-4 text-center">התחברות</h2>
			<form onSubmit={handleLogin} className="space-y-4 text-right" dir="rtl">
			  <div>
				<Label htmlFor="email">אימייל</Label>
				<Input
				  id="email"
				  type="email"
				  value={email}
				  onChange={(e) => setEmail(e.target.value)}
				  required
				/>
			  </div>
			  <div>
				<Label htmlFor="password">סיסמה</Label>
				<Input
				  id="password"
				  type="password"
				  value={password}
				  onChange={(e) => setPassword(e.target.value)}
				  required
				/>
			  </div>
			  {error && <p className="text-red-500 text-sm">{error}</p>}
			  <Button type="submit" className="w-full" disabled={loading}>
				{loading ? "טוען..." : "התחבר"}
			  </Button>
			</form>
		  </CardContent>
		</Card>
	  </div>
	);
  }
  