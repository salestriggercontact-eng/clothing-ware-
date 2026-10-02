import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { img, inr } from '../api';
import { useSettings } from '../context/SettingsContext';
import PageHead from '../components/PageHead';
import Empty from '../components/Empty';


export function PriceBox({ subtotal, mrpTotal, coupon = 0 }) {
  const { settings } = useSettings(); // delivery rules come from the server
  const FREE_MIN = settings.freeDeliveryMin;
  const delivery = subtotal >= FREE_MIN ? 0 : settings.deliveryFee;
  return (
    <div className="pricebox">
      <h3>Price details</h3>
      <div><span>Price ({inr(mrpTotal)} MRP)</span><span>{inr(mrpTotal)}</span></div>
      {mrpTotal > subtotal && <div><span>Discount</span><span className="green">-{inr(mrpTotal - subtotal)}</span></div>}
      {coupon > 0 && <div><span>Coupon</span><span className="green">-{inr(coupon)}</span></div>}
      <div><span>Delivery charges</span><span className={delivery ? '' : 'green'}>{delivery ? inr(delivery) : 'FREE'}</span></div>
      <div className="total"><span>Total</span><span>{inr(subtotal - coupon + delivery)}</span></div>
      {delivery > 0 && <p className="muted small">Add {inr(FREE_MIN - subtotal)} more for free delivery</p>}
    </div>
  );
}

export default function Cart() {
  const { items, setQty, remove, subtotal, mrpTotal } = useCart();
  const nav = useNavigate();
  if (!items.length) return <><PageHead title="My cart" /><Empty icon={ShoppingBag} title="Your cart is empty" text="Items you add will show up here." to="/shop" cta="Start shopping" /></>;
  return (
    <div>
      <PageHead title="My cart" />
      <div className="two-col">
        <div className="cart-list">
          {items.map((i) => (
            <div key={i.key} className="cart-item">
              <Link to={`/product/${i.slug}`}><img src={img(i.image)} alt="" /></Link>
              <div className="ci-body">
                <Link to={`/product/${i.slug}`}><h3>{i.name}</h3></Link>
                <p className="muted small">{[i.color, i.size].filter(Boolean).join(', ')}</p>
                <div className="price-row"><b>{inr(i.price)}</b>{i.mrp > i.price && <s>{inr(i.mrp)}</s>}</div>
                <div className="stepper">
                  <button onClick={() => setQty(i.key, i.qty - 1)} aria-label="Decrease"><Minus size={14} /></button>
                  <span>{i.qty}</span>
                  <button onClick={() => setQty(i.key, i.qty + 1)} aria-label="Increase"><Plus size={14} /></button>
                </div>
              </div>
              <button className="icon-btn" onClick={() => remove(i.key)} aria-label="Remove"><Trash2 size={17} /></button>
            </div>
          ))}
        </div>
        <div>
          <PriceBox subtotal={subtotal} mrpTotal={mrpTotal} />
          <button className="btn btn-block" onClick={() => nav('/checkout')}>Proceed to checkout <ArrowRight size={16} /></button>
          <p className="secure"><ShieldCheck size={14} /> Secure and safe payments</p>
        </div>
      </div>
    </div>
  );
}
