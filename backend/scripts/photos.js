// Fetches UNIQUE, category-matched demo photos from Unsplash or Pexels (both free for commercial use).
// Set ONE key in backend/.env:
//   UNSPLASH_ACCESS_KEY=...   (https://unsplash.com/developers -> New Application -> Access Key)
//   PEXELS_API_KEY=...        (https://www.pexels.com/api/)
// Progress is saved in scripts/photo-cache.json, so when a rate limit is hit you just run the seed again later.
const fs = require('fs');
const path = require('path');

const CACHE = path.join(__dirname, 'photo-cache.json');

const QUERIES = {
  'Sarees': ['saree woman', 'indian saree', 'silk saree', 'saree fashion'],
  'Kurtis': ['kurti woman', 'indian kurta woman', 'kurti fashion', 'indian woman ethnic top'],
  'Kurta Sets': ['indian kurta set woman', 'salwar kameez', 'indian ethnic wear woman', 'kurta palazzo'],
  'Salwar Suits': ['salwar suit', 'punjabi suit woman', 'salwar kameez woman', 'indian suit dupatta'],
  'Anarkali Suits': ['anarkali dress', 'anarkali suit', 'indian gown woman', 'flared indian dress'],
  'Lehengas': ['lehenga', 'bridal lehenga', 'indian bride', 'lehenga choli'],
  'Sharara Sets': ['sharara', 'indian festive wear woman', 'gharara', 'indian wedding guest outfit'],
  'Dupattas': ['dupatta', 'indian scarf woman', 'chunri', 'embroidered stole', 'woman scarf fabric'],
  'Blouses': ['saree blouse', 'indian blouse', 'embroidered blouse woman', 'crop blouse woman'],
  'Gowns': ['evening gown woman', 'ball gown', 'long gown fashion', 'party gown woman'],
  'Dresses': ['woman dress', 'summer dress woman', 'midi dress', 'floral dress woman'],
  'One Piece': ['short dress woman', 'mini dress fashion', 'casual dress woman', 'skater dress'],
  'Co-ords': ['matching set woman', 'co ord set', 'two piece outfit woman', 'woman suit set fashion'],
  'Jumpsuits': ['jumpsuit woman', 'romper woman', 'jumpsuit fashion', 'playsuit'],
  'Tops': ['woman top fashion', 'blouse woman fashion', 'crop top woman', 'woman shirt top'],
  'Shirts': ['woman shirt', 'woman button down shirt', 'oversized shirt woman', 'linen shirt woman'],
  'T-Shirts': ['woman t-shirt', 'woman tee', 'woman white t-shirt', 'casual t-shirt woman'],
  'Bottoms': ['woman trousers', 'palazzo pants', 'wide leg pants woman', 'woman pants fashion'],
  'Leggings': ['leggings woman', 'woman leggings fashion', 'yoga pants woman', 'woman tights'],
  'Jeans': ['woman jeans', 'denim jeans woman', 'woman denim fashion', 'jeans fashion woman'],
  'Skirts': ['skirt woman', 'midi skirt', 'pleated skirt', 'woman skirt fashion'],
  'Jackets & Shrugs': ['woman jacket', 'woman blazer', 'denim jacket woman', 'kimono woman'],
  'Nightwear': ['pajamas woman', 'sleepwear woman', 'nightgown', 'woman loungewear'],
  'Jewellery Sets': ['jewelry set', 'indian jewelry', 'necklace earrings set', 'bridal jewelry'],
  'Earrings': ['earrings', 'gold earrings', 'jhumka', 'earrings jewelry closeup'],
  'Necklaces': ['necklace', 'gold necklace', 'pendant necklace', 'necklace jewelry'],
  'Bangles & Bracelets': ['bangles', 'bracelet', 'gold bangles', 'bracelet jewelry'],
  'Rings & Anklets': ['ring jewelry', 'gold ring', 'anklet', 'rings closeup'],
  'Heels': ['high heels', 'heels shoes', 'stiletto', 'woman heels'],
  'Flats & Chappals': ['flat shoes woman', 'ballet flats', 'women slippers', 'leather flats'],
  'Sandals': ['sandals woman', 'women sandals', 'strappy sandals', 'summer sandals'],
  'Sneakers': ['white sneakers', 'sneakers woman', 'canvas shoes', 'women sneakers'],
  'Boots': ['woman boots', 'ankle boots', 'leather boots', 'knee high boots'],
  'Handbags': ['handbag', 'leather handbag', 'tote bag', 'woman purse'],
  'Clutches & Potlis': ['clutch bag', 'evening clutch', 'small purse', 'potli bag'],
};

