// Dibuja las imágenes para redes (1200 × 630) de cada página de servicio en
// img/og/<idioma>-<servicio>.jpg y la general, img/og.jpg, con Chromium (Playwright).
//
//   node construir.js        (escribe og/fichas.json)
//   node og/generar.js       (dibuja las imágenes)
//   node construir.js        (las enlaza en og:image de cada servicio)
//
// Solo hace falta repetirlo si cambia el nombre de un servicio o se añade uno.
// Si falta la imagen de un servicio, su página usa img/og.jpg.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = path.join(__dirname, '..');
const fichas = JSON.parse(fs.readFileSync(path.join(__dirname, 'fichas.json'), 'utf8'));
const fuente = 'file://' + path.join(RAIZ, 'fuentes', 'robotoflex-latin.woff2');
const fuenteExt = 'file://' + path.join(RAIZ, 'fuentes', 'robotoflex-latin-ext.woff2');
const byte = 'file://' + path.join(RAIZ, 'img', 'bit.webp');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function html(f) {
  const derecha = f.icono
    ? `<svg class="icono" viewBox="0 0 48 48">${f.icono}</svg>`
    : `<img class="byte" src="${byte}" alt="">`;
  return `<!DOCTYPE html><html lang="${f.lang}"><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Roboto Flex'; font-weight: 400 700; src: url(${fuenteExt}) format('woff2'); unicode-range: U+0100-024F, U+1E00-1EFF; }
  @font-face { font-family: 'Roboto Flex'; font-weight: 400 700; src: url(${fuente}) format('woff2'); }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #FFFFFF; color: #191C20;
    font-family: 'Roboto Flex', 'WenQuanYi Zen Hei', sans-serif; position: relative; }
  .panel { position: absolute; top: 0; right: 0; width: 400px; height: 630px; background: #1B222C;
    clip-path: polygon(70px 0, 100% 0, 100% 100%, 0 100%); display: grid; place-items: center; padding-left: 60px; }
  .icono { width: 210px; height: 210px; fill: none; stroke: #D3E4F5; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
  .byte { width: 208px; }
  .texto { position: absolute; left: 80px; top: 72px; width: 690px; height: 486px; display: flex; flex-direction: column; }
  .ante { font-size: 24px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #1D4F7A; }
  h1 { margin-top: 28px; font-size: ${f.titulo.length > 22 ? 70 : 88}px; line-height: 1.02; font-weight: 700; letter-spacing: -0.02em; }
  .sub { margin-top: 26px; font-size: 32px; line-height: 1.35; color: #2E3238; }
  .url { margin-top: auto; font-size: 25px; color: #5A5F67; }
  .barra { position: absolute; left: 0; bottom: 0; width: 840px; height: 12px; background: linear-gradient(90deg, #1B222C, #2E6C9E); }
  </style></head><body>
  <div class="texto">
    <p class="ante">Arce Data Lab${f.ante ? ' · ' + esc(f.ante) : ''}</p>
    <h1>${esc(f.titulo)}</h1>
    <p class="sub">${esc(f.sub)}</p>
    <p class="url">${esc(f.url)}</p>
  </div>
  <div class="panel">${derecha}</div>
  <div class="barra"></div>
  </body></html>`;
}

const GENERAL = {
  archivo: 'img/og.jpg', lang: 'es', ante: '', titulo: 'Henry Arce',
  sub: 'Automatización, IA aplicada y Power BI para pymes e industria · Alicante',
  url: 'arcedatalab.com', icono: ''
};

(async () => {
  fs.mkdirSync(path.join(RAIZ, 'img', 'og'), { recursive: true });
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const f of [GENERAL].concat(fichas)) {
    const tmp = path.join(__dirname, '_ficha.html');
    fs.writeFileSync(tmp, html(f));
    await pagina.goto('file://' + tmp);
    await pagina.evaluate(() => document.fonts.ready);
    await pagina.screenshot({ path: path.join(RAIZ, f.archivo), type: 'jpeg', quality: 86 });
    fs.unlinkSync(tmp);
    console.log(f.archivo);
  }
  await navegador.close();
})();
