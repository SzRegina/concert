import { Link, NavLink, Outlet } from "react-router-dom";
import "../../styles_/dashboard.css";
import "../../styles_/dashboard.light.css";

type UserLayoutProps = {
  user: any | null;
  onLogout: () => void;
};

export function UserLayout({ user, onLogout }: UserLayoutProps) {
  const userName = user?.name ?? user?.username ?? user?.email ?? "Felhasználó";

  return (
    <div className="shell">
      <header className="topbar">
        <div className="sectionHead">
          <h2>👤 {userName}</h2>
        </div>

        <div className="topbarActions">
          <Link className="actionBtn actionBtn--ghost" to="/home">
            Vissza a főoldalra
          </Link>
        </div>
      </header>

      <div className="dashboardBody dashboardBody--user">
        <aside className="dashboardSide">
          <NavLink
            to="personal"
            className={({ isActive }) =>
              "dashboardNavItem dashboardNavItem--user" + (isActive ? " active" : "")
            }
          >
            Személyes adatai
          </NavLink>

          <NavLink
            to="orders"
            className={({ isActive }) =>
              "dashboardNavItem dashboardNavItem--user" + (isActive ? " active" : "")
            }
          >
            Foglalásai / vásárlásai
          </NavLink>
        </aside>

        <main className="dashboardMain dashboardMain--user">
          <Outlet />
        </main>
      </div>
    </div>
  );
}