import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { img, inr, fmtDate, errMsg } from '../api';
import PageHead from '../components/PageHead';
import Loader from '../components/Loader';
import Empty from '../components/Empty';

const STEPS = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [o, setO] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api.get(`/orders/${id}`).then((r) => setO(r.data)).catch((e) => setErr(errMsg(e))); }, [id]);
  if (err) return <Empty title="Order not found" text={err} to="/orders" cta="My orders" />;
  if (!o) return <Loader />;

  const cancel = async () => {
    if (!confirm('Cancel this order?')) return;
    try { const { data } = await api.put(`/orders/${o._id}/cancel`); setO(data); toast.success('Order cancelled'); }
    catch (e) { toast.error(errMsg(e)); }
  };
  const step = STEPS.indexOf(o.status);

  return (
    <div>
      <PageHead title={`Order #${o._id.slice(-6).toUpperCase()}`} />
      <div className="two-col">
        <div>
          <section className="panel">
            <p className="muted small">Placed on {fmtDate(o.createdAt)}</p>
            {o.status === 'Cancelled' ? <p className="status s-cancelled">Cancelled</p> : (
              <ol className="track">{STEPS.map((s, k) => <li key={s} className={k <= step ? 'done' : ''}>{s}</li>)}</ol>
            )}
            {o.trackingNote && <p className="note">{o.trackingNote}</p>}
          </section>
          <section className="panel">
            <h3>Items</h3>
            {o.items.map((i, k) => (
              <div key={k} className="line-item">
                <img src={img(i.image)} alt="" />
                <div className="grow"><b>{i.name}</b><p className="muted small">{[i.color, i.size, `Qty ${i.qty}`].filter(Boolean).join(', ')}</p></div>
                <b>{inr(i.price * i.qty)}</b>
              </div>
            ))}
          </section>
        </div>
        <div>
          <section className="panel">
            <h3>Delivery address</h3>
            <p><b>{o.address.name}</b><br />{[o.address.line1, o.address.line2, o.address.city, o.address.state, o.address.pincode].filter(Boolean).join(', ')}<br />{o.address.phone}</p>
          </section>
          <div className="pricebox">
            <h3>Payment</h3>
            <div><span>Items</span><span>{inr(o.subtotal)}</span></div>
            {o.couponDiscount > 0 && <div><span>Coupon {o.couponCode}</span><span className="green">-{inr(o.couponDiscount)}</span></div>}
            <div><span>Delivery</span><span>{o.delivery ? inr(o.delivery) : 'FREE'}</span></div>
            <div className="total"><span>Total</span><span>{inr(o.total)}</span></div>
            <p className="muted small">{o.paymentMethod === 'COD' ? 'Cash on delivery' : o.paymentMethod}, {o.paymentStatus.toLowerCase()}</p>
          </div>
          {['Placed', 'Confirmed'].includes(o.status) && <button className="btn btn-ghost btn-block" onClick={cancel}>Cancel order</button>}
        </div>
      </div>
    </div>
  );
}
