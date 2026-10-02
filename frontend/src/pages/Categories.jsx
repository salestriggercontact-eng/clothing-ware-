import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LayoutGrid } from 'lucide-react';
import api, { img } from '../api';
import PageHead from '../components/PageHead';
import Loader from '../components/Loader';
import Empty from '../components/Empty';

export default function Categories() {
  const [cats, setCats] = useState(null);
  useEffect(() => { api.get('/categories').then((r) => setCats(r.data)).catch(() => setCats([])); }, []);
  if (!cats) return <Loader />;
  return (
    <div>
      <PageHead title="Categories" />
      <div className="chips">
        <Link to="/shop" className="chip on">All</Link>
        {cats.map((c) => <Link key={c._id} to={`/shop/${c.slug}`} className="chip">{c.name}</Link>)}
      </div>
      {!cats.length ? <Empty icon={LayoutGrid} title="No categories yet" text="Categories added in the admin panel appear here." /> : (
        <div className="cat-list">
          {cats.map((c) => (
            <Link key={c._id} to={`/shop/${c.slug}`} className="cat-card">
              <div className="cat-card-img">{c.image ? <img src={img(c.image)} alt="" loading="lazy" /> : <span>{c.name[0]}</span>}</div>
              <div className="cat-card-txt"><h3>{c.name}</h3>{c.tagline && <p>{c.tagline}</p>}</div>
              <ChevronRight size={18} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
