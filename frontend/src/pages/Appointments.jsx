import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, CalendarPlus, CalendarHeart } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { img, errMsg, fmtDate, fmtTime } from '../api';
import PageHead from '../components/PageHead';
import Loader from '../components/Loader';
import Empty from '../components/Empty';
import Modal from '../components/Modal';

const today = () => new Date().toISOString().slice(0, 10);

export default function Appointments() {
  const [list, setList] = useState(null);
  const [services, setServices] = useState([]);
  const [tab, setTab] = useState('Upcoming');
  const [book, setBook] = useState(null);   // {service,date,time,note}
  const [resch, setResch] = useState(null); // appointment

  const load = () => api.get('/appointments/mine').then((r) => setList(r.data)).catch(() => setList([]));
  useEffect(() => { load(); api.get('/services').then((r) => setServices(r.data)).catch(() => {}); }, []);
  if (!list) return <Loader />;

  const shown = list.filter((a) => (tab === 'Upcoming' ? a.status === 'Upcoming' : a.status !== 'Upcoming'));

  const submitBook = async (e) => {
    e.preventDefault();
    try { await api.post('/appointments', book); toast.success('Appointment booked'); setBook(null); load(); }
    catch (er) { toast.error(errMsg(er)); }
  };
  const submitResch = async (e) => {
    e.preventDefault();
    try { await api.put(`/appointments/${resch._id}/reschedule`, { date: resch.date, time: resch.time }); toast.success('Appointment rescheduled'); setResch(null); load(); }
    catch (er) { toast.error(errMsg(er)); }
  };
  const cancel = async (a) => {
    if (!confirm('Cancel this appointment?')) return;
    try { await api.put(`/appointments/${a._id}/cancel`); toast.success('Appointment cancelled'); load(); }
    catch (er) { toast.error(errMsg(er)); }
  };

  return (
    <div className="narrow">
      <PageHead title="My appointments" right={services.length > 0 && (
        <button className="icon-btn" onClick={() => setBook({ service: services[0]._id, date: '', time: '', note: '' })} aria-label="Book appointment"><CalendarPlus size={20} /></button>
      )} />
      <div className="tabs">{['Upcoming', 'Past'].map((t) => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>

      {!shown.length ? (
        <Empty icon={CalendarHeart} title={tab === 'Upcoming' ? 'No upcoming appointments' : 'No past appointments'}
          text={services.length ? 'Book a styling or makeup session with our team.' : 'Booking will open soon.'} />
      ) : (
        <div className="stack">{shown.map((a) => (
          <div key={a._id} className="appt">
            {a.image ? <img src={img(a.image)} alt="" /> : <div className="noimg" />}
            <div className="grow">
              <b>{a.serviceName}</b>
              {a.serviceSubtitle && <p className="muted small">{a.serviceSubtitle}</p>}
              <p className="small"><CalendarDays size={14} /> {fmtDate(a.date)}, {fmtTime(a.time)}</p>
              {a.location && <p className="small"><MapPin size={14} /> {a.location}</p>}
              {a.status === 'Upcoming' ? (
                <div className="row-actions">
                  <button className="btn btn-sm" onClick={() => setResch({ ...a })}>Reschedule</button>
                  <button className="link danger" onClick={() => cancel(a)}>Cancel</button>
                </div>
              ) : <span className={`status s-${a.status.toLowerCase()}`}>{a.status}</span>}
            </div>
          </div>
        ))}</div>
      )}

      {services.length > 0 && (
        <section className="stylist-cta">
          <div><h3>Need help?<br />Talk to our stylist</h3><button className="btn" onClick={() => setBook({ service: services[0]._id, date: '', time: '', note: '' })}>Book a session</button></div>
          {services[0].image && <img src={img(services[0].image)} alt="" />}
        </section>
      )}

      {book && (
        <Modal title="Book appointment" onClose={() => setBook(null)}>
          <form className="form" onSubmit={submitBook}>
            <label>Service<select value={book.service} onChange={(e) => setBook({ ...book, service: e.target.value })}>{services.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}</select></label>
            <div className="row2">
              <label>Date<input type="date" required min={today()} value={book.date} onChange={(e) => setBook({ ...book, date: e.target.value })} /></label>
              <label>Time<input type="time" required value={book.time} onChange={(e) => setBook({ ...book, time: e.target.value })} /></label>
            </div>
            <label>Note (optional)<textarea rows={3} value={book.note} onChange={(e) => setBook({ ...book, note: e.target.value })} placeholder="Occasion, outfit idea, anything we should know" /></label>
            <button className="btn btn-block">Confirm booking</button>
          </form>
        </Modal>
      )}
      {resch && (
        <Modal title="Reschedule" onClose={() => setResch(null)}>
          <form className="form" onSubmit={submitResch}>
            <div className="row2">
              <label>Date<input type="date" required min={today()} value={resch.date} onChange={(e) => setResch({ ...resch, date: e.target.value })} /></label>
              <label>Time<input type="time" required value={resch.time} onChange={(e) => setResch({ ...resch, time: e.target.value })} /></label>
            </div>
            <button className="btn btn-block">Save new time</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
