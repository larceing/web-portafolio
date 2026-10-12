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

document.getElementById('anio').textContent = new Date().getFullYear();
