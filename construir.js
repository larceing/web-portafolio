// Genera index.html (español) y en/index.html (inglés) a partir de los datos
// de este fichero y de las traducciones de contenido.en.js, y la página de
// publicaciones de LinkedIn (linkedin/ y en/linkedin/) a partir de
// publicaciones-linkedin.js.
//
//   node construir.js
//
// Para añadir o cambiar un proyecto, edita la lista PROYECTOS, añade su
// traducción en contenido.en.js y vuelve a ejecutarlo. El resultado es HTML
// estático: no hace falta nada más para verlo.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Huella del contenido del CSS y del JS: va en su enlace (?v=...) para que el
// navegador los pida de nuevo en cuanto cambian, aunque los guarde una semana.
const huella = f => crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, f))).digest('hex').slice(0, 10);
const VERSION_CSS = huella('css/estilos.css');
const VERSION_JS = huella('js/app.js');
const VERSION_JS_LINKEDIN = huella('js/linkedin.js');

const VERSION_JS_BIT = huella('js/bit-arranque.js');
const VERSION_JS_PASEO = huella('js/bit-paseo.js');

// Dirección pública de la web. Si cambia, cambia también nginx.conf (la
// redirección desde la dirección antigua) y vuelve a ejecutar este script.
const SITIO = 'https://arcedatalab.com/';

const CORREO = 'info@arcedatalab.com';
const SOPORTE = 'soporte@arcedatalab.com';
const LINKEDIN = 'https://www.linkedin.com/in/luis-henry-programador';
const GITHUB = 'https://github.com/larceing';
const TELEFONO = '+34 633 42 42 23';
const WHATSAPP = 'https://wa.me/34633424223';

// Arce Data Lab (la marca) y Club Byte (su canal infantil).
const ARCE = 'https://arcedatalab.com';
const DEMOS = 'https://demo.arcedatalab.com';
const TIKTOK = 'https://www.tiktok.com/@arcedatalab';
const CLUBBYTE_YOUTUBE = 'https://www.youtube.com/@clubbyte_es';
const CLUBBYTE_CANAL = 'https://www.youtube.com/channel/UCGf6S4beoxCkjF3Fyl2XIrA';
const CLUBBYTE_BLOG = 'https://clubbyte.arcedatalab.com';

// Fecha de la última revisión del contenido (sitemap y datos estructurados).
const REVISADO = new Date().toISOString().slice(0, 10);

