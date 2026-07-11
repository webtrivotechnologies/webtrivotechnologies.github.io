import HomePage from "./pages/HomePage";
import AdminDashboard from "./admin/AdminDashboard";

export default function App() {
  const isAdminRoute = window.location.hash === "#admin" || window.location.pathname === "/admin";

  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  return <HomePage />;
}
