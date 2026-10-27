// Plantilla v3 · Arce Data Lab. Sin dependencias ni nada de fuera.
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var anio = $('#anio'); if (anio) anio.textContent = new Date().getFullYear();

  // Menú del móvil
  var boton = $('#abrir-menu'), menu = $('#menu');
  function cierraMenu() { menu.classList.remove('abierto'); boton.setAttribute('aria-expanded', 'false'); }
  if (boton) {
    boton.addEventListener('click', function () {
      var abre = !menu.classList.contains('abierto');
      menu.classList.toggle('abierto', abre); boton.setAttribute('aria-expanded', String(abre));
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', cierraMenu); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') cierraMenu(); });
  }

  // Cabecera con sombra, barra de progreso y barra del móvil
  var cab = $('#cab'), prog = $('.progreso'), barra = $('.barra-movil'), heroe = $('#inicio-heroe');
  var pendiente = false;
  function alDesplazar() {
    pendiente = false;
    var y = window.scrollY, alto = document.documentElement.scrollHeight - window.innerHeight;
    cab.classList.toggle('con-sombra', y > 8);
    if (prog) prog.style.transform = 'scaleX(' + (alto > 0 ? Math.min(1, y / alto) : 0) + ')';
    if (barra && heroe) barra.classList.toggle('visible', y > heroe.offsetHeight * 0.6);
  }
  window.addEventListener('scroll', function () { if (!pendiente) { pendiente = true; requestAnimationFrame(alDesplazar); } }, { passive: true });
  alDesplazar();

  // Enlace del menú activo según la sección visible
  if ('IntersectionObserver' in window) {
    var enlaces = $$('.menu a[href^="#"]:not(.btn)');
    var obsMenu = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        enlaces.forEach(function (a) { a.classList.toggle('activo', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    enlaces.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) obsMenu.observe(s); });
  }

  // Aparición al hacer scroll, escalonada dentro de cada grupo
  var rv = $$('.rv');
  rv.forEach(function (el) {
    var hermanos = $$(':scope > .rv', el.parentElement);
    var i = hermanos.indexOf(el);
    if (i > 0) el.style.setProperty('--retardo', Math.min(i, 6) * 0.08 + 's');
  });
  // Solo se esconde lo que está por debajo de la pantalla al cargar: la primera vista sale completa.
  if (!quieto && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visto'); obs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) {
      if (el.closest('.heroe') || el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('espera'); obs.observe(el);
    });
  }

  // Contadores de las cifras
  function cuenta(el) {
    var txt = el.getAttribute('data-contar');
    var m = txt.match(/^([\d.]+)(,(\d+))?(.*)$/);
    if (!m || quieto) return;
    var entero = parseInt(m[1].replace(/\./g, ''), 10), dec = m[3] ? parseInt(m[3], 10) : null, resto = m[4];
    var fin = dec !== null ? entero + dec / Math.pow(10, m[3].length) : entero, t0 = null, dur = 1400;
    function fmt(v) {
      if (dec !== null) return v.toFixed(m[3].length).replace('.', ',') + resto;
      return Math.round(v).toLocaleString('es-ES') + resto;
    }
    function paso(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), v = fin * (1 - Math.pow(1 - p, 3));
      el.textContent = fmt(v);
      if (p < 1) requestAnimationFrame(paso); else el.textContent = txt;
    }
    requestAnimationFrame(paso);
  }
  if ('IntersectionObserver' in window) {
    var obsC = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { cuenta(en.target); obsC.unobserve(en.target); } });
    }, { threshold: 0.6 });
    $$('[data-contar]').forEach(function (el) { obsC.observe(el); });
  }

  // Barras de reseñas
  var barras = $$('.barras i');
  function llena() { barras.forEach(function (i) { $('b', i).style.width = i.getAttribute('data-pct') + '%'; }); }
  if (barras.length && 'IntersectionObserver' in window && !quieto) {
    var obsB = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { llena(); obsB.disconnect(); } }, { threshold: 0.4 });
    obsB.observe($('.barras'));
  } else llena();

  // Pestañas de la carta (teclado: flechas, Inicio, Fin)
  $$('[data-pestanas]').forEach(function (caja) {
    var tabs = $$('[role="tab"]', caja), paneles = $$('[role="tabpanel"]', caja);
    function elige(k, foco) {
      tabs.forEach(function (t, i) { var si = i === k; t.setAttribute('aria-selected', String(si)); t.tabIndex = si ? 0 : -1; });
      paneles.forEach(function (p, i) { p.hidden = i !== k; if (i === k) { p.classList.remove('entra'); void p.offsetWidth; p.classList.add('entra'); } });
      if (foco) tabs[k].focus();
      tabs[k].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { elige(i); });
      t.addEventListener('keydown', function (ev) {
        var k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[ev.key];
        if (k === undefined) return; ev.preventDefault(); elige((k + tabs.length) % tabs.length, true);
      });
    });
    paneles.forEach(function (p, i) { p.hidden = i !== 0; });
  });

  // Carrusel de reseñas
  $$('[data-carrusel]').forEach(function (c) {
    var pista = $('.pista', c), ant = $('.ant', c), sig = $('.sig', c);
    function ancho() { var t = $('li', pista); return t ? t.getBoundingClientRect().width + 16 : 300; }
    function estado() {
      ant.disabled = pista.scrollLeft < 4;
      sig.disabled = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 4;
    }
    ant.addEventListener('click', function () { pista.scrollBy({ left: -ancho(), behavior: quieto ? 'auto' : 'smooth' }); });
    sig.addEventListener('click', function () { pista.scrollBy({ left: ancho(), behavior: quieto ? 'auto' : 'smooth' }); });
    pista.addEventListener('scroll', estado, { passive: true });
    window.addEventListener('resize', estado);
    estado();
  });

  // Visor de la galería
  var visor = $('#visor'), datos = $('#fotos-galeria');
  if (visor && datos && visor.showModal) {
    var fotos = JSON.parse(datos.textContent), actual = 0, img = $('img', visor), pie = $('.visor-pie', visor);
    function muestra(k) {
      actual = (k + fotos.length) % fotos.length;
      img.src = fotos[actual].src; img.alt = fotos[actual].alt;
      pie.textContent = fotos[actual].alt + '  ·  ' + (actual + 1) + ' de ' + fotos.length;
    }
    $$('[data-visor]').forEach(function (b) {
      b.addEventListener('click', function () { muestra(parseInt(b.getAttribute('data-visor'), 10)); visor.showModal(); });
    });
    $('.ant', visor).addEventListener('click', function () { muestra(actual - 1); });
    $('.sig', visor).addEventListener('click', function () { muestra(actual + 1); });
    $('.cerrar', visor).addEventListener('click', function () { visor.close(); });
    visor.addEventListener('click', function (ev) { if (ev.target === visor) visor.close(); });
    visor.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight') muestra(actual + 1);
      if (ev.key === 'ArrowLeft') muestra(actual - 1);
    });
    var x0 = null;
    visor.addEventListener('touchstart', function (ev) { x0 = ev.touches[0].clientX; }, { passive: true });
    visor.addEventListener('touchend', function (ev) {
      if (x0 === null) return; var dx = ev.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) muestra(actual + (dx < 0 ? 1 : -1));
    });
  }

  // Abierto ahora + día de hoy en el horario (hora de España)
  var cfg3 = $('#cfg3');
  if (cfg3) {
    var horario = JSON.parse(cfg3.textContent).horario;
    var ahora = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
    var dia = (ahora.getDay() + 6) % 7; // 0 = lunes
    var fila = $('.horario tr[data-dia="' + dia + '"]'); if (fila) fila.classList.add('hoy');
    var h = horario[dia], min = ahora.getHours() * 60 + ahora.getMinutes();
    function aMin(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
    var texto, abierto = false;
    // h = [día, abre, cierra, abre2, cierra2...] (horario partido)
    for (var t = 1; h && t + 1 < h.length && !texto; t += 2) {
      if (!h[t]) continue;
      var a = aMin(h[t]), c = aMin(h[t + 1]);
      if (min >= a && min < c) { abierto = true; texto = 'Abierto ahora · hasta las ' + h[t + 1]; }
      else if (min < a) texto = 'Cerrado ahora · abre hoy a las ' + h[t];
    }
    if (!texto) {
      for (var k = 1; k <= 7; k++) {
        var d = horario[(dia + k) % 7];
        if (d && d[1]) { texto = 'Cerrado ahora · abre ' + (k === 1 ? 'mañana' : 'el ' + d[0].toLowerCase()) + ' a las ' + d[1]; break; }
      }
    }
    $$('[data-ahora]').forEach(function (p) {
      p.hidden = false; p.classList.toggle('abierto', abierto); $('span', p).textContent = texto || '';
    });
  }
})();