// Publicaciones de LinkedIn de la sección de divulgación, en el mismo orden que
// las cifras. Si una no tiene enlace (null), su cifra sale sin él.
const PUBLICACIONES = [
  'https://www.linkedin.com/posts/luis-henry-programador_windows-cmd-networking-activity-7371120247170502656-_654',
  'https://www.linkedin.com/posts/luis-henry-programador_10-t%C3%A9rminos-que-todo-profesional-de-datos-activity-7372599959688462336-17HF',
  'https://www.linkedin.com/posts/luis-henry-programador_el-abuelo-sabio-del-excel-vba-hoy-activity-7368190955071504385-PzAT'
];

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
  tablero: '<rect x="7" y="9" width="34" height="30" rx="3"/><path d="M18.5 9v30M29.5 9v30"/><path d="M10.5 15h5M10.5 20h5M21.5 15h5M32.5 15h5M32.5 20h5M32.5 25h5"/>',
  mapa: '<path d="M24 41c-8-10-12-15-12-21a12 12 0 0 1 24 0c0 6-4 11-12 21z"/><circle cx="24" cy="20" r="4"/>',
  servidor: '<rect x="9" y="8" width="30" height="12" rx="2"/><rect x="9" y="28" width="30" height="12" rx="2"/><circle cx="15" cy="14" r="1.5"/><circle cx="15" cy="34" r="1.5"/><path d="M24 20v8M22 14h11M22 34h11"/>',
  fabrica: '<path d="M6 40V22l9 6v-6l9 6v-6l9 6V10h8v30z"/><path d="M14 34h4M24 34h4"/>',
  sobre: '<rect x="7" y="12" width="34" height="24" rx="2"/><path d="M7 14l17 13 17-13"/>',
  video: '<rect x="6" y="11" width="36" height="26" rx="5"/><path d="M21 18v12l10-6z"/>'
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
    id: 'clubbyte', corto: 'Club Byte', titulo: 'Club Byte: tecnología explicada a niños de 8 a 12 años',
    tipo: 'producto', etiqueta: 'Arce Data Lab · canal educativo · 2026', icono: 'video', color: C.tostado,
    caso: [
      ['Problema', 'Casi no hay contenido en castellano que explique a niños y niñas cómo funciona la informática con historias y personajes, sin vender un curso detrás.'],
      ['Qué hice', 'Un canal de YouTube y un blog con dos protagonistas, Lía y Teo, y Bit, un robot hecho en Blender. Cada capítulo explica una idea (sensores, condicionales, binario, algoritmos) y termina con un reto sin pantalla para hacer en casa o en clase.'],
      ['Resultado', 'Intro animada en 3D, guiones, voces y el primer capítulo, y un blog para familias y docentes con fichas de actividad. Sin cookies ni seguimiento, como corresponde a una web infantil.']
    ],
    tec: ['Blender', 'Python', 'Guion educativo', 'SEO para familias y docentes'],
    enlaces: [['Ver el canal', CLUBBYTE_YOUTUBE], ['Leer el blog', CLUBBYTE_BLOG]]
  },
  {
    id: 'plataforma', corto: 'Plataforma DEV/PRO', titulo: 'Plataforma propia para desplegar apps en DEV y PRO',
    tipo: 'abierto', etiqueta: 'Open source · Arce Data Lab · 2026', icono: 'servidor', color: C.tinta,
    caso: [
      ['Problema', 'Cada aplicación se desplegaba a mano en el servidor, con su dominio, su inicio de sesión y su copia de seguridad hechos de una forma distinta.'],
      ['Qué hice', 'Un sistema que da a cada app un entorno de pruebas y otro de producción en el mismo servidor. Una app se enchufa con un fichero de manifiesto y el sistema crea su ruta, su grupo de usuarios en Keycloak, su dominio con certificado y su despliegue desde la imagen de GitHub.'],
      ['Resultado', 'Una decena de aplicaciones conviviendo en un servidor, botones de «Poner», «Pasar a PRO» y «Volver a la anterior», vuelta atrás automática si una versión no responde y un agente que se actualiza solo cuando las pruebas están en verde.']
    ],
    tec: ['Python', 'FastAPI', 'Nginx', 'Keycloak', 'Docker', 'GitHub Actions', 'Cloudflare'],
    enlaces: [['Ver en GitHub', GITHUB + '/servidor']]
  },
  {
    id: 'sindri', corto: 'Sindri ERP + CRM', titulo: 'Sindri: ERP y CRM para pymes industriales',
    tipo: 'producto', etiqueta: 'Producto propio · open source · 2026', icono: 'fabrica', color: C.azul,
    texto: 'ERP y CRM para fábricas pequeñas: clientes, oportunidades, presupuestos, pedidos, hojas de ruta, albaranes, facturas preparadas para VERI*FACTU y almacén con lotes. Tiene versión de escritorio y un agente de planta que lee las máquinas por OPC UA. Recibe las horas de soporte por facturar desde Odin y genera sus PDF con Report Server.',
    tec: ['PostgreSQL (PGlite)', 'Electron', 'OPC UA', 'API REST', 'Docker'],
    enlaces: [['Ver en GitHub', GITHUB + '/sindri']]
  },
  {
    id: 'gestor', corto: 'Odin, incidencias', titulo: 'Odin: incidencias, documentación y horas de soporte',
    tipo: 'producto', etiqueta: 'Producto propio · open source · 2026', icono: 'ticket', color: C.cielo,
    caso: [
      ['Problema', 'Las incidencias se apuntaban a mano, las horas en una hoja de cálculo y las facturas aparte. Nada estaba conectado.'],
      ['Qué hice', 'Una aplicación web propia donde cada incidencia lleva su seguimiento, su documentación y sus sesiones de trabajo cronometradas. Empezó apoyada en MantisBT y hoy tiene sus propias tablas, con el historial migrado.'],
      ['Resultado', 'Inicio de sesión único con Keycloak, cada incidencia abierta crea su tarea en el gestor de tareas y las horas pendientes pasan solas a Sindri para facturarlas. Correo con la marca a través del servicio Mail.']
    ],
    tec: ['Node.js', 'Express', 'MariaDB', 'Keycloak', 'Docker'],
    enlaces: [['Ver en GitHub', GITHUB + '/soporte']]
  },
  {
    id: 'servicios', corto: 'Mail y Report Server', titulo: 'Mail y Report Server: correo y PDF para todas las apps',
    tipo: 'abierto', etiqueta: 'Open source · servicios compartidos · 2026', icono: 'sobre', color: C.verde,
    texto: 'Dos servicios que comparten todas mis aplicaciones. <strong>Mail</strong> envía correo con la marca de Arce Data Lab a través de Resend, desde <code>soporte@arcedatalab.com</code>, con bloques (título, botón, tabla, imagen), adjuntos, llaves por aplicación y registro de enviados. <strong>Report Server</strong> diseña plantillas PDF en el navegador con pdfme, se conecta a MariaDB en solo lectura y genera facturas, pedidos y albaranes por API.',
    tec: ['Node.js', 'Resend', 'pdfme', 'SQLite', 'Docker'],
    enlaces: [['Mail en GitHub', GITHUB + '/mail'], ['Report Server en GitHub', GITHUB + '/report-server']]
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
    id: 'tareas', corto: 'Gestor de tareas', titulo: 'Gestor de tareas y proyectos para equipos',
    tipo: 'abierto', etiqueta: 'Open source · app web', icono: 'tablero', color: C.azul,
    texto: 'Aplicación web para organizar el trabajo de un equipo: tableros Kanban y Scrum, calendario y agenda, wiki, notas, pizarra, SLA, notas entre personas, muros de actividad y una API pensada para agentes de IA. Es una versión base sin datos de ninguna empresa: la marca, el inicio de sesión (local o Keycloak) y los módulos opcionales se configuran en un fichero, y se instala con Docker y datos de demostración.',
    tec: ['Python', 'FastAPI', 'MariaDB', 'Keycloak', 'Docker'],
    enlaces: [['Ver en GitHub', 'https://github.com/lharce/APP_TAREAS_BASE']]
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
  titulo: 'Henry Arce · Automatización, IA aplicada y Power BI | Arce Data Lab',
  descripcion: 'Henry Arce, fundador de Arce Data Lab (Alicante): automatización, IA aplicada, Power BI y apps a medida para pymes e industria. Proyectos reales y open source.',
  ogDescripcion: 'Automatización, IA aplicada y datos para pymes e industria. Proyectos reales, open source y Club Byte.',
  locale: 'es_ES',
  idiomaNombre: 'Español',
  linkedinTitulo: 'Publicaciones en LinkedIn',
  linkedinDescripcion: 'Publicaciones de Henry Arce en LinkedIn sobre BI, datos e IA aplicada.',
  linkedinSub: 'Lo que escribo sobre BI, datos e IA aplicada',
  linkedinMarco: 'Publicación de LinkedIn',
  linkedinVer: 'Abrir en LinkedIn',
  linkedinPerfil: 'Ver todas en mi perfil de LinkedIn',
  verPublicaciones: 'Leer las publicaciones aquí',
  saltar: 'Saltar al contenido',
  lema: 'automatización · IA · datos',
  secciones: 'Secciones',
  menu: { servicios: 'Servicios', arce: 'Arce Data Lab', proyectos: 'Proyectos', trayectoria: 'Trayectoria', tecnologias: 'Tecnologías', preguntas: 'Preguntas', contacto: 'Contacto' },
  otroIdioma: 'English',
  otroIdiomaAria: 'English version',
  h1: 'Automatizo procesos y pongo la IA a trabajar con los datos del negocio.',
  intro: 'Soy Henry Arce, analista de datos y desarrollador en Alicante, y fundador de <a href="#arcedatalab">Arce Data Lab</a>. Encuentro las tareas manuales de un equipo, las convierto en flujos, asistentes e informes, y mido lo que se gana. Desde 2019, primero en consultoras y ahora dentro de la industria.',
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
  verPublicacion: 'Ver la publicación',
  telefono: 'también por WhatsApp',
  pie: 'Alicante, España',
  cerrar: 'Cerrar',
  verFicha: 'Página completa del proyecto',
  volver: 'Volver a todos los proyectos',
  migas: 'Inicio',
  otrosProyectos: 'Otros proyectos',
  servicios: 'Servicios',
  serviciosSub: 'Qué puedo hacer por tu empresa, a través de Arce Data Lab',
  serviciosLista: [
    ['flujo', 'Automatización de procesos', 'Quito el trabajo manual que se repite: informes que se generan solos, datos que pasan de un programa a otro, avisos y correos automáticos.', 'Python, Power Automate, Apps Script, API'],
    ['grafico', 'Cuadros de mando y BI', 'Power BI y Microsoft Fabric sobre tu ERP o tus hojas de cálculo: ventas, cobros, stock y producción, con las cifras cuadradas y documentadas.', 'Power BI, DAX, Fabric, SQL'],
    ['bot', 'Asistentes de IA sobre tus datos', 'Un asistente que responde preguntas del negocio consultando tus datos en solo lectura, sin inventar cifras, en texto o en Excel.', 'Agentes, Claude, OpenAI, SQL'],
    ['escritorio', 'Aplicaciones a medida', 'ERP, CRM, citas, incidencias o una tienda: aplicaciones web con inicio de sesión, copias y despliegue en mi propia infraestructura.', 'Node.js, Python, Next.js, Docker']
  ],
  serviciosCta: 'Cuéntame qué tarea te quita tiempo',
  infra: 'Mi infraestructura',
  infraSub: 'Lo que tengo montado y mantengo yo, y donde viven mis aplicaciones y las de mis clientes',
  infraTexto: 'No dependo de plataformas cerradas: tengo un servidor propio con todo lo necesario para poner una aplicación en marcha con seguridad, probarla y pasarla a producción.',
  infraLista: [
    ['Servidor propio', 'Linux con Docker en Hetzner (Alemania, UE). Cada aplicación en su contenedor, detrás de un único proxy con HTTPS.'],
    ['Entornos DEV y PRO', 'Cada app se prueba antes de llegar a producción, con vuelta atrás automática si una versión falla.'],
    ['Inicio de sesión único', 'Keycloak para todas las aplicaciones, con grupos por app y por entorno.'],
    ['Dominios y certificados', 'Nginx Proxy Manager con HTTPS de Let\'s Encrypt y DNS en Cloudflare.'],
    ['Correo con marca', 'Servicio Mail sobre Resend: las apps envían desde ' + SOPORTE + ', con SPF, DKIM y DMARC.'],
    ['Documentos PDF', 'Report Server para facturas, pedidos y albaranes desde plantillas.'],
    ['Despliegue continuo', 'GitHub Actions construye cada versión y la publica en GitHub Container Registry.'],
    ['Copias y avisos', 'Copias nocturnas de las bases de datos y comprobación continua de que cada app responde.']
  ],
  infraEnlace: 'Ver la plataforma en GitHub',
  arce: 'Arce Data Lab',
  arceSub: 'Mi marca: datos, automatización e IA para pymes, y un canal para que los niños se interesen por la tecnología',
  arceTexto: '<strong>Arce Data Lab</strong> es el laboratorio desde el que construyo aplicaciones, cuadros de mando y asistentes de IA para pymes e industria, con su propia plataforma de despliegue, correo y documentos. Todo lo que ves en los proyectos marcados como producto propio vive allí.',
  arceEnlaces: [['Demos para clientes', DEMOS], ['TikTok @arcedatalab', TIKTOK]],
  clubbyteTitulo: 'Club Byte',
  clubbyteTexto: '<strong>Club Byte</strong> es el canal educativo de Arce Data Lab: explica a niños y niñas de 8 a 12 años cómo funciona la informática con Lía, Teo y el robot Bit. Su hermano mayor, Byte, es el que te acompaña en esta página. Cada capítulo acaba con un reto sin pantalla para hacer en casa o en clase.',
  clubbyteEnlaces: [['YouTube @clubbyte_es', CLUBBYTE_YOUTUBE], ['Blog para familias y docentes', CLUBBYTE_BLOG]],
  bitAlt: 'Byte, el hermano mayor de Bit, de Club Byte',
  preguntas: 'Preguntas frecuentes',
  preguntasSub: 'Lo que más me preguntan, en una frase cada una',
  faq: [
    ['¿Quién es Henry Arce?', 'Luis Henry Arce Inga, conocido como Henry Arce, es analista de datos y desarrollador en Alicante (España), especializado en automatización de procesos, IA aplicada y Power BI, y fundador de Arce Data Lab.'],
    ['¿Qué es Arce Data Lab?', 'Arce Data Lab es la marca de Henry Arce para construir aplicaciones a medida, cuadros de mando e integraciones con IA para pymes e industria; su web es arcedatalab.com.'],
    ['¿Qué servicios ofrece Arce Data Lab?', 'Automatización de procesos, cuadros de mando con Power BI y Microsoft Fabric, asistentes de IA sobre los datos del negocio y aplicaciones a medida (ERP, CRM, citas), desplegadas en infraestructura propia en la UE.'],
    ['¿Qué tipo de proyectos hace?', 'Automatiza tareas repetitivas, conecta ERP, CRM y bases de datos, crea informes de Power BI y Microsoft Fabric, y pone asistentes de IA a responder sobre los datos del negocio en solo lectura.'],
    ['¿Trabaja con pymes?', 'Sí: con pymes y fábricas que tienen tareas manuales o datos que no cuadran, en remoto o desde Alicante.'],
    ['¿Qué es Club Byte?', 'Club Byte es el canal de YouTube (@clubbyte_es) y el blog de Arce Data Lab que explica informática y tecnología a niños de 8 a 12 años, con retos sin pantalla para familias y docentes.'],
    ['¿Dónde publica contenido?', 'En LinkedIn sobre BI, datos e IA aplicada, en TikTok (@arcedatalab) con consejos rápidos de automatización y datos, y en YouTube con Club Byte para niños.'],
    ['¿Cómo contactar?', 'Por correo a ' + CORREO + ', por WhatsApp al ' + TELEFONO + ' o por LinkedIn; para soporte de las aplicaciones, ' + SOPORTE + '.']
  ],
  soporte: 'Soporte de las aplicaciones',
  bit: {
    nombre: 'Byte, el hermano mayor de Bit',
    hola: '¡Hola! Soy Byte, el hermano mayor de Bit, el robot de Club Byte. Te acompaño por la web de Henry.',
    servicios: 'Si en tu empresa algo se hace a mano cada semana, Henry lo puede automatizar.',
    infraestructura: 'Aquí vivo yo también: en contenedores, con copias cada noche.',
    arcedatalab: 'Esto es Arce Data Lab. Mi hermano pequeño, Bit, sale en Club Byte, su canal para peques.',
    proyectos: 'Pulsa un proyecto y te cuento qué problema resolvía.',
    trayectoria: 'De la consultora a la fábrica. ¡Cuántos datos!',
    tecnologias: 'Python, Power BI, Docker… a mí me programaron en Blender.',
    preguntas: 'Respuestas cortas, como me gustan a mí.',
    contacto: '¿Hablamos? Escribe a ' + CORREO,
    pulsar: ['¡Bip bup! Eso hace cosquillas.', 'Soy un byte: 8 bits, y uno de ellos es mi hermano.', 'En Club Byte, Bit explica cómo piensan los ordenadores.', 'Un algoritmo es una receta. ¡Como un bocadillo!'],
    ocultar: 'Ocultar a Byte',
    mostrar: 'Mostrar a Byte',
    canal: 'Ver Club Byte'
  }
};

