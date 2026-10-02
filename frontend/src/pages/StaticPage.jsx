import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { fmtDate } from '../api';
import { useSettings } from '../context/SettingsContext';
import PageHead from '../components/PageHead';
import Markdown from '../components/Markdown';
import Loader from '../components/Loader';
import NotFound from './NotFound';

export default function StaticPage() {
  const { slug } = useParams();
  const { fill } = useSettings();
  const [page, setPage] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setPage(null); setMissing(false);
    api.get(`/pages/${slug}`).then((r) => { setPage(r.data); document.title = r.data.title; }).catch(() => setMissing(true));
  }, [slug]);

  if (missing) return <NotFound />;
  if (!page) return <Loader />;
  return (
    <article className="narrow doc">
      <PageHead title={page.title} />
      <p className="muted small">Last updated {fmtDate(page.updatedAt)}</p>
      <Markdown text={fill(page.content)} />
    </article>
  );
}
