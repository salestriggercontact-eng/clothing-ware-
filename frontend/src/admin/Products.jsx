import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Search } from 'lucide-react';
import api, { img, inr, errMsg } from '../api';
import Loader from '../components/Loader';

export default function Products() {
  const [list, setList] = useState(null);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  const load = () => api.get('/products/admin/all', { params: { q, category: cat } }).then((r) => setList(r.data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { api.get('/categories/admin/all').then((r) => setCats(r.data)); }, []);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [q, cat]); // eslint-disable-line

  const patch = async (p, body) => {
    try { await api.put(`/products/${p._id}`, body); setList((l) => l.map((x) => (x._id === p._id ? { ...x, ...body } : x))); }
    catch (e) { toast.error(errMsg(e)); }
  };
  const del = async (p) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try { await api.delete(`/products/${p._id}`); setList((l) => l.filter((x) => x._id !== p._id)); toast.success('Product deleted'); }
    catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div>
      <div className="a-head"><h1>Products</h1><Link to="/admin/products/new" className="btn btn-sm">Add product</Link></div>
      <div className="filters">
        <div className="search"><Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or fabric" /></div>
        <select value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{cats.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}</select>
      </div>
      {!list ? <Loader /> : !list.length ? <p className="notice">No products found. {!cats.length && 'Create a category first, then add products.'}</p> : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Trending</th><th>Visible</th><th></th></tr></thead>
          <tbody>{list.map((p) => (
            <tr key={p._id}>
              <td><img className="t-img" src={img(p.images?.[0])} alt="" /></td>
              <td><b>{p.name}</b>{p.isDemo && <span className="tag">Demo</span>}<br /><small className="muted">{p.fabric}</small></td>
              <td>{p.category?.name || <span className="danger">Missing</span>}</td>
              <td>{inr(p.price)}{p.mrp > p.price && <><br /><s className="muted small">{inr(p.mrp)}</s></>}</td>
              <td className={p.stock <= 5 ? 'warn' : ''}>{p.stock}</td>
              <td><input type="checkbox" className="switch" checked={!!p.isTrending} onChange={(e) => patch(p, { isTrending: e.target.checked })} aria-label="Trending" /></td>
              <td><input type="checkbox" className="switch" checked={!!p.isActive} onChange={(e) => patch(p, { isActive: e.target.checked })} aria-label="Visible" /></td>
              <td className="t-actions"><Link to={`/admin/products/${p._id}`} className="icon-btn" aria-label="Edit"><Pencil size={16} /></Link><button className="icon-btn" onClick={() => del(p)} aria-label="Delete"><Trash2 size={16} /></button></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
