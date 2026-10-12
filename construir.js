// Genera index.html (español) y en/index.html (inglés) a partir de los datos
// de este fichero y de las traducciones de contenido.en.js.
//
//   node construir.js
//
// Para añadir o cambiar un proyecto, edita la lista PROYECTOS, añade su
// traducción en contenido.en.js y vuelve a ejecutarlo. El resultado es HTML
// estático: no hace falta nada más para verlo.

const fs = require('fs');
const path = require('path');

const CORREO = 'info@luiscontacto03.com';
const LINKEDIN = 'https://www.linkedin.com/in/luis-henry-programador';
const GITHUB = 'https://github.com/larceing';
const TELEFONO = '+34 633 42 42 23';
const WHATSAPP = 'https://wa.me/34633424223';
const SITIO = 'https://luiscontacto03.com/';

// Pictogramas de línea (lienzo de 48 x 48).
const ICONOS = {
  ticket: '<rect x="8" y="12" width="32" height="24" rx="3"/><path d="M16 20h16M16 28h10"/>',
  tunel: '<rect x="5" y="16" width="13" height="16" rx="2"/><rect x="30" y="16" width="13" height="16" rx="2"/><path d="M18 21h12M30 27H18"/>',
  tablet: '<rect x="12" y="6" width="24" height="36" rx="3"/><path d="M18 14h12M18 20h8"/><circle cx="24" cy="36" r="1.5"/>',
  plato: '<circle cx="24" cy="26" r="13"/><circle cx="24" cy="26" r="6"/><path d="M24 13c1-5 5-7 9-6"/>',
  bot: '<rect x="12" y="16" width="24" height="18" rx="4"/><circle cx="19" cy="25" r="2"/><circle cx="29" cy="25" r="2"/><path d="M24 16v-6"/><circle cx="24" cy="8" r="2"/>',
  grafico: '<path d="M8 40h32M8 34l8-9 8 4 8-14 8 5"/>',
  escritorio: '<rect x="8" y="10" width="32" height="22" rx="2"/><path d="M24 32v6M17 38h14"/>',
  tienda: '<path d="M10 18h28l-3 20H13z"/><path d="M17 18a7 7 0 0 1 14 0"/>',
  soporte: '<circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="5"/><path d="M14 14l6 6M28 28l6 6M34 14l-6 6M20 28l-6 6"/>',
  paleta: '<path d="M24 8a16 16 0 1 0 0 32c3 0 4-2 3-4-2-3 0-6 4-6h3c4 0 6-3 6-6 0-9-7-16-16-16z"/><circle cx="17" cy="19" r="2"/><circle cx="25" cy="15" r="2"/><circle cx="33" cy="20" r="2"/>',
  formula: '<path d="M10 36c7 0 5-24 13-24M9 23h11M27 25l10 12M37 25L27 37"/>',
  grafo: '<circle cx="24" cy="23" r="4"/><circle cx="11" cy="12" r="3"/><circle cx="37" cy="13" r="3"/><circle cx="24" cy="39" r="3"/><path d="M14 14l7 6M34 15l-7 5M24 27v9"/>',
  calendario: '<rect x="9" y="12" width="30" height="26" rx="3"/><path d="M9 20h30M17 8v8M31 8v8"/>',
  chat: '<path d="M8 11h32v19H23l-8 7v-7H8z"/><path d="M16 18h16M16 24h9"/>',
  lupa: '<circle cx="21" cy="21" r="11"/><path d="M29 29l10 10"/>',
  flujo: '<rect x="5" y="18" width="10" height="12" rx="2"/><rect x="19" y="18" width="10" height="12" rx="2"/><rect x="33" y="18" width="10" height="12" rx="2"/><path d="M15 24h4M29 24h4"/>',
  escudo: '<path d="M24 6l14 5v11c0 9-6 15-14 20-8-5-14-11-14-20V11z"/><path d="M18 24l4 4 8-9"/>',
  mapa: '<path d="M24 41c-8-10-12-15-12-21a12 12 0 0 1 24 0c0 6-4 11-12 21z"/><circle cx="24" cy="20" r="4"/>'
};

const icono = clave => '<svg viewBox="0 0 48 48" aria-hidden="true">' + ICONOS[clave] + '</svg>';

