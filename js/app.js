// Menú móvil
const menuBoton = document.getElementById('menuBoton');
const menu = document.getElementById('menu');

menuBoton.addEventListener('click', function() {
  const abierto = menu.classList.toggle('abierto');
  menuBoton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
});

menu.addEventListener('click', function(e) {
  if (e.target.tagName === 'A') {
    menu.classList.remove('abierto');
    menuBoton.setAttribute('aria-expanded', 'false');
  }
});

// Borde de la cabecera al bajar
const cabecera = document.getElementById('cabecera');
window.addEventListener('scroll', function() {
  cabecera.classList.toggle('con-borde', window.scrollY > 12);
}, { passive: true });

// Filtro de proyectos
document.querySelectorAll('.filtro').forEach(function(boton) {
  boton.addEventListener('click', function() {
    const filtro = boton.dataset.filtro;

    document.querySelectorAll('.filtro').forEach(function(b) {
      b.classList.toggle('activo', b === boton);
    });

    document.querySelectorAll('.proyecto').forEach(function(p) {
      p.classList.toggle('oculto', filtro !== 'todos' && p.dataset.tipo !== filtro);
      p.classList.add('visible');
    });
  });
});

// Aparición al hacer scroll
if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver(function(entradas) {
    entradas.forEach(function(entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.revelar').forEach(function(el) { observador.observe(el); });
} else {
  document.querySelectorAll('.revelar').forEach(function(el) { el.classList.add('visible'); });
}

document.getElementById('anio').textContent = new Date().getFullYear();

// Carrusel lateral de proyectos
(function() {
  const carrusel = document.getElementById('carrusel');
  const antes = document.getElementById('carruselAntes');
  const despues = document.getElementById('carruselDespues');
  if (!carrusel) return;

  function paso() {
    const tarjeta = carrusel.querySelector('.proyecto:not(.oculto)');
    return tarjeta ? tarjeta.getBoundingClientRect().width + 24 : 380;
  }

  function actualizar() {
    const maximo = carrusel.scrollWidth - carrusel.clientWidth - 2;
    antes.disabled = carrusel.scrollLeft <= 2;
    despues.disabled = carrusel.scrollLeft >= maximo;
  }

  antes.addEventListener('click', function() { carrusel.scrollBy({ left: -paso(), behavior: 'smooth' }); });
  despues.addEventListener('click', function() { carrusel.scrollBy({ left: paso(), behavior: 'smooth' }); });
  carrusel.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar);

  // Al cambiar de filtro, vuelve al principio.
  document.querySelectorAll('.filtro').forEach(function(boton) {
    boton.addEventListener('click', function() {
      carrusel.scrollTo({ left: 0 });
      setTimeout(actualizar, 60);
    });
  });

  actualizar();
})();
