import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import api, { fmtDate, errMsg } from '../api';
import Loader from '../components/Loader';

export default function Users() {
  const [list, setList] = useState(null);
  const [q, setQ] = useState('');
  useEffect(() => { const t = setTimeout(() => api.get('/admin/users', { params: { q } }).then((r) => setList(r.data)).catch((e) => toast.error(errMsg(e))), 300); return () => clearTimeout(t); }, [q]);
  const patch = async (u, body) => {
    if (body.role === 'admin' && !confirm(`Give ${u.name} full admin access?`)) return;
    try { const { data } = await api.put(`/admin/users/${u._id}`, body); setList((l) => l.map((x) => (x._id === u._id ? data : x))); toast.success('Customer updated'); }
    catch (e) { toast.error(errMsg(e)); }
  };
  return (
    <div>
      <div className="a-head"><h1>Customers</h1></div>
      <div className="filters"><div className="search"><Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or phone" /></div></div>
      {!list ? <Loader /> : !list.length ? <p className="notice">No customers found.</p> : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Name</th><th>Contact</th><th>Joined</th><th>Premium</th><th>Blocked</th><th>Role</th></tr></thead>
          <tbody>{list.map((u) => (
            <tr key={u._id}>
              <td><b>{u.name}</b></td>
              <td>{u.email}<br /><small className="muted">{u.phone}</small></td>
              <td>{fmtDate(u.createdAt)}</td>
              <td><input type="checkbox" className="switch" checked={u.isPremium} onChange={(e) => patch(u, { isPremium: e.target.checked })} aria-label="Premium" /></td>
              <td><input type="checkbox" className="switch" checked={u.isBlocked} onChange={(e) => patch(u, { isBlocked: e.target.checked })} aria-label="Blocked" /></td>
              <td><select value={u.role} onChange={(e) => patch(u, { role: e.target.value })}><option value="user">Customer</option><option value="admin">Admin</option></select></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
