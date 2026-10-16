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
