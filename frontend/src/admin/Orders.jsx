import { useEffect, useState, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { inr, img, fmtDate, errMsg } from '../api';
import Loader from '../components/Loader';

const STATUSES = ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [sp, setSp] = useSearchParams();
  const status = sp.get('status') || '';
  const [list, setList] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => { setList(null); api.get('/orders/admin/all', { params: { status } }).then((r) => setList(r.data)).catch((e) => toast.error(errMsg(e))); }, [status]);

  const update = async (o, body) => {
    if (body.status === 'Cancelled' && !confirm('Cancel this order? Stock will be added back.')) return;
    try { const { data } = await api.put(`/orders/${o._id}/status`, body); setList((l) => l.map((x) => (x._id === o._id ? data : x))); toast.success('Order updated'); }
    catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div>
      <div className="a-head"><h1>Orders</h1></div>
      <div className="chips">
        <button className={`chip ${!status ? 'on' : ''}`} onClick={() => setSp({})}>All</button>
        {STATUSES.map((s) => <button key={s} className={`chip ${status === s ? 'on' : ''}`} onClick={() => setSp({ status: s })}>{s}</button>)}
      </div>
      {!list ? <Loader /> : !list.length ? <p className="notice">No orders here.</p> : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
          <tbody>{list.map((o) => (
            <Fragment key={o._id}>
              <tr className="clickable" onClick={() => setOpen(open === o._id ? null : o._id)}>
                <td>#{o._id.slice(-6).toUpperCase()}</td>
                <td>{o.user?.name || o.address.name}<br /><small className="muted">{o.address.phone}</small></td>
                <td>{fmtDate(o.createdAt)}</td>
                <td>{o.items.reduce((a, i) => a + i.qty, 0)}</td>
                <td>{inr(o.total)}</td>
                <td><small>{o.paymentMethod}, {o.paymentStatus}</small></td>
                <td onClick={(e) => e.stopPropagation()}>
                  <select value={o.status} disabled={o.status === 'Cancelled'} onChange={(e) => update(o, { status: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                </td>
              </tr>
              {open === o._id && (
                <tr className="expand"><td colSpan={7}>
                  <div className="a-two">
                    <div>{o.items.map((i, k) => (
                      <div key={k} className="line-item"><img src={img(i.image)} alt="" /><div className="grow"><b>{i.name}</b><p className="muted small">{[i.color, i.size, `Qty ${i.qty}`].filter(Boolean).join(', ')}</p></div><b>{inr(i.price * i.qty)}</b></div>
                    ))}</div>
                    <div>
                      <p><b>Ship to</b><br />{o.address.name}, {o.address.phone}<br />{[o.address.line1, o.address.line2, o.address.city, o.address.state, o.address.pincode].filter(Boolean).join(', ')}</p>
                      <p className="small">Subtotal {inr(o.subtotal)}{o.couponDiscount > 0 && `, coupon ${o.couponCode} -${inr(o.couponDiscount)}`}, delivery {inr(o.delivery)}</p>
                      <label className="form">Note for customer (tracking id, courier)
                        <div className="inline-form"><input defaultValue={o.trackingNote} id={`n-${o._id}`} /><button className="btn btn-sm" onClick={() => update(o, { trackingNote: document.getElementById(`n-${o._id}`).value })}>Save</button></div>
                      </label>
                    </div>
                  </div>
                </td></tr>
              )}
            </Fragment>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
