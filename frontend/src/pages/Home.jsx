import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import api, { img } from '../api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

function Hero({ banners }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) {
    return (
      <section className="hero hero-plain">
        <div className="hero-text">
          <h2>Style that feels like you</h2>
          <p>Trendy, traditional and timeless</p>
          <Link className="btn btn-light" to="/shop">Shop now <ArrowRight size={16} /></Link>
        </div>
      </section>
    );
  }
  const b = banners[i];
  return (
    <section className="hero">
      {b.image && <img src={img(b.image)} alt="" className="hero-img" />}
      <div className="hero-text">
        {b.eyebrow && <span className="hero-eyebrow">{b.eyebrow}</span>}
        <h2>{b.title}</h2>
        {b.subtitle && <p>{b.subtitle}</p>}
        <Link className="btn btn-light" to={b.link || '/shop'}>{b.buttonText || 'Shop now'} <ArrowRight size={16} /></Link>
      </div>
      {banners.length > 1 && (
        <div className="dots">{banners.map((_, k) => <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Banner ${k + 1}`} />)}</div>
      )}
    </section>
  );
}

function Rail({ title, to, items }) {
  if (!items.length) return null;
  return (
    <section className="block">
      <div className="block-head"><h2>{title}</h2>{to && <Link to={to}>See all</Link>}</div>
      <div className="grid">{items.map((p) => <ProductCard key={p._id} p={p} />)}</div>
    </section>
  );
}

export default function Home() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [d, setD] = useState(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/banners'), api.get('/categories'),
      api.get('/products?trending=true&limit=8'), api.get('/products?sort=new&limit=8'), api.get('/services'),
    ]).then(([b, c, t, n, s]) => setD({ banners: b.data, cats: c.data, trending: t.data.items, fresh: n.data.items, services: s.data }))
      .catch(() => setD({ banners: [], cats: [], trending: [], fresh: [], services: [], error: true }));
  }, []);

  if (!d) return <Loader />;
  return (
    <div className="home">
      <div className="greet">
        <p>Hello{user ? ',' : ''}</p>
        <h1>{user ? user.name.split(' ')[0] : 'Welcome'}</h1>
        <span>Your style, your story.</span>
      </div>
      <form className="search search-mob" onSubmit={(e) => { e.preventDefault(); if (q.trim()) nav(`/shop?q=${encodeURIComponent(q.trim())}`); }}>
        <Search size={17} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for sarees, kurtis, dresses" aria-label="Search" />
      </form>

      {d.error && <p className="notice">Could not load the store. Check that the API server is running.</p>}
      <Hero banners={d.banners} />

      {d.cats.length > 0 && (
        <section className="cat-row">
          {d.cats.map((c) => (
            <Link key={c._id} to={`/shop/${c.slug}`} className="cat-chip">
              <span className="cat-ico">{c.image ? <img src={img(c.image)} alt="" /> : c.name[0]}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </section>
      )}

      <Rail title="Trending now" to="/shop?trending=true" items={d.trending} />
      <Rail title="New arrivals" to="/shop" items={d.fresh} />

      {!d.trending.length && !d.fresh.length && !d.error && (
        <p className="notice">No products yet. Add products from the admin panel and they will show up here.</p>
      )}

      {d.services.length > 0 && (
        <section className="stylist-cta">
          <div><h3>Need help?<br />Talk to our stylist</h3><Link className="btn" to="/appointments">Book a session <ArrowRight size={16} /></Link></div>
          {d.services[0].image && <img src={img(d.services[0].image)} alt="" />}
        </section>
      )}
    </div>
  );
}