// Las cuatro áreas de la franja superior.
const AREAS = [
  { titulo: 'Automatización', texto: 'Flujos e integraciones que quitan trabajo manual', icono: 'flujo', color: '#15202B' },
  { titulo: 'IA aplicada', texto: 'Asistentes y agentes sobre datos de negocio', icono: 'bot', color: '#1D4F7A' },
  { titulo: 'Datos y BI', texto: 'Informes que se usan y miden el impacto', icono: 'grafico', color: '#2E6C9E' },
  { titulo: 'Sistemas de negocio', texto: 'ERP, CRM y ecommerce por dentro', icono: 'escritorio', color: '#3F5266' }
];

// tipo: producto | empresa | abierto. color: uno de los seis de la cuadrícula.
const C = { tinta: '#15202B', azul: '#1D4F7A', cielo: '#2E6C9E', pizarra: '#3F5266', tostado: '#A94F0E', verde: '#2C6259' };

const PROYECTOS = [
  {
    id: 'gestor', corto: 'Gestor de incidencias', titulo: 'Gestor de incidencias, horas y facturación',
    tipo: 'producto', etiqueta: 'Producto propio · 2026', icono: 'ticket', color: C.azul,
    caso: [
      ['Problema', 'Las incidencias se apuntaban a mano, las horas en una hoja de cálculo y las facturas aparte. Nada estaba conectado.'],
      ['Qué hice', 'Una aplicación web propia donde cada incidencia lleva su seguimiento, su documentación, sus sesiones de trabajo cronometradas y su facturación. Usa MantisBT como motor de incidencias a través de su API, sin tocar su código.'],
      ['Resultado', 'Historial migrado y cuadrado al céntimo, circuito proforma → factura → cobro, correo transaccional y 181 pruebas automáticas que recorren cada cambio de estado.']
    ],
    tec: ['Node.js', 'MariaDB', 'API REST', 'Docker', 'Nginx']
  },
  {
    id: 'gateway', corto: 'Gateway de datos', titulo: 'Gateway de datos en tiempo real',
    tipo: 'empresa', etiqueta: 'Para Grupo SPSIL · 2026', icono: 'tunel', color: C.tinta,
    caso: [
      ['Problema', 'El almacén necesitaba ver el stock real desde una web, pero las bases de datos están en la red interna y no se podían abrir puertos hacia fuera.'],
      ['Qué hice', 'Un gateway al estilo del de Power BI: un agente dentro de la red abre un túnel WebSocket hacia la web, consulta MariaDB y SQL Server cuando alguien lo pide y devuelve el dato por ese mismo túnel.'],
      ['Resultado', 'Stock al momento en pantallas táctiles de nave, permisos por departamento, interfaz en español, chino e inglés y exportación a Excel.']
    ],
    tec: ['Python', 'Django Channels', 'WebSocket', 'SQL Server', 'MariaDB']
  },
  {
    id: 'crm', corto: 'CRM sin conexión', titulo: 'CRM de citas con tablet sin conexión',
    tipo: 'producto', etiqueta: 'Producto propio · en desarrollo', icono: 'tablet', color: C.cielo,
    caso: [
      ['Problema', 'Un negocio que gestiona citas de pacientes en hospitales trabajaba con una aplicación sobre hojas de cálculo que se quedaba corta, y en los hospitales no siempre hay cobertura.'],
      ['Qué hice', 'La reescribí como aplicación web con base de datos propia y una app de tablet que funciona sin conexión: guarda en local, encola los cambios y los sincroniza por eventos con control de versiones cuando vuelve la red.'],
      ['Resultado', 'Agenda, pacientes, servicios, cobros, documentos y alarmas en un solo sitio, con pantalla de conflictos para decidir cuando dos dispositivos cambian lo mismo. Desplegado en servidor propio.']
    ],
    tec: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'React Native', 'Docker']
  },
  {
    id: 'asistente', corto: 'Asistente de IA', titulo: 'Asistente de IA sobre el ERP',
    tipo: 'empresa', etiqueta: 'Para Grupo SPSIL · en desarrollo', icono: 'bot', color: C.tostado,
    texto: 'Un asistente que responde preguntas de negocio consultando el ERP en solo lectura. Cada tipo de consulta es una función cerrada; el modelo elige cuál usar y con qué parámetros, así no inventa datos. Se apoya en fichas de negocio editables que explican cómo se calcula cada cosa, y responde en texto o en Excel.',
    tec: ['Python', 'Agentes', 'Base de conocimiento', 'SQL Server']
  },
  {
    id: 'reporting', corto: 'Reporting BI', titulo: 'Reporting de ventas, cobros y stock',
    tipo: 'empresa', etiqueta: 'Para Grupo SPSIL · 2025–2026', icono: 'grafico', color: C.pizarra,
    texto: 'Informes de Power BI sobre el ERP para dirección, comerciales y compras. Tras un cambio de red que cortó los orígenes, migré los procesos a Dataflows y Lakehouse en Microsoft Fabric. Cada cambio en una vista va con su copia, su script de vuelta atrás y una comprobación de antes y después.',
    tec: ['Power BI', 'DAX', 'Microsoft Fabric', 'A3 ERP']
  },
  {
    id: 'nutricion', corto: 'App de nutrición', titulo: 'App de nutrición y entrenamiento',
    tipo: 'producto', etiqueta: 'Producto propio · app web', icono: 'plato', color: C.verde,
    texto: 'Aplicación personal para perder peso con criterio: genera el plan semanal a partir de un catálogo de más de 500 alimentos ajustado al objetivo de calorías, construye la lista de la compra con lo elegido y aprende de lo que marcas como «me gustó». Cada decisión de diseño queda en un registro de cambios.',
    tec: ['Apps Script', 'Google Sheets', 'JavaScript']
  },
  {
    id: 'escritorio', corto: 'Informe de escritorio', titulo: 'Informe operativo sin Power BI',
    tipo: 'empresa', etiqueta: 'Para Grupo SPSIL · escritorio', icono: 'escritorio', color: C.azul,
    texto: 'Aplicación de escritorio que genera un informe de ofertas por cliente y familia directamente desde SQL Server o el Lakehouse. El cálculo se hace en la base de datos para no cargar el equipo, con filtros, exportación a Excel y pruebas automáticas.',
    tec: ['Python', 'PySide6', 'SQL Server', 'pytest']
  },
  {
    id: 'tienda', corto: 'Tienda online', titulo: 'Tienda online con panel propio',
    tipo: 'empresa', etiqueta: 'Para un comercio · tienda online', icono: 'tienda', color: C.tostado,
    texto: 'Tienda para un negocio de serigrafía: catálogo, carrito y compra, con un panel de administración a medida para gestionar productos y pedidos. Todo arranca con un solo comando gracias a Docker.',
    tec: ['Next.js', 'PostgreSQL', 'Prisma', 'Docker']
  },
  {
    id: 'helpdesk', corto: 'Helpdesk interno', titulo: 'Helpdesk interno, control horario y costes de IT',
    tipo: 'empresa', etiqueta: 'En ES Group · 2026', icono: 'soporte', color: C.tinta,
    texto: 'Herramientas internas para dos plantas de producción: sistema de helpdesk propio para el soporte, control horario, seguimiento de costes de IT e integración de la facturación entre plantas del grupo.',
    tec: ['Python', 'SQL Server', 'SAP', 'SharePoint']
  },
  {
    id: 'themelab', corto: 'Power BI Theme Lab', titulo: 'Power BI Theme Lab',
    tipo: 'abierto', etiqueta: 'Open source · herramienta web', icono: 'paleta', color: C.cielo,
    texto: 'Generador de temas para Power BI en el navegador: eliges tu color de marca, ves la paleta sobre un panel en vivo, compruebas el contraste y exportas el <code>theme.json</code>.',
    enlaces: [['Probar la demo', 'https://larceing.github.io/powerbi-theme-lab/'], ['Código', GITHUB + '/powerbi-theme-lab']]
  },
  {
    id: 'calculate', corto: 'CALCULATE en vivo', titulo: 'CALCULATE en vivo',
    tipo: 'abierto', etiqueta: 'Open source · herramienta web', icono: 'formula', color: C.verde,
    texto: 'Página interactiva para entender la función más potente y más confusa de DAX: cambias el contexto de filtro y ves, fila a fila, qué cuenta la medida y qué modifica <code>CALCULATE</code>.',
    enlaces: [['Probar la demo', 'https://larceing.github.io/dax-calculate-en-vivo/'], ['Código', GITHUB + '/dax-calculate-en-vivo']]
  },
  {
    id: 'grafo', corto: 'Mapa-grafo', titulo: 'Mapa-grafo de tu proyecto Power BI',
    tipo: 'abierto', etiqueta: 'Open source · método', icono: 'grafo', color: C.pizarra,
    texto: 'Cuatro pasos y cuatro prompts para que una IA lea tu modelo y dibuje su grafo de dependencias: qué medidas lo sostienen, cuáles no usa nadie y qué conexiones no se ven a simple vista.',
    enlaces: [['Ver en GitHub', GITHUB + '/powerbi-mapa-grafo']]
  },
  {
    id: 'gobernanza', corto: 'Gobernanza de IA', titulo: 'Marco de gobernanza de IA',
    tipo: 'abierto', etiqueta: 'Open source · plantilla', icono: 'escudo', color: C.azul,
    texto: 'Plantilla para que un equipo defina cómo se usa la IA al revisar o construir proyectos: unas reglas que nadie puede saltarse y dos bucles de mejora que aprenden de cada caso real.',
    enlaces: [['Ver en GitHub', GITHUB + '/claude-governance']]
  },
  {
    id: 'modelo', corto: 'Modelo de interacción', titulo: 'Modelo de interacción con la IA',
    tipo: 'abierto', etiqueta: 'Open source · guía', icono: 'chat', color: C.tostado,
    texto: 'Una forma de trabajar con la IA como colaborador y no como buscador: encuadre, iteración y cierre, con plantillas pensadas para DAX, Power Query y documentación.',
    enlaces: [['Ver en GitHub', GITHUB + '/modelo-interaccion-ia']]
  },
  {
    id: 'outlook', corto: 'Outlook a tus programas', titulo: 'outlook-ics-calendar',
    tipo: 'abierto', etiqueta: 'Open source · Python', icono: 'calendario', color: C.tinta,
    texto: 'Conecta tu calendario de Outlook a tus propios programas con un enlace y un script sin dependencias. Sin API de Microsoft, sin registrar aplicaciones y sin tokens.',
    enlaces: [['Ver en GitHub', GITHUB + '/outlook-ics-calendar']]
  },
  {
    id: 'reader', corto: 'Auditor de Power BI', titulo: 'powerbi-report-reader',
    tipo: 'abierto', etiqueta: 'Open source · PowerShell', icono: 'lupa', color: C.cielo,
    texto: 'Dos scripts para auditar un tenant de Power BI con tu propio inicio de sesión: a cuántos informes tienes acceso de verdad y qué conjuntos de datos están fallando al refrescar.',
    enlaces: [['Ver en GitHub', GITHUB + '/powerbi-report-reader']]
  },
  {
    id: 'comercial', corto: 'Prioridad comercial', titulo: 'Prioridad comercial sin saturar',
    tipo: 'abierto', etiqueta: 'Open source · Power BI', icono: 'mapa', color: C.verde,
    texto: 'Informe de Power BI con datos de ejemplo para decidir a qué clientes y zonas dedicar el tiempo del equipo comercial, con un script de Python que regenera los datos.',
    enlaces: [['Ver en GitHub', GITHUB + '/analisis_comerciales']]
  },
  {
    id: 'nifi', corto: 'Apache NiFi', titulo: 'Apache NiFi: tu primer flujo',
    tipo: 'abierto', etiqueta: 'Open source · manual', icono: 'flujo', color: C.pizarra,
    texto: 'Manual paso a paso en español para instalar NiFi en Windows y montar un primer pipeline en veinte minutos, pensado para analistas que vienen de Power BI y Power Query.',
    enlaces: [['Ver en GitHub', GITHUB + '/apache-nifi-primer-flujo']]
  }
];

