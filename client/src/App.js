import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute"; 
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import AdminClientInvestments from "./pages/AdminClientInvestments";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
		<Route 
			path="/dashboard"
			element={
				<PrivateRoute>
					<ClientDashboard />
				</PrivateRoute>
			}
		/>
		<Route
    		path="/admin"
    		element={
      			<AdminRoute>
        			<AdminDashboard />
      			</AdminRoute>
    		}
  		/>
		<Route
  			path="/admin/user/:id"
  			element={
    			<AdminRoute>
      				<AdminClientInvestments />
    			</AdminRoute>
  			}
		/>
		<Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
	// <AdminDashboard />
  );
}

export default App;
