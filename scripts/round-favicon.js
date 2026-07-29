const sharp = require('sharp');
const fs = require('fs');

const size = 512;
const r = size / 2;

async function main() {
  // Draw gift on transparent canvas, then clip to circle
  const art = Buffer.from(`
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#FFFFFF"/>
  <g transform="translate(256 272) rotate(12) translate(-256 -272)" opacity="0.42">
    <rect x="168" y="210" width="150" height="165" rx="18" fill="#004CFF"/>
  </g>
  <rect x="176" y="200" width="160" height="175" rx="18" fill="#004CFF"/>
  <line x1="256" y1="200" x2="256" y2="375" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
  <line x1="176" y1="278" x2="336" y2="278" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
  <path d="M256 200 C220 150 180 155 190 195 C200 220 230 230 256 245 C282 230 312 220 322 195 C332 155 292 150 256 200 Z" fill="#004CFF"/>
  <circle cx="256" cy="208" r="12" fill="#0039C7"/>
</svg>`);

  const mask = Buffer.from(`
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${r}" cy="${r}" r="${r}" fill="#ffffff"/>
</svg>`);

  const rounded = await sharp(art)
    .ensureAlpha()
    .composite([
      {
        input: await sharp(mask).png().toBuffer(),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  await sharp(rounded).toFile('assets/favicon.png');
  await sharp(rounded).resize(192, 192).toFile('assets/icon.png');
  await sharp(rounded).resize(48, 48).toFile('assets/android-icon-foreground.png');

  console.log('ok', fs.statSync('assets/favicon.png').size);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
