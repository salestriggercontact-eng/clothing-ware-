import { Link } from 'react-router-dom';

// Tiny safe markdown renderer: ## / ### headings, - bullets, 1. numbered, **bold**, [text](link). No raw HTML.
function inline(text, key) {
  const out = [];
  const rx = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0, m, i = 0;
  while ((m = rx.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={`${key}-b${i++}`}>{m[1]}</strong>);
    else {
      const href = m[3];
      out.push(href.startsWith('/')
        ? <Link key={`${key}-l${i++}`} to={href}>{m[2]}</Link>
        : <a key={`${key}-l${i++}`} href={href} target="_blank" rel="noreferrer">{m[2]}</a>);
    }
    last = rx.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ text = '' }) {
  const blocks = [];
  let list = null, para = [];
  const flushPara = () => { if (para.length) { blocks.push({ t: 'p', v: para.join(' ') }); para = []; } };
  const flushList = () => { if (list) { blocks.push(list); list = null; } };

  text.split('\n').forEach((raw) => {
    const line = raw.trim();
    if (!line) { flushPara(); flushList(); return; }
    let m;
    if ((m = line.match(/^(#{2,3})\s+(.*)/))) { flushPara(); flushList(); blocks.push({ t: m[1].length === 2 ? 'h2' : 'h3', v: m[2] }); return; }
    if ((m = line.match(/^[-*]\s+(.*)/))) { flushPara(); if (!list || list.t !== 'ul') { flushList(); list = { t: 'ul', items: [] }; } list.items.push(m[1]); return; }
    if ((m = line.match(/^\d+\.\s+(.*)/))) { flushPara(); if (!list || list.t !== 'ol') { flushList(); list = { t: 'ol', items: [] }; } list.items.push(m[1]); return; }
    flushList();
    // a line that is fully bold acts as its own short paragraph (used for FAQ questions)
    if (/^\*\*.+\*\*$/.test(line)) { flushPara(); blocks.push({ t: 'q', v: line }); return; }
    para.push(line);
  });
  flushPara(); flushList();

  return (
    <div className="md">
      {blocks.map((b, k) => {
        if (b.t === 'h2') return <h2 key={k}>{inline(b.v, k)}</h2>;
        if (b.t === 'h3') return <h3 key={k}>{inline(b.v, k)}</h3>;
        if (b.t === 'ul') return <ul key={k}>{b.items.map((x, j) => <li key={j}>{inline(x, `${k}-${j}`)}</li>)}</ul>;
        if (b.t === 'ol') return <ol key={k}>{b.items.map((x, j) => <li key={j}>{inline(x, `${k}-${j}`)}</li>)}</ol>;
        if (b.t === 'q') return <p key={k} className="md-q">{inline(b.v, k)}</p>;
        return <p key={k}>{inline(b.v, k)}</p>;
      })}
    </div>
  );
}