const TRAYECTORIA = [
  ['Abr 2026 – actualidad', 'Business Applications Administrator', 'F&amp;D Shower Tray (ES Group)', 'Responsable de los ERP del grupo para dos plantas de producción. Integraciones con SAP, lectura de datos de máquinas, EDI, un helpdesk propio, control horario y costes de IT, y soporte a la migración a Azure.'],
  ['Ene 2025 – mar 2026', 'Data Analyst · Transformación digital', 'Grupo SPSIL', 'Análisis de datos, automatización y desarrollo para un fabricante: Microsoft Fabric para centralizar y gobernar el dato, Power BI para dirección y comerciales, y aplicaciones de escritorio en Python para logística y aprovisionamiento.'],
  ['Nov 2023 – jul 2024', 'Analista programador', 'Inforges', 'Área de innovación y transformación digital: ETL y almacenes de datos, informes en Power BI y Excel, e indicadores de proveedores (SLA, disponibilidad, MTBF, MTTR) con su documentación funcional y técnica.'],
  ['Feb 2022 – nov 2023', 'Business Intelligence Developer', 'NTT DATA', 'Soluciones de BI para el sector bancario: cuadros de mando de indicadores financieros y operativos, procesos ETL e integración de datos desde Azure Databricks, AWS, SharePoint y Oracle.'],
  ['2020 – 2022', 'Técnico en Sistemas de Telecomunicaciones e Informáticos', 'IES El Palmeral', 'Nota media 8,8. Premio a la Excelencia Académica 2022 y premiado en el campeonato CV Skills 2021, modalidad de Electrónica.'],
  ['Sep 2019 – feb 2020', 'Analista de datos', 'Autónomo', 'Primeros proyectos por cuenta propia: paneles de ventas, inventario y producción, y automatización de informes con Python y macros de Excel.']
];

