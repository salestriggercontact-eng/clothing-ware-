import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import api, { img, inr, fmtDate } from '../api';
import PageHead from '../components/PageHead';
import Loader from '../components/Loader';
import Empty from '../components/Empty';

export default function Orders() {
  const [list, setList] = useState(null);
  useEffect(() => { api.get('/orders/mine').then((r) => setList(r.data)).catch(() => setList([])); }, []);
  if (!list) return <Loader />;
  return (
    <div>
      <PageHead title="My orders" />
      {!list.length ? <Empty icon={Package} title="No orders yet" text="Your placed orders will appear here." to="/shop" cta="Start shopping" /> : (
        <div className="stack">
          {list.map((o) => (
            <Link to={`/orders/${o._id}`} key={o._id} className="order-row">
              <div className="order-imgs">{o.items.slice(0, 3).map((i, k) => <img key={k} src={img(i.image)} alt="" />)}</div>
              <div className="grow">
                <b>#{o._id.slice(-6).toUpperCase()}</b>
                <p className="muted small">{fmtDate(o.createdAt)}, {o.items.reduce((a, i) => a + i.qty, 0)} item(s)</p>
                <b>{inr(o.total)}</b>
              </div>
              <span className={`status s-${o.status.toLowerCase()}`}>{o.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
