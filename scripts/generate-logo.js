const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * High-quality Givit gift logo assets for Expo / Android / PWA.
 * Android adaptive icons need 1024×1024; the old 48px foreground caused blur.
 */

const BLUE = '#004CFF';
const BLUE_SOFT = 'rgba(0, 76, 255, 0.42)';
const BLUE_BOW_KNOT = '#0039C7';

/** Full app icon: white circle + gift (for Expo icon / web / PWA) */
function logoSvg(size) {
  const cx = size / 2;
  const s = size / 512; // scale from 512 design space
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${12 * s}" stdDeviation="${14 * s}" flood-color="#000000" flood-opacity="0.08"/>
    </filter>
  </defs>
  <circle cx="${cx}" cy="${cx}" r="${cx}" fill="#FFFFFF"/>
  <g filter="url(#soft)">
    <!-- back box (soft, offset) -->
    <g transform="translate(${cx} ${cx * 1.06}) rotate(-14) translate(${-cx} ${-cx * 1.06})" opacity="0.9">
      <rect x="${168 * s}" y="${210 * s}" width="${150 * s}" height="${165 * s}" rx="${18 * s}" fill="${BLUE_SOFT}"/>
    </g>
    <!-- front box -->
    <rect x="${176 * s}" y="${200 * s}" width="${160 * s}" height="${175 * s}" rx="${18 * s}" fill="${BLUE}"/>
    <!-- ribbon -->
    <line x1="${256 * s}" y1="${200 * s}" x2="${256 * s}" y2="${375 * s}" stroke="#FFFFFF" stroke-width="${10 * s}" stroke-linecap="round" stroke-opacity="0.9"/>
    <line x1="${176 * s}" y1="${278 * s}" x2="${336 * s}" y2="${278 * s}" stroke="#FFFFFF" stroke-width="${10 * s}" stroke-linecap="round" stroke-opacity="0.9"/>
    <!-- bow -->
    <path d="M${256 * s} ${200 * s}
      C${220 * s} ${150 * s} ${180 * s} ${155 * s} ${190 * s} ${195 * s}
      C${200 * s} ${220 * s} ${230 * s} ${230 * s} ${256 * s} ${245 * s}
      C${282 * s} ${230 * s} ${312 * s} ${220 * s} ${322 * s} ${195 * s}
      C${332 * s} ${155 * s} ${292 * s} ${150 * s} ${256 * s} ${200 * s} Z" fill="${BLUE}"/>
    <circle cx="${256 * s}" cy="${208 * s}" r="${12 * s}" fill="${BLUE_BOW_KNOT}"/>
  </g>
</svg>`);
}

/**
 * Adaptive icon foreground: transparent canvas, gift centered in safe zone.
 * Expo/Android: 1024×1024, important content in center ~66%.
 */
function adaptiveForegroundSvg(size) {
  // Design gift in ~420px box centered (safe within 66% of 1024)
  const gift = 420;
  const ox = (size - gift) / 2;
  const oy = (size - gift) / 2 + 8;
  const u = gift / 220; // local unit from ~220 design

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- transparent background -->
  <g transform="translate(${ox} ${oy})">
    <!-- back box -->
    <g transform="translate(${110 * u} ${125 * u}) rotate(-14) translate(${-110 * u} ${-125 * u})" opacity="0.9">
      <rect x="${28 * u}" y="${78 * u}" width="${95 * u}" height="${110 * u}" rx="${14 * u}" fill="${BLUE_SOFT}"/>
    </g>
    <!-- front box -->
    <rect x="${55 * u}" y="${70 * u}" width="${110 * u}" height="${120 * u}" rx="${14 * u}" fill="${BLUE}"/>
    <!-- ribbon -->
    <line x1="${110 * u}" y1="${70 * u}" x2="${110 * u}" y2="${190 * u}" stroke="#FFFFFF" stroke-width="${8 * u}" stroke-linecap="round" stroke-opacity="0.92"/>
    <line x1="${55 * u}" y1="${122 * u}" x2="${165 * u}" y2="${122 * u}" stroke="#FFFFFF" stroke-width="${8 * u}" stroke-linecap="round" stroke-opacity="0.92"/>
    <!-- bow -->
    <path d="M${110 * u} ${70 * u}
      C${85 * u} ${32 * u} ${55 * u} ${36 * u} ${62 * u} ${65 * u}
      C${70 * u} ${85 * u} ${92 * u} ${92 * u} ${110 * u} ${102 * u}
      C${128 * u} ${92 * u} ${150 * u} ${85 * u} ${158 * u} ${65 * u}
      C${165 * u} ${36 * u} ${135 * u} ${32 * u} ${110 * u} ${70 * u} Z" fill="${BLUE}"/>
    <circle cx="${110 * u}" cy="${76 * u}" r="${9 * u}" fill="${BLUE_BOW_KNOT}"/>
  </g>
</svg>`);
}

