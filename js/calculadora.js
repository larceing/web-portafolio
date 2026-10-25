// Calculadora «¿Cuánto cuesta mi dashboard?» de /servicios/power-bi/.
// Cada respuesta suma horas (o multiplica, si su grupo lleva data-factor). El
// rango sale de horas × tarifa, y × 1,2 para el tope, redondeado a 50 €.
// La misma cuenta está en construir.js para el valor inicial sin JavaScript.
(function () {
  var form = document.getElementById('calc');
  if (!form) return;
  var salida = document.getElementById('calcRango');
  var enviar = document.getElementById('calcEnviar');
  var tarifa = Number(form.dataset.tarifa);
  var lang = document.documentElement.lang || 'es';
  var cifra = function (n) { return n.toLocaleString(lang === 'en' ? 'en-GB' : 'es-ES'); };
  var redondea = function (n) { return Math.round(n / 50) * 50; };

  function calcula() {
    var horas = 0, factor = 1, lineas = [];
    form.querySelectorAll('fieldset').forEach(function (grupo) {
      var elegido = grupo.querySelector('input:checked');
      if (!elegido) return;
      var valor = Number(elegido.value);
      if (grupo.hasAttribute('data-factor')) factor *= valor; else horas += valor;
      lineas.push('- ' + grupo.querySelector('legend').textContent.trim() + ' ' + elegido.dataset.texto);
    });
    var texto = form.dataset.rango
      .replace('{a}', cifra(redondea(horas * tarifa * factor)))
      .replace('{b}', cifra(redondea(horas * tarifa * 1.2 * factor)));
    salida.textContent = texto;
    enviar.href = form.dataset.whatsapp + '?text=' + encodeURIComponent(form.dataset.texto + '\n' + lineas.join('\n') + '\n' + texto);
  }

  form.addEventListener('change', calcula);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  calcula();
})();
