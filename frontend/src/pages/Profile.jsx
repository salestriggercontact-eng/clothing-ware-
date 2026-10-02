import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Heart, MapPin, TicketPercent, CalendarHeart, HelpCircle, ChevronRight, LayoutDashboard, LogOut, Crown, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import PageHead from '../components/PageHead';
import Modal from '../components/Modal';

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const nav = useNavigate();
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ name: user.name, phone: user.phone, currentPassword: '', password: '' });

  const save = async (e) => {
    e.preventDefault();
    try {
      const body = { name: f.name, phone: f.phone };
      if (f.password) Object.assign(body, { password: f.password, currentPassword: f.currentPassword });
      const { data } = await api.put('/auth/me', body);
      setUser(data); setEdit(false); toast.success('Profile updated');
    } catch (er) { toast.error(errMsg(er)); }
  };

  const menu = [
    ['/orders', Package, 'My orders', 'Track your orders'],
    ['/wishlist', Heart, 'Wishlist', 'Your saved items'],
    ['/addresses', MapPin, 'Addresses', 'Manage delivery addresses'],
    ['/coupons', TicketPercent, 'Coupons and offers', 'View available coupons'],
    ['/appointments', CalendarHeart, 'My appointments', 'Styling and makeup sessions'],
    ['/help', HelpCircle, 'Help and support', 'Policies, FAQs, contact us'],
  ];
  if (user.role === 'admin') menu.unshift(['/admin', LayoutDashboard, 'Admin panel', 'Products, orders, customers']);

  return (
    <div className="narrow">
      <PageHead title="Profile" back={false} />
      <div className="profile-card">
        <div className="avatar">{user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}</div>
        <div className="grow">
          <h2>{user.name}</h2>
          <p className="muted small">{user.phone || user.email}</p>
          {user.isPremium && <span className="premium"><Crown size={12} /> Premium member</span>}
        </div>
        <button className="icon-btn" onClick={() => setEdit(true)} aria-label="Edit profile"><Pencil size={17} /></button>
      </div>
      <div className="menu">
        {menu.map(([to, Icon, t, s]) => (
          <Link key={to} to={to} className="menu-item"><span className="menu-ico"><Icon size={18} /></span><div className="grow"><b>{t}</b><small>{s}</small></div><ChevronRight size={18} /></Link>
        ))}
        <button className="menu-item" onClick={() => { logout(); nav('/'); }}><span className="menu-ico"><LogOut size={18} /></span><div className="grow"><b>Log out</b></div></button>
      </div>
      {edit && (
        <Modal title="Edit profile" onClose={() => setEdit(false)}>
          <form className="form" onSubmit={save}>
            <label>Name<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
            <label>Phone<input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
            <p className="muted small">Leave password fields empty to keep your current password.</p>
            <label>Current password<input type="password" value={f.currentPassword} onChange={(e) => setF({ ...f, currentPassword: e.target.value })} /></label>
            <label>New password<input type="password" minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
            <button className="btn btn-block">Save changes</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
