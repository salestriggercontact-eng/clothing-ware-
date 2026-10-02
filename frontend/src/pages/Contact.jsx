import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Phone, Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import api, { errMsg } from '../api';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import PageHead from '../components/PageHead';

export default function Contact() {
  const { settings: s } = useSettings();
  const { user } = useAuth();
  const [f, setF] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const bind = (k) => ({ value: f[k], onChange: (e) => setF({ ...f, [k]: e.target.value }) });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.email && !f.phone) return toast.error('Add an email or phone number so we can reply');
    setBusy(true);
    try { await api.post('/messages', f); setSent(true); }
    catch (er) { toast.error(errMsg(er)); } finally { setBusy(false); }
  };

  return (
    <div>
      <PageHead title="Contact us" />
      <div className="two-col">
        <section className="panel">
          {sent ? (
            <div className="empty"><h3>Message sent</h3><p>We will reply within one working day.</p><Link className="btn" to="/">Back to shopping</Link></div>
          ) : (
            <form className="form" onSubmit={submit}>
              <h3>Send us a message</h3>
              <div className="row2"><label>Name<input required {...bind('name')} /></label><label>Phone<input inputMode="tel" {...bind('phone')} /></label></div>
              <label>Email<input type="email" {...bind('email')} /></label>
              <label>Subject<select {...bind('subject')}>
                <option value="">Choose a topic</option><option>Order or delivery</option><option>Return or refund</option>
                <option>Size or product question</option><option>Payment</option><option>Appointment</option><option>Something else</option>
              </select></label>
              <label>Message<textarea required rows={5} maxLength={3000} {...bind('message')} placeholder="Add your order number if this is about an order" /></label>
              <button className="btn btn-block" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
            </form>
          )}
        </section>
        <section className="panel contact">
          <h3>Reach us directly</h3>
          {s.phone && <a href={`tel:${s.phone}`}><Phone size={17} /> {s.phone}</a>}
          {s.whatsapp && <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Chat on WhatsApp</a>}
          {s.email && <a href={`mailto:${s.email}`}><Mail size={17} /> {s.email}</a>}
          {s.address && <p><MapPin size={17} /> {s.address}</p>}
          {s.hours && <p><Clock size={17} /> {s.hours}</p>}
          {(s.grievanceName || s.grievanceEmail) && (
            <div className="grievance"><b>Grievance officer</b><p>{s.grievanceName}</p>{s.grievanceEmail && <a href={`mailto:${s.grievanceEmail}`}>{s.grievanceEmail}</a>}</div>
          )}
          {s.legalName && <p className="muted small">{s.legalName}{s.gstin && `, GSTIN ${s.gstin}`}</p>}
        </section>
      </div>
    </div>
  );
}
