import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Shirt, LayoutGrid, Package, CalendarHeart, Sparkles, Image, TicketPercent, Users, Store, FileText, Mail, Settings } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const links = [
  ['/admin', LayoutDashboard, 'Dashboard'], ['/admin/products', Shirt, 'Products'], ['/admin/categories', LayoutGrid, 'Categories'],
  ['/admin/orders', Package, 'Orders'], ['/admin/appointments', CalendarHeart, 'Appointments'], ['/admin/services', Sparkles, 'Services'],
  ['/admin/banners', Image, 'Banners'], ['/admin/coupons', TicketPercent, 'Coupons'], ['/admin/users', Users, 'Customers'],
  ['/admin/messages', Mail, 'Messages'], ['/admin/pages', FileText, 'Pages and policies'], ['/admin/settings', Settings, 'Store settings'],
];

export default function AdminLayout() {
  const { user } = useAuth();
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link to="/admin" className="admin-logo"><Logo small /><small>Admin</small></Link>
        <nav>{links.map(([to, Icon, t]) => <NavLink key={to} to={to} end={to === '/admin'}><Icon size={18} /><span>{t}</span></NavLink>)}</nav>
        <Link to="/" className="admin-store"><Store size={18} /><span>View store</span></Link>
      </aside>
      <div className="admin-main">
        <div className="admin-top"><span className="muted small">Signed in as</span> <b>{user.name}</b></div>
        <div className="admin-body"><Outlet /></div>
      </div>
    </div>
  );
}
