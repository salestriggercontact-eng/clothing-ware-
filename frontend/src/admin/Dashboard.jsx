import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { inr, img, fmtDate } from '../api';
import Loader from '../components/Loader';

export default function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/admin/stats').then((r) => setS(r.data)).catch(() => setS({})); }, []);
  if (!s) return <Loader />;
  const cards = [
    ['Revenue', inr(s.revenue), '/admin/orders'], ['Orders', s.orders, '/admin/orders'], ['To process', s.pending, '/admin/orders?status=Placed'],
    ['Products', s.products, '/admin/products'], ['Customers', s.users, '/admin/users'], ['Upcoming appointments', s.upcoming, '/admin/appointments'], ['New messages', s.newMessages, '/admin/messages'],
  ];
  return (
    <div>
      <div className="a-head"><h1>Dashboard</h1><Link to="/admin/products/new" className="btn btn-sm">Add product</Link></div>
      <div className="stats">{cards.map(([t, v, to]) => <Link key={t} to={to} className="stat"><small>{t}</small><b>{v ?? 0}</b></Link>)}</div>
      <div className="a-two">
        <section className="panel">
          <h3>Recent orders</h3>
          {!s.recentOrders?.length ? <p className="muted">No orders yet.</p> : (
            <div className="table-wrap"><table className="table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>{s.recentOrders.map((o) => (
                <tr key={o._id}><td>#{o._id.slice(-6).toUpperCase()}</td><td>{o.user?.name || '—'}</td><td>{fmtDate(o.createdAt)}</td><td>{inr(o.total)}</td><td><span className={`status s-${o.status.toLowerCase()}`}>{o.status}</span></td></tr>
              ))}</tbody></table></div>
          )}
        </section>
        <section className="panel">
          <h3>Low stock</h3>
          {!s.lowStock?.length ? <p className="muted">All products have more than 5 in stock.</p> : s.lowStock.map((p) => (
            <Link key={p._id} to={`/admin/products/${p._id}`} className="line-item"><img src={img(p.images?.[0])} alt="" /><span className="grow">{p.name}</span><b className={p.stock ? 'warn' : 'danger'}>{p.stock} left</b></Link>
          ))}
        </section>
      </div>
    </div>
  );
}