const EN = require('./contenido.en.js');

// Publicaciones de la página /linkedin/. Cada elemento es el código de
// «Insertar esta publicación» o el enlace de la publicación; de él solo se
// toman la referencia (urn:li:...) y la altura, y el <iframe> se escribe aquí.
const ALTO_LINKEDIN = 640;

// Cuántas publicaciones se ven a la vez. Si en la lista hay más, cada semana
// se eligen otras al azar (js/linkedin.js); si hay menos, cambia el orden.
const LINKEDIN_A_LA_VEZ = 4;

function publicacionLinkedin(entrada, i) {
  const texto = String(typeof entrada === 'string' ? entrada : entrada.publicacion).trim();
  let legible = texto;
  try { legible = decodeURIComponent(texto); } catch (e) { /* se usa tal cual */ }

  const urn = (legible.match(/urn:li:(?:activity|share|ugcPost):\d+/) || [])[0]
    || ((legible.match(/activity-(\d+)/) || [])[1] ? 'urn:li:activity:' + legible.match(/activity-(\d+)/)[1] : null);
  if (!urn) {
    throw new Error('publicaciones-linkedin.js, elemento ' + (i + 1) + ': no encuentro la publicación. Pega el código de «Insertar esta publicación» o el enlace de la publicación.');
  }

  const alto = Number(entrada.alto) || Number((texto.match(/height="(\d+)"/) || [])[1]) || ALTO_LINKEDIN;
  const marco = 'https://www.linkedin.com/embed/feed/update/' + urn + (/collapsed=1/.test(texto) ? '?collapsed=1' : '');
  const enlace = /^https:\/\/www\.linkedin\.com\/(posts|feed)\/[^\s"'<>]+$/.test(texto) ? texto : 'https://www.linkedin.com/feed/update/' + urn + '/';
  return { marco: marco, alto: alto, enlace: enlace };
}

const LINKEDIN_PUBLICACIONES = require('./publicaciones-linkedin.js').map(publicacionLinkedin);

// Cada idioma: sus textos, sus datos, la carpeta donde se escribe y la ruta
// hasta la raíz (para css, js e img) y hasta la página del otro idioma.
const IDIOMAS = [
  { t: UI, areas: AREAS, proyectos: PROYECTOS, trayectoria: TRAYECTORIA, tecnologias: TECNOLOGIAS, carpeta: '', base: '', otro: 'en/' },
  {
    t: Object.assign({}, EN.UI, {
      arceEnlaces: UI.arceEnlaces.map((e, i) => [EN.UI.arceEnlacesTextos[i], e[1]]),
      clubbyteEnlaces: UI.clubbyteEnlaces.map((e, i) => [EN.UI.clubbyteEnlacesTextos[i], e[1]])
    }),
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


// ---------- SEO: textos planos, datos estructurados y ficheros para buscadores ----------

const ID_PERSONA = SITIO + '#henry';
const ID_ORG = ARCE + '/#organizacion';
const ID_CLUBBYTE = CLUBBYTE_BLOG + '/#serie'; // el mismo @id que publica el blog
const ID_WEB = SITIO + '#web';

// Quita etiquetas y entidades para usar un texto en metadatos.
const plano = h => String(h).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const attr = h => plano(h).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Resumen de un proyecto para su descripción (unos 155 caracteres).
function resumen(p) {
  const texto = plano(p.caso ? p.caso.map(c => c[1]).slice(0, 2).join(' ') : p.texto);
  if (texto.length <= 158) return texto;
  return texto.slice(0, 155).replace(/\s+\S*$/, '') + '…';
}

// JSON dentro de <script>: sin "</" para que no pueda cerrar la etiqueta.
const jsonLd = datos => JSON.stringify(datos).replace(/</g, '\\u003c');

function persona(d) {
  const t = d.t;
  return {
    '@type': 'Person',
    '@id': ID_PERSONA,
    name: 'Henry Arce',
    alternateName: 'Luis Henry Arce Inga',
    givenName: 'Luis Henry',
    familyName: 'Arce Inga',
    url: SITIO,
    image: SITIO + 'img/foto.webp',
    email: 'mailto:' + CORREO,
    telephone: TELEFONO.replace(/\s/g, ''),
    jobTitle: t.lang === 'es' ? 'Analista de datos y desarrollador · automatización e IA aplicada' : 'Data analyst and developer · automation and applied AI',
    description: plano(t.descripcion),
    address: { '@type': 'PostalAddress', addressLocality: 'Alicante', addressRegion: 'Comunidad Valenciana', addressCountry: 'ES' },
    worksFor: { '@id': ID_ORG },
    knowsLanguage: ['es', 'en'],
    knowsAbout: ['Power BI', 'DAX', 'Microsoft Fabric', 'Automatización de procesos', 'IA aplicada', 'Agentes de IA', 'Python', 'SQL Server', 'ERP', 'CRM', 'Docker', 'Keycloak', 'Node.js', 'Blender', 'Process automation', 'Business intelligence'],
    alumniOf: { '@type': 'EducationalOrganization', name: 'IES El Palmeral' },
    award: ['Premio a la Excelencia Académica 2022', 'CV Skills 2021, Electrónica'],
    sameAs: [LINKEDIN, GITHUB, TIKTOK]
  };
}

function organizacion() {
  return {
    '@type': 'Organization',
    '@id': ID_ORG,
    name: 'Arce Data Lab',
    url: ARCE,
    email: CORREO,
    logo: SITIO + 'img/monograma.png',
    founder: { '@id': ID_PERSONA },
    areaServed: 'ES',
    address: { '@type': 'PostalAddress', addressLocality: 'Alicante', addressCountry: 'ES' },
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer service', email: CORREO, availableLanguage: ['es', 'en'] },
      { '@type': 'ContactPoint', contactType: 'technical support', email: SOPORTE, availableLanguage: ['es'] }
    ],
    sameAs: [TIKTOK, CLUBBYTE_YOUTUBE],
    brand: { '@id': ID_CLUBBYTE },
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Servicios',
      itemListElement: UI.serviciosLista.map(x => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: x[1], description: plano(x[2]), provider: { '@id': ID_ORG }, areaServed: 'ES' } }))
    }
  };
}

