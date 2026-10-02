// Generates illustrated placeholder images (SVG data URIs). No external hosting needed.
const SHAPES = {
  saree: ['M120 72 L150 84 L180 72 L196 92 L190 142 L216 342 L84 342 L110 142 L104 92 Z', 'M118 74 L182 74 L200 96 L98 262 L82 232 Z'],
  kurti: ['M115 72 L150 84 L185 72 L226 96 L240 162 L214 170 L204 126 L210 332 L90 332 L96 126 L86 170 L60 162 L74 96 Z'],
  dress: ['M120 72 L150 86 L180 72 L196 82 L186 152 L242 334 L58 334 L114 152 L104 82 Z'],
  lehenga: ['M118 72 L150 84 L182 72 L200 96 L188 126 L112 126 L100 96 Z', 'M114 140 L186 140 L252 338 Q150 360 48 338 Z'],
  top: ['M110 82 L150 94 L190 82 L232 106 L216 142 L196 132 L196 236 L104 236 L104 132 L84 142 L68 106 Z'],
  bottoms: ['M104 72 L196 72 L236 342 L160 342 L150 152 L140 342 L64 342 Z'],
  gown: ['M122 72 L150 84 L178 72 L192 84 L184 170 L236 342 Q150 356 64 342 L116 170 L108 84 Z'],
  suit: ['M112 280 L188 280 L182 346 L156 346 L150 300 L144 346 L118 346 Z', 'M115 72 L150 84 L185 72 L226 96 L240 160 L214 168 L204 126 L208 288 L92 288 L96 126 L86 168 L60 160 L74 96 Z', 'M100 78 Q150 128 200 78 L208 96 Q150 150 92 96 Z'],
  sharara: ['M108 214 L192 214 L190 268 L238 346 L158 346 L150 282 L142 346 L62 346 L110 268 Z', 'M115 72 L150 84 L185 72 L222 96 L236 156 L212 162 L202 124 L206 212 L94 212 L98 124 L88 162 L64 156 L78 96 Z'],
  dupatta: ['M106 72 L194 72 L188 336 L112 336 Z', 'M106 72 L150 72 L132 336 L112 336 Z'],
  jeans: ['M110 72 L190 72 L206 342 L162 342 L150 152 L138 342 L94 342 Z'],
  skirt: ['M112 78 L188 78 L240 330 Q150 348 60 330 Z'],
  nighty: ['M118 72 L150 84 L182 72 L222 100 L210 132 L196 124 L210 342 L90 342 L104 124 L90 132 L78 100 Z'],
  shrug: ['M110 74 L146 86 L140 300 L96 300 L94 130 L74 160 L58 150 L76 96 Z', 'M190 74 L154 86 L160 300 L204 300 L206 130 L226 160 L242 150 L224 96 Z'],
  blouse: ['M114 82 L150 104 L186 82 L222 104 L210 138 L194 130 L194 196 L106 196 L106 130 L90 138 L78 104 Z'],
  jumpsuit: ['M118 72 L150 86 L182 72 L198 90 L192 176 L214 344 L162 344 L150 212 L138 344 L86 344 L108 176 L102 90 Z'],
  coord: ['M115 72 L150 82 L185 72 L216 92 L206 118 L190 112 L190 162 L110 162 L110 112 L94 118 L84 92 Z', 'M112 172 L188 172 L222 350 L160 350 L150 232 L140 350 L78 350 Z'],
};
const BORDERS = {
  saree: '<path d="M88 324 L212 324" stroke-width="14"/>',
  kurti: '<path d="M92 318 L208 318" stroke-width="10"/><path d="M136 76 Q150 104 164 76" stroke-width="5"/>',
  dress: '<path d="M112 152 L188 152" stroke-width="6"/>',
  lehenga: '<path d="M58 318 Q150 340 242 318" stroke-width="12"/><path d="M114 140 L186 140" stroke-width="6"/>',
  top: '<path d="M136 86 Q150 112 164 86" stroke-width="5"/>',
  bottoms: '<path d="M104 78 L196 78" stroke-width="12"/>',
  gown: '<path d="M116 170 L184 170" stroke-width="6"/><path d="M70 334 Q150 350 230 334" stroke-width="8"/>',
  suit: '<path d="M96 276 L204 276" stroke-width="8"/><path d="M100 86 Q150 134 200 86" stroke-width="4"/>',
  sharara: '<path d="M70 334 L144 334" stroke-width="8"/><path d="M156 334 L230 334" stroke-width="8"/><path d="M98 200 L202 200" stroke-width="6"/>',
  dupatta: '<path d="M114 324 L186 324" stroke-width="12"/><path d="M118 336 v10 M130 336 v10 M142 336 v10 M154 336 v10 M166 336 v10 M178 336 v10" stroke-width="3"/>',
  jeans: '<path d="M110 80 L190 80" stroke-width="5"/><path d="M118 92 Q130 116 146 96" stroke-width="3"/><path d="M182 92 Q170 116 154 96" stroke-width="3"/>',
  skirt: '<path d="M112 86 L188 86" stroke-width="10"/><path d="M68 318 Q150 336 232 318" stroke-width="8"/>',
  nighty: '<path d="M104 126 L196 126" stroke-width="5"/><path d="M92 330 L208 330" stroke-width="8"/>',
  shrug: '<path d="M146 88 L140 298 M154 88 L160 298" stroke-width="6"/>',
  blouse: '<path d="M126 92 Q138 120 150 106 Q162 120 174 92" stroke-width="4"/><path d="M106 190 L194 190" stroke-width="8"/>',
  jumpsuit: '<path d="M106 176 L194 176" stroke-width="8"/>',
  coord: '<path d="M110 158 L190 158" stroke-width="5"/><path d="M112 178 L188 178" stroke-width="8"/>',
};

