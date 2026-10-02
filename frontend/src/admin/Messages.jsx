import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import api, { errMsg, fmtDate } from '../api';
import Loader from '../components/Loader';

export default function Messages() {
  const [list, setList] = useState(null);
  const load = () => api.get('/messages/admin/all').then((r) => setList(r.data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []);
  const setStatus = async (m, status) => {
    try { const { data } = await api.put(`/messages/${m._id}`, { status }); setList((l) => l.map((x) => (x._id === m._id ? data : x))); }
    catch (e) { toast.error(errMsg(e)); }
  };
  const del = async (m) => {
    if (!confirm('Delete this message?')) return;
    try { await api.delete(`/messages/${m._id}`); setList((l) => l.filter((x) => x._id !== m._id)); } catch (e) { toast.error(errMsg(e)); }
  };
  if (!list) return <Loader />;
  return (
    <div>
      <div className="a-head"><h1>Messages</h1></div>
      {!list.length ? <p className="notice">No messages yet. Messages from the Contact us page appear here.</p> : (
        <div className="stack">{list.map((m) => (
          <div key={m._id} className={`panel msg ${m.status === 'New' ? 'msg-new' : ''}`}>
            <div className="msg-head">
              <div className="grow"><b>{m.name}</b> <span className="muted small">{fmtDate(m.createdAt)}</span>
                <p className="small">{m.phone && <a href={`tel:${m.phone}`}>{m.phone}</a>}{m.phone && m.email && ', '}{m.email && <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Your message'))}`}>{m.email}</a>}</p>
              </div>
              <select value={m.status} onChange={(e) => setStatus(m, e.target.value)}>{['New', 'Replied', 'Closed'].map((s) => <option key={s}>{s}</option>)}</select>
              <button className="icon-btn" onClick={() => del(m)} aria-label="Delete"><Trash2 size={16} /></button>
            </div>
            {m.subject && <p className="tag">{m.subject}</p>}
            <p className="msg-body">{m.message}</p>
          </div>
        ))}</div>
      )}
    </div>
  );
}