// Wider searches used only when a section's own searches run out of unique photos
const GROUP = {
  ethnic: ['Sarees', 'Kurtis', 'Kurta Sets', 'Salwar Suits', 'Anarkali Suits', 'Lehengas', 'Sharara Sets', 'Dupattas', 'Blouses'],
  western: ['Gowns', 'Dresses', 'One Piece', 'Co-ords', 'Jumpsuits', 'Skirts', 'Nightwear'],
  casual: ['Tops', 'Shirts', 'T-Shirts', 'Bottoms', 'Leggings', 'Jeans', 'Jackets & Shrugs'],
  jewellery: ['Jewellery Sets', 'Earrings', 'Necklaces', 'Bangles & Bracelets', 'Rings & Anklets'],
  footwear: ['Heels', 'Flats & Chappals', 'Sandals', 'Sneakers', 'Boots'],
  bags: ['Handbags', 'Clutches & Potlis'],
};
const FALLBACK = {
  ethnic: ['indian woman traditional dress', 'indian ethnic fashion woman', 'indian wedding outfit woman', 'traditional indian clothing'],
  western: ['woman fashion dress', 'woman outfit fashion', 'fashion model woman', 'woman style portrait'],
  casual: ['woman casual outfit', 'woman street style', 'woman casual fashion', 'woman everyday outfit'],
  jewellery: ['jewelry closeup', 'gold jewelry', 'fashion jewelry', 'jewellery'],
  footwear: ['women shoes', 'shoes fashion', 'woman footwear', 'shoes closeup'],
  bags: ['woman bag', 'fashion bag', 'purse', 'bag closeup'],
};
const groupOf = (name) => Object.keys(GROUP).find((g) => GROUP[g].includes(name));

const BANNER_QUERIES = ['indian woman saree fashion', 'indian bride lehenga', 'fashion accessories handbag shoes'];
const MALE = /\b(man|men|boy|boys|male|gentleman|groom|husband|father|guy)\b/i;
const BRAND = /\b(nike|adidas|puma|gucci|louis vuitton|chanel|dior|prada|new balance|converse|vans|zara|h&m|reebok|jordan)\b/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class RateLimit extends Error {}

const PROVIDERS = {
  unsplash: {
    perPage: 30,
    credit: 'Unsplash',
    async search(key, query, page, orientation) {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}&orientation=${orientation === 'portrait' ? 'portrait' : 'landscape'}&content_filter=high`;
      const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' } });
      const remaining = Number(res.headers.get('x-ratelimit-remaining'));
      if (res.status === 401) throw new Error('UNSPLASH_ACCESS_KEY is wrong. Copy the "Access Key" (not the Secret key) from your Unsplash app.');
      if (res.status === 403 || res.status === 429) throw new RateLimit();
      if (!res.ok) throw new Error(`Unsplash error ${res.status} for "${query}"`);
      const data = await res.json();
      const photos = (data.results || []).map((p) => ({
        id: `u_${p.id}`,
        alt: `${p.alt_description || ''} ${p.description || ''}`,
        base: p.urls.raw,
        join: '&',
      }));
      return { photos, remaining };
    },
  },
  pexels: {
    perPage: 80,
    credit: 'Pexels',
    async search(key, query, page, orientation) {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=80&page=${page}&orientation=${orientation}`;
      const res = await fetch(url, { headers: { Authorization: key } });
      const remaining = Number(res.headers.get('x-ratelimit-remaining'));
      if (res.status === 401 || res.status === 403) throw new Error('PEXELS_API_KEY is wrong.');
      if (res.status === 429) throw new RateLimit();
      if (!res.ok) throw new Error(`Pexels error ${res.status} for "${query}"`);
      const data = await res.json();
      const photos = (data.photos || []).map((p) => ({ id: `p_${p.id}`, alt: p.alt || '', base: p.src.original, join: '?' }));
      return { photos, remaining };
    },
  },
};

const sized = (ph, w, h, crop) => `${ph.base}${ph.join}auto=format&fit=crop&crop=${crop}&w=${w}&h=${h}&q=75`;
const OBJECT_GROUPS = new Set(['jewellery', 'footwear', 'bags']);

