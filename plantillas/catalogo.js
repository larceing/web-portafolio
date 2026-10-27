(function () {
  var botones = [].slice.call(document.querySelectorAll('.filtro'));
  var tarjetas = [].slice.call(document.querySelectorAll('.tarjeta'));
  function filtra(g) {
    var n = 0;
    tarjetas.forEach(function (t) { var ok = !g || t.dataset.grupo === g; t.hidden = !ok; if (ok) n++; });
    botones.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.grupo === g ? 'true' : 'false'); });
    document.getElementById('cuenta').textContent = n + (n === 1 ? ' plantilla' : ' plantillas');
  }
  botones.forEach(function (b) { b.addEventListener('click', function () { filtra(b.dataset.grupo); }); });
  filtra('');
  var a = document.getElementById('anio'); if (a) a.textContent = new Date().getFullYear();
})();
