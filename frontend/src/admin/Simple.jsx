import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';
import api, { img, errMsg, fmtDate } from '../api';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import ImageUpload from './ImageUpload';

// Generic admin CRUD screen driven by a field config
function SimpleCrud({ title, endpoint, fields, columns, empty, help }) {
  const [list, setList] = useState(null);
  const [edit, setEdit] = useState(null);
  const blank = Object.fromEntries(fields.map((f) => [f.key, f.default ?? (f.type === 'checkbox' ? true : '')]));

  const load = () => api.get(`/${endpoint}/admin/all`).then((r) => setList(r.data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []); // eslint-disable-line

  const save = async (e) => {
    e.preventDefault();
    const body = { ...edit };
    fields.forEach((f) => { if (f.type === 'number') body[f.key] = Number(body[f.key]) || 0; if (f.type === 'date') body[f.key] = body[f.key] || null; });
    try {
      if (edit._id) await api.put(`/${endpoint}/${edit._id}`, body); else await api.post(`/${endpoint}`, body);
      toast.success('Saved'); setEdit(null); load();
    } catch (er) { toast.error(errMsg(er)); }
  };
  const del = async (row) => {
    if (!confirm('Delete this item?')) return;
    try { await api.delete(`/${endpoint}/${row._id}`); toast.success('Deleted'); load(); } catch (er) { toast.error(errMsg(er)); }
  };
  const toggle = async (row, key) => {
    try { await api.put(`/${endpoint}/${row._id}`, { [key]: !row[key] }); load(); } catch (er) { toast.error(errMsg(er)); }
  };
  const openEdit = (row) => setEdit(row ? { ...row, ...Object.fromEntries(fields.filter((f) => f.type === 'date').map((f) => [f.key, row[f.key] ? row[f.key].slice(0, 10) : ''])) } : { ...blank });

  const input = (f) => {
    const v = edit[f.key];
    const on = (val) => setEdit((x) => ({ ...x, [f.key]: val }));
    if (f.type === 'image') return <ImageUpload value={v} onChange={on} />;
    if (f.type === 'textarea') return <textarea rows={3} value={v || ''} onChange={(e) => on(e.target.value)} />;
    if (f.type === 'select') return <select value={v} onChange={(e) => on(e.target.value)}>{f.options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}</select>;
    if (f.type === 'checkbox') return <input type="checkbox" checked={!!v} onChange={(e) => on(e.target.checked)} />;
    return <input type={f.type || 'text'} required={f.required} value={v ?? ''} onChange={(e) => on(f.upper ? e.target.value.toUpperCase() : e.target.value)} placeholder={f.placeholder} />;
  };

  return (
    <div>
      <div className="a-head"><h1>{title}</h1><button className="btn btn-sm" onClick={() => openEdit(null)}>Add new</button></div>
      {help && <p className="muted small">{help}</p>}
      {!list ? <Loader /> : !list.length ? <p className="notice">{empty}</p> : (
        <div className="table-wrap"><table className="table">
          <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th>Active</th><th></th></tr></thead>
          <tbody>{list.map((row) => (
            <tr key={row._id}>
              {columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}
              <td><input type="checkbox" className="switch" checked={!!row.isActive} onChange={() => toggle(row, 'isActive')} aria-label="Active" /></td>
              <td className="t-actions"><button className="icon-btn" onClick={() => openEdit(row)} aria-label="Edit"><Pencil size={16} /></button><button className="icon-btn" onClick={() => del(row)} aria-label="Delete"><Trash2 size={16} /></button></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
      {edit && (
        <Modal title={edit._id ? `Edit ${title.toLowerCase().replace(/s$/, '')}` : `New ${title.toLowerCase().replace(/s$/, '')}`} onClose={() => setEdit(null)}>
          <form className="form" onSubmit={save}>
            {fields.map((f) => <label key={f.key} className={f.type === 'checkbox' ? 'check' : ''}>{f.type === 'checkbox' && input(f)}{f.label}{f.type !== 'checkbox' && input(f)}</label>)}
            <button className="btn btn-block">Save</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

const thumb = (row) => (row.image ? <img className="t-img" src={img(row.image)} alt="" /> : <span className="t-img" />);

export const AdminCategories = () => (
  <SimpleCrud title="Categories" endpoint="categories" empty="No categories yet. Add Sarees, Kurtis, Dresses and so on."
    help="Lower order number shows first. Image is shown as the category icon and on the categories page."
    fields={[{ key: 'name', label: 'Name', required: true }, { key: 'tagline', label: 'Tagline', placeholder: 'Grace in every drape' }, { key: 'image', label: 'Image', type: 'image' }, { key: 'order', label: 'Order', type: 'number', default: 0 }, { key: 'isActive', label: 'Show in store', type: 'checkbox' }]}
    columns={[{ key: 'image', label: '', render: thumb }, { key: 'name', label: 'Name' }, { key: 'tagline', label: 'Tagline' }, { key: 'order', label: 'Order' }]} />
);

export const AdminBanners = () => (
  <SimpleCrud title="Banners" endpoint="banners" empty="No banners yet. The home page shows a plain hero until you add one."
    help="Use wide images (about 1600 x 700). Link can be /shop, /shop/sarees or any page."
    fields={[{ key: 'eyebrow', label: 'Small text above title', placeholder: 'New collection' }, { key: 'title', label: 'Title', required: true }, { key: 'subtitle', label: 'Subtitle' }, { key: 'image', label: 'Image', type: 'image' }, { key: 'buttonText', label: 'Button text', default: 'Shop now' }, { key: 'link', label: 'Button link', default: '/shop' }, { key: 'order', label: 'Order', type: 'number', default: 0 }, { key: 'isActive', label: 'Show on home page', type: 'checkbox' }]}
    columns={[{ key: 'image', label: '', render: thumb }, { key: 'title', label: 'Title' }, { key: 'link', label: 'Link' }, { key: 'order', label: 'Order' }]} />
);

export const AdminServices = () => (
  <SimpleCrud title="Services" endpoint="services" empty="No services yet. Add Styling consultation, Makeup and hair, etc. to open appointment booking."
    fields={[{ key: 'name', label: 'Service name', required: true }, { key: 'subtitle', label: 'Subtitle', placeholder: 'Personal style session' }, { key: 'location', label: 'Location', placeholder: 'Studio address' }, { key: 'image', label: 'Image', type: 'image' }, { key: 'isActive', label: 'Open for booking', type: 'checkbox' }]}
    columns={[{ key: 'image', label: '', render: thumb }, { key: 'name', label: 'Name' }, { key: 'location', label: 'Location' }]} />
);

export const AdminCoupons = () => (
  <SimpleCrud title="Coupons" endpoint="coupons" empty="No coupons yet."
    fields={[{ key: 'code', label: 'Code', required: true, upper: true, placeholder: 'WELCOME10' }, { key: 'description', label: 'Description' },
      { key: 'type', label: 'Type', type: 'select', default: 'percent', options: [['percent', 'Percent off'], ['flat', 'Flat ₹ off']] },
      { key: 'value', label: 'Value', type: 'number', required: true }, { key: 'minOrder', label: 'Minimum order (₹)', type: 'number', default: 0 },
      { key: 'maxDiscount', label: 'Max discount for percent (₹, 0 = no limit)', type: 'number', default: 0 },
      { key: 'expiresAt', label: 'Expiry date (optional)', type: 'date' }, { key: 'isActive', label: 'Active', type: 'checkbox' }]}
    columns={[{ key: 'code', label: 'Code' }, { key: 'value', label: 'Value', render: (r) => (r.type === 'percent' ? `${r.value}%` : `₹${r.value}`) }, { key: 'minOrder', label: 'Min order' }, { key: 'expiresAt', label: 'Expires', render: (r) => (r.expiresAt ? fmtDate(r.expiresAt) : 'Never') }]} />
);
