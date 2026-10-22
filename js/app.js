// Filtro de proyectos
document.querySelectorAll('.filtro').forEach(function(boton) {
  boton.addEventListener('click', function() {
    const filtro = boton.dataset.filtro;

    document.querySelectorAll('.filtro').forEach(function(b) {
      b.classList.toggle('activo', b === boton);
    });

    document.querySelectorAll('.tesela').forEach(function(t) {
      t.classList.toggle('oculta', filtro !== 'todos' && t.dataset.tipo !== filtro);
    });
  });
});

// Ficha de proyecto: se abre al pulsar una tesela.
(function() {
  const ficha = document.getElementById('ficha');
  const cabecera = document.getElementById('fichaCabecera');
  const cuerpo = document.getElementById('fichaCuerpo');

  document.querySelectorAll('.tesela').forEach(function(tesela) {
    tesela.addEventListener('click', function() {
      const detalle = document.getElementById(tesela.dataset.detalle);
      if (!detalle) return;

      cabecera.style.setProperty('--c', detalle.dataset.color);
      cabecera.innerHTML = tesela.querySelector('svg').outerHTML;
      cuerpo.innerHTML = detalle.innerHTML;
      cuerpo.querySelector('h3').id = 'fichaTitulo';

      if (ficha.showModal) {
        ficha.showModal();
      } else {
        ficha.setAttribute('open', '');
      }
      ficha.scrollTop = 0;
    });
  });

  function cerrar() {
    if (ficha.close) {
      ficha.close();
    } else {
      ficha.removeAttribute('open');
    }
  }

  document.getElementById('fichaCerrar').addEventListener('click', cerrar);

  // Pulsar fuera de la ficha también la cierra.
  ficha.addEventListener('click', function(e) {
    if (e.target === ficha) cerrar();
  });
})();

// Relieve 3D: las teselas y los servicios se inclinan hacia el puntero y les
// cruza un brillo. Solo con ratón y si nadie ha pedido menos movimiento.
(function() {
  const mq = function(q) { return window.matchMedia && window.matchMedia(q).matches; };
  if (!mq('(hover: hover) and (pointer: fine)') || mq('(prefers-reduced-motion: reduce)')) return;

  document.querySelectorAll('.tesela, .servicio').forEach(function(el) {
    el.classList.add('relieve');
    let pendiente = null;
    el.addEventListener('pointermove', function(e) {
      if (pendiente) return;
      pendiente = requestAnimationFrame(function() {
        pendiente = null;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', (-y * 12).toFixed(2) + 'deg');
        el.style.setProperty('--ry', (x * 14).toFixed(2) + 'deg');
        el.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
        el.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
      });
    });
    el.addEventListener('pointerleave', function() {
      ['--rx', '--ry'].forEach(function(v) { el.style.removeProperty(v); });
    });
  });
})();

document.getElementById('anio').textContent = new Date().getFullYear();
