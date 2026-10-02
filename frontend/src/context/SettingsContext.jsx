import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { STORE, inr } from '../api';

const Ctx = createContext(null);
export const useSettings = () => useContext(Ctx);

const LABELS = {
  storeName: 'store name', legalName: 'business name', email: 'email', phone: 'phone', whatsapp: 'WhatsApp',
  address: 'address', gstin: 'GSTIN', hours: 'working hours', grievanceName: 'grievance officer name',
  grievanceEmail: 'grievance officer email', returnDays: 'return days', dispatchDays: 'dispatch days', deliveryDays: 'delivery days',
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({ storeName: STORE, freeDeliveryMin: 999, deliveryFee: 79 });
  const [pages, setPages] = useState([]);

  const reload = useCallback(() => {
    api.get('/settings').then((r) => setSettings((s) => ({ ...s, ...r.data, storeName: r.data.storeName || STORE }))).catch(() => {});
    api.get('/pages').then((r) => setPages(r.data)).catch(() => {});
  }, []);
  useEffect(() => { reload(); }, [reload]);

  // Replace {{placeholders}} in page content with store settings
  const fill = (text = '') => text.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (k === 'freeDeliveryMin') return inr(settings.freeDeliveryMin);
    if (k === 'deliveryFee') return inr(settings.deliveryFee);
    const v = settings[k];
    return v === undefined || v === null || v === '' ? `[${LABELS[k] || k} not set]` : String(v);
  });

  return <Ctx.Provider value={{ settings, setSettings, pages, reload, fill }}>{children}</Ctx.Provider>;
}
