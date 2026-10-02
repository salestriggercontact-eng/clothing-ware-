import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Heart, ClipboardList, User } from 'lucide-react';
const items = [
  ['/', Home, 'Home'], ['/categories', LayoutGrid, 'Categories'], ['/wishlist', Heart, 'Wishlist'],
  ['/orders', ClipboardList, 'Orders'], ['/profile', User, 'Profile'],
];
export default function BottomNav() {
  return (
    <nav className="bottomnav">
      {items.map(([to, Icon, label]) => (
        <NavLink key={to} to={to} end={to === '/'}><Icon size={20} /><span>{label}</span></NavLink>
      ))}
    </nav>
  );
}
