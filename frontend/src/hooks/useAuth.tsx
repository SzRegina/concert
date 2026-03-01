import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE } from "../utility/config";

const API = `${API_BASE}/api`;

type AuthState = {
  user: any | null;
  authChecked: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setAuthChecked(true);
      return;
    }

    try {
      const res = await fetch(`${API}/user`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const me = await res.json();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Nem sikerült belépni.");

    const data = await res.json();
    if (data?.access_token) {
      localStorage.setItem("token", data.access_token);
    }

    const token = localStorage.getItem("token") ?? "";
    const meRes = await fetch(`${API}/user`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });

    if (!meRes.ok) throw new Error("Nem sikerült betölteni a felhasználót.");

    const me = await meRes.json();
    setUser(me);
    setAuthChecked(true);
    return me;
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } finally {
      localStorage.removeItem("token");
    }
    setUser(null);
    setAuthChecked(true);
  }, []);

  const value = useMemo(() => ({ user, authChecked, refresh, login, logout }), [user, authChecked, refresh, login, logout]);

  return <AuthCtx.Provider value={value}>{props.children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
