// Bit, el robot de Club Byte, acompaña la visita.
//
// Primero se ve su foto (img/bit.webp), que no cuesta nada. Cuando la página
// ya ha cargado y está quieta, se pide el 3D (js/bit.js, unos 140 KB
// comprimido, y img/bit.glb). No se carga el 3D si el navegador no tiene
// WebGL, si la persona pide menos movimiento o ahorro de datos, o si lo ha
// ocultado (se recuerda en este navegador).
(function () {
  var caja = document.getElementById('bit');
  if (!caja) return;

  var bocadillo = document.getElementById('bitBocadillo');
  var cuerpo = document.getElementById('bitCuerpo');
  var foto = caja.querySelector('.bit-foto');
  var lienzo = document.getElementById('bitLienzo');
  var boton = document.getElementById('bitBoton');
  var guion = {};
  try { guion = JSON.parse(document.getElementById('bitGuion').textContent); } catch (e) { /* sin textos */ }

  var movil = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
  var menosMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ahorro = navigator.connection && navigator.connection.saveData;

  function leer() { try { return localStorage.getItem('bit'); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem('bit', v); } catch (e) { /* sin memoria */ } }

  var bit3d = null;
  var cargando = false;
  var temporizador = null;
  var dichos = {};

  // ---- Bocadillo ----
  function decir(texto, conEnlace, segundos) {
    if (!texto || caja.classList.contains('oculto')) return;
    bocadillo.textContent = texto;
    if (conEnlace && guion.canalUrl) {
      var a = document.createElement('a');
      a.href = guion.canalUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = guion.canal || 'Club Byte';
      bocadillo.appendChild(document.createTextNode(' '));
      bocadillo.appendChild(a);
    }
    bocadillo.hidden = false;
    clearTimeout(temporizador);
    temporizador = setTimeout(function () { bocadillo.hidden = true; }, (segundos || 6) * 1000);
  }

  // ---- Ocultar y mostrar ----
  function ponerOculto(oculto) {
    caja.classList.toggle('oculto', oculto);
    boton.setAttribute('aria-expanded', String(!oculto));
    boton.title = oculto ? (guion.mostrar || 'Bit') : (guion.ocultar || '×');
    boton.setAttribute('aria-label', boton.title);
    boton.textContent = oculto ? '' : '×';
    if (oculto) bocadillo.hidden = true;
    guardar(oculto ? 'oculto' : 'visible');
    if (!oculto) cargar3d();
  }
  boton.addEventListener('click', function () { ponerOculto(!caja.classList.contains('oculto')); });

  // ---- 3D ----
  function hayWebGL() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }

  function cargar3d() {
    if (bit3d || cargando || menosMovimiento || ahorro || !hayWebGL()) return;
    cargando = true;
    var s = document.createElement('script');
    s.src = caja.getAttribute('data-js');
    s.async = true;
    s.onload = function () {
      if (!window.ClubByteBit) return;
      lienzo.hidden = false;
      window.ClubByteBit.iniciar({
        lienzo: lienzo,
        modelo: caja.getAttribute('data-modelo'),
        alPulsar: alPulsar
      }).then(function (b) {
        bit3d = b;
        foto.hidden = true;
        caja.classList.add('en3d');
      }).catch(function () {
        lienzo.hidden = true; // Se queda la foto.
      });
    };
    s.onerror = function () { cargando = false; };
    document.head.appendChild(s);
  }

  var pulsaciones = 0;
  function alPulsar() {
    var frases = guion.pulsar || [];
    decir(frases[pulsaciones % frases.length], pulsaciones % frases.length === 2, 5);
    pulsaciones++;
  }
  foto.addEventListener('click', alPulsar);

  // ---- Comentarios por sección (solo en pantallas grandes) ----
  function observarSecciones() {
    if (movil || !('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        var clave = e.target.getAttribute('data-bit');
        if (e.isIntersecting && !dichos[clave] && guion[clave]) {
          dichos[clave] = true;
          decir(guion[clave], clave === 'arcedatalab');
          if (bit3d && clave === 'contacto') bit3d.saludar();
        }
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('[data-bit]').forEach(function (s) { obs.observe(s); });
  }

  function empezar() {
    caja.classList.add('listo');
    if (leer() === 'oculto') {
      ponerOculto(true);
      return;
    }
    cargar3d();
    setTimeout(function () { decir(guion.hola, true, movil ? 5 : 7); }, 900);
    observarSecciones();
  }

  function cuandoQuieta(fn) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: 3000 });
    } else {
      setTimeout(fn, 1200);
    }
  }

  if (document.readyState === 'complete') {
    cuandoQuieta(empezar);
  } else {
    window.addEventListener('load', function () { cuandoQuieta(empezar); });
  }
})();
