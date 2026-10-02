import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import api from '../api';
import PageHead from '../components/PageHead';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Empty from '../components/Empty';

export default function Shop() {
  const { slug } = useParams();
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') || '';
  const trending = sp.get('trending') || '';
  const fabric = sp.get('fabric') || '';
  const sort = sp.get('sort') || 'new';
  const [title, setTitle] = useState('');
  const [fabrics, setFabrics] = useState([]);
  const [data, setData] = useState({ items: [], pages: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) api.get('/categories').then((r) => setTitle(r.data.find((c) => c.slug === slug)?.name || 'Products'));
    else setTitle(q ? `Results for "${q}"` : trending ? 'Trending now' : 'All products');
    api.get('/products/fabrics', { params: { category: slug } }).then((r) => setFabrics(r.data)).catch(() => setFabrics([]));
  }, [slug, q, trending]);

  useEffect(() => { setPage(1); }, [slug, q, trending, fabric, sort]);

  useEffect(() => {
    setLoading(true);
    api.get('/products', { params: { category: slug, q, trending, fabric, sort, page, limit: 20 } })
      .then((r) => setData((d) => ({ items: page === 1 ? r.data.items : [...d.items, ...r.data.items], pages: r.data.pages, total: r.data.total })))
      .finally(() => setLoading(false));
  }, [slug, q, trending, fabric, sort, page]);

  const setParam = (k, v) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }); };

  return (
    <div>
      <PageHead title={title} right={
        <select className="sort" value={sort} onChange={(e) => setParam('sort', e.target.value)} aria-label="Sort">
          <option value="new">Newest</option><option value="popular">Popular</option>
          <option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option>
        </select>
      } />
      {fabrics.length > 0 && (
        <div className="chips">
          <button className={`chip ${!fabric ? 'on' : ''}`} onClick={() => setParam('fabric', '')}>All</button>
          {fabrics.map((f) => <button key={f} className={`chip ${fabric === f ? 'on' : ''}`} onClick={() => setParam('fabric', f)}>{f}</button>)}
        </div>
      )}
      {loading && page === 1 ? <Loader /> : !data.items.length ? (
        <Empty icon={SearchX} title="Nothing found" text="Try another category or search word." to="/shop" cta="View all products" />
      ) : (
        <>
          <div className="grid">{data.items.map((p) => <ProductCard key={p._id} p={p} />)}</div>
          {page < data.pages && <div className="center"><button className="btn btn-ghost" disabled={loading} onClick={() => setPage(page + 1)}>{loading ? 'Loading…' : 'Load more'}</button></div>}
        </>
      )}
    </div>
  );
}
