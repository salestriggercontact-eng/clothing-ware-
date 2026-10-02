import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { fmtDate, fmtTime, errMsg } from '../api';
import Loader from '../components/Loader';

export default function Appointments() {
  const [list, setList] = useState(null);
  useEffect(() => { api.get('/appointments/admin/all').then((r) => setList(r.data)).catch((e) => toast.error(errMsg(e))); }, []);
  const update = async (a, status) => {
    try { const { data } = await api.put(`/appointments/${a._id}/status`, { status }); setList((l) => l.map((x) => (x._id === a._id ? data : x))); toast.success('Appointment updated'); }
    catch (e) { toast.error(errMsg(e)); }
  };
  if (!list) return <Loader />;
  return (
    <div>
      <div className="a-head"><h1>Appointments</h1></div>
      {!list.length ? <p className="notice">No appointments yet. Customers can book once you add a service.</p> : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Customer</th><th>Service</th><th>Date and time</th><th>Note</th><th>Status</th></tr></thead>
          <tbody>{list.map((a) => (
            <tr key={a._id}>
              <td>{a.user?.name}<br /><small className="muted">{a.user?.phone || a.user?.email}</small></td>
              <td>{a.serviceName}</td>
              <td>{fmtDate(a.date)}<br /><small>{fmtTime(a.time)}</small></td>
              <td className="small">{a.note || '—'}</td>
              <td><select value={a.status} onChange={(e) => update(a, e.target.value)}>{['Upcoming', 'Completed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}</select></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