function clubbyte() {
  return {
    '@type': 'CreativeWorkSeries',
    '@id': ID_CLUBBYTE,
    name: 'Club Byte',
    url: CLUBBYTE_BLOG,
    inLanguage: 'es',
    description: 'Canal educativo que explica informática y tecnología a niños y niñas de 8 a 12 años, con retos sin pantalla para familias y docentes.',
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 8, suggestedMaxAge: 12 },
    educationalUse: 'Pensamiento computacional',
    publisher: { '@id': ID_ORG },
    creator: { '@id': ID_PERSONA },
    sameAs: [CLUBBYTE_YOUTUBE, CLUBBYTE_CANAL]
  };
}

function urlProyecto(d, p) {
  return SITIO + (d.carpeta ? d.carpeta + '/' : '') + 'proyectos/' + p.id + '/';
}

function obraProyecto(d, p) {
  const repo = (p.enlaces || []).map(e => e[1]).find(u => u.indexOf('https://github.com/') === 0);
  const o = {
    '@type': repo ? 'SoftwareSourceCode' : 'CreativeWork',
    '@id': urlProyecto(d, p) + '#proyecto',
    name: plano(p.titulo),
    url: urlProyecto(d, p),
    description: resumen(p),
    inLanguage: d.t.lang,
    author: { '@id': ID_PERSONA },
    keywords: (p.tec || []).join(', ')
  };
  if (repo) o.codeRepository = repo;
  if (p.id === 'clubbyte') o.isPartOf = { '@id': ID_CLUBBYTE };
  return o;
}

