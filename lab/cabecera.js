// Cabecera de la web en el laboratorio: pasa su altura real a --cab (la lista y la
// barra del laboratorio se colocan debajo), le pone sombra al bajar y, al elegir
// un proyecto, vuelve arriba para verlo desde el principio.
(function () {
  var cab = document.querySelector('.cabecera');
  if (!cab) return;
  var raiz = document.documentElement;
  function medir() { raiz.style.setProperty('--cab', cab.offsetHeight + 'px'); }
  function mirar() { cab.classList.toggle('con-sombra', window.scrollY > 8); }
  medir(); mirar();
  if (window.ResizeObserver) new ResizeObserver(medir).observe(cab);
  else window.addEventListener('resize', medir);
  window.addEventListener('scroll', mirar, { passive: true });
  window.addEventListener('hashchange', function () { window.scrollTo(0, 0); });
  // En pantallas estrechas la lista se abre en su sitio: se lleva a la vista.
  var boton = document.getElementById('abrirLista');
  var lista = document.getElementById('catalogo');
  if (boton && lista) boton.addEventListener('click', function () {
    setTimeout(function () {
      if (document.body.classList.contains('lista-abierta')) lista.scrollIntoView({ block: 'start' });
    }, 0);
  });
})();
