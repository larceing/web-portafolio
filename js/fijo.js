// Botones fijos de todas las páginas (los pone pie() en construir.js):
// - «Volver arriba»: aparece al bajar más de dos pantallas.
// - WhatsApp: solo en el móvil (lo decide el CSS).
// Además cuenta en Umami los clics en WhatsApp, correo y teléfono, para saber
// cuántos contactos salen de la web y desde qué página. Sin cookies.
(function () {
  'use strict';

  var arriba = document.querySelector('.fijo-arriba');
  if (arriba) {
    arriba.hidden = false;
    var visible = false;
    var mirar = function () {
      var toca = window.scrollY > window.innerHeight * 2;
      if (toca !== visible) {
        visible = toca;
        arriba.classList.toggle('visible', toca);
      }
    };
    window.addEventListener('scroll', mirar, { passive: true });
    mirar();
    arriba.addEventListener('click', function (e) {
      e.preventDefault();
      var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: quieto ? 'auto' : 'smooth' });
      var destino = document.getElementById('contenido');
      if (destino) {
        destino.setAttribute('tabindex', '-1');
        destino.focus({ preventScroll: true });
      }
    });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !window.umami || typeof window.umami.track !== 'function') return;
    var href = a.getAttribute('href');
    var tipo = /wa\.me\//.test(href) ? 'whatsapp' : /^mailto:/.test(href) ? 'correo' : /^tel:/.test(href) ? 'telefono' : '';
    if (!tipo) return;
    window.umami.track('contacto-' + tipo, { pagina: location.pathname, boton: a.classList.contains('fijo-whatsapp') ? 'fijo' : (a.className || 'enlace') });
  });
})();
