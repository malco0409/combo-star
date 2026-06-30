// AdminApp.jsx — CRM "/admin/*" ostida mount qilinadi
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getSession, logout, getEmployees } from "./data/auth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Buyurtmalar from "./pages/Buyurtmalar";
import Mijozlar from "./pages/Mijozlar";
import Ombor from "./pages/Ombor";
import AttendancePage from "./pages/attendance/AttendancePage";
import AdminAttendancePage from "./pages/attendance/AdminAttendancePage";

export default function AdminApp() {
  const [session, setSession] = useState(getSession());

  const handleLogin = (s) => setSession(s);
  const handleLogout = () => { logout(); setSession(null); };

  if (!session) {
    return (
      <div className="crm-root">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  const role = session.role;

  return (
    <div className="crm-root">
      <Routes>
        <Route path="/" element={<Layout session={session} onLogout={handleLogout} />}>

          {/* Default yo'naltirish rolga qarab */}
          <Route index element={
            role === "ishchi"
              ? <Navigate to="/admin/davomat" replace />
              : <Navigate to="/admin/dashboard" replace />
          } />

          {/* Admin + Operator */}
          <Route path="dashboard" element={
            ["admin", "operator"].includes(role)
              ? <Dashboard />
              : <Navigate to="/admin/davomat" replace />
          } />
          <Route path="buyurtmalar" element={
            ["admin", "operator"].includes(role)
              ? <Buyurtmalar />
              : <Navigate to="/admin/davomat" replace />
          } />
          <Route path="mijozlar" element={
            ["admin", "operator"].includes(role)
              ? <Mijozlar />
              : <Navigate to="/admin/davomat" replace />
          } />

          {/* Faqat Admin */}
          <Route path="ombor" element={
            role === "admin"
              ? <Ombor />
              : <Navigate to="/admin/dashboard" replace />
          } />

          {/* Admin + Ishchi */}
          <Route path="davomat" element={
            ["admin", "ishchi"].includes(role)
              ? <AttendancePage session={session} />
              : <Navigate to="/admin/dashboard" replace />
          } />

          {/* Faqat Admin — barcha xodimlar hisoboti */}
          <Route path="davomat/admin" element={
            role === "admin"
              ? <AdminAttendancePage session={session} employees={getEmployees()} />
              : <Navigate to="/admin/davomat" replace />
          } />

          {/* Noma'lum yo'l */}
          <Route path="*" element={<Navigate to="/admin" replace />} />

        </Route>
      </Routes>
    </div>
  );
}
