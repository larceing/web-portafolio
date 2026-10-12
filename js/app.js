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

// Constelación del fondo: puntos que se mueven despacio y se unen al acercarse.
(function() {
  const lienzo = document.getElementById('constelacion');
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!lienzo || !lienzo.getContext) return;

  const ctx = lienzo.getContext('2d');
  let puntos = [];
  let ancho = 0;
  let alto = 0;

  function preparar() {
    const escala = Math.min(window.devicePixelRatio || 1, 2);
    ancho = lienzo.clientWidth;
    alto = lienzo.clientHeight;
    lienzo.width = ancho * escala;
    lienzo.height = alto * escala;
    ctx.setTransform(escala, 0, 0, escala, 0, 0);

    const cantidad = Math.min(70, Math.round(ancho * alto / 22000));
    puntos = [];
    for (let i = 0; i < cantidad; i++) {
      puntos.push({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }

  function pintar() {
    ctx.clearRect(0, 0, ancho, alto);

    for (let i = 0; i < puntos.length; i++) {
      const p = puntos[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > ancho) p.vx *= -1;
      if (p.y < 0 || p.y > alto) p.vy *= -1;

      for (let j = i + 1; j < puntos.length; j++) {
        const q = puntos[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) {
          ctx.strokeStyle = 'rgba(94, 231, 255, ' + (0.16 * (1 - d / 130)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(94, 231, 255, 0.75)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!quieto) requestAnimationFrame(pintar);
  }

  preparar();
  pintar();
  window.addEventListener('resize', function() {
    preparar();
    if (quieto) pintar();
  });
})();
