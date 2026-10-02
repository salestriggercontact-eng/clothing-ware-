import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { img, inr } from '../api';
import { useAuth } from '../context/AuthContext';
export default function ProductCard({ p }) {
  const { isWished, toggleWish } = useAuth();
  const on = isWished(p._id);
  return (
    <div className="pcard">
      <Link to={`/product/${p.slug}`} className="pcard-img">
        {p.images?.[0] ? <img src={img(p.images[0])} alt={p.name} loading="lazy" /> : <div className="noimg" />}
        {p.stock === 0 && <span className="soldout">Sold out</span>}
      </Link>
      <button className={`heart ${on ? 'on' : ''}`} onClick={() => toggleWish(p._id)} aria-label={on ? 'Remove from wishlist' : 'Save to wishlist'}>
        <Heart size={16} fill={on ? 'currentColor' : 'none'} />
      </button>
      <Link to={`/product/${p.slug}`} className="pcard-body">
        <h3>{p.name}</h3>
        <div className="price-row"><b>{inr(p.price)}</b>{p.mrp > p.price && <s>{inr(p.mrp)}</s>}</div>
        {p.discount > 0 && <span className="off">{p.discount}% OFF</span>}
      </Link>
    </div>
  );
}
