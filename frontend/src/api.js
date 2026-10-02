import axios from 'axios';

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
export const STORE = import.meta.env.VITE_STORE_NAME || 'LuxeHer';

const api = axios.create({ baseURL: `${API_URL}/api` });
api.interceptors.request.use((c) => {
  const t = localStorage.getItem('lh_token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

export const errMsg = (e) => e?.response?.data?.message || 'Could not reach the server. Check your connection and try again.';
export const img = (u) => (!u ? '' : /^(https?:|data:)/.test(u) ? u : `${API_URL}${u}`);
export const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const fmtTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};
export default api;