function garment(type, color, accent, id) {
  const paths = SHAPES[type] || SHAPES.dress;
  const body = paths.map((d, i) => {
    if (type === 'suit' && i === 2) return `<path d="${d}" fill="${accent}" opacity=".9"/>`; // dupatta in contrast color
    return `<path d="${d}" fill="${color}"${(type === 'saree' || type === 'dupatta') && i === 1 ? ' opacity=".85"' : ''}/>`;
  }).join('');
  const motif = paths.map((d) => `<path d="${d}" fill="url(#m${id})"/>`).join('');
  return `<defs><pattern id="m${id}" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="2.2" fill="${accent}" opacity=".6"/><circle cx="0" cy="0" r="1.4" fill="${accent}" opacity=".45"/><circle cx="22" cy="22" r="1.4" fill="${accent}" opacity=".45"/></pattern></defs>`
    + '<path d="M150 56 V44 q0 -10 9 -10 q9 0 9 9" fill="none" stroke="#8C7A82" stroke-width="3" stroke-linecap="round"/>'
    + '<path d="M104 74 L150 56 L196 74" fill="none" stroke="#8C7A82" stroke-width="4" stroke-linecap="round"/>'
    + body + motif
    + `<g fill="none" stroke="${accent}" stroke-linecap="round">${BORDERS[type] || ''}</g>`;
}

const uri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

exports.productImage = (type, color, accent, bg = '#FBEFF3') => uri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${bg}"/></linearGradient></defs><rect width="300" height="400" fill="url(#bg)"/><ellipse cx="150" cy="372" rx="110" ry="10" fill="#000" opacity=".05"/>${garment(type, color, accent, 'p')}</svg>`
);

exports.categoryImage = (type, color, accent) => uri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 20 300 360"><rect y="20" width="300" height="360" fill="#FBEFF3"/>${garment(type, color, accent, 'c')}</svg>`
);

exports.bannerImage = (items) => {
  const g = items.map(([type, color, accent], i) =>
    `<svg x="${820 + i * 250}" y="${120 + (i % 2) * 40}" width="300" height="400" viewBox="0 0 300 400">${garment(type, color, accent, `b${i}`)}</svg>`).join('');
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 700"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E1446"/><stop offset="1" stop-color="#E86A9A"/></linearGradient><pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2" fill="#fff" opacity=".12"/></pattern></defs><rect width="1600" height="700" fill="url(#bg)"/><rect width="1600" height="700" fill="url(#dots)"/><circle cx="1180" cy="360" r="300" fill="#fff" opacity=".08"/>${g}</svg>`);
};
