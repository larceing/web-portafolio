// Bit, el robot de Club Byte, acompaña la visita.
//
// Primero se ve su foto (img/bit.webp), que no cuesta nada. Cuando la página
// ya ha cargado y está quieta, se pide el 3D (js/bit.js, unos 140 KB
// comprimido, y img/bit.glb). No se carga el 3D si el navegador no tiene
// WebGL, si la persona pide menos movimiento o ahorro de datos, o si lo ha
// ocultado (se recuerda en este navegador).
// En DEV, los enlaces con data-dev (catálogo de plantillas) apuntan a la
// copia de DEV. Va aquí porque este archivo se carga en todas las páginas.
if (location.hostname.indexOf('dev.') === 0) {
  document.querySelectorAll('a[data-dev]').forEach(function (a) { a.href = a.getAttribute('data-dev'); });
}

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

  // ---- Doble clic (o doble toque) en Byte: mensaje para Henry ----
  // No hay servidor de por medio: el mensaje se prepara aquí y se abre el
  // correo o WhatsApp de la persona con todo escrito. Estados: vacío (falta
  // texto), abriendo, listo y, si no se abre nada, copiar el mensaje.
  var dialogo = document.getElementById('byteMensaje');
  var m = guion.mensaje || {};
  function abrirMensaje() {
    if (!dialogo || typeof dialogo.showModal !== 'function') {
      location.href = 'mailto:' + (guion.correoDestino || '');
      return;
    }
    var estado = document.getElementById('byteEstado');
    estado.textContent = '';
    estado.className = 'byte-estado';
    dialogo.showModal();
    if (bit3d) bit3d.saludar();
    var campo = dialogo.querySelector('[name=nombre]');
    setTimeout(function () { campo.focus(); }, 50);
  }
  function textoMensaje(f) {
    var nombre = f.nombre.value.trim(), empresa = f.empresa.value.trim(), texto = f.texto.value.trim();
    var cabeza = nombre ? (m.hola || 'Hola Henry, soy') + ' ' + nombre + (empresa ? ' (' + empresa + ')' : '') + '.' : '';
    return (cabeza ? cabeza + '\n\n' : '') + texto;
  }
  if (dialogo) {
    var f = dialogo.querySelector('form');
    var estado = document.getElementById('byteEstado');
    dialogo.querySelectorAll('[data-via]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (f.texto.value.trim().length < 8) {
          estado.textContent = m.vacio || '';
          estado.className = 'byte-estado error';
          f.texto.focus();
          return;
        }
        var cuerpoMsg = textoMensaje(f);
        var url = b.getAttribute('data-via') === 'whatsapp'
          ? (guion.whatsappDestino || '') + '?text=' + encodeURIComponent(cuerpoMsg)
          : 'mailto:' + guion.correoDestino + '?subject=' + encodeURIComponent(m.asunto || '') + '&body=' + encodeURIComponent(cuerpoMsg);
        estado.textContent = m.abriendo || '';
        estado.className = 'byte-estado cargando';
        if (b.getAttribute('data-via') === 'whatsapp') window.open(url, '_blank', 'noopener');
        else location.href = url;
        setTimeout(function () {
          estado.textContent = '';
          estado.className = 'byte-estado listo';
          estado.appendChild(document.createTextNode((m.listo || '') + ' '));
          var p = document.createElement('span');
          p.className = 'byte-fallo';
          p.appendChild(document.createTextNode((m.fallo || '') + guion.correoDestino + '. '));
          var copiar = document.createElement('button');
          copiar.type = 'button';
          copiar.className = 'enlace';
          copiar.textContent = m.copiar || 'Copiar';
          copiar.addEventListener('click', function () {
            var hecho = function () { copiar.textContent = m.copiado || '✓'; };
            if (navigator.clipboard) navigator.clipboard.writeText(cuerpoMsg).then(hecho, function () { f.texto.select(); });
            else { f.texto.select(); }
          });
          p.appendChild(copiar);
          estado.appendChild(p);
        }, 1200);
      });
    });
    // Clic fuera del cuadro: cerrar.
    dialogo.addEventListener('click', function (e) { if (e.target === dialogo) dialogo.close(); });
  }
  // Doble clic con ratón, o dos toques seguidos en el móvil.
  var ultimoToque = 0;
  cuerpo.addEventListener('dblclick', function (e) { e.preventDefault(); abrirMensaje(); });
  cuerpo.addEventListener('pointerup', function (e) {
    if (e.pointerType !== 'touch') return;
    var ahora = Date.now();
    if (ahora - ultimoToque < 380) { ultimoToque = 0; abrirMensaje(); }
    else ultimoToque = ahora;
  });

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
    // El 3D se pide con el primer gesto (ratón, dedo, tecla o scroll): hasta
    // entonces se ve la foto. Así la carga inicial no paga el WebGL.
    var gestos = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'];
    var alPrimerGesto = function () {
      gestos.forEach(function (g) { window.removeEventListener(g, alPrimerGesto); });
      cargar3d();
    };
    gestos.forEach(function (g) { window.addEventListener(g, alPrimerGesto, { passive: true }); });
    setTimeout(function () { decir(guion.hola, true, movil ? 5 : 7); }, 900);
    observarSecciones();
  }

  // Para js/bit-paseo.js: que Byte hable y salude cuando explica una ficha.
  window.ByteWeb = {
    decir: function (texto, segundos) { decir(texto, false, segundos); },
    callar: function () { clearTimeout(temporizador); bocadillo.hidden = true; },
    saludar: function () { if (bit3d) bit3d.saludar(); },
    jugar: function (tipo) { return bit3d && bit3d.jugar ? bit3d.jugar(tipo) : 0; },
    dormir: function () { if (bit3d && bit3d.dormir) bit3d.dormir(); },
    despertar: function () { return !!(bit3d && bit3d.despertar && bit3d.despertar()); },
    hay3d: function () { return !!bit3d; },
    guion: guion
  };

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
