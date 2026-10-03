import { Gem, Truck, ShieldCheck, Headphones, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings: s, pages } = useSettings();
  const policy = pages.filter((p) => p.showInFooter);
  return (
    <footer className="footer">
      <div className="trust">
        <div><Gem size={26} /><span>Premium quality products</span></div>
        <div><Truck size={26} /><span>Fast and secure delivery</span></div>
        <div><ShieldCheck size={26} /><span>100% genuine products</span></div>
        <div><Headphones size={26} /><span>Customer support</span></div>
      </div>
      <div className="footer-grid">
        <div>
          <Logo small />
          <p className="script">Dress beautifully, everyday</p>
          {s.address && <p className="small muted">{s.address}</p>}
          <div className="socials">
            {s.instagram && <a href={s.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>}
            {s.facebook && <a href={s.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18} /></a>}
          </div>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/categories">Categories</Link><Link to="/shop">All products</Link><Link to="/coupons">Offers</Link><Link to="/appointments">Book a stylist</Link>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <Link to="/contact">Contact us</Link><Link to="/help">Help and support</Link><Link to="/orders">Track order</Link>
          {s.phone && <a href={`tel:${s.phone}`}>{s.phone}</a>}
          {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
        </div>
        {policy.length > 0 && (
          <div className="footer-col">
            <h4>Policies</h4>
            {policy.map((p) => <Link key={p._id} to={`/page/${p.slug}`}>{p.title}</Link>)}
          </div>
        )}
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} {s.legalName || s.storeName}. All rights reserved. <span className="credit">Demo photos from <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a> and <a href="https://www.pexels.com" target="_blank" rel="noreferrer">Pexels</a></span></div>
    </footer>
  );
}
