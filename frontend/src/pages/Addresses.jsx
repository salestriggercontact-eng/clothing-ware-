import { useState } from 'react';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import PageHead from '../components/PageHead';
import Empty from '../components/Empty';
import Modal from '../components/Modal';
import AddressForm from './AddressForm';

export default function Addresses() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(null); // 'new' | address
  const list = user.addresses || [];

  const persist = async (addresses, msg) => {
    try { const { data } = await api.put('/auth/me', { addresses }); setUser(data); setEditing(null); toast.success(msg); }
    catch (e) { toast.error(errMsg(e)); }
  };
  const save = (a) => {
    if (editing === 'new') persist([...list, { ...a, isDefault: !list.length }], 'Address added');
    else persist(list.map((x) => (x._id === editing._id ? { ...x, ...a } : x)), 'Address updated');
  };
  const del = (id) => confirm('Delete this address?') && persist(list.filter((x) => x._id !== id), 'Address deleted');
  const makeDefault = (id) => persist(list.map((x) => ({ ...x, isDefault: x._id === id })), 'Default address set');

  return (
    <div className="narrow">
      <PageHead title="Addresses" right={<button className="btn btn-sm" onClick={() => setEditing('new')}>Add</button>} />
      {!list.length ? <Empty icon={MapPin} title="No saved addresses" text="Add an address to check out faster." /> : (
        <div className="stack">{list.map((a) => (
          <div key={a._id} className="panel addr-card">
            <b>{a.name}</b> <span className="tag">{a.label}</span>{a.isDefault && <span className="tag tag-rose">Default</span>}
            <p>{[a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(', ')}</p><p>{a.phone}</p>
            <div className="row-actions">
              <button className="link" onClick={() => setEditing(a)}>Edit</button>
              {!a.isDefault && <button className="link" onClick={() => makeDefault(a._id)}>Make default</button>}
              <button className="link danger" onClick={() => del(a._id)}>Delete</button>
            </div>
          </div>
        ))}</div>
      )}
      {editing && <Modal title={editing === 'new' ? 'New address' : 'Edit address'} onClose={() => setEditing(null)}><AddressForm initial={editing === 'new' ? {} : editing} onSave={save} /></Modal>}
    </div>
  );
}
