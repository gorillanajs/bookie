// Renders the app icon, Android adaptive icon layers, splash images and favicon from SVG.
// Requires Google Chrome. Run from the project root:
//   npm install --no-save puppeteer-core@23.11.1 && node scripts/generate-icons.mjs . assets/images
import puppeteer from 'puppeteer-core';
import { readFileSync } from 'node:fs';

const [root, out] = process.argv.slice(2);
// Inline the font: Chrome won't load file:// fonts into a setContent() page.
const boldFont = `data:font/ttf;base64,${readFileSync(`${root}/assets/fonts/JetBrainsMonoNerdFont-Bold.ttf`).toString('base64')}`;

const C = {
  ink: '#1C1917', // light-theme text / icon background
  paper: '#FAFAF9', // light-theme canvas
  night: '#0C0A09', // dark-theme canvas
  snow: '#F5F5F4', // dark-theme text
  dot: '#E07A5F', // first collection color
};

// Bookmark ribbon in a 100×100 box: soft top corners, notched bottom.
const ribbon = (fill) =>
  `<path d="M35 18 h30 a5 5 0 0 1 5 5 v61 l-20 -13.5 l-20 13.5 v-61 a5 5 0 0 1 5 -5 z" fill="${fill}"/>`;
const dot = (fill) => `<circle cx="50" cy="38" r="5" fill="${fill}"/>`;

/**
 * mark scale: fraction of the canvas the 100-unit mark box occupies.
 * bg: background color or null for transparent.
 */
const markSvg = ({ size, scale, bg, ribbonFill, dotFill }) => {
  const box = size * scale;
  const offset = (size - box) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ''}
    <g transform="translate(${offset} ${offset}) scale(${box / 100})">
      ${ribbon(ribbonFill)}${dotFill ? dot(dotFill) : ''}
    </g>
  </svg>`;
};

// Splash: ribbon + wordmark, transparent so the plugin's backgroundColor shows through.
const splashHtml = ({ ribbonFill, textFill }) => `
  <div style="width:1024px;height:1024px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:56px">
    <svg width="420" height="420" viewBox="0 0 100 100">${ribbon(ribbonFill)}${dot(C.dot)}</svg>
    <div style="font-family:Mono;font-size:112px;letter-spacing:48px;margin-right:-48px;color:${textFill}">BOOKIE</div>
  </div>`;

const assets = [
  // iOS / default app icon: opaque, Apple applies the rounded mask.
  { file: 'icon.png', size: 1024, html: markSvg({ size: 1024, scale: 0.68, bg: C.ink, ribbonFill: C.paper, dotFill: C.dot }) },
  // Android adaptive icon: launcher crops to the centre ~66%, so keep the mark inside that.
  { file: 'android-icon-foreground.png', size: 512, transparent: true, html: markSvg({ size: 512, scale: 0.42, bg: null, ribbonFill: C.paper, dotFill: C.dot }) },
  { file: 'android-icon-background.png', size: 512, html: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="${C.ink}"/></svg>` },
  // Android 13+ themed icon: only alpha is used; the dot is cut out so it still reads.
  {
    file: 'android-icon-monochrome.png',
    size: 432,
    transparent: true,
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="432" height="432" viewBox="0 0 432 432">
      <defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
        <!-- Mask content is already in the transformed group's units (0–100), so no extra transform. -->
        <rect width="100" height="100" fill="white"/>${dot('black')}
      </mask></defs>
      <g mask="url(#m)" transform="translate(${(432 - 432 * 0.42) / 2} ${(432 - 432 * 0.42) / 2}) scale(${(432 * 0.42) / 100})">${ribbon('#FFFFFF')}</g>
    </svg>`,
  },
  { file: 'splash-icon.png', size: 1024, transparent: true, html: splashHtml({ ribbonFill: C.ink, textFill: C.ink }) },
  { file: 'splash-icon-dark.png', size: 1024, transparent: true, html: splashHtml({ ribbonFill: C.snow, textFill: C.snow }) },
  { file: 'favicon.png', size: 48, html: markSvg({ size: 48, scale: 0.8, bg: C.ink, ribbonFill: C.paper, dotFill: C.dot }) },
];

const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage();
for (const a of assets) {
  await page.setViewport({ width: a.size, height: a.size, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><html><head><style>
      @font-face { font-family: Mono; src: url('${boldFont}'); }
      html,body { margin:0; background: transparent; }
      svg, div { display:block; }
    </style></head><body>${a.html}</body></html>`,
    { waitUntil: 'load' },
  );
  await page.evaluate(() => document.fonts.ready);
  if (a.file.startsWith('splash')) console.log('  font loaded:', await page.evaluate(() => document.fonts.check('112px Mono')));
  await page.screenshot({ path: `${out}/${a.file}`, omitBackground: !!a.transparent, clip: { x: 0, y: 0, width: a.size, height: a.size } });
  console.log('wrote', a.file);
}
await browser.close();
