import { API_BASE } from "./config";

type JsonInit = Omit<RequestInit, "body"> & { json?: any };

export function apiUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function fetchJson<T>(path: string, init: JsonInit = {}): Promise<T> {
  const { json, headers, ...rest } = init;

  const res = await fetch(apiUrl(path), {
    credentials: "include",
    ...rest,
    headers: {
      Accept: "application/json",
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}
