const sharp = require("sharp");
const path = require("path");

// Reevu brand colors
const PRIMARY = "#3B82F6";
const GRADIENT_END = "#6366F1";
const BG_LIGHT = "#2563EB";
const BG_DARK = "#0F172A";

function createIconSvg(size, padding = 0) {
  const s = size - padding * 2;
  const cx = size / 2;
  const cy = size / 2;
  const r = s / 2;

  // Scale letter R to fit within circle
  const scale = s / 64;
  const tx = (size - 64 * scale) / 2;
  const ty = (size - 64 * scale) / 2;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${PRIMARY}"/>
      <stop offset="1" stop-color="${GRADIENT_END}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)"/>
  <g transform="translate(${tx}, ${ty}) scale(${scale})">
    <path d="M22 18h12c4.42 0 8 3.58 8 8s-3.58 8-8 8h-4l10 12h-7l-9-12h-2v12h-6V18h6zm6 6v4h6c1.1 0 2-.9 2-2s-.9-2-2-2h-6z" fill="#FFF"/>
  </g>
</svg>`;
}

function createAdaptiveIconSvg(size) {
  // Adaptive icons need the foreground with extra padding (safe zone is inner 66%)
  const s = size;
  const scale = (s / 64) * 0.5; // smaller R in adaptive
  const tx = (s - 64 * scale) / 2;
  const ty = (s - 64 * scale) / 2;

  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${s}" y2="${s}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${PRIMARY}"/>
      <stop offset="1" stop-color="${GRADIENT_END}"/>
    </linearGradient>
  </defs>
  <rect width="${s}" height="${s}" fill="url(#bg)"/>
  <g transform="translate(${tx}, ${ty}) scale(${scale})">
    <path d="M22 18h12c4.42 0 8 3.58 8 8s-3.58 8-8 8h-4l10 12h-7l-9-12h-2v12h-6V18h6zm6 6v4h6c1.1 0 2-.9 2-2s-.9-2-2-2h-6z" fill="#FFF"/>
  </g>
</svg>`;
}

function createSplashSvg(size) {
  const scale = (size / 64) * 0.6;
  const tx = (size - 64 * scale) / 2;
  const ty = (size - 64 * scale) / 2;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${tx}, ${ty}) scale(${scale})">
    <path d="M22 18h12c4.42 0 8 3.58 8 8s-3.58 8-8 8h-4l10 12h-7l-9-12h-2v12h-6V18h6zm6 6v4h6c1.1 0 2-.9 2-2s-.9-2-2-2h-6z" fill="#FFF"/>
  </g>
</svg>`;
}

async function generate() {
  const outDir = path.join(__dirname, "..", "assets", "images");

  // App icon (1024x1024)
  await sharp(Buffer.from(createIconSvg(1024)))
    .png()
    .toFile(path.join(outDir, "icon.png"));
  console.log("✓ icon.png (1024x1024)");

  // Adaptive icon foreground (1024x1024)
  await sharp(Buffer.from(createAdaptiveIconSvg(1024)))
    .png()
    .toFile(path.join(outDir, "adaptive-icon.png"));
  console.log("✓ adaptive-icon.png (1024x1024)");

  // Favicon (48x48)
  await sharp(Buffer.from(createIconSvg(192)))
    .resize(48)
    .png()
    .toFile(path.join(outDir, "favicon.png"));
  console.log("✓ favicon.png (48x48)");

  // Splash icon (200x200 white R on transparent)
  await sharp(Buffer.from(createSplashSvg(200)))
    .png()
    .toFile(path.join(outDir, "splash-icon.png"));
  console.log("✓ splash-icon.png (200x200)");

  console.log("\n🎉 All Reevu brand icons generated!");
}

generate().catch(console.error);