const TECNOLOGIAS = [
  ['Automatización', 'Python, Power Automate, Apps Script, VBA, PowerShell, Shell Script'],
  ['IA aplicada', 'Claude, Claude Code, Copilot, agentes y asistentes, diseño de prompts, bases de conocimiento'],
  ['Datos y BI', 'Power BI, DAX, Power Query, SQL Server, MariaDB, PostgreSQL, Microsoft Fabric, Databricks'],
  ['Integraciones', 'API REST, webhooks, WebSocket, EDI, correo transaccional'],
  ['Sistemas de negocio', 'Clavei, Cybermax, SAP, A3 ERP, SharePoint'],
  ['Desarrollo', 'Node.js, Next.js, TypeScript, React Native, Django, Docker, Linux, Git']
];

// Textos de la página en español. Los de inglés están en contenido.en.js.
const UI = {
  lang: 'es',
  titulo: 'Henry Arce · Automatización, IA aplicada y datos',
  descripcion: 'Henry Arce: automatización de procesos, IA aplicada y datos. Asistentes, integraciones e informes construidos sobre ERP, CRM y ecommerce reales.',
  ogDescripcion: 'Proyectos reales, herramientas open source y trayectoria.',
  saltar: 'Saltar al contenido',
  lema: 'automatización · IA · datos',
  secciones: 'Secciones',
  menu: { proyectos: 'Proyectos', trayectoria: 'Trayectoria', tecnologias: 'Tecnologías', contacto: 'Contacto' },
  otroIdioma: 'English',
  otroIdiomaAria: 'English version',
  h1: 'Automatizo procesos y pongo la IA a trabajar con los datos del negocio.',
  intro: 'Soy Henry Arce. Encuentro las tareas manuales de un equipo, las convierto en flujos, asistentes e informes, y mido lo que se gana. Desde 2019, primero en consultoras y ahora dentro de la industria.',
  fotoAlt: 'Henry Arce en la Ciudad de las Artes y las Ciencias de Valencia',
  areasAria: 'Áreas de trabajo',
  verProyectos: 'Ver proyectos',
  franja: 'Abierto a proyectos y a nuevas conversaciones',
  proyectos: 'Proyectos',
  proyectosSub: 'Pulsa en cualquiera para ver qué problema resolvía y cómo lo hice',
  filtrosAria: 'Filtrar proyectos',
  todos: 'Todos',
  tipos: { producto: 'Producto propio', empresa: 'Para empresa', abierto: 'Open source' },
  enlaces: {},
  trayectoria: 'Trayectoria',
  trayectoriaSub: 'De la consultora a la fábrica',
  tecnologias: 'Tecnologías',
  tecnologiasSub: 'Con qué trabajo',
  divulgacion: 'Divulgación',
  divulgacionSub: 'Escribo en LinkedIn sobre BI e IA aplicada',
  cifras: [
    ['139.760', 'impresiones · Chuleta de comandos CMD de Windows'],
    ['51.431', 'impresiones · 10 términos que todo profesional de datos debe dominar'],
    ['29.131', 'impresiones · VBA, el abuelo sabio de Excel']
  ],
  contacto: 'Contacto',
  contactoSub: 'Si en tu equipo hay tareas que se repiten o datos que no cuadran, cuéntamelo',
  telefono: 'también por WhatsApp',
  pie: 'Alicante, España',
  cerrar: 'Cerrar'
};

