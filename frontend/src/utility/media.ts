import { API_BASE } from './config';

const ABSOLUTE_RE = /^(?:https?:)?\/\//i;

export function resolveMediaUrl(path?: string | null): string {
  const value = String(path ?? '').trim();
  if (!value) return '';
  if (ABSOLUTE_RE.test(value) || value.startsWith('data:')) return value;
  if (value.startsWith('/storage/') || value.startsWith('storage/')) {
    const normalized = value.startsWith('/') ? value : `/${value}`;
    return `${API_BASE}${normalized}`;
  }
  if (value.startsWith('/')) return `${API_BASE}${value}`;
  return `${API_BASE}/storage/${value.replace(/^\/+/, '')}`;
}
