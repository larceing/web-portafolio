// Bit se mueve por la página.
//
// Cuatro maneras de moverse (la web usa «libre», puesto en construir.js):
//   libre    · solo se pone donde no tapa nada (ver «libre» más abajo)
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

  var parametro = (location.search.match(/[?&]bit=(libre|guia|ascensor|paseo)\b/) || [])[1];
  var modo = parametro || caja.getAttribute('data-paseo');
  if (!modo) return;

  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  // Con «menos movimiento» solo se queda el modo libre, y salta sin animación.
  var sinAnimar = mq('(prefers-reduced-motion: reduce)');
  if (sinAnimar && modo !== 'libre') return;

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

  // ---- libre: un algoritmo de uso de la pantalla ----
  // Byte (y su bocadillo) solo se ponen en un hueco donde no hay nada debajo.
  // 1. Se proponen sitios: los márgenes junto al título de la sección que se
  //    lee (si caben) y las esquinas y bordes de la ventana.
  // 2. En el móvil manda el dedo: si tocas arriba, Byte se va abajo, y al revés.
  // 3. Cada sitio se comprueba con una rejilla de puntos: si alguno cae sobre
  //    texto, una imagen, un botón o una tarjeta, ese sitio no vale.
  // 4. Si no hay ningún hueco, Byte se aparta al borde y solo se asoma un poco.
  // 5. Mientras se desplaza la página, si algo pasa por debajo, se esconde, y
  //    reaparece en un hueco cuando la página se para.
  var ultimoToque = null, apartadoHasta = 0;

  function cabeceraAbajo() {
    var c = document.querySelector('.cabecera');
    if (!c) return 8;
    var b = c.getBoundingClientRect().bottom;
    return b > 0 ? b + 8 : 8;
  }

  // ¿Hay contenido en este punto de la ventana? (Byte no cuenta.)
  var FONDOS = /^(HTML|BODY|MAIN|SECTION)$/;
  function esFondo(el) {
    if (FONDOS.test(el.tagName)) return true;
    if (el.matches('img[aria-hidden="true"], .portada, .portada-dentro, .bloque')) return true;
    if (/^(IMG|CANVAS|SVG|VIDEO|IFRAME|A|BUTTON|INPUT|TEXTAREA|SELECT|LABEL|LI|DT|DD|P|H1|H2|H3|H4|FIGURE)$/i.test(el.tagName)) return false;
    var e = getComputedStyle(el);
    if (e.backgroundImage !== 'none') return false;
    var fondo = e.backgroundColor;
    if (fondo && fondo !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(fondo)) return false;
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && n.textContent.trim()) return false;
    }
    return true;
  }
  function hayAlgo(x, y) {
    var W = ancho(), H = window.innerHeight;
    if (x < 0 || y < 0 || x > W || y > H) return false;
    var pila = document.elementsFromPoint(x, y);
    for (var i = 0; i < pila.length; i++) {
      if (caja.contains(pila[i])) continue;
      return !esFondo(pila[i]);
    }
    return false;
  }
  // Parte del rectángulo que tapa algo (0 = hueco limpio). Rejilla cols × filas.
  function tapa(x, y, w, h, cols, filas) {
    var malos = 0, total = 0;
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < filas; j++) {
        total++;
        if (hayAlgo(x + w * (i + 0.5) / cols, y + h * (j + 0.5) / filas)) malos++;
      }
    }
    return malos / total;
  }
  // Del cuerpo solo cuenta el robot, no el aire transparente de alrededor.
  // También cuenta el botón de cerrar (×), que va pegado al cuerpo.
  var botonX = document.getElementById('bitBoton');
  function tapaByte(x, y, r) {
    var nota = tapa(x + r.w * 0.2, y + r.h * 0.12, r.w * 0.6, r.h * 0.82, 4, 5);
    if (nota === 0 && botonX && botonX.offsetWidth && getComputedStyle(botonX).opacity !== '0') {
      var b = botonX.getBoundingClientRect(), c = cuerpo.getBoundingClientRect();
      var bx = x + (b.left - c.left), by = y + (b.top - c.top);
      nota = tapa(bx, by, b.width, b.height, 2, 2) * 0.5;
    }
    return nota;
  }

  function sitios(r) {
    var W = ancho(), H = window.innerHeight, techo = cabeceraAbajo(), m = margen();
    var abajo = H - r.h - 8, lista = [];
    // Márgenes junto al título de la sección (como el modo guía).
    if (m >= r.w * 0.7) {
      var s = seccionActual(), t = s && s.querySelector('h1, h2');
      var y = t ? t.getBoundingClientRect().top + t.getBoundingClientRect().height / 2 - r.h * 0.55 : techo + 20;
      y = Math.min(Math.max(y, techo), abajo);
      var xi = Math.max(8, m - r.w + r.w * 0.15), xd = W - m - r.w * 0.15;
      lista.push({ x: xi, y: y }, { x: xd, y: y }, { x: xd, y: abajo }, { x: xi, y: abajo }, { x: xd, y: techo }, { x: xi, y: techo });
    }
    var bordes = [
      { x: W - r.w - 8, y: abajo, abajo: true }, { x: 8, y: abajo, abajo: true },
      { x: W - r.w - 8, y: (techo + abajo) / 2 }, { x: 8, y: (techo + abajo) / 2 },
      { x: W - r.w - 8, y: techo, arriba: true }, { x: 8, y: techo, arriba: true }
    ];
    // En el móvil, lejos del dedo.
    if (ultimoToque != null && estrecho()) {
      var tocaArriba = ultimoToque < H / 2;
      bordes.sort(function (a, b) {
        var pa = tocaArriba ? (a.abajo ? 0 : a.arriba ? 2 : 1) : (a.arriba ? 0 : a.abajo ? 2 : 1);
        var pb = tocaArriba ? (b.abajo ? 0 : b.arriba ? 2 : 1) : (b.arriba ? 0 : b.abajo ? 2 : 1);
        return pa - pb;
      });
    }
    return lista.concat(bordes);
  }

  function libre() {
    var r = reposo(), mejor = null;
    var lista = sitios(r);
    for (var i = 0; i < lista.length; i++) {
      var p = lista[i], nota = tapaByte(p.x, p.y, r);
      if (nota === 0) { mejor = p; mejor.nota = 0; break; }
      if (!mejor || nota < mejor.nota) { mejor = p; mejor.nota = nota; }
    }
    var asomado = mejor.nota > 0.05;
    caja.classList.toggle('asomado', asomado);
    if (asomado) {
      // Sin hueco: al borde derecho, abajo, casi fuera de la pantalla.
      mejor = { x: ancho() - r.w * 0.42, y: window.innerHeight - r.h * 0.8 };
    }
    var dx = mejor.x - (r.x + pos.x), dy = mejor.y - (r.y + pos.y);
    if (asomado) { obj.x = mejor.x - r.x; obj.y = mejor.y - r.y; despertar(); }
    else irA(mejor.x, mejor.y, 0);
    // Si el viaje es largo, no cruza la página por encima de nada: desaparece y aparece.
    if (sinAnimar || Math.abs(dx) + Math.abs(dy) > 220) saltar();
  }

  function saltar() {
    caja.classList.add('apartado');
    apartadoHasta = performance.now() + 200;
    setTimeout(function () {
      pos.x = obj.x; pos.y = obj.y; vel.x = vel.y = 0;
      caja.style.transform = 'translate3d(' + pos.x.toFixed(1) + 'px,' + pos.y.toFixed(1) + 'px,0)';
      setTimeout(function () { caja.classList.remove('apartado'); comprobarBocadillo(); }, 30);
    }, 180);
  }

  // Mientras se desplaza la página: si algo pasa por debajo de Byte, se esconde.
  var finScroll = null;
  function alDesplazar() {
    if (enFicha || caja.classList.contains('oculto')) return;
    var b = cuerpo.getBoundingClientRect();
    var r = { w: b.width, h: b.height };
    if (!caja.classList.contains('asomado') && tapaByte(b.left, b.top, r) > 0) caja.classList.add('apartado');
    else comprobarBocadillo();
    clearTimeout(finScroll);
    finScroll = setTimeout(function () {
      caja.classList.remove('apartado');
      libre();
    }, 260);
  }

  // El bocadillo: a un lado con sitio; si tapa algo en todos, no se enseña
  // (salvo que la persona haya pulsado a Byte, que entonces lo pide ella).
  var pidio = 0;
  var bocadillo = document.getElementById('bitBocadillo');
  function comprobarBocadillo() {
    if (modo !== 'libre' || !bocadillo || bocadillo.hidden || enFicha) return;
    if (performance.now() - pidio < 1500) return;
    var combos = [[false, false], [true, false], [false, true], [true, true]];
    var b = cuerpo.getBoundingClientRect();
    var prefIzq = b.left + b.width / 2 < ancho() / 2, prefAbajo = b.top < 190;
    combos.sort(function (a, c) { return (a[0] !== prefIzq) + (a[1] !== prefAbajo) - ((c[0] !== prefIzq) + (c[1] !== prefAbajo)); });
    for (var i = 0; i < combos.length; i++) {
      caja.classList.toggle('izq', combos[i][0]);
      caja.classList.toggle('abajo', combos[i][1]);
      var q = bocadillo.getBoundingClientRect();
      var fuera = q.left < 4 || q.top < cabeceraAbajo() - 4 || q.right > ancho() - 4 || q.bottom > window.innerHeight - 4;
      if (!fuera && tapa(q.left, q.top, q.width, q.height, 5, 3) === 0) { fijoBocadillo = true; return; }
    }
    bocadillo.hidden = true;
  }
  var fijoBocadillo = false, fotogramas = 0;
  if (bocadillo && modo === 'libre') {
    new MutationObserver(function () {
      fijoBocadillo = false;
      if (!bocadillo.hidden) requestAnimationFrame(comprobarBocadillo);
    }).observe(bocadillo, { attributes: true, attributeFilter: ['hidden'], childList: true });
    cuerpo.addEventListener('pointerdown', function () {
      pidio = performance.now();
      // Asomado: al pulsarlo sale un momento entero.
      if (caja.classList.contains('asomado')) {
        caja.classList.remove('asomado');
        irA(ancho() - reposo().w - 8, window.innerHeight - reposo().h - 8, 0);
        setTimeout(libre, 7000);
      }
    });
    window.addEventListener('pointerdown', function (e) {
      if (caja.contains(e.target)) return;
      ultimoToque = e.clientY;
      if (!estrecho()) return;
      // Si el dedo cae en la mitad donde está Byte, se cambia de mitad.
      var b = cuerpo.getBoundingClientRect();
      if ((b.top + b.height / 2 < window.innerHeight / 2) === (e.clientY < window.innerHeight / 2)) setTimeout(libre, 120);
    }, { passive: true });
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
    if (modo === 'libre') libre();
    else if (modo === 'guia') guia();
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
    // En marcha, el bocadillo se revisa cada pocos fotogramas: si empieza a tapar algo, se va.
    if (modo === 'libre' && bocadillo && !bocadillo.hidden && (++fotogramas % 5 === 0)) comprobarBocadillo();
    cuerpo.style.transform = 'rotate(' + inclina.toFixed(2) + 'deg) scale(' + (2 - estira).toFixed(3) + ',' + estira.toFixed(3) + ')';

    // El bocadillo, al lado que tenga sitio.
    var r = cuerpo.getBoundingClientRect();
    if (enFicha) {
      // Junto a la ficha, el bocadillo se abre hacia fuera; dentro, hacia abajo.
      caja.classList.toggle('izq', ladoFicha !== 'izq');
      caja.classList.toggle('abajo', ladoFicha === 'dentro' || r.top < 130);
    } else if (modo !== 'libre') {
      caja.classList.toggle('izq', r.left + r.width / 2 < ancho() / 2);
      caja.classList.toggle('abajo', r.top < 190);
    }

    var parado = Math.abs(obj.x - pos.x) < 0.5 && Math.abs(obj.y - pos.y) < 0.5 && Math.abs(vel.x) < 2 && Math.abs(vel.y) < 2;
    if (parado) {
      if (!quietoDesde && modo === 'libre') comprobarBocadillo();
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
    if (modo === 'libre') return alDesplazar();
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
    if (estrecho() || enFicha || modo === 'libre') return;
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
