// Arranca las escenas 3D de la página cuando están a punto de verse:
//   #cinta        · cinta de automatización (bit/cinta.js)
//   #infraEscena  · servidor, contenedores y copias nocturnas (bit/infra.js)
// Las dos van dentro de js/bit.js, el mismo fichero que Byte: si ya se ha
// pedido, se espera a ese; si no, se pide. Sin WebGL o con ahorro de datos no
// se cargan (queda el texto); con «menos movimiento», una foto fija.
(function () {
  var ESCENAS = [
    { caja: 'cinta', lienzo: 'cintaLienzo', funcion: 'cinta' },
    { caja: 'infraEscena', lienzo: 'infraLienzo', funcion: 'infra' }
  ];

  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  var quieto = mq('(prefers-reduced-motion: reduce)');
  if (navigator.connection && navigator.connection.saveData) return;

  function hayWebGL() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }
  if (!hayWebGL()) return;

  function conTres(src, fn) {
    if (window.ClubByteBit) return fn();
    var s = document.querySelector('script[src="' + src + '"]');
    if (!s) {
      s = document.createElement('script');
      s.src = src;
      s.async = true;
      document.head.appendChild(s);
    }
    s.addEventListener('load', function () { if (window.ClubByteBit) fn(); });
  }

  ESCENAS.forEach(function (e) {
    var caja = document.getElementById(e.caja);
    var lienzo = document.getElementById(e.lienzo);
    if (!caja || !lienzo) return;

    function arrancar() {
      conTres(caja.getAttribute('data-js'), function () {
        var iniciar = window.ClubByteBit[e.funcion];
        if (!iniciar) return;
        lienzo.hidden = false;
        try {
          iniciar({ lienzo: lienzo, quieto: quieto, modelo: caja.getAttribute('data-modelo') });
          caja.classList.add('en3d');
        } catch (err) {
          lienzo.hidden = true;
        }
      });
    }

    if (!('IntersectionObserver' in window)) return arrancar();
    var obs = new IntersectionObserver(function (entradas) {
      if (entradas[0].isIntersecting) { obs.disconnect(); arrancar(); }
    }, { rootMargin: '300px 0px' });
    obs.observe(caja);
  });
})();
