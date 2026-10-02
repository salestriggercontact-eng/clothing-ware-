import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Tag, X } from 'lucide-react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import PageHead from '../components/PageHead';
import AddressForm from './AddressForm';
import { PriceBox } from './Cart';

export default function Checkout() {
  const { user, setUser } = useAuth();
  const { items, subtotal, mrpTotal, clear } = useCart();
  const nav = useNavigate();
  const addrs = user.addresses || [];
  const [sel, setSel] = useState(() => (addrs.find((a) => a.isDefault) || addrs[0])?._id || '');
  const [adding, setAdding] = useState(!addrs.length);
  const [code, setCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!items.length) return <Navigate to="/cart" replace />;

  const saveAddress = async (a) => {
    try {
      const list = [...addrs, { ...a, isDefault: !addrs.length }];
      const { data } = await api.put('/auth/me', { addresses: list });
      setUser(data); setSel(data.addresses[data.addresses.length - 1]._id); setAdding(false);
    } catch (e) { toast.error(errMsg(e)); }
  };
  const applyCode = async () => {
    if (!code.trim()) return;
    try { const { data } = await api.post('/coupons/validate', { code, subtotal }); setCoupon(data); toast.success(`Coupon applied. You save ₹${data.discount}`); }
    catch (e) { setCoupon(null); toast.error(errMsg(e)); }
  };
  const place = async () => {
    const address = addrs.find((a) => a._id === sel);
    if (!address) return toast.error('Choose a delivery address');
    setBusy(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product, qty: i.qty, color: i.color, size: i.size })),
        address, couponCode: coupon?.code || '',
      });
      clear();
      toast.success('Order placed');
      nav(`/orders/${data._id}`, { replace: true });
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  return (
    <div>
      <PageHead title="Checkout" />
      <div className="two-col">
        <div>
          <section className="panel">
            <h3>Delivery address</h3>
            {addrs.map((a) => (
              <label key={a._id} className={`addr ${sel === a._id ? 'on' : ''}`}>
                <input type="radio" name="addr" checked={sel === a._id} onChange={() => setSel(a._id)} />
                <div><b>{a.name}</b> <span className="tag">{a.label}</span><p>{[a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(', ')}</p><p>{a.phone}</p></div>
              </label>
            ))}
            {adding ? <AddressForm onSave={saveAddress} onCancel={addrs.length ? () => setAdding(false) : null} />
              : <button className="btn btn-ghost btn-sm" onClick={() => setAdding(true)}>Add new address</button>}
          </section>
          <section className="panel">
            <h3>Payment</h3>
            <label className="addr on"><input type="radio" checked readOnly /><div><b>Cash on delivery</b><p>Pay when your order arrives.</p></div></label>
          </section>
        </div>
        <div>
          <section className="panel">
            <h3>Coupon</h3>
            {coupon ? (
              <div className="applied"><Tag size={16} /><b>{coupon.code}</b><span>-₹{coupon.discount}</span><button className="icon-btn" onClick={() => { setCoupon(null); setCode(''); }} aria-label="Remove coupon"><X size={16} /></button></div>
            ) : (
              <div className="inline-form"><input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" /><button className="btn btn-sm" onClick={applyCode}>Apply</button></div>
            )}
          </section>
          <PriceBox subtotal={subtotal} mrpTotal={mrpTotal} coupon={coupon?.discount || 0} />
          <button className="btn btn-block" disabled={busy || adding} onClick={place}>{busy ? 'Placing order…' : 'Place order'}</button>
          <p className="muted small agree">By placing this order you agree to our <Link to="/page/terms-and-conditions">Terms</Link>, <Link to="/page/refund-and-return-policy">Return policy</Link> and <Link to="/page/privacy-policy">Privacy policy</Link>.</p>
        </div>
      </div>
    </div>
  );
}