function monochromeSvg(size) {
  const gift = 420;
  const ox = (size - gift) / 2;
  const oy = (size - gift) / 2 + 8;
  const u = gift / 220;
  const ink = '#000000';

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${ox} ${oy})">
    <rect x="${55 * u}" y="${70 * u}" width="${110 * u}" height="${120 * u}" rx="${14 * u}" fill="${ink}"/>
    <line x1="${110 * u}" y1="${70 * u}" x2="${110 * u}" y2="${190 * u}" stroke="#FFFFFF" stroke-width="${8 * u}" stroke-linecap="round"/>
    <line x1="${55 * u}" y1="${122 * u}" x2="${165 * u}" y2="${122 * u}" stroke="#FFFFFF" stroke-width="${8 * u}" stroke-linecap="round"/>
    <path d="M${110 * u} ${70 * u}
      C${85 * u} ${32 * u} ${55 * u} ${36 * u} ${62 * u} ${65 * u}
      C${70 * u} ${85 * u} ${92 * u} ${92 * u} ${110 * u} ${102 * u}
      C${128 * u} ${92 * u} ${150 * u} ${85 * u} ${158 * u} ${65 * u}
      C${165 * u} ${36 * u} ${135 * u} ${32 * u} ${110 * u} ${70 * u} Z" fill="${ink}"/>
  </g>
</svg>`);
}

async function renderSvg(svg, outPath, size = 1024) {
  await sharp(svg)
    .resize(size, size, { fit: 'fill' })
    .png({ compressionLevel: 9, quality: 100 })
    .toFile(outPath);
}

async function main() {
  const root = path.join(__dirname, '..');
  const assets = path.join(root, 'assets');
  const pub = path.join(root, 'public');

  const master = logoSvg(1024);
  const adaptiveFg = adaptiveForegroundSvg(1024);
  const mono = monochromeSvg(1024);
  const bg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#FFFFFF"/>
</svg>`);

  // Master / Expo icon (1024)
  await renderSvg(master, path.join(assets, 'icon.png'), 1024);
  await renderSvg(master, path.join(assets, 'favicon.png'), 512);

  // Android adaptive (1024 — was 48px before, which caused blur)
  await renderSvg(adaptiveFg, path.join(assets, 'android-icon-foreground.png'), 1024);
  await renderSvg(bg, path.join(assets, 'android-icon-background.png'), 1024);
  await renderSvg(mono, path.join(assets, 'android-icon-monochrome.png'), 1024);

  // Splash-friendly square
  await renderSvg(master, path.join(assets, 'splash-icon.png'), 1024);

  // PWA sizes
  if (!fs.existsSync(pub)) fs.mkdirSync(pub, { recursive: true });
  await sharp(master).resize(512, 512).png().toFile(path.join(pub, 'logo512.png'));
  await sharp(master).resize(192, 192).png().toFile(path.join(pub, 'logo192.png'));
  await sharp(master).resize(192, 192).png().toFile(path.join(pub, 'favicon.png'));

  // Standalone high-res logo for sharing / store listings
  await renderSvg(master, path.join(assets, 'logo-1024.png'), 1024);

  const check = [
    'assets/icon.png',
    'assets/logo-1024.png',
    'assets/android-icon-foreground.png',
    'assets/favicon.png',
    'public/logo512.png',
  ];
  for (const f of check) {
    const m = await sharp(path.join(root, f)).metadata();
    console.log(f, `${m.width}x${m.height}`, `${fs.statSync(path.join(root, f)).size}b`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
