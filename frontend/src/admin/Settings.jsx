import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg, inr } from '../api';
import { useSettings } from '../context/SettingsContext';
import Loader from '../components/Loader';

const GROUPS = [
  ['Store', [['storeName', 'Store name (shown in logo)'], ['legalName', 'Registered business name'], ['gstin', 'GSTIN'], ['address', 'Business address', 'textarea']]],
  ['Contact', [['phone', 'Support phone'], ['whatsapp', 'WhatsApp number (with country code, e.g. 919876543210)'], ['email', 'Support email'], ['hours', 'Working hours']]],
  ['Grievance officer (required for Indian e-commerce)', [['grievanceName', 'Name'], ['grievanceEmail', 'Email']]],
  ['Delivery and returns (used in policy pages)', [['dispatchDays', 'Dispatch time, in working days (e.g. 1 to 2)'], ['deliveryDays', 'Delivery time after dispatch (e.g. 4 to 7)'], ['returnDays', 'Return window in days', 'number']]],
  ['Social links', [['instagram', 'Instagram URL'], ['facebook', 'Facebook URL']]],
];

export default function Settings() {
  const { setSettings } = useSettings();
  const [s, setS] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get('/settings').then((r) => setS(r.data)).catch((e) => toast.error(errMsg(e))); }, []);
  if (!s) return <Loader />;

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try { const { data } = await api.put('/settings', { ...s, returnDays: Number(s.returnDays) || 0 }); setS(data); setSettings((x) => ({ ...x, ...data })); toast.success('Settings saved'); }
    catch (er) { toast.error(errMsg(er)); } finally { setSaving(false); }
  };

  return (
    <form className="form" onSubmit={save}>
      <div className="a-head"><h1>Store settings</h1><button className="btn btn-sm" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</button></div>
      {GROUPS.map(([title, fields]) => (
        <section key={title} className="panel form">
          <h3>{title}</h3>
          {fields.map(([k, label, type]) => (
            <label key={k}>{label}
              {type === 'textarea'
                ? <textarea rows={2} value={s[k] || ''} onChange={(e) => setS({ ...s, [k]: e.target.value })} />
                : <input type={type || 'text'} value={s[k] ?? ''} onChange={(e) => setS({ ...s, [k]: e.target.value })} />}
            </label>
          ))}
        </section>
      ))}
      <section className="panel">
        <h3>Delivery charges</h3>
        <p className="small">Free delivery from <b>{inr(s.freeDeliveryMin)}</b>, otherwise <b>{inr(s.deliveryFee)}</b>.</p>
        <p className="muted small">Change these with FREE_DELIVERY_MIN and DELIVERY_FEE in the backend environment (Render dashboard), then redeploy. Cart, checkout and policy pages update automatically.</p>
      </section>
    </form>
  );
}
