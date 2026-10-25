// Bit se mueve por la página.
//
// Tres maneras de moverse (la web usa «guia», puesto en construir.js):
//   guia     · vuela al margen, junto al título de la sección que se está leyendo
//   ascensor · sube y baja por el borde derecho según lo leído, como una barra de progreso
//   paseo    · pasea solo por los márgenes y se deja «empujar» por el scroll
//
// En todos, al abrir la ficha de un proyecto Byte entra a su lado (o se asoma
// en su cabecera en el móvil) y la resume en bocadillos.
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
  function irA(x, y, techo) {
    var r = reposo();
    var H = window.innerHeight, W = ancho();
    x = Math.min(Math.max(x, 8), W - r.w - 8);
    y = Math.min(Math.max(y, techo == null ? 72 : techo), H - r.h - 8);
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
    // Si Byte no cabe entero en el margen, taparía texto: a la esquina.
    if (m < r.w + 10) return aLaEsquina();
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

  // ---- Ficha de proyecto: Byte entra a su lado y la explica ----
  var ficha = document.getElementById('ficha');
  var enFicha = false, ladoFicha = 'izq', turnos = [];

  // Frases de la ficha abierta: «Problema: …», «Qué hice: …», «Resultado: …»
  // (la primera frase de cada parte) o, si no tiene esas partes, su texto.
  function frases() {
    var c = document.getElementById('fichaCuerpo');
    if (!c) return [];
    function primera(t) {
      t = (t || '').replace(/\s+/g, ' ').trim();
      var m = t.match(/^.+?[.!?](?=\s|$)/);
      return m ? m[0] : t;
    }
    var lista = [];
    var dts = c.querySelectorAll('dl.caso dt');
    if (dts.length) {
      dts.forEach(function (dt) {
        var dd = dt.nextElementSibling;
        if (dd) lista.push(dt.textContent.trim() + ': ' + primera(dd.textContent));
      });
    } else {
      c.querySelectorAll('p:not(.etiqueta):not(.tec):not(.enlaces):not(.pagina-proyecto)').forEach(function (p, i) {
        if (i < 2) lista.push(primera(p.textContent));
      });
    }
    return lista;
  }

  function sitioFicha() {
    var f = ficha.getBoundingClientRect(), r = reposo(), W = ancho();
    if (f.left >= r.w + 24) { ladoFicha = 'izq'; return irA(f.left - r.w - 12, f.top + 190, 8); }
    if (W - f.right >= r.w + 24) { ladoFicha = 'der'; return irA(f.right + 12, f.top + 190, 8); }
    // Sin sitio a los lados (móvil): se asoma en la franja de color de la cabecera.
    ladoFicha = 'dentro';
    irA(f.left + 14, f.top + Math.max(4, 150 - r.h), 8);
  }

  function explicar() {
    var api = window.ByteWeb;
    if (!api) return;
    turnos.forEach(clearTimeout);
    turnos = [];
    var lista = frases(), intro = api.guion && api.guion.ficha;
    api.saludar();
    var t = 650;
    lista.forEach(function (texto, i) {
      if (i === 0 && intro) texto = intro + ' ' + texto;
      var dura = Math.min(12, 4 + texto.length / 20);
      turnos.push(setTimeout(function () { if (enFicha) api.decir(texto, dura); }, t));
      t += dura * 1000 + 350;
    });
  }

  function entrarFicha() {
    enFicha = true;
    ficha.appendChild(caja); // Así queda por encima del fondo oscuro de la ficha.
    requestAnimationFrame(function () { sitioFicha(); explicar(); });
  }

  function salirFicha() {
    enFicha = false;
    turnos.forEach(clearTimeout);
    turnos = [];
    if (window.ByteWeb) window.ByteWeb.callar();
    document.body.appendChild(caja);
    calcular();
  }

  if (ficha) {
    new MutationObserver(function () {
      var abierta = ficha.hasAttribute('open');
      if (abierta && !enFicha && !caja.classList.contains('oculto') && caja.classList.contains('listo')) entrarFicha();
      else if (!abierta && enFicha) salirFicha();
    }).observe(ficha, { attributes: true, attributeFilter: ['open'] });
  }

  function calcular(ahora) {
    if (caja.classList.contains('oculto')) { obj.x = obj.y = 0; return; }
    if (enFicha) return sitioFicha();
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
    if (enFicha) {
      // Junto a la ficha, el bocadillo se abre hacia fuera; dentro, hacia abajo.
      caja.classList.toggle('izq', ladoFicha !== 'izq');
      caja.classList.toggle('abajo', ladoFicha === 'dentro' || r.top < 130);
    } else {
      caja.classList.toggle('izq', r.left + r.width / 2 < ancho() / 2);
      caja.classList.toggle('abajo', r.top < 190);
    }

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

  // ---- Sin actividad, Byte se pone a jugar; si sigue sin pasar nada, se duerme ----
  // Mismo orden que las frases de UI.bit.jugar.
  var JUEGOS = ['malabares', 'voltereta', 'baile', 'giro'];
  var ultimaActividad = performance.now(), siguienteJuego = 15000, juegos = 0, nJuego = 0, durmiendo = false;

  function actividad() {
    ultimaActividad = performance.now();
    siguienteJuego = 12000 + Math.random() * 6000;
    juegos = 0;
    if (durmiendo) {
      durmiendo = false;
      var api = window.ByteWeb;
      if (api && api.despertar()) api.decir(api.guion.despertar, 3.5);
    }
  }
  ['pointermove', 'pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, actividad, { passive: true });
  });

  // Un saltito de lado y vuelta a su sitio (acompaña a la voltereta).
  function saltito() {
    if (estrecho() || enFicha) return;
    var r = cuerpo.getBoundingClientRect();
    obj.x += r.left > ancho() / 2 ? -120 : 120;
    obj.y -= 50;
    despertar();
    setTimeout(calcular, 1300);
  }

  setInterval(function () {
    var api = window.ByteWeb;
    if (!api || !api.hay3d() || enFicha || durmiendo || document.hidden || caja.classList.contains('oculto')) return;
    var quieto = performance.now() - ultimaActividad;
    if (juegos >= 4 && quieto > 55000) {
      durmiendo = true;
      api.dormir();
      api.decir(api.guion.dormir, 9);
      return;
    }
    if (quieto < siguienteJuego) return;
    var i = nJuego++ % JUEGOS.length;
    var dura = api.jugar(JUEGOS[i]);
    if (JUEGOS[i] === 'voltereta') saltito();
    var frases = api.guion.jugar || [];
    if (frases[i] && (juegos === 0 || Math.random() < 0.4)) api.decir(frases[i], Math.max(4, dura + 1));
    juegos++;
    siguienteJuego = quieto + 8000 + Math.random() * 5000;
  }, 1000);

  // Empieza cuando Bit ya se ve (bit-arranque.js añade .listo).
  var vigia = new MutationObserver(function () {
    if (caja.classList.contains('listo')) { vigia.disconnect(); setTimeout(calcular, 1600); }
  });
  vigia.observe(caja, { attributes: true, attributeFilter: ['class'] });
})();
