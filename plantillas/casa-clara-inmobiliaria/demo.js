// Demo: módulo de reservas/pedidos. No envía nada: enseña el mensaje que llegaría al negocio.
// Valida lo que falta (y el teléfono) y lo dice debajo del botón, en vez de dejarlo apagado sin más.
(function () {
  'use strict';
  var cfgEl = document.getElementById('cfg');
  if (!cfgEl) return;
  var cfg = JSON.parse(cfgEl.textContent);
  var raiz = document.getElementById('modulo');
  var DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var estado = {};

  // Pseudoaleatorio fijo por negocio, para que los huecos de ejemplo no cambien al recargar.
  var semilla = 0;
  for (var i = 0; i < cfg.nombre.length; i++) semilla = (semilla * 31 + cfg.nombre.charCodeAt(i)) >>> 0;
  function azar() { semilla = (semilla * 1664525 + 1013904223) >>> 0; return semilla / 4294967296; }

  function el(tag, attrs, hijos) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'texto') e.textContent = attrs[k];
      else if (k === 'clase') e.className = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    (hijos || []).forEach(function (h) { if (h) e.appendChild(typeof h === 'string' ? document.createTextNode(h) : h); });
    return e;
  }

  function proximosDias(n) {
    var r = [], d = new Date();
    d.setHours(12, 0, 0, 0);
    while (r.length < n) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) continue; // domingo cerrado en la demo
      r.push(new Date(d));
    }
    return r;
  }
  function fechaCorta(d) { return DIAS[d.getDay()] + ' ' + d.getDate() + ' ' + MESES[d.getMonth()]; }

  function chips(nombre, opciones, alElegir) {
    var caja = el('div', { clase: 'chips', role: 'group', 'aria-label': nombre });
    opciones.forEach(function (o) {
      var b = el('button', { type: 'button', clase: 'chip' + (o.lleno ? ' lleno' : ''), texto: o.texto, 'aria-pressed': 'false' });
      if (o.lleno) { b.disabled = true; b.title = 'Completo'; }
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(caja.children, function (c) { c.classList.remove('activo'); c.setAttribute('aria-pressed', 'false'); });
        b.classList.add('activo'); b.setAttribute('aria-pressed', 'true');
        estado[nombre] = o.valor || o.texto;
        if (alElegir) alElegir(o);
        resumen();
      });
      caja.appendChild(b);
    });
    return caja;
  }

  function campo(etq, control) { return el('label', { clase: 'campo' }, [el('span', { texto: etq }), control]); }
  // Teléfono español: 9 cifras que empiezan por 6, 7, 8 o 9 (se admiten espacios y +34 delante)
  var telefono = null;
  function telValido(v) { return /^(\+?34)?[6-9]\d{8}$/.test(String(v || '').replace(/[\s.-]/g, '')); }
  function entrada(nombre, tipo, ph) {
    var opciones = tipo === 'area' ? { rows: '3', placeholder: ph || '' } : { type: tipo || 'text', placeholder: ph || '' };
    if (tipo === 'tel') { opciones.inputmode = 'tel'; opciones.autocomplete = 'tel'; }
    if (nombre === 'Nombre') { opciones.autocomplete = 'name'; opciones.maxlength = '80'; }
    var i = el(tipo === 'area' ? 'textarea' : 'input', opciones);
    i.addEventListener('input', function () { estado[nombre] = i.value.trim(); if (tipo === 'tel') marcaTel(false); resumen(); });
    if (tipo === 'tel') {
      telefono = { campo: i, nombre: nombre, ayuda: el('span', { clase: 'ayuda', 'aria-live': 'polite' }) };
      i.addEventListener('blur', function () { marcaTel(true); });
    }
    return i;
  }
  function marcaTel(alSalir) {
    if (!telefono) return;
    var v = telefono.campo.value.trim();
    var mal = v !== '' && !telValido(v);
    if (mal && alSalir) { telefono.campo.setAttribute('aria-invalid', 'true'); telefono.ayuda.textContent = 'Revisa el teléfono: son 9 cifras, por ejemplo 600 123 456.'; }
    if (!mal) { telefono.campo.removeAttribute('aria-invalid'); telefono.ayuda.textContent = ''; }
  }
  function selector(nombre, opciones) {
    var s = el('select', null, [el('option', { value: '', texto: 'Elige…' })].concat(opciones.map(function (o) { return el('option', { value: o, texto: o }); })));
    s.addEventListener('change', function () { estado[nombre] = s.value; resumen(); });
    return s;
  }
  function horas(desde, hasta, paso) {
    var r = [], tramos = cfg.horas || [[desde, hasta, paso]];
    tramos.forEach(function (tr) { for (var m = tr[0] * 60; m <= tr[1] * 60; m += tr[2]) {
      var t = ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
      r.push({ texto: t, lleno: azar() < 0.3 });
    } });
    return r;
  }

  var pasos = el('div', { clase: 'pasos-mod' });
  var caja = el('div', { clase: 'resumen' });
  var boton = el('button', { type: 'button', clase: 'btn grande', texto: cfg.cta, disabled: 'disabled' });
  var necesarios = [];

  function paso(titulo, contenido) { pasos.appendChild(el('div', { clase: 'paso' }, [el('h3', { texto: titulo }), contenido])); }
  function diasChips() { return chips('Día', proximosDias(10).map(function (d) { return { texto: fechaCorta(d) }; })); }

  var m = cfg.modulo;
  if (m === 'reserva') {
    paso('¿Cuántos sois?', chips('Personas', [1, 2, 3, 4, 5, 6, '7+'].map(function (n) { return { texto: String(n) }; })));
    paso('¿Qué día?', diasChips());
    paso('¿A qué hora?', chips('Hora', horas(9, 13.5, 30)));
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('Comentarios', entrada('Comentarios', 'text', 'Trona, alergias, terraza…'))]));
    necesarios = ['Personas', 'Día', 'Hora', 'Nombre'];
  } else if (m === 'pedido') {
    estado.lineas = {};
    var lista = el('div', { clase: 'carta' });
    cfg.servicios.forEach(function (s) {
      var n = el('b', { texto: '0' });
      function cambia(d) { var v = Math.max(0, (estado.lineas[s] || 0) + d); estado.lineas[s] = v; n.textContent = v; resumen(); }
      lista.appendChild(el('div', { clase: 'linea' }, [el('span', { texto: s }), el('div', { clase: 'mas-menos' }, [
        el('button', { type: 'button', 'aria-label': 'Quitar ' + s, texto: '−', onclick: function () { cambia(-1); } }), n,
        el('button', { type: 'button', 'aria-label': 'Añadir ' + s, texto: '+', onclick: function () { cambia(1); } })])]));
    });
    paso('¿Qué te preparamos?', lista);
    paso('¿Cuándo lo recoges?', el('div', null, [diasChips(), chips('Hora', horas(12, 15, 30))]));
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('Notas', entrada('Notas', 'text', cfg.ph || 'Alergias, raciones…'))]));
    necesarios = ['Día', 'Hora', 'Nombre'];
  } else if (m === 'clases') {
    var tabla = el('div', { clase: 'semana' });
    var dias = proximosDias(5);
    dias.forEach(function (d) {
      var col = el('div', { clase: 'dia' }, [el('h4', { texto: fechaCorta(d) })]);
      ['09:30', '11:00', '18:00', '19:15', '20:30'].forEach(function (h) {
        if (azar() < 0.25) return;
        var clase = cfg.clases[Math.floor(azar() * cfg.clases.length)];
        var plazas = Math.floor(azar() * 6);
        var b = el('button', { type: 'button', clase: 'clase' + (plazas ? '' : ' lleno') }, [el('b', { texto: h }), el('span', { texto: clase }), el('small', { texto: plazas ? plazas + (plazas === 1 ? ' plaza' : ' plazas') : 'Completa' })]);
        if (!plazas) b.disabled = true;
        b.addEventListener('click', function () {
          Array.prototype.forEach.call(tabla.querySelectorAll('.clase'), function (c) { c.classList.remove('activo'); });
          b.classList.add('activo');
          estado['Clase'] = clase + ', ' + fechaCorta(d) + ' a las ' + h;
          resumen();
        });
        col.appendChild(b);
      });
      tabla.appendChild(col);
    });
    paso('Elige tu clase', tabla);
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('¿Algo que debamos saber?', entrada('Notas', 'text', 'Lesiones, embarazo, primera vez…'))]));
    necesarios = ['Clase', 'Nombre'];
  } else if (m === 'cita' || m === 'cita-mascota') {
    if (m === 'cita-mascota') {
      paso('Tu perro', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Perro', 'text', 'Toby')), campo('Raza', entrada('Raza', 'text', 'Caniche, mestizo…'))]));
      paso('Tamaño', chips('Tamaño', ['Mini (<5 kg)', 'Pequeño (5-10)', 'Mediano (10-25)', 'Grande (>25)'].map(function (t) { return { texto: t }; })));
    }
    paso('Servicio', selector('Servicio', cfg.servicios));
    paso('¿Qué día?', diasChips());
    paso('¿A qué hora?', chips('Hora', horas(10, 19.5, 45)));
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('Teléfono', entrada('Teléfono', 'tel', '600 000 000'))]));
    necesarios = (m === 'cita-mascota' ? ['Perro', 'Tamaño'] : []).concat(['Servicio', 'Día', 'Hora', 'Nombre']);
  } else if (m === 'solicitud') {
    paso('Estilo', selector('Estilo', cfg.servicios));
    paso('Zona del cuerpo', chips('Zona', ['Brazo', 'Antebrazo', 'Pierna', 'Espalda', 'Pecho', 'Mano', 'Otra'].map(function (t) { return { texto: t }; })));
    paso('Tamaño aproximado', chips('Tamaño', ['< 5 cm', '5-10 cm', '10-20 cm', 'Más grande'].map(function (t) { return { texto: t }; })));
    paso('Tu idea', el('div', { clase: 'fila' }, [campo('Cuéntanos la idea', entrada('Idea', 'area', 'Qué quieres, referencias, si es tu primer tatuaje…')), campo('Nombre', entrada('Nombre'))]));
    necesarios = ['Estilo', 'Zona', 'Tamaño', 'Idea', 'Nombre'];
  } else if (m === 'estancia') {
    paso('Llegada', chips('Llegada', proximosDias(14).map(function (d) { return { texto: fechaCorta(d) }; })));
    paso('¿Cuántas noches?', chips('Noches', ['1', '2', '3', '4', '5', '6', '7+'].map(function (t) { return { texto: t }; })));
    paso('Huéspedes', chips('Huéspedes', ['1', '2', '3', '4', '5', '6+'].map(function (t) { return { texto: t }; })));
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('Comentarios', entrada('Comentarios', 'text', 'Hora de llegada, cuna, mascota…'))]));
    necesarios = ['Llegada', 'Noches', 'Huéspedes', 'Nombre'];
  } else if (m === 'presupuesto') {
    paso('¿Qué trabajo es?', selector('Trabajo', cfg.servicios));
    paso('¿Para cuándo?', chips('Urgencia', ['Urgente (hoy)', 'Esta semana', 'Este mes', 'Sin prisa'].map(function (t) { return { texto: t }; })));
    paso('Cuéntanos', el('div', { clase: 'fila' }, [campo('Descripción', entrada('Descripción', 'area', 'Qué pasa, medidas aproximadas, si hay fotos…')), campo('Zona o código postal', entrada('Zona', 'text', '03003'))]));
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('Teléfono', entrada('Teléfono', 'tel', '600 000 000'))]));
    necesarios = ['Trabajo', 'Urgencia', 'Descripción', 'Nombre', 'Teléfono'];
  } else if (m === 'cita-taller') {
    paso('Tu coche', el('div', { clase: 'fila' }, [campo('Marca y modelo', entrada('Vehículo', 'text', 'Seat Ibiza 2018')), campo('Matrícula', entrada('Matrícula', 'text', '0000 XXX'))]));
    paso('¿Qué le hacemos?', selector('Servicio', cfg.servicios));
    paso('¿Qué día lo traes?', diasChips());
    paso('Hora de entrega', chips('Entrega', horas(8, 10.5, 30)));
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('Teléfono', entrada('Teléfono', 'tel', '600 000 000'))]));
    necesarios = ['Vehículo', 'Servicio', 'Día', 'Entrega', 'Nombre'];
  } else if (m === 'cita-salud') {
    paso('Tipo de visita', chips('Visita', ['Primera visita', 'Revisión', 'Urgencia'].map(function (t) { return { texto: t }; })));
    paso('Tratamiento', selector('Tratamiento', cfg.servicios));
    paso('¿Qué día?', diasChips());
    paso('¿A qué hora?', chips('Hora', horas(9, 19.5, 30)));
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('Teléfono', entrada('Teléfono', 'tel', '600 000 000'))]));
    necesarios = ['Visita', 'Tratamiento', 'Día', 'Hora', 'Nombre'];
  } else if (m === 'matricula') {
    paso('Curso', selector('Curso', cfg.servicios));
    paso('Nivel', chips('Nivel', (cfg.niveles || ['Inicial', 'Medio', 'Avanzado']).map(function (t) { return { texto: t }; })));
    paso('Modalidad', chips('Modalidad', ['Presencial', 'Online'].map(function (t) { return { texto: t }; })));
    paso('Horario', chips('Horario', ['Mañanas', 'Tardes', 'Fines de semana'].map(function (t) { return { texto: t }; })));
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('Teléfono', entrada('Teléfono', 'tel', '600 000 000'))]));
    necesarios = ['Curso', 'Nivel', 'Modalidad', 'Horario', 'Nombre'];
  } else if (m === 'tarta') {
    paso('¿Qué te preparamos?', selector('Encargo', cfg.servicios));
    paso('Raciones', chips('Raciones', ['6', '8', '12', '16', '20+'].map(function (t) { return { texto: t }; })));
    paso('Sabor', chips('Sabor', (cfg.sabores || ['Chocolate', 'Vainilla', 'Frutos rojos', 'Limón', 'Turrón']).map(function (t) { return { texto: t }; })));
    paso('¿Cuándo lo recoges?', diasChips());
    paso('Detalles', el('div', { clase: 'fila' }, [campo('Mensaje en la tarta', entrada('Mensaje', 'text', '¡Feliz cumple, Lucía!')), campo('Nombre', entrada('Nombre'))]));
    necesarios = ['Encargo', 'Raciones', 'Sabor', 'Día', 'Nombre'];
  } else if (m === 'tienda') {
    estado.lineas = {};
    var precios = {};
    var rejilla = el('div', { clase: 'productos' });
    (cfg.productos || []).forEach(function (pr) {
      precios[pr.n] = pr.p;
      var n = el('b', { texto: '0' });
      function cambia(d) { var v = Math.max(0, (estado.lineas[pr.n] || 0) + d); estado.lineas[pr.n] = v; n.textContent = v; resumen(); }
      rejilla.appendChild(el('div', { clase: 'producto' }, [(pr.img ? el('img', { clase: 'foto-producto', src: pr.img, alt: '' }) : el('div', { clase: 'foto-producto', 'aria-hidden': 'true' })), el('h4', { texto: pr.n }), el('p', { clase: 'tenue', texto: pr.d || '' }),
        el('div', { clase: 'fila-precio' }, [el('strong', { texto: pr.p.toFixed(2).replace('.', ',') + ' €' }), el('div', { clase: 'mas-menos' }, [
          el('button', { type: 'button', 'aria-label': 'Quitar ' + pr.n, texto: '−', onclick: function () { cambia(-1); } }), n,
          el('button', { type: 'button', 'aria-label': 'Añadir ' + pr.n, texto: '+', onclick: function () { cambia(1); } })])])]));
    });
    estado._precios = precios;
    paso('Elige tus productos', rejilla);
    paso('Entrega', chips('Entrega', ['Recoger en tienda', 'Envío a domicilio'].map(function (t) { return { texto: t }; })));
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('Teléfono', entrada('Teléfono', 'tel', '600 000 000'))]));
    necesarios = ['Entrega', 'Nombre'];
  } else if (m === 'consulta') {
    paso('¿Sobre qué es?', selector('Asunto', cfg.servicios));
    paso('¿Cómo prefieres?', chips('Forma', ['Llamada', 'Videollamada', 'En el despacho'].map(function (t) { return { texto: t }; })));
    paso('¿Qué día?', diasChips());
    paso('¿A qué hora?', chips('Hora', horas(9, 18, 60)));
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Cuéntanos en dos líneas', entrada('Resumen', 'area', 'Así preparamos la reunión')), campo('Nombre', entrada('Nombre'))]));
    necesarios = ['Asunto', 'Forma', 'Día', 'Hora', 'Nombre'];
  } else if (m === 'evento') {
    paso('¿Qué celebras?', selector('Evento', cfg.servicios));
    paso('Invitados', chips('Invitados', ['Menos de 20', '20-50', '50-100', '100-200', 'Más de 200'].map(function (t) { return { texto: t }; })));
    paso('Fecha y lugar', el('div', { clase: 'fila' }, [campo('Fecha', entrada('Fecha', 'date')), campo('Lugar', entrada('Lugar', 'text', 'Finca, restaurante, ciudad…'))]));
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('Teléfono', entrada('Teléfono', 'tel', '600 000 000'))]));
    necesarios = ['Evento', 'Invitados', 'Fecha', 'Nombre'];
  } else if (m === 'inmuebles') {
    var lista2 = el('div', { clase: 'inmuebles' });
    var filtro = 'Todos';
    function pinta() {
      lista2.textContent = '';
      (cfg.inmuebles || []).filter(function (x) { return filtro === 'Todos' || x.op === filtro; }).forEach(function (x) {
        var b = el('button', { type: 'button', clase: 'inmueble' }, [(x.img ? el('img', { clase: 'foto-producto', src: x.img, alt: '' }) : el('div', { clase: 'foto-producto', 'aria-hidden': 'true' })), el('small', { texto: x.op + ' · ' + x.zona }), el('h4', { texto: x.t }),
          el('p', { clase: 'tenue', texto: (x.hab ? x.hab + ' hab. · ' : '') + x.m2 + ' m²' }), el('strong', { texto: x.precio })]);
        b.addEventListener('click', function () {
          Array.prototype.forEach.call(lista2.children, function (c) { c.classList.remove('activo'); });
          b.classList.add('activo'); estado['Inmueble'] = x.t + ' (' + x.zona + ', ' + x.precio + ')'; resumen();
        });
        lista2.appendChild(b);
      });
    }
    paso('¿Qué buscas?', chips('Operación', ['Todos', 'Venta', 'Alquiler'].map(function (t) { return { texto: t }; }), function (o) { filtro = o.texto; pinta(); }));
    pinta();
    paso('Elige un inmueble', lista2);
    paso('¿Cuándo te viene bien verlo?', diasChips());
    paso('Tus datos', el('div', { clase: 'fila' }, [campo('Nombre', entrada('Nombre')), campo('Teléfono', entrada('Teléfono', 'tel', '600 000 000'))]));
    necesarios = ['Inmueble', 'Día', 'Nombre'];
  } else {
    paso('¿Qué necesitas?', el('div', { clase: 'fila' }, [campo('Producto o encargo', entrada('Encargo', 'area', 'Cuéntanos qué buscas')), campo('Nombre', entrada('Nombre'))]));
    necesarios = ['Encargo', 'Nombre'];
  }

  function texto() {
    var t = ['Hola, ' + cfg.nombre + '. ' + cfg.intro];
    Object.keys(estado).forEach(function (k) {
      if (k === '_precios' || k === 'Operación') return;
      if (k === 'lineas') {
        var l = Object.keys(estado.lineas).filter(function (s) { return estado.lineas[s] > 0; }).map(function (s) { return estado.lineas[s] + ' × ' + s; });
        if (l.length) t.push('Pedido: ' + l.join(', '));
        if (l.length && estado._precios) {
          var tot = Object.keys(estado.lineas).reduce(function (a, s) { return a + estado.lineas[s] * (estado._precios[s] || 0); }, 0);
          t.push('Total: ' + tot.toFixed(2).replace('.', ',') + ' €');
        }
      } else if (estado[k]) t.push(k + ': ' + estado[k]);
    });
    return t.join('\n');
  }
  function faltan() {
    var f = [];
    if ((m === 'pedido' || m === 'tienda') && !Object.keys(estado.lineas).some(function (s) { return estado.lineas[s] > 0; })) f.push('algún producto');
    necesarios.forEach(function (k) { if (!estado[k]) f.push(k.toLowerCase()); });
    if (telefono) { var v = estado[telefono.nombre]; if (!v) f.push('teléfono'); else if (!telValido(v)) f.push('un teléfono válido'); }
    return f.filter(function (x, i, a) { return a.indexOf(x) === i; });
  }
  function completo() { return faltan().length === 0; }
  var aviso = el('p', { clase: 'falta', 'aria-live': 'polite' });
  function resumen() {
    caja.textContent = texto();
    var f = faltan();
    if (!f.length) { boton.removeAttribute('disabled'); aviso.textContent = 'Todo listo.'; }
    else { boton.setAttribute('disabled', 'disabled'); aviso.textContent = 'Falta: ' + f.join(', ') + '.'; }
  }

  var dialogo = document.getElementById('dialogo');
  boton.addEventListener('click', function () {
    document.getElementById('dialogo-texto').textContent = texto();
    var pl = document.getElementById('dialogo-plataforma');
    if (pl && cfg.plataforma) { pl.hidden = false; pl.textContent = 'Si prefieres seguir con tu agenda de ' + cfg.plataforma.split(' ')[0] + ', este botón puede abrirla directamente: tus clientes reservan desde tu web y tú no cambias de herramienta.'; }
    if (dialogo.showModal) dialogo.showModal(); else dialogo.setAttribute('open', '');
  });
  document.getElementById('dialogo-cerrar').addEventListener('click', function () { dialogo.close ? dialogo.close() : dialogo.removeAttribute('open'); });

  raiz.appendChild(pasos);
  if (telefono) telefono.campo.parentNode.appendChild(telefono.ayuda);
  raiz.appendChild(el('div', { clase: 'cierre' }, [el('p', { clase: 'tenue', texto: 'Así le llegaría tu mensaje al negocio:' }), caja, boton, aviso]));
  resumen();

  // Menú móvil
  var abrir = document.getElementById('abrir-menu');
  if (abrir) abrir.addEventListener('click', function () { var si = document.body.classList.toggle('menu-abierto'); abrir.setAttribute('aria-expanded', si ? 'true' : 'false'); });
  Array.prototype.forEach.call(document.querySelectorAll('.menu a'), function (a) { a.addEventListener('click', function () { document.body.classList.remove('menu-abierto'); if (abrir) abrir.setAttribute('aria-expanded', 'false'); }); });
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
