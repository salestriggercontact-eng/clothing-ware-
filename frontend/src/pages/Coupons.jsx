import { useEffect, useState } from 'react';
import { TicketPercent, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { fmtDate, inr } from '../api';
import PageHead from '../components/PageHead';
import Loader from '../components/Loader';
import Empty from '../components/Empty';

export default function Coupons() {
  const [list, setList] = useState(null);
  useEffect(() => { api.get('/coupons').then((r) => setList(r.data)).catch(() => setList([])); }, []);
  if (!list) return <Loader />;
  const copy = (c) => { navigator.clipboard?.writeText(c); toast.success(`${c} copied`); };
  return (
    <div className="narrow">
      <PageHead title="Coupons and offers" />
      {!list.length ? <Empty icon={TicketPercent} title="No offers right now" text="New coupons will show up here." /> : (
        <div className="stack">{list.map((c) => (
          <div key={c._id} className="coupon">
            <div className="coupon-val">{c.type === 'percent' ? `${c.value}%` : inr(c.value)}<small>OFF</small></div>
            <div className="grow">
              <b>{c.code}</b>
              {c.description && <p>{c.description}</p>}
              <p className="muted small">
                {c.minOrder > 0 && `On orders above ${inr(c.minOrder)}. `}
                {c.type === 'percent' && c.maxDiscount > 0 && `Up to ${inr(c.maxDiscount)}. `}
                {c.expiresAt && `Valid till ${fmtDate(c.expiresAt)}.`}
              </p>
            </div>
            <button className="icon-btn" onClick={() => copy(c.code)} aria-label="Copy code"><Copy size={17} /></button>
          </div>
        ))}</div>
      )}
    </div>
  );
}
