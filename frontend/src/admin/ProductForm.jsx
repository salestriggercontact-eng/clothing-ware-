import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { X, Plus } from 'lucide-react';
import api, { errMsg } from '../api';
import Loader from '../components/Loader';
import ImageUpload from './ImageUpload';

const SIZE_PRESETS = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const blank = { name: '', category: '', fabric: '', price: '', mrp: '', stock: '', sizes: [], colors: [], images: [], details: [], description: '', isTrending: false, isActive: true };

export default function ProductForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(id ? null : blank);
  const [cats, setCats] = useState([]);
  const [color, setColor] = useState({ name: '', hex: '#C2185B' });
  const [customSize, setCustomSize] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/categories/admin/all').then((r) => { setCats(r.data); if (!id && r.data[0]) setP((x) => ({ ...x, category: x.category || r.data[0]._id })); });
    if (id) api.get(`/products/admin/${id}`).then((r) => setP({ ...blank, ...r.data, category: r.data.category?._id || r.data.category })).catch((e) => toast.error(errMsg(e)));
  }, [id]);

  if (!p) return <Loader />;
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));
  const bind = (k) => ({ value: p[k] ?? '', onChange: (e) => set(k, e.target.value) });
  const toggleSize = (s) => set('sizes', p.sizes.includes(s) ? p.sizes.filter((x) => x !== s) : [...p.sizes, s]);
  const addColor = () => { if (!color.name.trim()) return; set('colors', [...p.colors, { name: color.name.trim(), hex: color.hex }]); setColor({ name: '', hex: color.hex }); };

  const save = async (e) => {
    e.preventDefault();
    if (!p.category) return toast.error('Create a category first');
    if (!p.images.length) return toast.error('Add at least one image');
    if (p.mrp && +p.mrp < +p.price) return toast.error('MRP cannot be lower than the selling price');
    setSaving(true);
    const body = { ...p, price: +p.price, mrp: +p.mrp || +p.price, stock: +p.stock || 0, details: p.details.map((d) => d.trim()).filter(Boolean) };
    try {
      if (id) await api.put(`/products/${id}`, body); else await api.post('/products', body);
      toast.success(id ? 'Product updated' : 'Product added');
      nav('/admin/products');
    } catch (er) { toast.error(errMsg(er)); } finally { setSaving(false); }
  };

  if (!cats.length) return <p className="notice">Add a category first. <Link to="/admin/categories">Go to categories</Link></p>;

  return (
    <form className="form a-form" onSubmit={save}>
      <div className="a-head"><h1>{id ? 'Edit product' : 'Add product'}</h1>
        <div className="row-actions"><Link to="/admin/products" className="btn btn-ghost btn-sm">Cancel</Link><button className="btn btn-sm" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</button></div>
      </div>
      <div className="a-two">
        <div className="panel">
          <label>Product name<input required {...bind('name')} placeholder="Banarasi Silk Saree" /></label>
          <div className="row2">
            <label>Category<select required {...bind('category')}>{cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></label>
            <label>Fabric (used as filter)<input {...bind('fabric')} placeholder="Silk, Georgette, Cotton" /></label>
          </div>
          <div className="row3">
            <label>Selling price (₹)<input required type="number" min="0" {...bind('price')} /></label>
            <label>MRP (₹)<input type="number" min="0" {...bind('mrp')} /></label>
            <label>Stock<input required type="number" min="0" {...bind('stock')} /></label>
          </div>
          <label>Description<textarea rows={4} {...bind('description')} /></label>
          <label>Product details (one per line)
            <textarea rows={4} value={p.details.join('\n')} onChange={(e) => set('details', e.target.value.split('\n'))} placeholder={'Premium Banarasi silk\nRich zari work\nIncludes blouse piece\nDry clean only'} />
          </label>
          <div className="row2">
            <label className="check"><input type="checkbox" checked={p.isTrending} onChange={(e) => set('isTrending', e.target.checked)} /> Show in Trending now</label>
            <label className="check"><input type="checkbox" checked={p.isActive} onChange={(e) => set('isActive', e.target.checked)} /> Visible in store</label>
          </div>
        </div>
        <div>
          <div className="panel"><h3>Images</h3><p className="muted small">First image is the main photo. JPG, PNG or WEBP under 5 MB.</p><ImageUpload multiple value={p.images} onChange={(v) => set('images', v)} /></div>
          <div className="panel">
            <h3>Sizes</h3>
            <div className="sizes">{[...new Set([...SIZE_PRESETS, ...p.sizes])].map((s) => <button type="button" key={s} className={`size ${p.sizes.includes(s) ? 'on' : ''}`} onClick={() => toggleSize(s)}>{s}</button>)}</div>
            <div className="inline-form"><input value={customSize} onChange={(e) => setCustomSize(e.target.value)} placeholder="Custom size, e.g. 32" /><button type="button" className="btn btn-sm btn-ghost" onClick={() => { if (customSize.trim()) { toggleSize(customSize.trim()); setCustomSize(''); } }}>Add</button></div>
          </div>
          <div className="panel">
            <h3>Colors</h3>
            <div className="color-list">{p.colors.map((c, k) => (
              <span key={k} className="color-pill"><i style={{ background: c.hex }} />{c.name}<button type="button" onClick={() => set('colors', p.colors.filter((_, i) => i !== k))} aria-label="Remove color"><X size={12} /></button></span>
            ))}</div>
            <div className="inline-form">
              <input type="color" value={color.hex} onChange={(e) => setColor({ ...color, hex: e.target.value })} aria-label="Color" className="color-input" />
              <input value={color.name} onChange={(e) => setColor({ ...color, name: e.target.value })} placeholder="Color name, e.g. Pink" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }} />
              <button type="button" className="btn btn-sm btn-ghost" onClick={addColor}><Plus size={14} /></button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