function datosPortada(d) {
  const t = d.t;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': ID_WEB, url: SITIO, name: 'Henry Arce · Arce Data Lab', inLanguage: ['es', 'en'], publisher: { '@id': ID_PERSONA } },
      {
        '@type': 'ProfilePage', '@id': SITIO + (d.carpeta ? d.carpeta + '/' : '') + '#pagina',
        url: SITIO + (d.carpeta ? d.carpeta + '/' : ''), name: plano(t.titulo), description: plano(t.descripcion),
        inLanguage: t.lang, isPartOf: { '@id': ID_WEB }, dateModified: REVISADO,
        mainEntity: { '@id': ID_PERSONA }, about: { '@id': ID_PERSONA }
      },
      persona(d),
      organizacion(),
      clubbyte(),
      {
        '@type': 'ItemList', name: t.proyectos,
        itemListElement: d.proyectos.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: urlProyecto(d, p), name: plano(p.titulo) }))
      },
      {
        '@type': 'FAQPage', '@id': SITIO + (d.carpeta ? d.carpeta + '/' : '') + '#preguntas',
        mainEntity: t.faq.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } }))
      }
    ]
  };
}

function datosProyecto(d, p) {
  const t = d.t;
  const inicio = SITIO + (d.carpeta ? d.carpeta + '/' : '');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': urlProyecto(d, p), url: urlProyecto(d, p), name: plano(p.titulo), description: resumen(p), inLanguage: t.lang, isPartOf: { '@id': ID_WEB }, dateModified: REVISADO, mainEntity: { '@id': urlProyecto(d, p) + '#proyecto' } },
      obraProyecto(d, p),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.migas, item: inicio },
          { '@type': 'ListItem', position: 2, name: t.proyectos, item: inicio + '#proyectos' },
          { '@type': 'ListItem', position: 3, name: plano(p.corto) }
        ]
      },
      persona(d)
    ]
  };
}

function tesela(p, t) {
  return '      <button type="button" class="tesela" data-tipo="' + p.tipo + '" data-detalle="d-' + p.id + '" style="--c:' + p.color + '">\n' +
    '        ' + icono(p.icono) + '\n' +
    '        <span class="tesela-titulo">' + p.corto + '</span>\n' +
    '        <span class="tesela-tipo">' + t.tipos[p.tipo] + '</span>\n' +
    '      </button>';
}

function detalle(p, t, base) {
  const cuerpo = p.caso
    ? '<dl class="caso">' + p.caso.map(c => '<div><dt>' + c[0] + '</dt><dd>' + c[1] + '</dd></div>').join('') + '</dl>'
    : '<p>' + p.texto + '</p>';
  const tec = p.tec ? '<p class="tec">' + p.tec.join(' · ') + '</p>' : '';
  const enlaces = p.enlaces
    ? '<p class="enlaces">' + p.enlaces.map(e => '<a href="' + e[1] + '" target="_blank" rel="noopener">' + (t.enlaces[e[0]] || e[0]) + '</a>').join('') + '</p>'
    : '';
  return '    <div hidden id="d-' + p.id + '" data-color="' + p.color + '" data-icono="' + p.icono + '">\n' +
    '      <p class="etiqueta">' + p.etiqueta + '</p>\n      <h3>' + p.titulo + '</h3>\n      ' + cuerpo + '\n      ' + tec + enlaces + '\n' +
    '      <p class="pagina-proyecto"><a href="' + base + 'proyectos/' + p.id + '/">' + t.verFicha + ' →</a></p>\n    </div>';
}

