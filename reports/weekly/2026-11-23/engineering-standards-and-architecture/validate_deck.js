const fs = require('fs');
const path = require('path');
const pptx = require('./build_deck.js');

const W = 13.333;
const H = 7.5;
const outDir = path.join(__dirname, 'preview');
fs.mkdirSync(outDir, { recursive: true });

const overflow = [];
const slides = [];

pptx._slides.forEach((slide, index) => {
  const masterObjects = slide._slideLayout?._slideObjects || [];
  const objects = [...masterObjects, ...slide._slideObjects];
  for (const obj of objects) {
    const o = obj.options || {};
    if (![o.x, o.y, o.w, o.h].every(v => typeof v === 'number')) continue;
    const bad = o.x < -0.001 || o.y < -0.001 || o.x + o.w > W + 0.001 || o.y + o.h > H + 0.001;
    const decorativeArc = index === 0 && obj.shape === 'arc';
    if (bad && !decorativeArc) overflow.push({ slide: index + 1, shape: obj.shape, x: o.x, y: o.y, w: o.w, h: o.h });
  }
  slides.push({
    background: slide._background?.color || slide._bkgd || 'F4F7FB',
    objects: objects.map(obj => ({ shape: obj.shape, text: obj.text, options: obj.options })),
  });
});

fs.writeFileSync(path.join(outDir, 'geometry-report.json'), JSON.stringify({ slideCount: slides.length, overflow }, null, 2));
fs.writeFileSync(path.join(outDir, 'deck-objects.json'), JSON.stringify({ width: W, height: H, slides }));

if (overflow.length) {
  console.error(JSON.stringify(overflow, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Geometry check passed for ${slides.length} slides.`);
}
