// Antes y después con deslizador: el control es un <input type="range"> de
// verdad (teclado y lector de pantalla); aquí solo se mueve la línea.
(function () {
  document.querySelectorAll('.antes-ahora').forEach(function (fig) {
    var rango = fig.querySelector('input[type="range"]');
    if (!rango) return;
    var mueve = function () { fig.style.setProperty('--pos', rango.value + '%'); };
    rango.addEventListener('input', mueve);
    fig.classList.add('activo');
    mueve();
  });
})();
