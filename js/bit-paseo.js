// Bit se mueve por la página.
//
// Tres maneras de moverse (prototipo, se elige una):
//   guia     · vuela al margen, junto al título de la sección que se está leyendo
//   ascensor · sube y baja por el borde derecho según lo leído, como una barra de progreso
//   paseo    · pasea solo por los márgenes y se deja «empujar» por el scroll
//
// Se elige con data-paseo="..." en #bit, o con ?bit=guia|ascensor|paseo en la
// dirección (para probar). Sin ninguna, Bit se queda en la esquina como antes.
//
// Coste: solo mueve la caja de Bit con transform (sin repintar la página) y el
// bucle se para cuando Bit llega a su sitio. En pantallas estrechas, con
// «menos movimiento» o con Bit oculto, se queda quieto en la esquina.
(function () {
  var caja = document.getElementById('bit');
  if (!caja) return;
  var cuerpo = document.getElementById('bitCuerpo');

  var parametro = (location.search.match(/[?&]bit=(guia|ascensor|paseo)\b/) || [])[1];
  var modo = parametro || caja.getAttribute('data-paseo');
  if (!modo) return;

  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  if (mq('(prefers-reduced-motion: reduce)')) return;

  caja.classList.add('paseo-' + modo);

  // Posición: desplazamiento de la caja respecto a su sitio en la esquina (px).
  var pos = { x: 0, y: 0 }, vel = { x: 0, y: 0 }, obj = { x: 0, y: 0 };
  var activo = false, ultimo = 0, quietoDesde = 0, encima = false;

  // Medidas del cuerpo en su sitio de la esquina (esquina superior izquierda).
  // En estos modos el bocadillo va por encima (position: absolute), así que la
  // caja mide lo mismo que el cuerpo y su sitio no cambia al hablar.
  function reposo() {
    var r = caja.getBoundingClientRect();
    return { x: r.left - pos.x, y: r.top - pos.y, w: cuerpo.offsetWidth, h: cuerpo.offsetHeight };
  }
  function ancho() { return document.documentElement.clientWidth; }

  function estrecho() { return ancho() < 900 || mq('(max-width: 640px)'); }

  // Hueco libre a cada lado del contenido (el contenido mide --ancho, 1160 px).
  function margen() {
    var medida = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ancho')) || 1160;
    return Math.max(0, (ancho() - medida) / 2) - 8;
  }

  // Lleva el cuerpo de Bit a (x, y) de la ventana: calcula el objetivo.
  function irA(x, y) {
    var r = reposo();
    var H = window.innerHeight, W = ancho();
    x = Math.min(Math.max(x, 8), W - r.w - 8);
    y = Math.min(Math.max(y, 72), H - r.h - 8);
    obj.x = x - r.x;
    obj.y = y - r.y;
    despertar();
  }

  function aLaEsquina() { obj.x = 0; obj.y = 0; despertar(); }

  // ---- guia ----
  var lados = {};
  function seccionActual() {
    var linea = window.innerHeight * 0.4, actual = null;
    document.querySelectorAll('main section').forEach(function (s) {
      if (s.getBoundingClientRect().top < linea) actual = s;
    });
    return actual;
  }
  function guia() {
    if (estrecho()) return aLaEsquina();
    var s = seccionActual();
    var titulo = s && s.querySelector('h1, h2');
    if (!titulo) return aLaEsquina();
    var r = reposo(), t = titulo.getBoundingClientRect(), m = margen();
    // Si el margen es muy estrecho (portátil pequeño), taparía texto: a la esquina.
    if (m < r.w * 0.5) return aLaEsquina();
    // Alterna lados de una sección a otra; si el margen no cabe, a la derecha.
    var id = s.id || 'inicio';
    if (!(id in lados)) lados[id] = Object.keys(lados).length % 2 === 0 ? 'der' : 'izq';
    var lado = m > r.w + 10 ? lados[id] : 'der';
    var x = lado === 'izq' ? Math.max(8, m - r.w - 4) : ancho() - m + 4;
    irA(x, t.top + t.height / 2 - r.h * 0.55);
  }

  // ---- ascensor ----
  function ascensor() {
    var r = reposo();
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var avance = total > 0 ? window.scrollY / total : 0;
    var arriba = 80, abajo = window.innerHeight - r.h - 14;
    if (estrecho()) arriba = Math.max(arriba, abajo - 160); // en tablet, un recorrido corto
    obj.x = 0;
    obj.y = (arriba + avance * (abajo - arriba)) - r.y;
    despertar();
  }

  // ---- paseo ----
  var siguientePaseo = 0, ultimoScroll = window.scrollY;
  function puntoLibre() {
    var r = reposo(), m = margen(), W = ancho(), H = window.innerHeight;
    var y = 90 + Math.random() * Math.max(0, H - r.h - 110);
    if (m > r.w + 10) {
      var izq = Math.random() < 0.5;
      return { x: izq ? m - r.w - 4 - Math.random() * Math.max(0, m - r.w - 20) : W - m + 4 + Math.random() * Math.max(0, m - r.w - 20), y: y };
    }
    // Sin márgenes: por el borde derecho y la franja de abajo.
    return Math.random() < 0.5 ? { x: W - r.w - 8, y: y } : { x: W * 0.55 + Math.random() * (W * 0.45 - r.w), y: H - r.h - 8 };
  }
  function paseo(ahora) {
    if (estrecho()) return aLaEsquina();
    if (encima) return;
    if (ahora > siguientePaseo) {
      var p = puntoLibre();
      irA(p.x, p.y);
      siguientePaseo = ahora + 6000 + Math.random() * 4000;
    }
  }

  function calcular(ahora) {
    if (caja.classList.contains('oculto')) { obj.x = obj.y = 0; return; }
    if (modo === 'guia') guia();
    else if (modo === 'ascensor') ascensor();
    else paseo(ahora || performance.now());
  }

  // ---- Movimiento con muelle ----
  function despertar() {
    if (activo) return;
    activo = true;
    ultimo = performance.now();
    requestAnimationFrame(paso);
  }

  function paso(ahora) {
    var dt = Math.min(0.05, (ahora - ultimo) / 1000);
    ultimo = ahora;
    if (modo === 'paseo') paseo(ahora);
    var k = modo === 'ascensor' ? 60 : 28, c = modo === 'ascensor' ? 13 : 8;
    ['x', 'y'].forEach(function (e) {
      vel[e] += ((obj[e] - pos[e]) * k - vel[e] * c) * dt;
      pos[e] += vel[e] * dt;
    });
    // Se inclina hacia donde va y se estira un poco al subir.
    var inclina = Math.max(-16, Math.min(16, vel.x * 0.025));
    var estira = 1 + Math.max(-0.05, Math.min(0.05, -vel.y * 0.00012));
    caja.style.transform = 'translate3d(' + pos.x.toFixed(1) + 'px,' + pos.y.toFixed(1) + 'px,0)';
    cuerpo.style.transform = 'rotate(' + inclina.toFixed(2) + 'deg) scale(' + (2 - estira).toFixed(3) + ',' + estira.toFixed(3) + ')';

    // El bocadillo, al lado que tenga sitio.
    var r = cuerpo.getBoundingClientRect();
    caja.classList.toggle('izq', r.left + r.width / 2 < ancho() / 2);
    caja.classList.toggle('abajo', r.top < 190);

    var parado = Math.abs(obj.x - pos.x) < 0.5 && Math.abs(obj.y - pos.y) < 0.5 && Math.abs(vel.x) < 2 && Math.abs(vel.y) < 2;
    if (parado) {
      quietoDesde = quietoDesde || ahora;
      // En «paseo» el bucle sigue (a poco coste) para elegir el siguiente sitio.
      if (modo !== 'paseo' || ahora - quietoDesde > 12000) { activo = false; return; }
    } else {
      quietoDesde = 0;
    }
    requestAnimationFrame(paso);
  }

  // ---- Eventos ----
  var pendiente = false;
  window.addEventListener('scroll', function () {
    if (modo === 'paseo' && !estrecho()) {
      // El scroll empuja a Bit un poco, como el viento.
      var d = window.scrollY - ultimoScroll;
      vel.y -= Math.max(-600, Math.min(600, d * 6));
      despertar();
    }
    ultimoScroll = window.scrollY;
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () { pendiente = false; calcular(); });
  }, { passive: true });

  window.addEventListener('resize', function () { lados = {}; calcular(); });
  cuerpo.addEventListener('pointerenter', function () { encima = true; });
  cuerpo.addEventListener('pointerleave', function () { encima = false; });
  document.getElementById('bitBoton').addEventListener('click', function () {
    setTimeout(function () { calcular(); despertar(); }, 0);
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) calcular(); });

  // Empieza cuando Bit ya se ve (bit-arranque.js añade .listo).
  var vigia = new MutationObserver(function () {
    if (caja.classList.contains('listo')) { vigia.disconnect(); setTimeout(calcular, 1600); }
  });
  vigia.observe(caja, { attributes: true, attributeFilter: ['class'] });
})();
