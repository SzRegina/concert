import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { ConcertPage } from "./pages/Concerts";
import { Home } from "./pages/Home";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { UsersPage } from "./pages/admin/UsersPage";
import { OrdersPage } from "./pages/admin/OrdersPage";
import { ShowsPage } from "./pages/admin/ShowsPage";
import { SeatsPage } from "./pages/admin/SeatsPage";
import { UserLayout } from "./pages/regUser/UserLayout";
import { REG_OrdersPage } from "./pages/regUser/REG_OrdersPage";
import { PersonalData } from "./pages/regUser/PersonalData";

const API = "http://localhost:8000/api";

function getRole(u: any): number | null {
  const r = u?.role ?? u?.role_id ?? u?.roleId ?? u?.Role ?? null;
  if (r === null || r === undefined) return null;
  const n = Number(r);
  return Number.isFinite(n) ? n : null;
}

function RequireRole(props: {
  user: any | null;
  allowed: number[];
  authChecked: boolean;
  children: React.ReactElement;
}) {
  if (!props.authChecked) {
    return <div style={{ padding: 20 }}>Betöltés...</div>;
  }

  if (!props.user) return <Navigate to="/login" replace />;

  const role = getRole(props.user);
  if (role === null || !props.allowed.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return props.children;
}

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthChecked(true);
        return;
      }

      try {
        const res = await fetch(`${API}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        setUser(res.ok ? await res.json() : null);
      } catch {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
    } catch {
    }

    localStorage.removeItem("token");
    setUser(null);
    setAuthChecked(true);
  };

  return (
    <BrowserRouter>
      <Header user={user} onLogout={logout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/concerts" element={<ConcertPage />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />

        <Route
          path="/admin"
          element={
            <RequireRole user={user} allowed={[0]} authChecked={authChecked}>
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="users" element={<UsersPage />} /> 
          <Route path="orders" element={<OrdersPage />} />
          <Route path="shows" element={<ShowsPage />} />
          <Route path="seats" element={<SeatsPage />} />
        </Route>

        <Route
          path="/user"
          element={
            <RequireRole user={user} allowed={[2]} authChecked={authChecked}>
              <UserLayout user={user} onLogout={logout} />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="personal" replace />} />
          <Route path="personal" element={<PersonalData onUserUpdated={setUser} />} />
          <Route path="orders" element={<REG_OrdersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}