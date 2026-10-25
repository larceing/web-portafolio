// Filtro de proyectos
document.querySelectorAll('.filtro').forEach(function(boton) {
  boton.addEventListener('click', function() {
    const filtro = boton.dataset.filtro;

    document.querySelectorAll('.filtro').forEach(function(b) {
      b.classList.toggle('activo', b === boton);
    });

    let vistas = 0;
    document.querySelectorAll('.mini').forEach(function(t) {
      const fuera = filtro !== 'todos' && t.dataset.tipo !== filtro;
      t.parentNode.hidden = fuera;
      if (!fuera) vistas++;
    });

    // Estado vacío: si un filtro no deja ningún proyecto, se dice.
    const vacio = document.getElementById('sinProyectos');
    if (vacio) vacio.hidden = vistas > 0;
  });
});

// Ficha de proyecto: se abre al pulsar un proyecto de la lista corta o
// «Ver el caso» en un proyecto principal.
(function() {
  const ficha = document.getElementById('ficha');
  const cabecera = document.getElementById('fichaCabecera');
  const cuerpo = document.getElementById('fichaCuerpo');

  document.querySelectorAll('[data-detalle]').forEach(function(tesela) {
    tesela.addEventListener('click', function() {
      const detalle = document.getElementById(tesela.dataset.detalle);
      if (!detalle) return;
      const tarjeta = tesela.closest('.principal') || tesela;

      cabecera.style.setProperty('--c', detalle.dataset.color);
      cabecera.innerHTML = tarjeta.querySelector('.tesela-cara').innerHTML;
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

// «Ver todos»: la portada enseña nueve proyectos; el botón o cualquier filtro
// abren la lista completa.
(function() {
  const boton = document.getElementById('verTodos');
  const cuadricula = document.querySelector('.cuadricula');
  if (!boton || !cuadricula) return;
  function abrir() {
    cuadricula.classList.add('abierta');
    boton.hidden = true;
  }
  boton.addEventListener('click', abrir);
  document.querySelectorAll('.filtro').forEach(function(f) {
    f.addEventListener('click', function() {
      if (f.dataset.filtro !== 'todos') abrir();
    });
  });
})();

// «Lo que puede ganar tu empresa»: las escaleras suben al entrar en pantalla.
(function() {
  const zona = document.querySelector('.niveles');
  if (!zona || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  zona.querySelectorAll('.nivel').forEach(function(n) { n.classList.add('animar'); });
  const io = new IntersectionObserver(function(entradas) {
    entradas.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visto');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.35 });
  zona.querySelectorAll('.nivel').forEach(function(n) { io.observe(n); });
})();

document.getElementById('anio').textContent = new Date().getFullYear();

// La cabecera coge una sombra suave en cuanto bajas.
(function () {
  const cab = document.querySelector('.cabecera');
  if (!cab) return;
  const mirar = () => cab.classList.toggle('con-sombra', window.scrollY > 8);
  window.addEventListener('scroll', mirar, { passive: true });
  mirar();
})();

// Los datos clave de la portada cuentan desde cero la primera vez que se ven
// (el año no, que no tiene gracia contar hasta 2019).
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cifras = Array.from(document.querySelectorAll('.datos-clave strong')).filter(function (el) {
    const n = Number(el.textContent.replace(/\./g, ''));
    return Number.isFinite(n) && n > 0 && n < 1900 || n > 2100;
  });
  if (!cifras.length || !('IntersectionObserver' in window)) return;
  const formato = new Intl.NumberFormat(document.documentElement.lang || 'es');
  cifras.forEach(function (el) {
    const final = Number(el.textContent.replace(/[.,]/g, ''));
    el.dataset.final = el.textContent;
    el.style.minWidth = el.offsetWidth + 'px';
    const ojo = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting) return;
      ojo.disconnect();
      const t0 = performance.now(), dura = 1300;
      (function paso(ahora) {
        const k = Math.min(1, (ahora - t0) / dura), suave = 1 - Math.pow(1 - k, 3);
        el.textContent = k < 1 ? formato.format(Math.round(final * suave)) : el.dataset.final;
        if (k < 1) requestAnimationFrame(paso);
      })(t0);
    }, { threshold: 0.6 });
    ojo.observe(el);
  });
})();
