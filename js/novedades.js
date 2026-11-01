// «Lo último» de /novedades/: tarjetas con color, vídeo o imagen.
// La misma función pinta las tarjetas al construir la web (construir.js, con
// la copia de novedades.js) y en el navegador, con lo que devuelve n8n
// (flujo «Ada · Novedades web»: las 7 últimas aprobadas). Si n8n no responde,
// se queda la copia. Sin cookies: es una petición normal, sin credenciales.
(function (raiz) {
  'use strict';

  var LOCALES = { es: 'es-ES', en: 'en-GB', zh: 'zh-CN' };

  function esc(t) {
    return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fecha(iso, lang) {
    try {
      return new Date(iso + 'T12:00:00Z').toLocaleDateString(LOCALES[lang] || 'es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    } catch (e) { return iso; }
  }

  // ctx: { lang, raiz (camino a la raíz del sitio), medios, textos }
  function enlace(u, ctx) {
    if (!u) return '';
    if (/^https?:\/\//.test(u)) return u;
    var global = /^(lab|plantillas|cookies|img)\b/.test(u);
    var ruta = ctx.raiz + (ctx.lang !== 'es' && !global ? ctx.lang + '/' : '') + u;
    if (ctx.lang !== 'es' && /^lab\//.test(u)) ruta = ruta.replace(/lab\/(#.*)?$/, function (m, ancla) { return 'lab/?lang=' + ctx.lang + (ancla || ''); });
    return ruta;
  }

  function medio(n, ctx) {
    var m = ctx.medios[n.producto] || ctx.medios.otro || {};
    var video = n.video || (n.imagen ? null : m.video);
    var imagen = n.imagen || (video ? null : m.imagen);
    if (video && !/[\/.]/.test(video)) {
      var suf = ctx.lang === 'es' ? '' : '-' + ctx.lang;
      var base = ctx.raiz + 'lab/v/' + video + suf;
      return '<div class="nov-movil"><video controls preload="none" playsinline poster="' + esc(base + '.jpg') + '" aria-label="' + esc(ctx.textos.play) + '"><source src="' + esc(base + '.mp4') + '" type="video/mp4"></video></div>';
    }
    if (imagen) {
      var src = /^https?:/.test(imagen) ? imagen : ctx.raiz + imagen;
      var forma = (m.forma === 'movil' || /iit-|vertical/.test(imagen)) ? 'nov-movil' : 'nov-ventana';
      return '<div class="' + forma + '"><img src="' + esc(src) + '" alt="" loading="lazy"></div>';
    }
    return '<div class="nov-marca">' + esc(n.producto) + '</div>';
  }

  function tarjeta(n, ctx) {
    var l = ctx.lang;
    var titulo = n.titulo && typeof n.titulo === 'object' ? n.titulo[l] : (n[l] || [])[0];
    var texto = n.texto && typeof n.texto === 'object' ? n.texto[l] : (n[l] || [])[1];
    var m = ctx.medios[n.producto] || ctx.medios.otro || {};
    var href = enlace(n.enlace, ctx);
    var fuera = /^https?:/.test(href);
    return '<article class="nov" style="--c:' + esc(m.color || '#1D4F7A') + '" data-tipo="' + esc(n.tipo) + '">' +
      '<div class="nov-media">' + medio(n, ctx) + '</div>' +
      '<div class="nov-cuerpo">' +
        '<p class="nov-meta"><span class="nov-tipo">' + esc((ctx.textos.tipos || {})[n.tipo] || n.tipo) + '</span><time datetime="' + esc(n.fecha) + '">' + esc(fecha(n.fecha, l)) + '</time></p>' +
        '<h3>' + esc(titulo) + '</h3>' +
        '<p>' + esc(texto) + '</p>' +
        (href ? '<a class="nov-ir" href="' + esc(href) + '"' + (fuera ? ' target="_blank" rel="noopener"' : '') + '>' + esc(ctx.textos.ver) + ' →</a>' : '') +
      '</div></article>';
  }

  function pintar(lista, ctx) {
    return lista.slice(0, 7).map(function (n) { return tarjeta(n, ctx); }).join('\n');
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { pintar: pintar };
    return;
  }

  // En el navegador: pide a n8n las novedades y, si llegan bien, cambia la copia.
  var caja = document.getElementById('novedadesLista');
  if (!caja || !window.fetch) return;
  var ctx;
  try { ctx = JSON.parse(caja.getAttribute('data-ctx')); } catch (e) { return; }
  var ctrl = window.AbortController ? new AbortController() : null;
  var reloj = setTimeout(function () { if (ctrl) ctrl.abort(); }, 6000);
  fetch(caja.getAttribute('data-fuente'), { credentials: 'omit', signal: ctrl ? ctrl.signal : undefined })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      clearTimeout(reloj);
      if (!d || !Array.isArray(d.novedades) || !d.novedades.length) return;
      var html = pintar(d.novedades, ctx);
      if (html !== caja.innerHTML.trim()) caja.innerHTML = html;
    })
    .catch(function () { /* se queda la copia */ });
})(this);
