import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);
const load = () => { try { return JSON.parse(localStorage.getItem('lh_cart')) || []; } catch { return []; } };

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  useEffect(() => { localStorage.setItem('lh_cart', JSON.stringify(items)); }, [items]);

  const add = (p, { color = '', size = '', qty = 1 } = {}) => {
    const key = `${p._id}|${color}|${size}`;
    setItems((list) => {
      const ex = list.find((i) => i.key === key);
      if (ex) return list.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, p.stock || 99) } : i));
      return [...list, { key, product: p._id, slug: p.slug, name: p.name, image: p.images?.[0] || '', price: p.price, mrp: p.mrp || p.price, stock: p.stock, color, size, qty }];
    });
  };
  const setQty = (key, qty) => setItems((l) => l.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, i.stock || 99)) } : i)));
  const remove = (key) => setItems((l) => l.filter((i) => i.key !== key));
  const clear = () => setItems([]);

  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const mrpTotal = items.reduce((a, i) => a + i.mrp * i.qty, 0);

  return <Ctx.Provider value={{ items, add, setQty, remove, clear, count, subtotal, mrpTotal }}>{children}</Ctx.Provider>;
}
