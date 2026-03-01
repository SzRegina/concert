import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../utility/config";

const API = `${API_BASE}/api/users`;

export type Role = "Admin" | "Jegykezelő" | "Felhasználó";

export type UserRow = {
  id: number;
  username: string;
  email: string;
  name: string;
  role: Role;
};

const roleFromApi = (r: unknown): Role => {
  if (r === 0 || r === "0") return "Admin";
  if (r === 1 || r === "1") return "Jegykezelő";
  if (r === 2 || r === "2") return "Felhasználó";
  return "Felhasználó";
};

const roleToApi = (role: Role): number => {
  if (role === "Admin") return 0;
  if (role === "Jegykezelő") return 1;
  return 2;
};

export function useUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

const data = await res.json();

const list = Array.isArray(data) ? data : (data.users ?? data.data ?? []);
setUsers(
  list.map((u: any) => ({
    id: u.id,
    username: u.username ?? "",
    email: u.email ?? "",
    name: u.name ?? "",
    role: roleFromApi(u.role),
  }))
); 
setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Nem sikerült betölteni a felhasználókat.");
    } finally {
      setLoading(false);
    }
  }, []);
  

  const addUser = useCallback(
    async (user: Omit<UserRow, "id">) => {
      const res = await fetch(API, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Hiba a felhasználó létrehozásakor.");

      await load();
    },
    [load]
  );

  const updateRole = useCallback(
    async (id: number, role: Role) => {
      const res = await fetch(`${API}/${id}/role`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ role: roleToApi(role) }),
      });

      if (!res.ok) throw new Error("Hiba a szerepkör módosításakor.");

      await load();
    },
    [load]
  );

  const removeUser = useCallback(
    async (id: number) => {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Hiba a törléskor.");

      await load();
    },
    [load]
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    users,
    loading,
    error,
    reload: load,
    addUser,
    updateRole,
    removeUser,
  };
}