// Cabecera HTML y menú, comunes a la portada y a la página de LinkedIn.
// p.ruta: la página dentro de cada idioma ('' o 'linkedin/'). p.raiz: camino
// hasta la raíz del sitio (css, js, img). p.inicio: camino hasta la portada
// del mismo idioma. p.otro: la misma página en el otro idioma.
function cabeza(d, p) {
  const t = d.t;
  const url = SITIO + (d.carpeta ? d.carpeta + '/' : '') + p.ruta;
  const imagen = SITIO + 'img/og.jpg';

  return `<!DOCTYPE html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${p.titulo}</title>
  <meta name="description" content="${p.descripcion}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="author" content="Henry Arce">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="es" href="${SITIO}${p.ruta}">
  <link rel="alternate" hreflang="en" href="${SITIO}en/${p.ruta}">
  <link rel="alternate" hreflang="x-default" href="${SITIO}${p.ruta}">
  <meta property="og:title" content="${p.titulo}">
  <meta property="og:description" content="${p.ogDescripcion}">
  <meta property="og:type" content="${p.ogTipo || 'profile'}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Henry Arce · Arce Data Lab">
  <meta property="og:locale" content="${t.locale}">
  <meta property="og:image" content="${imagen}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Henry Arce · Arce Data Lab">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${p.titulo}">
  <meta name="twitter:description" content="${p.ogDescripcion}">
  <meta name="twitter:image" content="${imagen}">
  <meta name="theme-color" content="#FFFFFF">
  <link rel="icon" href="${p.raiz}img/monograma.svg" type="image/svg+xml">
  <link rel="icon" href="${p.raiz}img/monograma.png" type="image/png">
  <link rel="apple-touch-icon" href="${p.raiz}img/monograma.png">
  <link rel="me" href="${LINKEDIN}">
  <link rel="me" href="${GITHUB}">
  <script type="application/ld+json">${jsonLd(p.datos)}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="${p.raiz}css/estilos.css?v=${VERSION_CSS}">
</head>

<body>
  <a class="saltar" href="#contenido">${t.saltar}</a>

  <header class="cabecera">
    <a class="marca" href="${p.inicio}#inicio">Henry Arce <span>${t.lema}</span></a>
    <nav class="menu" aria-label="${t.secciones}">
      <a href="${p.inicio}#servicios">${t.menu.servicios}</a>
      <a href="${p.inicio}#arcedatalab">${t.menu.arce}</a>
      <a href="${p.inicio}#proyectos">${t.menu.proyectos}</a>
      <a href="${p.inicio}#trayectoria">${t.menu.trayectoria}</a>
      <a href="${p.inicio}#preguntas">${t.menu.preguntas}</a>
      <a href="${p.inicio}#contacto">${t.menu.contacto}</a>
      <a class="idioma" href="${p.otro}" lang="${t.lang === 'es' ? 'en' : 'es'}" hreflang="${t.lang === 'es' ? 'en' : 'es'}" aria-label="${t.otroIdiomaAria}">${t.otroIdioma}</a>
    </nav>
  </header>
`;
}

function pagina(d) {
  const t = d.t;
  const base = d.base;

  return cabeza(d, { titulo: t.titulo, descripcion: t.descripcion, ogDescripcion: t.ogDescripcion, ruta: '', raiz: base, inicio: '', otro: d.otro, datos: datosPortada(d) }) + `
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

    <p class="franja">${t.franja} <span><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a><a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a><a href="${TIKTOK}" target="_blank" rel="noopener">TikTok</a></span></p>

    <section class="bloque" id="servicios" data-bit="servicios">
      <h2>${t.servicios}</h2>
      <p class="sub">${t.serviciosSub}</p>

      <div class="servicios">
${t.serviciosLista.map(x => '        <article class="servicio">' + icono(x[0]) + '<h3>' + x[1] + '</h3><p>' + x[2] + '</p><p class="tec">' + x[3] + '</p></article>').join('\n')}
      </div>
      <p class="mas"><a href="#contacto">${t.serviciosCta} →</a></p>
    </section>

    <section class="bloque" id="arcedatalab" data-bit="arcedatalab">
      <h2>${t.arce}</h2>
      <p class="sub">${t.arceSub}</p>

      <div class="marcas">
        <article class="marca-tarjeta">
          <h3>Arce Data Lab</h3>
          <p>${t.arceTexto}</p>
          <p class="enlaces">${t.arceEnlaces.map(e => '<a href="' + e[1] + '" target="_blank" rel="noopener">' + e[0] + '</a>').join('')}</p>
        </article>
        <article class="marca-tarjeta clubbyte">
          <img src="${base}img/bit.webp" alt="${t.bitAlt}" width="208" height="320" loading="lazy">
          <div>
            <h3>${t.clubbyteTitulo}</h3>
            <p>${t.clubbyteTexto}</p>
            <p class="enlaces">${t.clubbyteEnlaces.map(e => '<a href="' + e[1] + '" target="_blank" rel="noopener">' + e[0] + '</a>').join('')}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="bloque" id="infraestructura" data-bit="infraestructura">
      <h2>${t.infra}</h2>
      <p class="sub">${t.infraSub}</p>
      <p class="infra-texto">${t.infraTexto}</p>

      <dl class="infra">
${t.infraLista.map(x => '        <div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>').join('\n')}
      </dl>
      <p class="mas"><a href="${GITHUB}/servidor" target="_blank" rel="noopener">${t.infraEnlace}</a> · <a href="proyectos/plataforma/">${t.verFicha}</a></p>
    </section>

    <section class="bloque" id="proyectos" data-bit="proyectos">
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

${d.proyectos.map(p => detalle(p, t, '')).join('\n')}

    <section class="bloque" id="trayectoria" data-bit="trayectoria">
      <h2>${t.trayectoria}</h2>
      <p class="sub">${t.trayectoriaSub}</p>

      <ol class="lista">
${d.trayectoria.map(x => '        <li><span class="cuando">' + x[0] + '</span><div><h3>' + x[1] + ' <span>· ' + x[2] + '</span></h3><p>' + x[3] + '</p></div></li>').join('\n')}
      </ol>
    </section>

    <section class="bloque" id="tecnologias" data-bit="tecnologias">
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
${t.cifras.map((c, i) => '        <div><strong>' + c[0] + '</strong><span>' + c[1] + '</span>' + (PUBLICACIONES[i] ? '<a href="' + PUBLICACIONES[i] + '" target="_blank" rel="noopener">' + t.verPublicacion + '</a>' : '') + '</div>').join('\n')}
      </div>
      <p class="mas"><a href="linkedin/">${t.verPublicaciones}</a></p>
    </section>

    <section class="bloque" id="preguntas" data-bit="preguntas">
      <h2>${t.preguntas}</h2>
      <p class="sub">${t.preguntasSub}</p>

      <dl class="preguntas">
${t.faq.map(f => '        <div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>').join('\n')}
      </dl>
    </section>

    <section class="bloque contacto" id="contacto" data-bit="contacto">
      <h2>${t.contacto}</h2>
      <p class="sub">${t.contactoSub}</p>
      <a class="correo" href="mailto:${CORREO}">${CORREO}</a>
      <p class="redes">
        <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a>
        <a href="${GITHUB}" target="_blank" rel="noopener">GitHub</a>
        <a href="${TIKTOK}" target="_blank" rel="noopener">TikTok</a>
        <a href="${CLUBBYTE_YOUTUBE}" target="_blank" rel="noopener">YouTube · Club Byte</a>
      </p>
      <p class="telefono">${TELEFONO} · ${t.telefono}</p>
      <p class="telefono">${t.soporte}: <a href="mailto:${SOPORTE}">${SOPORTE}</a></p>
    </section>
  </main>

  <footer class="pie">Henry Arce · <a href="${ARCE}">Arce Data Lab</a> · ${t.pie} · <span id="anio">2026</span></footer>

  <dialog class="ficha" id="ficha" aria-labelledby="fichaTitulo">
    <div class="ficha-cabecera" id="fichaCabecera"></div>
    <div class="ficha-cuerpo" id="fichaCuerpo"></div>
    <button type="button" class="ficha-cerrar" id="fichaCerrar" aria-label="${t.cerrar}">×</button>
  </dialog>

${bitHtml(t, base)}
  <script src="${base}js/app.js?v=${VERSION_JS}"></script>
</body>
</html>
`;
}