const EN = require('./contenido.en.js');

// Cada idioma: sus textos, sus datos, la carpeta donde se escribe y la ruta
// hasta la raíz (para css, js e img) y hasta la página del otro idioma.
const IDIOMAS = [
  { t: UI, areas: AREAS, proyectos: PROYECTOS, trayectoria: TRAYECTORIA, tecnologias: TECNOLOGIAS, carpeta: '', base: '', otro: 'en/' },
  {
    t: EN.UI,
    areas: AREAS.map((a, i) => Object.assign({}, a, EN.AREAS[i])),
    proyectos: PROYECTOS.map(p => {
      if (!EN.PROYECTOS[p.id]) throw new Error('Falta la traducción del proyecto ' + p.id + ' en contenido.en.js');
      return Object.assign({}, p, EN.PROYECTOS[p.id]);
    }),
    trayectoria: EN.TRAYECTORIA,
    tecnologias: EN.TECNOLOGIAS,
    carpeta: 'en', base: '../', otro: '../'
  }
];

function tesela(p, t) {
  return '      <button type="button" class="tesela" data-tipo="' + p.tipo + '" data-detalle="d-' + p.id + '" style="--c:' + p.color + '">\n' +
    '        ' + icono(p.icono) + '\n' +
    '        <span class="tesela-titulo">' + p.corto + '</span>\n' +
    '        <span class="tesela-tipo">' + t.tipos[p.tipo] + '</span>\n' +
    '      </button>';
}

