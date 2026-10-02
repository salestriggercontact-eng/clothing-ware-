import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function PageHead({ title, right, back = true }) {
  const nav = useNavigate();
  return (
    <div className="pagehead">
      {back && <button className="icon-btn" onClick={() => nav(-1)} aria-label="Go back"><ArrowLeft size={20} /></button>}
      <h1>{title}</h1>
      <div className="pagehead-right">{right}</div>
    </div>
  );
}
