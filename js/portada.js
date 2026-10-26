// Portada: carrusel del principio y pestañas de las oficinas Ada.
// Sin JavaScript se ve el primer mensaje y la primera oficina; las demás
// siguen en la página (para buscadores) y el laboratorio enseña todo.
(function () {
  var heroe = document.querySelector('.heroe');
  if (heroe) {
    var diapos = Array.prototype.slice.call(heroe.querySelectorAll('.heroe-diapo'));
    var puntos = Array.prototype.slice.call(heroe.querySelectorAll('.heroe-punto'));
    var pausa = heroe.querySelector('.heroe-pausa');
    var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var actual = 0, reloj = null, parado = quieto;

    heroe.classList.add('con-js');
    heroe.querySelectorAll('[hidden]').forEach(function (el) { el.hidden = false; });

    function ir(n) {
      actual = (n + diapos.length) % diapos.length;
      diapos.forEach(function (d, i) {
        var si = i === actual;
        d.classList.toggle('activa', si);
        if (si) d.removeAttribute('aria-hidden'); else d.setAttribute('aria-hidden', 'true');
        d.querySelectorAll('a').forEach(function (a) { if (si) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1'); });
      });
      puntos.forEach(function (p, i) {
        p.classList.toggle('activo', i === actual);
        if (i === actual) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current');
      });
    }
    function programar() {
      clearInterval(reloj);
      if (!parado) reloj = setInterval(function () { ir(actual + 1); }, 7000);
    }
    function pintarPausa() {
      pausa.setAttribute('aria-label', parado ? pausa.dataset.seguir : pausa.dataset.pausar);
      pausa.firstElementChild.textContent = parado ? '▶' : '❚❚';
    }

    heroe.querySelector('.heroe-ant').addEventListener('click', function () { ir(actual - 1); programar(); });
    heroe.querySelector('.heroe-sig').addEventListener('click', function () { ir(actual + 1); programar(); });
    puntos.forEach(function (p) { p.addEventListener('click', function () { ir(+p.dataset.ir); programar(); }); });
    pausa.addEventListener('click', function () { parado = !parado; pintarPausa(); programar(); });
    // Se para mientras el ratón o el foco están dentro, para poder leer.
    heroe.addEventListener('mouseenter', function () { clearInterval(reloj); });
    heroe.addEventListener('mouseleave', programar);
    heroe.addEventListener('focusin', function () { clearInterval(reloj); });
    heroe.addEventListener('focusout', programar);
    // Deslizar con el dedo
    var x0 = null;
    heroe.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    heroe.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { ir(actual + (dx < 0 ? 1 : -1)); programar(); }
    });
    pintarPausa();
    programar();
  }

  var lista = document.querySelector('.pestanas');
  if (lista) {
    var pestanas = Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]'));
    function elegir(p, foco) {
      pestanas.forEach(function (o) {
        var si = o === p;
        o.setAttribute('aria-selected', si);
        if (si) o.removeAttribute('tabindex'); else o.setAttribute('tabindex', '-1');
        document.getElementById(o.getAttribute('aria-controls')).hidden = !si;
      });
      if (foco) p.focus();
    }
    pestanas.forEach(function (p, i) {
      p.addEventListener('click', function () { elegir(p); });
      p.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? pestanas.length - 1 : null;
        if (n === null) return;
        e.preventDefault();
        elegir(pestanas[(n + pestanas.length) % pestanas.length], true);
      });
    });
  }
})();
