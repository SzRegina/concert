import { User } from "../types";

export function getRole(u: User | null | undefined): number | null {
  const r = u?.role ?? u?.role_id ?? u?.roleId ?? u?.Role ?? null;
  if (r === null || r === undefined) return null;

  const n = Number(r);
  return Number.isFinite(n) ? n : null;
}

export function isAdmin(u: User | null | undefined): boolean {
  return getRole(u) === 0;
}

export function isRegisteredUser(u: User | null | undefined): boolean {
  return getRole(u) === 2;
}
