import { lazy, Suspense } from "react";
import HomePage from "./pages/HomePage";

const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));

export default function App() {
  const isAdminRoute = window.location.hash === "#admin" || window.location.pathname === "/admin";

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="admin-login-page">Loading admin...</div>}>
        <AdminDashboard />
      </Suspense>
    );
  }

  return <HomePage />;
}
