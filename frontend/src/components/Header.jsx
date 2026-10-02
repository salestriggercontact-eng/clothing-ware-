import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, ShoppingBag, Heart, User } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { count } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const go = (e) => { e.preventDefault(); if (q.trim()) nav(`/shop?q=${encodeURIComponent(q.trim())}`); };

  return (
    <header className="topbar">
      <div className="topbar-in">
        <Link to="/" aria-label="Home"><Logo /></Link>
        <nav className="topnav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/shop">Shop all</NavLink>
          <NavLink to="/appointments">Book a stylist</NavLink>
        </nav>
        <form className="search search-desk" onSubmit={go}>
          <Search size={17} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sarees, kurtis, dresses" aria-label="Search" />
        </form>
        <div className="top-icons">
          <Link to="/wishlist" className="icon-btn hide-sm" aria-label="Wishlist"><Heart size={20} /></Link>
          <Link to={user ? '/profile' : '/login'} className="icon-btn hide-sm" aria-label="Account"><User size={20} /></Link>
          <Link to="/cart" className="icon-btn" aria-label="Cart">
            <ShoppingBag size={20} />
            {count > 0 && <span className="dot-count">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