function detalle(p, t) {
  const cuerpo = p.caso
    ? '<dl class="caso">' + p.caso.map(c => '<div><dt>' + c[0] + '</dt><dd>' + c[1] + '</dd></div>').join('') + '</dl>'
    : '<p>' + p.texto + '</p>';
  const tec = p.tec ? '<p class="tec">' + p.tec.join(' · ') + '</p>' : '';
  const enlaces = p.enlaces
    ? '<p class="enlaces">' + p.enlaces.map(e => '<a href="' + e[1] + '" target="_blank" rel="noopener">' + (t.enlaces[e[0]] || e[0]) + '</a>').join('') + '</p>'
    : '';
  return '    <div hidden id="d-' + p.id + '" data-color="' + p.color + '" data-icono="' + p.icono + '">\n' +
    '      <p class="etiqueta">' + p.etiqueta + '</p>\n      <h3>' + p.titulo + '</h3>\n      ' + cuerpo + '\n      ' + tec + enlaces + '\n    </div>';
}

function pagina(d) {
  const t = d.t;
  const base = d.base;

  return `<!DOCTYPE html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${t.titulo}</title>
  <meta name="description" content="${t.descripcion}">
  <link rel="canonical" href="${SITIO}${d.carpeta ? d.carpeta + '/' : ''}">
  <link rel="alternate" hreflang="es" href="${SITIO}">
  <link rel="alternate" hreflang="en" href="${SITIO}en/">
  <link rel="alternate" hreflang="x-default" href="${SITIO}">
  <meta property="og:title" content="${t.titulo}">
  <meta property="og:description" content="${t.ogDescripcion}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${SITIO}img/monograma.png">
  <meta name="theme-color" content="#FFFFFF">
  <link rel="icon" href="${base}img/monograma.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="${base}css/estilos.css">
</head>

<body>
  <a class="saltar" href="#contenido">${t.saltar}</a>

  <header class="cabecera">
    <a class="marca" href="#inicio">Henry Arce <span>${t.lema}</span></a>
    <nav class="menu" aria-label="${t.secciones}">
      <a href="#proyectos">${t.menu.proyectos}</a>
      <a href="#trayectoria">${t.menu.trayectoria}</a>
      <a href="#tecnologias">${t.menu.tecnologias}</a>
      <a href="#contacto">${t.menu.contacto}</a>
      <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>
      <a class="idioma" href="${d.otro}" lang="${t.lang === 'es' ? 'en' : 'es'}" hreflang="${t.lang === 'es' ? 'en' : 'es'}" aria-label="${t.otroIdiomaAria}">${t.otroIdioma}</a>
    </nav>
  </header>

  <main id="contenido">
    <section class="inicio" id="inicio">
      <div>
        <h1>${t.h1}</h1>
        <p>${t.intro}</p>
      </div>
      <img src="${base}img/foto.webp" alt="${t.fotoAlt}" width="640" height="640">
    </section>

    <section class="areas" aria-label="${t.areasAria}">
${d.areas.map(a => '      <a class="area" href="#proyectos" style="--c:' + a.color + '">\n        ' + icono(a.icono) + '\n        <strong>' + a.titulo + '</strong>\n        <span>' + a.texto + '</span>\n        <em>' + t.verProyectos + '</em>\n      </a>').join('\n')}
    </section>

    <p class="franja">${t.franja} <span><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a><a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a></span></p>

    <section class="bloque" id="proyectos">
      <h2>${t.proyectos}</h2>
      <p class="sub">${t.proyectosSub}</p>

      <div class="filtros" role="group" aria-label="${t.filtrosAria}">
        <button type="button" class="filtro activo" data-filtro="todos">${t.todos}</button>
        <button type="button" class="filtro" data-filtro="empresa">${t.tipos.empresa}</button>
        <button type="button" class="filtro" data-filtro="producto">${t.tipos.producto}</button>
        <button type="button" class="filtro" data-filtro="abierto">${t.tipos.abierto}</button>
      </div>

      <div class="cuadricula">
${d.proyectos.map(p => tesela(p, t)).join('\n')}
      </div>
    </section>

${d.proyectos.map(p => detalle(p, t)).join('\n')}

    <section class="bloque" id="trayectoria">
      <h2>${t.trayectoria}</h2>
      <p class="sub">${t.trayectoriaSub}</p>

      <ol class="lista">
${d.trayectoria.map(x => '        <li><span class="cuando">' + x[0] + '</span><div><h3>' + x[1] + ' <span>· ' + x[2] + '</span></h3><p>' + x[3] + '</p></div></li>').join('\n')}
      </ol>
    </section>

    <section class="bloque" id="tecnologias">
      <h2>${t.tecnologias}</h2>
      <p class="sub">${t.tecnologiasSub}</p>

      <dl class="lista">
${d.tecnologias.map(x => '        <div><dt class="cuando">' + x[0] + '</dt><dd>' + x[1] + '</dd></div>').join('\n')}
      </dl>
    </section>

    <section class="bloque" id="divulgacion">
      <h2>${t.divulgacion}</h2>
      <p class="sub">${t.divulgacionSub}</p>

      <div class="cifras">
${t.cifras.map(c => '        <div><strong>' + c[0] + '</strong><span>' + c[1] + '</span></div>').join('\n')}
      </div>
    </section>

    <section class="bloque contacto" id="contacto">
      <h2>${t.contacto}</h2>
      <p class="sub">${t.contactoSub}</p>
      <a class="correo" href="mailto:${CORREO}">${CORREO}</a>
      <p class="redes">
        <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a>
        <a href="${GITHUB}" target="_blank" rel="noopener">GitHub</a>
      </p>
      <p class="telefono">${TELEFONO} · ${t.telefono}</p>
    </section>
  </main>

  <footer class="pie">Henry Arce · ${t.pie} · <span id="anio">2026</span></footer>

  <dialog class="ficha" id="ficha" aria-labelledby="fichaTitulo">
    <div class="ficha-cabecera" id="fichaCabecera"></div>
    <div class="ficha-cuerpo" id="fichaCuerpo"></div>
    <button type="button" class="ficha-cerrar" id="fichaCerrar" aria-label="${t.cerrar}">×</button>
  </dialog>

  <script src="${base}js/app.js"></script>
</body>
</html>
`;
}

IDIOMAS.forEach(d => {
  const carpeta = path.join(__dirname, d.carpeta);
  fs.mkdirSync(carpeta, { recursive: true });
  fs.writeFileSync(path.join(carpeta, 'index.html'), pagina(d));
  console.log(path.join(d.carpeta, 'index.html') + ' generado: ' + d.proyectos.length + ' proyectos');
});
