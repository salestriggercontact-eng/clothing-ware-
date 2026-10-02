import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ArrowLeft, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { img, inr, errMsg, fmtDate } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import Empty from '../components/Empty';

export default function Product() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { user, isWished, toggleWish } = useAuth();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [err, setErr] = useState('');
  const [idx, setIdx] = useState(0);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [rev, setRev] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    setP(null); setIdx(0);
    api.get(`/products/${slug}`).then((r) => {
      setP(r.data);
      setColor(r.data.colors?.[0]?.name || '');
      setSize(r.data.sizes?.length === 1 ? r.data.sizes[0] : '');
    }).catch((e) => setErr(errMsg(e)));
  }, [slug]);

  if (err) return <Empty title="Product not available" text={err} to="/shop" cta="Continue shopping" />;
  if (!p) return <Loader />;

  const needSize = p.sizes?.length > 0;
  const addToCart = (buy) => {
    if (p.stock < 1) return toast.error('This item is sold out');
    if (needSize && !size) return toast.error('Choose a size');
    add(p, { color, size });
    if (buy) nav('/cart'); else toast.success('Added to cart');
  };
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: p.name, url }).catch(() => {});
    else { await navigator.clipboard.writeText(url); toast.success('Link copied'); }
  };
  const submitReview = async (e) => {
    e.preventDefault();
    try { const { data } = await api.post(`/products/${p._id}/reviews`, rev); setP({ ...p, ...data, category: p.category }); toast.success('Review saved'); setRev({ rating: 5, comment: '' }); }
    catch (er) { toast.error(errMsg(er)); }
  };
  const on = isWished(p._id);

  return (
    <div className="pdp">
      <div className="gallery">
        <div className="gallery-main">
          {p.images?.length ? <img src={img(p.images[idx])} alt={p.name} /> : <div className="noimg" />}
          <button className="icon-btn floating left" onClick={() => nav(-1)} aria-label="Go back"><ArrowLeft size={18} /></button>
          <div className="floating right">
            <button className={`icon-btn ${on ? 'wish-on' : ''}`} onClick={() => toggleWish(p._id)} aria-label="Wishlist"><Heart size={18} fill={on ? 'currentColor' : 'none'} /></button>
            <button className="icon-btn" onClick={share} aria-label="Share"><Share2 size={18} /></button>
          </div>
        </div>
        {p.images?.length > 1 && (
          <div className="thumbs">{p.images.map((u, k) => <button key={k} className={k === idx ? 'on' : ''} onClick={() => setIdx(k)}><img src={img(u)} alt="" /></button>)}</div>
        )}
      </div>

      <div className="pdp-info">
        <h1>{p.name}</h1>
        {(p.numReviews > 0 || p.sold > 0) && (
          <div className="meta">
            {p.numReviews > 0 && <span><Star size={14} fill="#F5A623" color="#F5A623" /> {p.rating} ({p.numReviews} reviews)</span>}
            {p.sold > 0 && <span>{p.sold} sold</span>}
          </div>
        )}
        <div className="pdp-price"><b>{inr(p.price)}</b>{p.mrp > p.price && <s>{inr(p.mrp)}</s>}{p.discount > 0 && <span className="off">{p.discount}% OFF</span>}</div>
        <p className={`stock ${p.stock < 1 ? 'out' : p.stock <= 5 ? 'low' : ''}`}>{p.stock < 1 ? 'Sold out' : p.stock <= 5 ? `Only ${p.stock} left` : 'In stock'}</p>

        {p.colors?.length > 0 && (
          <div className="opt"><h4>Color{color && <span>: {color}</span>}</h4>
            <div className="swatches">{p.colors.map((c) => (
              <button key={c.name} className={`swatch ${color === c.name ? 'on' : ''}`} style={{ background: c.hex || '#ccc' }} onClick={() => setColor(c.name)} aria-label={c.name} title={c.name} />
            ))}</div>
          </div>
        )}
        {needSize && (
          <div className="opt"><h4>Size</h4>
            <div className="sizes">{p.sizes.map((s) => <button key={s} className={`size ${size === s ? 'on' : ''}`} onClick={() => setSize(s)}>{s}</button>)}</div>
          </div>
        )}
        {p.details?.length > 0 && <div className="opt"><h4>Product details</h4><ul className="details">{p.details.map((d, k) => <li key={k}>{d}</li>)}</ul></div>}
        {p.description && <div className="opt"><h4>Description</h4><p className="desc">{p.description}</p></div>}

        <div className="buybar">
          <button className="btn btn-ghost" onClick={() => addToCart(false)} disabled={p.stock < 1}><ShoppingBag size={17} /> Add to cart</button>
          <button className="btn" onClick={() => addToCart(true)} disabled={p.stock < 1}>Buy now</button>
        </div>

        <div className="opt reviews"><h4>Reviews</h4>
          {!p.reviews?.length && <p className="muted">No reviews yet.</p>}
          {p.reviews?.map((r) => (
            <div key={r._id} className="review"><b>{r.name}</b> <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span><small>{fmtDate(r.createdAt)}</small>{r.comment && <p>{r.comment}</p>}</div>
          ))}
          {user && (
            <form className="review-form" onSubmit={submitReview}>
              <select value={rev.rating} onChange={(e) => setRev({ ...rev, rating: +e.target.value })} aria-label="Rating">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
              </select>
              <input value={rev.comment} onChange={(e) => setRev({ ...rev, comment: e.target.value })} placeholder="Write a review (after delivery)" />
              <button className="btn btn-sm">Post review</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