// Página /linkedin/: las publicaciones insertadas con el código oficial de
// LinkedIn, una debajo de otra (dos columnas en pantallas anchas).
function paginaLinkedin(d) {
  const t = d.t;

  return cabeza(d, {
    titulo: t.linkedinTitulo + ' · Henry Arce', descripcion: t.linkedinDescripcion, ogDescripcion: t.linkedinDescripcion,
    ruta: 'linkedin/', raiz: '../' + d.base, inicio: '../', otro: '../' + d.otro + 'linkedin/',
    datos: { '@context': 'https://schema.org', '@graph': [{ '@type': 'CollectionPage', url: SITIO + (d.carpeta ? d.carpeta + '/' : '') + 'linkedin/', name: plano(t.linkedinTitulo), inLanguage: t.lang, isPartOf: { '@id': ID_WEB }, about: { '@id': ID_PERSONA } }, persona(d)] }
  }) + `
  <main id="contenido">
    <section class="bloque publicaciones">
      <h1>${t.linkedinTitulo}</h1>
      <p class="sub">${t.linkedinSub}</p>

      <div class="embebidas" data-a-la-vez="${LINKEDIN_A_LA_VEZ}">
${LINKEDIN_PUBLICACIONES.map((p, i) => '        <figure class="embebida"' + (i >= LINKEDIN_A_LA_VEZ ? ' hidden' : '') + '>\n          <iframe src="' + p.marco + '" height="' + p.alto + '" title="' + t.linkedinMarco + ' ' + (i + 1) + '" loading="lazy" allowfullscreen></iframe>\n          <figcaption><a href="' + p.enlace + '" target="_blank" rel="noopener">' + t.linkedinVer + '</a></figcaption>\n        </figure>').join('\n')}
      </div>

      <p class="mas"><a href="${LINKEDIN}" target="_blank" rel="noopener">${t.linkedinPerfil}</a></p>
    </section>
  </main>

  <footer class="pie">Henry Arce · ${t.pie} · ${new Date().getFullYear()}</footer>

  <script src="${'../' + d.base}js/linkedin.js?v=${VERSION_JS_LINKEDIN}"></script>
</body>
</html>
`;
}

// Bit, el robot de Club Byte, como acompañante. La página funciona igual sin
// él: primero se ve su foto y, cuando la página ya está quieta, js/bit-arranque.js
// carga el 3D (js/bit.js + img/bit.glb). Ver bit/README.md.
const VERSION_JS_BIT3D = huella('js/bit.js');

function bitHtml(t, base) {
  const guion = Object.assign({}, t.bit, { canalUrl: CLUBBYTE_YOUTUBE });
  return `  <aside class="bit" id="bit" data-paseo="guia" aria-label="${t.bit.nombre}" data-modelo="${base}img/bit.glb?v=${huella('img/bit.glb')}" data-js="${base}js/bit.js?v=${VERSION_JS_BIT3D}">
    <p class="bit-bocadillo" id="bitBocadillo" role="status" aria-live="polite" hidden></p>
    <div class="bit-cuerpo" id="bitCuerpo">
      <img class="bit-foto" src="${base}img/bit.webp" alt="" width="104" height="160">
      <canvas class="bit-lienzo" id="bitLienzo" aria-hidden="true" hidden></canvas>
    </div>
    <button type="button" class="bit-boton" id="bitBoton" aria-expanded="true" aria-controls="bitCuerpo" title="${t.bit.ocultar}">×</button>
  </aside>
  <script type="application/json" id="bitGuion">${jsonLd(guion)}</script>
  <script src="${base}js/bit-arranque.js?v=${VERSION_JS_BIT}"></script>
  <script src="${base}js/bit-paseo.js?v=${VERSION_JS_PASEO}"></script>`;
}

// Página propia de cada proyecto: /proyectos/<id>/ y /en/proyectos/<id>/.
function paginaProyecto(d, p) {
  const t = d.t;
  const raiz = '../../' + d.base;
  const cuerpo = p.caso
    ? '<dl class="caso">' + p.caso.map(c => '<div><dt>' + c[0] + '</dt><dd>' + c[1] + '</dd></div>').join('') + '</dl>'
    : '<p>' + p.texto + '</p>';
  const tec = p.tec ? '<p class="tec">' + p.tec.join(' · ') + '</p>' : '';
  const enlaces = p.enlaces
    ? '<p class="enlaces">' + p.enlaces.map(e => '<a href="' + e[1] + '" target="_blank" rel="noopener">' + (t.enlaces[e[0]] || e[0]) + '</a>').join('') + '</p>'
    : '';
  const otros = d.proyectos.filter(o => o.id !== p.id);

  return cabeza(d, {
    titulo: plano(p.titulo) + ' · Henry Arce', descripcion: attr(resumen(p)), ogDescripcion: attr(resumen(p)), ogTipo: 'article',
    ruta: 'proyectos/' + p.id + '/', raiz: raiz, inicio: '../../', otro: '../../' + d.otro + 'proyectos/' + p.id + '/',
    datos: datosProyecto(d, p)
  }) + `
  <main id="contenido">
    <nav class="migas" aria-label="Breadcrumb"><a href="../../">${t.migas}</a> › <a href="../../#proyectos">${t.proyectos}</a> › <span>${p.corto}</span></nav>

    <article class="bloque proyecto" data-bit="proyectos">
      <div class="proyecto-cabecera" style="--c:${p.color}">${icono(p.icono)}</div>
      <p class="etiqueta">${p.etiqueta}</p>
      <h1>${p.titulo}</h1>
      ${cuerpo}
      ${tec}${enlaces}
      <p class="proyecto-contacto">${t.contactoSub}: <a href="mailto:${CORREO}">${CORREO}</a></p>
    </article>

    <section class="bloque">
      <h2>${t.otrosProyectos}</h2>
      <ul class="otros">
${otros.map(o => '        <li><a href="../' + o.id + '/">' + o.titulo + '</a> <span>· ' + t.tipos[o.tipo] + '</span></li>').join('\n')}
      </ul>
      <p class="mas"><a href="../../#proyectos">${t.volver}</a></p>
    </section>
  </main>

  <footer class="pie">Henry Arce · <a href="${ARCE}">Arce Data Lab</a> · ${t.pie} · ${new Date().getFullYear()}</footer>

${bitHtml(t, raiz)}
</body>
</html>
`;
}

