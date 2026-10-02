import { Link } from 'react-router-dom';
export default function Empty({ icon: Icon, title, text, to, cta }) {
  return (
    <div className="empty">
      {Icon && <Icon size={40} strokeWidth={1.4} />}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {to && <Link className="btn" to={to}>{cta}</Link>}
    </div>
  );
}
