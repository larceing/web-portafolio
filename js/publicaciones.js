// Página /linkedin/: cada semana (de lunes a domingo) elige otras publicaciones
// de la lista y cambia su orden. Todos los visitantes ven la misma selección
// durante la semana. Cuántas se ven a la vez lo dice data-a-la-vez.
// Nombres sin «linkedin» a propósito: Brave y uBlock esconden lo que lo lleva.
(function() {
  const caja = document.querySelector('.entradas');
  if (!caja) return;

  const todas = Array.from(caja.querySelectorAll('.entrada'));
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

  todas.forEach(function(tarjeta, i) {
    tarjeta.hidden = i >= aLaVez;
    caja.appendChild(tarjeta);
  });
})();

// El visor oficial pone cookies de terceros, así que no se pide hasta que la
// persona pulsa el botón (Guía de cookies de la AEPD). La tarjeta siempre se
// ve: el marco se añade debajo y, si a los 12 segundos no ha llegado (por
// ejemplo, porque el navegador lo bloquea), se quita y sale un aviso.
(function() {
  const caja = document.querySelector('.entradas');
  const aviso = document.getElementById('visorAviso');
  const boton = document.getElementById('visorCargar');
  if (!caja || !boton) return;
  boton.addEventListener('click', function() {
    if (aviso) aviso.hidden = true;
    const tarjetas = Array.from(caja.querySelectorAll('.entrada'));
    const primera = tarjetas.find(function(t) { return t.dataset.marco; });
    if (!primera) return;
    // Si el navegador bloquea LinkedIn (Brave, uBlock), el marco se queda en
    // blanco sin avisar. Se prueba antes con una petición: si falla, solo se
    // pone el aviso en cada tarjeta y no se añade ningún marco.
    fetch(primera.dataset.marco, { mode: 'no-cors', credentials: 'omit' }).then(function() {
      caja.classList.add('con-visor');
      tarjetas.forEach(cargar);
    }, function() {
      tarjetas.forEach(avisar);
    });
  });

  function avisar(tarjeta) {
    if (tarjeta.querySelector('.entrada-fallo')) return;
    const nota = document.createElement('p');
    nota.className = 'entrada-fallo';
    nota.setAttribute('role', 'status');
    nota.textContent = caja.dataset.fallo;
    tarjeta.insertBefore(nota, tarjeta.querySelector('.entrada-ir'));
  }

  function cargar(tarjeta) {
    if (!tarjeta.dataset.marco || tarjeta.querySelector('iframe')) return;
    const marco = document.createElement('iframe');
    marco.src = tarjeta.dataset.marco;
    marco.height = tarjeta.dataset.alto || 640;
    marco.title = tarjeta.dataset.titulo || '';
    marco.loading = 'lazy';
    marco.allowFullscreen = true;
    tarjeta.classList.add('cargando');
    tarjeta.insertBefore(marco, tarjeta.querySelector('.entrada-ir'));

    let listo = false;
    marco.addEventListener('load', function() {
      listo = true;
      tarjeta.classList.remove('cargando');
    });
    function vigilar() {
      setTimeout(function() {
        if (listo) return;
        tarjeta.classList.remove('cargando');
        marco.remove();
        avisar(tarjeta);
      }, 12000);
    }
    // Con loading="lazy" el marco no se pide hasta que se acerca: se cuenta desde ahí.
    if ('IntersectionObserver' in window) {
      const ojo = new IntersectionObserver(function(entradas) {
        if (entradas.some(function(e) { return e.isIntersecting; })) { ojo.disconnect(); vigilar(); }
      }, { rootMargin: '300px' });
      ojo.observe(tarjeta);
    } else {
      vigilar();
    }
  }
})();
