import { Link, NavLink, Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../../dashboard.css";

export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="shell">
      <header className="topbar">
      <div className="sectionHead">
        <h2>👑 Admin vezérlőpult</h2>
      </div>
        <div className="topbarActions">
          <Link className="actionBtn actionBtn--ghost" to="/home">
            Vissza a főoldalra
          </Link>
        </div>
      </header>

      <div className="dashboardBody dashboardBody--admin">
        <aside className="dashboardSide">
          <NavLink
            to="/admin/users"
            className={({ isActive }) => "dashboardNavItem dashboardNavItem--admin" + (isActive ? " active" : "")}
          >
            Felhasználók
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) => "dashboardNavItem dashboardNavItem--admin" + (isActive ? " active" : "")}
          >
            Rendelések
          </NavLink>

          <NavLink
            to="/admin/shows"
            className={({ isActive }) => "dashboardNavItem dashboardNavItem--admin" + (isActive ? " active" : "")}
          >
            Előadások
          </NavLink>

          <NavLink
            to="/admin/add"
            className={({ isActive }) => "dashboardNavItem dashboardNavItem--admin" + (isActive ? " active" : "")}
          >
            Újak felvétele
          </NavLink>          

          <NavLink
            to="/admin/seats"
            className={({ isActive }) => "dashboardNavItem dashboardNavItem--admin" + (isActive ? " active" : "")}
          >
            Ülések
          </NavLink>

          <div className="dashboardNavItem dashboardNavItem--admin dashboardNavItem--disabled">
            Statisztikák és riportok (később)
          </div>
        </aside>

        <main className="dashboardMain">
        <div>
          <Outlet />
        </div>
        </main>
      </div>
    </div>
  );
}