// Free photos from Unsplash (Unsplash License: free for commercial use, no attribution required).
// Used ONLY for demo products. They are not photos of your actual stock — replace before going live.
const u = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${w}&h=${h}&q=75`;

const POOLS = {
  saree: ['1610189013429-a703f4b245cf', '1610189012906-4c0aa9b9781e', '1679006831648-7c9ea12e5807', '1617627143750-d86bc21e42bb',
    '1609748513078-9ff6232781c5', '1646979200020-941e1deb2670', '1610189026297-df356264479c', '1572470176170-98fa8abcb741',
    '1729101143873-d80050bae219', '1619516388835-2b60acc4049e', '1706943262454-84ee74854346'],
  ethnic: ['1706943262117-b35de4ba50b4', '1610047614256-023d7c028d0b', '1610202631408-fa6ba0f39ca3', '1706943262500-491131a6877a',
    '1610047614222-d33c39abfab2', '1610047592780-aa246f5635c2', '1610189025857-f42fe6e8dd91', '1609748340878-c690e3e4706b',
    '1706943262473-fc393f495501', '1706943262459-3ef6ce03305c', '1503160865267-af4660ce7bf2'],
  bridal: ['1646979200020-941e1deb2670', '1729101143873-d80050bae219', '1610047614256-023d7c028d0b', '1503160865267-af4660ce7bf2',
    '1619516388835-2b60acc4049e', '1617627143750-d86bc21e42bb', '1610047614222-d33c39abfab2'],
  western: ['1612336307429-8a898d10e223', '1496747611176-843222e1e57c', '1568252542512-9fe8fe9c87bb', '1617019114583-affb34d1b3cd',
    '1542295669297-4d352b042bca', '1631234764568-996fab371596', '1623609163859-ca93c959b98a', '1657815929003-b97cc426cb3d',
    '1571908599407-cdb918ed83bf', '1479812627010-aa5bd9d173b1', '1632745994322-ac4f4bb36792'],
  casual: ['1599428021675-90f8f8dbc377', '1614788650841-e99d5f181137', '1628620835051-8f40f48c928d', '1542295669297-4d352b042bca',
    '1657815929003-b97cc426cb3d', '1617019114583-affb34d1b3cd'],
};

// which photo pool each art type uses
const POOL_OF = {
  saree: 'saree', kurti: 'ethnic', suit: 'ethnic', sharara: 'ethnic', dupatta: 'ethnic', blouse: 'ethnic',
  lehenga: 'bridal', gown: 'western', dress: 'western', coord: 'western', jumpsuit: 'western', skirt: 'western', nighty: 'western',
  top: 'casual', bottoms: 'casual', jeans: 'casual', shrug: 'casual',
};

const pool = (type) => POOLS[POOL_OF[type] || 'western'];
exports.productPhoto = (type, n) => { const p = pool(type); return u(p[n % p.length], 800, 1067); };
exports.categoryPhoto = (type, n) => { const p = pool(type); return u(p[n % p.length], 300, 300); };
exports.bannerPhotos = [u('1617627143750-d86bc21e42bb', 1600, 700), u('1610047614256-023d7c028d0b', 1600, 700)];