function pickProvider() {
  if (process.env.UNSPLASH_ACCESS_KEY) return ['unsplash', process.env.UNSPLASH_ACCESS_KEY.trim()];
  if (process.env.PEXELS_API_KEY) return ['pexels', process.env.PEXELS_API_KEY.trim()];
  return [null, null];
}

/**
 * Returns { sections: { [name]: [{id, url, thumb}] }, banners: [url], credit }
 * Every photo is used at most once across the whole store.
 */
async function getPhotos(sectionNames, need = 40) {
  if (typeof fetch !== 'function') throw new Error('Node 18 or newer is needed. Check with: node -v');
  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  cache.sections = cache.sections || {};
  cache.partial = cache.partial || {};
  cache.banners = cache.banners || [];
  const save = () => fs.writeFileSync(CACHE, JSON.stringify(cache));

  const used = new Set();
  [...Object.values(cache.sections), ...Object.values(cache.partial)].forEach((l) => l.forEach((p) => used.add(p.id)));
  cache.banners.forEach((b) => used.add(b.id));

  const missing = sectionNames.filter((n) => (cache.sections[n] || []).length < need);
  const needBanners = cache.banners.length < BANNER_QUERIES.length;
  if (!missing.length && !needBanners) return done(cache);

  const [provName, key] = pickProvider();
  if (!provName) throw new Error('Add UNSPLASH_ACCESS_KEY (free at https://unsplash.com/developers) or PEXELS_API_KEY to backend/.env');
  const prov = PROVIDERS[provName];
  cache.credit = prov.credit;
  console.log(`Using ${prov.credit}. ${missing.length} section(s) still need photos.`);

  const ok = (ph) => !used.has(ph.id) && !MALE.test(ph.alt) && !BRAND.test(ph.alt);
  let lowWarned = false;
  const call = async (q, page, orient) => {
    const r = await prov.search(key, q, page, orient);
    if (r.remaining <= 1 && !lowWarned) { lowWarned = true; throw new RateLimit(); }
    await sleep(300);
    return r.photos;
  };

  try {
    for (const name of missing) {
      const g = groupOf(name);
      const crop = OBJECT_GROUPS.has(g) ? 'entropy' : 'faces';
      const picked = cache.partial[name] || [];
      const searches = [...(QUERIES[name] || [name.toLowerCase()]), ...(FALLBACK[g] || [])];
      const state = cache[`state_${name}`] || { qi: 0, page: 1 };
      while (picked.length < need && state.qi < searches.length) {
        const list = await call(searches[state.qi], state.page, 'portrait');
        for (const ph of list) {
          if (!ok(ph)) continue;
          used.add(ph.id);
          picked.push({ id: ph.id, url: sized(ph, 800, 1067, crop), thumb: sized(ph, 300, 300, crop) });
          if (picked.length >= need) break;
        }
        // next page of the same search, or move to the next search word
        if (list.length < prov.perPage || state.page >= 4) { state.qi++; state.page = 1; } else state.page++;
        cache.partial[name] = picked;
        cache[`state_${name}`] = state;
        save();
      }
      if (picked.length < need) throw new Error(`Only ${picked.length} unique photos found for "${name}". Tell me the section name and I will add more search words.`);
      cache.sections[name] = picked;
      delete cache.partial[name];
      delete cache[`state_${name}`];
      save();
      console.log(`  photos: ${name} (${picked.length})`);
    }
    if (needBanners) {
      cache.banners = [];
      for (const q of BANNER_QUERIES) {
        const ph = (await call(q, 1, 'landscape')).find(ok);
        if (ph) { used.add(ph.id); cache.banners.push({ id: ph.id, url: sized(ph, 1600, 700, 'faces') }); }
      }
      save();
    }
  } catch (e) {
    if (e instanceof RateLimit) {
      const left = sectionNames.filter((n) => !(cache.sections[n] || []).length);
      throw new Error(`${prov.credit} hourly limit reached. Progress saved (${sectionNames.length - left.length}/${sectionNames.length} sections ready). Run "npm run seed-demo" again after 1 hour.`);
    }
    throw e;
  }
  return done(cache);
}

function done(cache) {
  const all = [...Object.values(cache.sections).flat().map((p) => p.id), ...cache.banners.map((b) => b.id)];
  if (new Set(all).size !== all.length) throw new Error('Duplicate photo found in cache. Delete scripts/photo-cache.json and run again.');
  return { sections: cache.sections, banners: cache.banners.map((b) => b.url), credit: cache.credit || '' };
}

module.exports = { getPhotos, QUERIES };