// sitemap.xml con las dos versiones de cada página enlazadas entre sí.
function sitemap() {
  const rutas = [''].concat(['linkedin/']).concat(PROYECTOS.map(p => 'proyectos/' + p.id + '/'));
  const entrada = ruta => ['', 'en/'].map(pre =>
    '  <url>\n    <loc>' + SITIO + pre + ruta + '</loc>\n    <lastmod>' + REVISADO + '</lastmod>\n' +
    '    <xhtml:link rel="alternate" hreflang="es" href="' + SITIO + ruta + '"/>\n' +
    '    <xhtml:link rel="alternate" hreflang="en" href="' + SITIO + 'en/' + ruta + '"/>\n' +
    '    <xhtml:link rel="alternate" hreflang="x-default" href="' + SITIO + ruta + '"/>\n  </url>').join('\n');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    rutas.map(entrada).join('\n') + '\n</urlset>\n';
}

// robots.txt: todo abierto, también a los rastreadores de IA (GEO).
function robots() {
  return ['# Web personal de Henry Arce (Arce Data Lab). Todo es público.',
    'User-agent: *', 'Allow: /', '',
    '# Buscadores y asistentes de IA: bienvenidos.',
    'User-agent: GPTBot', 'Allow: /', '',
    'User-agent: OAI-SearchBot', 'Allow: /', '',
    'User-agent: ChatGPT-User', 'Allow: /', '',
    'User-agent: ClaudeBot', 'Allow: /', '',
    'User-agent: Claude-SearchBot', 'Allow: /', '',
    'User-agent: PerplexityBot', 'Allow: /', '',
    'User-agent: Google-Extended', 'Allow: /', '',
    'User-agent: Applebot-Extended', 'Allow: /', '',
    'Sitemap: ' + SITIO + 'sitemap.xml', ''].join('\n');
}

// llms.txt: resumen en Markdown para asistentes de IA.
function llms() {
  const es = IDIOMAS[0];
  const lineas = [
    '# Henry Arce · Arce Data Lab', '',
    '> ' + plano(UI.faq[0][1]), '',
    plano(UI.intro), '',
    '## Datos clave',
    '- Nombre: Luis Henry Arce Inga (Henry Arce). Alicante, España.',
    '- Marca: Arce Data Lab (' + ARCE + '). Correo: ' + CORREO + '. Soporte: ' + SOPORTE + '.',
    '- Especialidad: automatización de procesos, IA aplicada sobre datos de negocio, Power BI y Microsoft Fabric, apps a medida (ERP, CRM).',
    '- Perfiles: LinkedIn ' + LINKEDIN + ' · GitHub ' + GITHUB + ' · TikTok ' + TIKTOK,
    '- Club Byte (canal educativo para niños de 8 a 12 años): YouTube ' + CLUBBYTE_YOUTUBE + ' · blog ' + CLUBBYTE_BLOG, '',
    '## Servicios'
  ].concat(UI.serviciosLista.map(x => '- **' + x[1] + '**: ' + plano(x[2])))
   .concat(['', '## Infraestructura propia']).concat(UI.infraLista.map(x => '- **' + x[0] + '**: ' + plano(x[1])))
   .concat(['', '## Proyectos']).concat(PROYECTOS.map(p => '- [' + plano(p.titulo) + '](' + urlProyecto(es, p) + '): ' + resumen(p)))
   .concat(['', '## Preguntas frecuentes']).concat(UI.faq.map(f => '- **' + f[0] + '** ' + plano(f[1])))
   .concat(['', '## Trayectoria']).concat(TRAYECTORIA.map(x => '- ' + plano(x[0]) + ': ' + plano(x[1]) + ', ' + plano(x[2])))
   .concat(['', '## Otras páginas', '- [English version](' + SITIO + 'en/)', '- [Publicaciones de LinkedIn](' + SITIO + 'linkedin/)', '']);
  return lineas.join('\n');
}

IDIOMAS.forEach(d => {
  const carpeta = path.join(__dirname, d.carpeta);
  fs.mkdirSync(carpeta, { recursive: true });
  fs.writeFileSync(path.join(carpeta, 'index.html'), pagina(d));
  console.log(path.join(d.carpeta, 'index.html') + ' generado: ' + d.proyectos.length + ' proyectos');

  const carpetaLinkedin = path.join(carpeta, 'linkedin');
  fs.mkdirSync(carpetaLinkedin, { recursive: true });
  fs.writeFileSync(path.join(carpetaLinkedin, 'index.html'), paginaLinkedin(d));
  console.log(path.join(d.carpeta, 'linkedin', 'index.html') + ' generado: ' + LINKEDIN_PUBLICACIONES.length + ' publicaciones');

  d.proyectos.forEach(p => {
    const carpetaProyecto = path.join(carpeta, 'proyectos', p.id);
    fs.mkdirSync(carpetaProyecto, { recursive: true });
    fs.writeFileSync(path.join(carpetaProyecto, 'index.html'), paginaProyecto(d, p));
  });
  console.log(path.join(d.carpeta, 'proyectos') + ': ' + d.proyectos.length + ' páginas de proyecto');
});

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap());
fs.writeFileSync(path.join(__dirname, 'robots.txt'), robots());
fs.writeFileSync(path.join(__dirname, 'llms.txt'), llms());
console.log('sitemap.xml, robots.txt y llms.txt generados');
