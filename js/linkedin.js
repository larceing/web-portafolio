// Página /linkedin/: cada semana (de lunes a domingo) elige otras publicaciones
// de la lista y cambia su orden. Todos los visitantes ven la misma selección
// durante la semana. Cuántas se ven a la vez lo dice data-a-la-vez.
(function() {
  const caja = document.querySelector('.embebidas');
  if (!caja) return;

  const todas = Array.from(caja.querySelectorAll('.embebida'));
  const aLaVez = Number(caja.dataset.aLaVez) || todas.length;

  // Semanas desde el lunes 5 de enero de 1970: la semilla del sorteo.
  let semilla = Math.floor((Date.now() / 86400000 + 3) / 7);
  function azar() {
    semilla = (semilla + 0x6D2B79F5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  for (let i = todas.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [todas[i], todas[j]] = [todas[j], todas[i]];
  }

  todas.forEach(function(figura, i) {
    figura.hidden = i >= aLaVez;
    caja.appendChild(figura);
  });
})();

// Estados de las publicaciones: «cargando» con un brillo hasta que llega el
// marco, y si a los 12 segundos no ha llegado, un aviso con el enlace directo.
(function() {
  const caja = document.querySelector('.embebidas');
  if (!caja) return;
  caja.querySelectorAll('.embebida').forEach(function(figura) {
    const marco = figura.querySelector('iframe');
    if (!marco) return;
    figura.classList.add('cargando');
    let listo = false;
    marco.addEventListener('load', function() {
      listo = true;
      figura.classList.remove('cargando', 'fallo');
    });
    function vigilar() {
      setTimeout(function() {
        if (listo) return;
        figura.classList.remove('cargando');
        figura.classList.add('fallo');
        if (!figura.querySelector('.embebida-fallo')) {
          const aviso = document.createElement('p');
          aviso.className = 'embebida-fallo';
          aviso.setAttribute('role', 'status');
          aviso.textContent = caja.dataset.fallo;
          figura.insertBefore(aviso, figura.querySelector('figcaption'));
        }
      }, 12000);
    }
    // Con loading="lazy" el marco no se pide hasta que se acerca: se cuenta desde ahí.
    if ('IntersectionObserver' in window) {
      const ojo = new IntersectionObserver(function(entradas) {
        if (entradas.some(function(e) { return e.isIntersecting; })) { ojo.disconnect(); vigilar(); }
      }, { rootMargin: '300px' });
      ojo.observe(figura);
    } else {
      vigilar();
    }
  });
})();
