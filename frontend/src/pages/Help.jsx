import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, ChevronRight, Send } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import PageHead from '../components/PageHead';

export default function Help() {
  const { settings: s, pages } = useSettings();
  return (
    <div className="narrow">
      <PageHead title="Help and support" />
      <section className="panel contact">
        <h3>Contact us</h3>
        {s.phone && <a href={`tel:${s.phone}`}><Phone size={17} /> {s.phone}</a>}
        {s.whatsapp && <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Chat on WhatsApp</a>}
        {s.email && <a href={`mailto:${s.email}`}><Mail size={17} /> {s.email}</a>}
        <Link to="/contact"><Send size={17} /> Send us a message</Link>
      </section>
      {pages.length > 0 && (
        <div className="menu">
          {pages.map((p) => <Link key={p._id} to={`/page/${p.slug}`} className="menu-item"><div className="grow"><b>{p.title}</b></div><ChevronRight size={18} /></Link>)}
        </div>
      )}
    </div>
  );
}
