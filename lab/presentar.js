// Vídeo de entrada del laboratorio: al abrir un proyecto con vídeo, el anuncio
// se presenta en grande, en un marco de móvil (tipo reel) que flota sobre el
// laboratorio, que se sigue viendo detrás.
//
// - La X lo minimiza a su tarjeta y lo recuerda en este navegador
//   (localStorage, sin cookies ni seguimiento): en los demás proyectos ya no se
//   abre solo. «Ver en grande» en la tarjeta lo vuelve a abrir cuando se quiera.
// - El botón de ampliar lo pone a pantalla completa.
//
// No toca lab.js (lo compila el hilo de demos): espera a que aparezca la
// tarjeta .anuncio y mueve su <video> al marco y de vuelta, así lab.js sigue
// cambiando el idioma del vídeo como siempre.
(function () {
  'use strict';

  var CLAVE = 'adl-lab-video';
  var TEXTOS = {
    es: { cerrar: 'Minimizar el vídeo', ampliar: 'Pantalla completa', grande: 'Ver en grande', aviso: 'Vídeo de la app real, con datos de prueba', novedades: 'Novedades' },
    en: { cerrar: 'Minimise the video', ampliar: 'Full screen', grande: 'Watch it big', aviso: 'Video of the real app, with test data', novedades: 'News' },
    zh: { cerrar: '最小化视频', ampliar: '全屏', grande: '放大观看', aviso: '真实应用录屏，使用测试数据', novedades: '动态' }
  };

  function idioma() {
    var l = (document.documentElement.lang || 'es').slice(0, 2);
    return TEXTOS[l] ? l : 'es';
  }
  function txt(k) { return TEXTOS[idioma()][k]; }

  function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) { /* sin almacenamiento: solo esta vez */ } }

  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ahorro = navigator.connection && navigator.connection.saveData;

  var capa = null;      // fondo + móvil, mientras está en grande
  var figura = null;    // la tarjeta .anuncio de la que salió el vídeo
  var vistas = new WeakSet();

  function boton(clase, etiqueta, svg) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = clase;
    b.setAttribute('aria-label', etiqueta);
    b.title = etiqueta;
    b.innerHTML = svg;
    return b;
  }

  var X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var AMPLIAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';

  function presentar(fig, solo) {
    if (capa) return;
    var video = fig.querySelector('video');
    if (!video) return;
    figura = fig;

    capa = document.createElement('div');
    capa.className = 'presenta';
    capa.setAttribute('role', 'dialog');
    capa.setAttribute('aria-modal', 'true');
    var titulo = fig.querySelector('figcaption b');
    capa.setAttribute('aria-label', titulo ? titulo.textContent : 'Vídeo');

    var movil = document.createElement('div');
    movil.className = 'presenta-movil';
    var pantalla = document.createElement('div');
    pantalla.className = 'presenta-pantalla';
    pantalla.appendChild(video);
    movil.appendChild(pantalla);

    var mandos = document.createElement('div');
    mandos.className = 'presenta-mandos';
    var cerrar = boton('presenta-boton', txt('cerrar'), X);
    var ampliar = boton('presenta-boton', txt('ampliar'), AMPLIAR);
    mandos.append(ampliar, cerrar);

    var pie = document.createElement('p');
    pie.className = 'presenta-pie';
    pie.textContent = (titulo ? titulo.textContent + ' · ' : '') + txt('aviso');

    var caja = document.createElement('div');
    caja.className = 'presenta-caja';
    caja.append(mandos, movil, pie);
    capa.appendChild(caja);
    document.body.appendChild(capa);
    document.body.classList.add('con-presenta');

    cerrar.addEventListener('click', function () { minimizar(true); });
    ampliar.addEventListener('click', function () { pantallaCompleta(video, pantalla); });
    capa.addEventListener('click', function (e) { if (e.target === capa) minimizar(true); });
    document.addEventListener('keydown', teclas);

    requestAnimationFrame(function () { capa.classList.add('abierta'); });
    cerrar.focus({ preventScroll: true });

    // Al entrar solo: empieza en silencio (los navegadores no dejan sonar sin
    // un gesto). Con los mandos del vídeo se activa el sonido.
    if (solo) {
      if (!quieto && !ahorro) {
        video.muted = true;
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      }
    } else {
      video.muted = false;
      var q = video.play();
      if (q && q.catch) q.catch(function () {});
    }
  }

  function teclas(e) { if (e.key === 'Escape') minimizar(true); }

  function minimizar(recordar) {
    if (!capa) return;
    if (recordar) guardar('min');
    var video = capa.querySelector('video');
    if (video && figura && figura.isConnected) {
      video.pause();
      figura.insertBefore(video, figura.firstChild);
    }
    document.removeEventListener('keydown', teclas);
    document.body.classList.remove('con-presenta');
    var vieja = capa;
    capa = null;
    vieja.classList.remove('abierta');
    setTimeout(function () { vieja.remove(); }, quieto ? 0 : 220);
    var reabrir = figura && figura.querySelector('.presenta-reabrir');
    if (reabrir && recordar) reabrir.focus({ preventScroll: true });
  }

  function pantallaCompleta(video, caja) {
    if (video.webkitEnterFullscreen && !document.fullscreenEnabled) { video.webkitEnterFullscreen(); return; }
    var el = video.requestFullscreen ? video : caja;
    var pedir = el.requestFullscreen || el.webkitRequestFullscreen;
    if (pedir) pedir.call(el);
  }

  // Botón «Ver en grande» en la tarjeta, para abrirlo cuando se quiera.
  function preparar(fig) {
    if (vistas.has(fig)) return;
    vistas.add(fig);
    var pie = fig.querySelector('figcaption');
    if (pie && !pie.querySelector('.presenta-reabrir')) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'presenta-reabrir';
      b.innerHTML = AMPLIAR + '<span></span>';
      b.querySelector('span').textContent = txt('grande');
      b.addEventListener('click', function () { presentar(fig, false); });
      pie.appendChild(b);
    }
    if (leer() !== 'min') presentar(fig, true);
  }

  function revisar() {
    // Si se cambió de proyecto con el vídeo en grande, su tarjeta ya no existe.
    if (capa && figura && !figura.isConnected) minimizar(false);
    document.querySelectorAll('figure.anuncio').forEach(preparar);
    // Solo si cambia: escribir el mismo texto también avisaría al observador.
    document.querySelectorAll('.presenta-reabrir span').forEach(function (s) {
      if (s.textContent !== txt('grande')) s.textContent = txt('grande');
    });
    var nov = document.getElementById('menuNovedades');
    if (nov && nov.textContent !== txt('novedades')) nov.textContent = txt('novedades');
  }

  new MutationObserver(revisar).observe(document.body, { childList: true, subtree: true });
  new MutationObserver(revisar).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  revisar();
})();
