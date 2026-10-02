import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import api, { errMsg, fmtDate } from '../api';
import { useSettings } from '../context/SettingsContext';
import Loader from '../components/Loader';
import Markdown from '../components/Markdown';

const HELP = 'Formatting: ## Heading, ### Small heading, - bullet, 1. numbered, **bold**, [link text](/page/faqs). Placeholders like {{storeName}}, {{email}}, {{phone}}, {{address}}, {{gstin}}, {{returnDays}}, {{freeDeliveryMin}} are filled from Store settings.';

function Editor({ page, onDone }) {
  const { fill, reload } = useSettings();
  const [p, setP] = useState(page);
  const [tab, setTab] = useState('edit');
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      if (p._id) await api.put(`/pages/${p._id}`, p); else await api.post('/pages', p);
      toast.success('Page saved'); reload(); onDone();
    } catch (e) { toast.error(errMsg(e)); } finally { setSaving(false); }
  };
  const reset = async () => {
    if (!confirm('Replace this page with the original template text? Your edits will be lost.')) return;
    try { const { data } = await api.post(`/pages/${p._id}/reset`); setP(data); toast.success('Template restored'); }
    catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div>
      <div className="a-head"><h1>{p._id ? 'Edit page' : 'New page'}</h1>
        <div className="row-actions">
          {p._id && <button className="link" onClick={reset}>Restore template</button>}
          <button className="btn btn-ghost btn-sm" onClick={onDone}>Cancel</button>
          <button className="btn btn-sm" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save page'}</button>
        </div>
      </div>
      <div className="panel form">
        <div className="row3">
          <label>Title<input value={p.title} onChange={(e) => set('title', e.target.value)} /></label>
          <label>Order<input type="number" value={p.order} onChange={(e) => set('order', Number(e.target.value))} /></label>
          <div className="stack">
            <label className="check"><input type="checkbox" checked={p.isActive} onChange={(e) => set('isActive', e.target.checked)} /> Published</label>
            <label className="check"><input type="checkbox" checked={p.showInFooter} onChange={(e) => set('showInFooter', e.target.checked)} /> Show in footer</label>
          </div>
        </div>
        <div className="tabs tabs-sm">{['edit', 'preview'].map((t) => <button key={t} type="button" className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t === 'edit' ? 'Edit' : 'Preview'}</button>)}</div>
        {tab === 'edit'
          ? <><textarea className="editor" rows={24} value={p.content} onChange={(e) => set('content', e.target.value)} /><p className="muted small">{HELP}</p></>
          : <div className="doc preview"><Markdown text={fill(p.content)} /></div>}
      </div>
    </div>
  );
}

export default function Pages() {
  const [list, setList] = useState(null);
  const [edit, setEdit] = useState(null);
  const { reload } = useSettings();
  const load = () => api.get('/pages/admin/all').then((r) => setList(r.data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []);

  if (edit) return <Editor page={edit} onDone={() => { setEdit(null); load(); }} />;
  if (!list) return <Loader />;

  const del = async (p) => {
    if (!confirm(`Delete "${p.title}"? Payment gateways usually require Terms, Privacy, Refund, Shipping and Contact pages.`)) return;
    try { await api.delete(`/pages/${p._id}`); toast.success('Page deleted'); load(); reload(); } catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div>
      <div className="a-head"><h1>Pages and policies</h1><button className="btn btn-sm" onClick={() => setEdit({ title: '', content: '', order: list.length + 1, isActive: true, showInFooter: true })}>Add page</button></div>
      <p className="notice">These pages are templates. Fill <Link to="/admin/settings">Store settings</Link> first, then read every page and change anything that does not match how you actually run the business. Get them checked by a lawyer or CA before going live.</p>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Title</th><th>Link</th><th>Updated</th><th>Footer</th><th>Published</th><th></th></tr></thead>
        <tbody>{list.map((p) => (
          <tr key={p._id}>
            <td><b>{p.title}</b></td>
            <td><a href={`/page/${p.slug}`} target="_blank" rel="noreferrer" className="link small">/page/{p.slug} <ExternalLink size={12} /></a></td>
            <td>{fmtDate(p.updatedAt)}</td>
            <td>{p.showInFooter ? 'Yes' : 'No'}</td>
            <td>{p.isActive ? 'Yes' : 'No'}</td>
            <td className="t-actions"><button className="icon-btn" onClick={() => setEdit(p)} aria-label="Edit"><Pencil size={16} /></button><button className="icon-btn" onClick={() => del(p)} aria-label="Delete"><Trash2 size={16} /></button></td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}
