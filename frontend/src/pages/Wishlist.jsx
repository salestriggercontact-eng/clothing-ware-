import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import PageHead from '../components/PageHead';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Empty from '../components/Empty';

export default function Wishlist() {
  const { user } = useAuth();
  const [list, setList] = useState(null);
  useEffect(() => { api.get('/user/wishlist').then((r) => setList(r.data)).catch(() => setList([])); }, []);
  if (!list) return <Loader />;
  const shown = list.filter((p) => user.wishlist.some((w) => String(w) === String(p._id)));
  return (
    <div>
      <PageHead title="Wishlist" />
      {!shown.length ? <Empty icon={Heart} title="No saved items" text="Tap the heart on any product to save it here." to="/shop" cta="Browse products" />
        : <div className="grid">{shown.map((p) => <ProductCard key={p._id} p={p} />)}</div>}
    </div>
  );
}
