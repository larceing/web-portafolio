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
const VERSION_JS_CINTA = huella('js/cinta-arranque.js');
const VERSION_JS_PORTADA = huella('js/portada.js');
const VERSION_JS_ANTES = huella('js/antes-ahora.js');

// Dirección pública de la web. Si cambia, cambia también nginx.conf (la
// redirección desde la dirección antigua) y vuelve a ejecutar este script.
const SITIO = 'https://arcedatalab.com/';

const CORREO = 'info@arcedatalab.com';
const SOPORTE = 'soporte@arcedatalab.com';
const LINKEDIN = 'https://www.linkedin.com/in/luis-henry-programador';
const GITHUB = 'https://github.com/larceing';
const TELEFONO = '+34 633 42 42 23';
const WHATSAPP = 'https://wa.me/34633424223';

// Arce Data Lab (la marca) y Club Byte (proyecto personal de animación, aparte).
const ARCE = 'https://arcedatalab.com';
const DEMOS = 'https://demo.arcedatalab.com';
const TIKTOK = 'https://www.tiktok.com/@arcedatalab';
const INSTAGRAM = 'https://www.instagram.com/henry_arce_dev/';
// Enlace de WhatsApp con el mensaje del diagnóstico ya escrito.
const WHATSAPP_DIAGNOSTICO = WHATSAPP + '?text=' + encodeURIComponent('Hola Henry, quiero pedir presupuesto para mi empresa. Te cuento: ');
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
// Catálogo de plantillas de ejemplo: vive en esta web, en plantillas/ (se copia desde el
// repo demos con catalogo/a_la_web.py). En DEV, js/bit-arranque.js cambia el enlace por
// el de DEV (atributo data-dev).
const CATALOGO_PLANTILLAS = 'https://arcedatalab.com/plantillas/';
const CATALOGO_PLANTILLAS_DEV = 'https://dev.luiscontacto03.com/web/plantillas/';

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
  video: '<rect x="6" y="11" width="36" height="26" rx="5"/><path d="M21 18v12l10-6z"/>',
  ciclo: '<path d="M38 19a15 15 0 0 0-26-6M10 29a15 15 0 0 0 26 6"/><path d="M11 7v6h6M37 41v-6h-6"/><path d="M21 18v12l9-6z"/>'
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
    id: 'ada', corto: 'Ada, marketing', titulo: 'Ada: el marketing de mis canales con n8n e IA',
    tipo: 'producto', etiqueta: 'Producto propio · en marcha · 2026', icono: 'ciclo', color: C.verde,
    resumen: 'Prepara, revisa y publica los vídeos y posts de cinco canales. Un ciclo semanal, un repaso cada noche y una cola en la que nada sale sin revisión.',
    probar: 'Haz de Ada una semana: historias, cupo agotado, revisión de las 20:00 y publicación.',
    caso: [
      ['Problema', 'Llevar YouTube, Instagram, TikTok y LinkedIn con vídeos, portadas y textos cada día se come las tardes, y el día que algo falla, ese día no se publica.'],
      ['Qué hice', 'Ada, un sistema en n8n que trabaja en dos ciclos. Cada semana pide las historias a ChatGPT y prepara capítulos, reels, posts y campañas; cada noche repasa lo que ha pasado y, si merece la pena, prepara un vídeo de actualidad. ChatGPT escribe las historias y hace las imágenes, Google AI Studio pone las voces, y el montaje, los clips y las portadas salen de un motor de vídeo propio. Todo entra en una cola: la víspera a las 20:00 se comprueba portada, textos, hora, un máximo de tres publicaciones al día por red y que no se repita tema en 14 días, y llega un correo con un botón «Parar» por publicación.'],
      ['Resultado', 'Lo aprobado sale por Buffer y por la API de YouTube, y el vídeo se archiva solo. Un registro de errores y avisos: si se acaba el cupo de imágenes o de voces, apunta la hora y retoma el trabajo cuando vuelve a haber cupo; si una red falla, avisa para subirlo a mano. La revisión y los avisos ya funcionan; la publicación automática está en pruebas.']
    ],
    tec: ['n8n', 'API de OpenAI', 'Google AI Studio', 'Buffer', 'API de YouTube', 'rclone']
  },
  {
    id: 'clubbyte', corto: 'Club Byte', titulo: 'Club Byte: tecnología explicada a niños de 8 a 12 años',
    tipo: 'producto', etiqueta: 'Proyecto personal · animación 3D · 2026', icono: 'video', color: C.tostado,
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
      ['Resultado', 'Una decena de aplicaciones conviviendo en un servidor, botones de «Poner», «Pasar a PRO» y «Volver a la anterior», vuelta atrás automática en las apps que despliega el servidor y un agente que se actualiza solo cuando las pruebas están en verde.']
    ],
    tec: ['Python', 'FastAPI', 'Nginx', 'Keycloak', 'Docker', 'GitHub Actions', 'Cloudflare'],
    enlaces: [['Ver en GitHub', GITHUB + '/servidor']]
  },
  {
    id: 'sindri', corto: 'Sindri ERP', titulo: 'Sindri: ERP para pymes industriales',
    tipo: 'producto', etiqueta: 'Producto propio · open source · 2026', icono: 'fabrica', color: C.azul,
    resumen: 'ERP para fábricas pequeñas: pedidos, almacén con lotes, facturas para VERI*FACTU y la planta conectada con Efesto.',
    probar: 'Del comercial a la planta: oportunidad, pedido, hoja de ruta, palé con su lote y albarán.',
    texto: 'ERP para fábricas pequeñas: clientes, presupuestos, pedidos, hojas de ruta, albaranes, facturas preparadas para VERI*FACTU y almacén con lotes. Tiene versión de escritorio, se conecta a la planta con Efesto y a las ventas con Brokkr, el CRM. Recibe las horas de soporte por facturar desde Odin y genera sus PDF con Report Server.',
    tec: ['PostgreSQL (PGlite)', 'Electron', 'OPC UA', 'API REST', 'Docker'],
    enlaces: [['Ver en GitHub', GITHUB + '/sindri']]
  },
  {
    id: 'efesto', corto: 'Efesto, planta', titulo: 'Efesto: Sindri lee la fábrica',
    tipo: 'producto', etiqueta: 'Producto propio · parte de Sindri · 2026', icono: 'servidor', color: C.tostado,
    caso: [
      ['Problema', 'El estado de las máquinas, las piezas buenas y malas y las alarmas se quedan en cada PLC o SCADA, lejos del ERP, y conectarlos suele obligar a abrir puertos de la fábrica.'],
      ['Qué hice', 'Un agente de planta en solo lectura con 16 conectores: OPC UA, Modbus, Siemens S7, Rockwell, Beckhoff, Omron, MQTT, MTConnect, BACnet, SQL de históricos, ficheros y básculas, entre otros. La conexión sale de la fábrica, guarda y reenvía si se corta la red, y ni direcciones ni claves salen de la planta.'],
      ['Resultado', 'Probado con 22 máquinas simuladas: llegan a Sindri los 106 datos de 106. Si una máquina cae, las demás siguen. Pendiente de conectarlo a una fábrica real.']
    ],
    tec: ['Python', 'OPC UA', 'Modbus', 'Siemens S7', 'MQTT', 'SQLite', 'Docker'],
    enlaces: [['Ver en GitHub', GITHUB + '/sindri']]
  },
  {
    id: 'brokkr', corto: 'Brokkr CRM', titulo: 'Brokkr: el CRM para el comercial de una pyme industrial',
    tipo: 'producto', etiqueta: 'Producto propio · en proceso', icono: 'tablet', color: C.verde,
    texto: 'El CRM de la casa, en proceso. Va como módulo de Sindri, con los mismos clientes, presupuestos, pedidos y facturas, así nada se duplica. El objetivo: registrar una visita en menos de 30 segundos desde el móvil o la PDA, incluso sin cobertura; que la oportunidad se gane sola al confirmarse el pedido, y una línea de tiempo por cliente que junte llamadas, presupuestos, facturas, cobros e incidencias de Odin. El embudo, las actividades y los presupuestos ya funcionan dentro de Sindri; antes de seguir analicé 15 CRM libres.',
    tec: ['Módulo de Sindri', 'Fastify', 'PostgreSQL', 'React', 'Keycloak'],
    enlaces: [['Ver en GitHub', GITHUB + '/brokkr']]
  },
  {
    id: 'plantillas', corto: 'Plantillas de web', titulo: 'Plantillas de web para negocios locales',
    tipo: 'producto', etiqueta: 'Producto propio · 2026', icono: 'escritorio', color: C.tostado,
    texto: '28 webs de ejemplo con negocios inventados: hostelería, belleza, deporte, salud, mascotas, comercio y servicios. Cada una tiene su acción principal (reservar mesa, pedir cita, encargar o pedir presupuesto) y se prueba entera sin enviar nada. Pensadas primero para el móvil, con tipografías propias sin Google Fonts y sin estilos ni scripts en línea, así pasan una política de seguridad estricta. Llevan aviso legal y dicen claramente que el negocio es inventado. El catálogo se filtra por sector y sale del mismo generador que uso para las demos privadas de clientes.',
    tec: ['HTML y CSS', 'JavaScript sin dependencias', 'CSP estricta', 'Generador propio'],
    ver: true
  },
  {
    id: 'whatsapp', corto: 'IA para WhatsApp', titulo: 'Asistente de IA para WhatsApp',
    tipo: 'producto', etiqueta: 'Producto propio · en desarrollo', icono: 'chat', color: C.cielo,
    texto: 'Un asistente que atiende por WhatsApp a los clientes de un negocio: contesta las preguntas de siempre, da horarios y servicios, ayuda a pedir cita o hacer un pedido y pasa la conversación a una persona cuando hace falta. Solo con la API oficial de WhatsApp Business. Está en desarrollo.',
    tec: ['API oficial de WhatsApp Business', 'IA aplicada']
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
    id: 'crm', corto: 'Forja, citas', titulo: 'Forja: citas con tablet sin conexión',
    tipo: 'producto', etiqueta: 'Producto propio · en desarrollo', icono: 'tablet', color: C.cielo,
    caso: [
      ['Problema', 'Un negocio que gestiona citas de pacientes en hospitales trabajaba con una aplicación sobre hojas de cálculo que se quedaba corta, y en los hospitales no siempre hay cobertura.'],
      ['Qué hice', 'La reescribí como aplicación web con base de datos propia y una app de tablet que funciona sin conexión: guarda en local, encola los cambios y los sincroniza por eventos con control de versiones cuando vuelve la red.'],
      ['Resultado', 'Agenda, pacientes, servicios, cobros, documentos y alarmas en un solo sitio, con pantalla de conflictos para decidir cuando dos dispositivos cambian lo mismo. Desplegado en servidor propio.']
    ],
    tec: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'React Native', 'Docker']
  },
  {
    id: 'asistente', corto: 'Lin-AI, asistente', titulo: 'Lin-AI: asistente de IA sobre el ERP',
    tipo: 'empresa', etiqueta: 'Para Grupo SPSIL · 2026', icono: 'bot', color: C.tostado,
    resumen: 'Preguntas de negocio al ERP en lenguaje normal, con consultas cerradas para que no invente datos.',
    probar: 'Pregunta al ERP, mira qué consulta elige y descarga la respuesta.',
    texto: 'Un asistente que responde preguntas de negocio consultando el ERP en solo lectura. Cada tipo de consulta es una función cerrada; el modelo elige cuál usar y con qué parámetros, así no inventa datos. Se apoya en fichas de negocio editables que explican cómo se calcula cada cosa, y responde en texto o en Excel.',
    tec: ['Python', 'Agentes', 'Base de conocimiento', 'SQL Server']
  },
  {
    id: 'reporting', corto: 'Reporting BI', titulo: 'Reporting de ventas, cobros y stock',
    tipo: 'empresa', etiqueta: 'Para Grupo SPSIL · 2025–2026', icono: 'grafico', color: C.pizarra,
    resumen: 'Ventas, cobros y stock en Power BI, migrados a Microsoft Fabric y comprobados antes y después.',
    probar: 'Filtra, cambia de página y actualiza el modelo paso a paso.',
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
    tipo: 'empresa', etiqueta: 'Para un comercio · en desarrollo', icono: 'tienda', color: C.tostado,
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
    id: 'tareas', corto: 'Aris, tareas', titulo: 'Aris: tareas y proyectos para equipos',
    tipo: 'abierto', etiqueta: 'Open source · app web', icono: 'tablero', color: C.azul,
    resumen: 'Kanban, Scrum, wiki y calendario para equipos, con una API pensada para agentes de IA.',
    probar: 'Una incidencia de Odin llega como tarjeta y la llevas hasta «Hecho».',
    texto: 'Aplicación web para organizar el trabajo de un equipo: tableros Kanban y Scrum, calendario y agenda, wiki, notas, pizarra, SLA, notas entre personas, muros de actividad y una API pensada para agentes de IA. Es una versión base sin datos de ninguna empresa: la marca, el inicio de sesión (local o Keycloak) y los módulos opcionales se configuran en un fichero, y se instala con Docker y datos de demostración.',
    tec: ['Python', 'FastAPI', 'MariaDB', 'Keycloak', 'Docker'],
    enlaces: [['Ver en GitHub', GITHUB + '/aris']]
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
  ogDescripcion: 'Automatización, IA aplicada y datos para pymes e industria. Proyectos reales, cuadros de mando y open source.',
  locale: 'es_ES',
  idiomaNombre: 'Español',
  linkedinTitulo: 'Publicaciones en LinkedIn',
  linkedinDescripcion: 'Publicaciones de Henry Arce en LinkedIn sobre BI, datos e IA aplicada.',
  linkedinSub: 'Lo que escribo sobre BI, datos e IA aplicada',
  linkedinMarco: 'Publicación de LinkedIn',
  linkedinVer: 'Abrir en LinkedIn',
  linkedinFallo: 'LinkedIn no ha cargado esta publicación (a veces la bloquea el navegador). Puedes verla en LinkedIn con el enlace de abajo.',
  sinProyectos: 'Todavía no hay proyectos de este tipo. Si tienes uno en mente, cuéntamelo.',
  linkedinPerfil: 'Ver todas en mi perfil de LinkedIn',
  verPublicaciones: 'Leer las publicaciones aquí',
  saltar: 'Saltar al contenido',
  lema: 'automatización · IA · datos',
  secciones: 'Secciones',
  menu: { servicios: 'Servicios', arce: 'Arce Data Lab', proyectos: 'Proyectos', trayectoria: 'Trayectoria', tecnologias: 'Tecnologías', preguntas: 'Preguntas', contacto: 'Contacto' },
  otroIdioma: 'English',
  otroIdiomaAria: 'English version',
  antetitulo: 'Analista de datos y desarrollador · Alicante',
  lema2: 'LA MEDIDA ES LO MEJOR',
  h1: 'Automatizo procesos y pongo la IA a trabajar <em>con los datos del negocio.</em>',
  intro: 'Soy Henry Arce, analista de datos y desarrollador en Alicante, y fundador de <a href="sobre-mi/">Arce Data Lab</a>. Encuentro las tareas manuales de un equipo, las convierto en flujos, asistentes e informes, y mido lo que se gana. Desde 2019, primero en consultoras y ahora dentro de la industria.',
  fotoAlt: 'Henry Arce en la Ciudad de las Artes y las Ciencias de Valencia',
  areasAria: 'Áreas de trabajo',
  verProyectos: 'Ver proyectos',
  franja: '¿Tus números viven en Excel? Te los miro gratis en 45 minutos.',
  inicioBotones: ['Ver proyectos', 'Hablemos'],
  datosClave: [
    ['2019', 'trabajando con datos, de la consultora a la fábrica'],
    [String(PROYECTOS.length), 'proyectos documentados, con problema y resultado'],
    ['139.760', 'impresiones en mi publicación más leída de LinkedIn'],
    ['UE', 'servidores propios, con copias cada noche']
  ],
  queHago: 'Lo que puede ganar tu empresa',
  queHagoSub: 'De lo más sencillo a lo más completo. Se empieza por lo que más tiempo os quita.',
  nivelesNombres: ['Para empezar', 'Siguiente paso', 'Completo'],
  niveles: [
    ['flujo', 'Automatización de tareas', ['Avisos y correos que salen solos', 'Formularios y hojas que se rellenan sin copiar a mano', 'Procesos enteros entre ERP, CRM y correo']],
    ['bot', 'Asistentes de IA', ['Respuestas a las preguntas de siempre', 'Un asistente que busca en tus documentos', 'IA que consulta tu ERP sin inventar cifras']],
    ['grafico', 'Datos y Power BI', ['Tu Excel ordenado y con las cifras cuadradas', 'Un cuadro de mando con lo importante', 'Informes que se actualizan solos cada mañana']],
    ['escritorio', 'Aplicaciones a medida', ['Una web con reservas o citas', 'Un CRM o un gestor de incidencias', 'ERP y CRM conectados, con tu marca']]
  ],
  verServicios: 'Ver servicios',
  verTodos: 'Ver los {n} proyectos',
  verProyectosHechos: 'Ver proyectos hechos',
  serviciosTitulo: 'Servicios',
  serviciosDescripcion: 'Automatización con n8n, cuadros de mando de Power BI, asistentes de IA y webs a medida para pymes. Pide presupuesto sin compromiso.',
  whatsappDiagnostico: WHATSAPP_DIAGNOSTICO,
  proyectos: 'Proyectos',
  proyectosSub: 'Los principales se pueden probar en el laboratorio, con datos inventados. El resto, más abajo y en corto.',
  principales: 'Principales',
  masProyectos: 'Más proyectos',
  masSub: 'Pulsa en cualquiera para ver qué problema resolvía y cómo lo hice',
  enLab: 'En el laboratorio',
  verCaso: 'Ver el caso',
  tambien: 'También en el laboratorio',
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
  contacto: '¿Hablamos?',
  contactoSub: 'Si en tu equipo hay tareas que se repiten o datos que no cuadran, cuéntamelo',
  verPublicacion: 'Ver la publicación',
  telefono: 'también por WhatsApp',
  pie: 'Alicante, España',
  pieFrase: 'Datos, Power BI y desarrollo a medida para empresas que quieren decidir con números.',
  pieNav: 'La web',
  pieRedes: 'Redes',
  escribemeWhatsapp: 'Escríbeme por WhatsApp',
  cerrar: 'Cerrar',
  verFicha: 'Página completa del proyecto',
  volver: 'Volver a todos los proyectos',
  migas: 'Inicio',
  otrosProyectos: 'Otros proyectos',
  servicios: 'Servicios',
  serviciosSub: 'Qué puedo hacer por tu empresa, a través de Arce Data Lab',
  serviciosLista: [
    ['flujo', 'Automatización de procesos', 'Quito el trabajo manual que se repite: informes que se generan solos, datos que pasan de un programa a otro, avisos y correos automáticos.', 'n8n, Python, Power Automate, API', 'automatizacion-n8n'],
    ['grafico', 'Cuadros de mando y BI', 'Power BI y Microsoft Fabric sobre tu ERP o tus hojas de cálculo: ventas, cobros, stock y producción, con las cifras cuadradas y documentadas.', 'Power BI, DAX, Fabric, SQL', 'power-bi'],
    ['bot', 'Asistentes de IA sobre tus datos', 'Un asistente que responde preguntas del negocio consultando tus datos en solo lectura, sin inventar cifras, en texto o en Excel.', 'Agentes, Claude, OpenAI, SQL', ''],
    ['escritorio', 'Webs y aplicaciones a medida', 'ERP, CRM, citas, incidencias o una tienda: webs y aplicaciones con inicio de sesión, copias y despliegue en mi propia infraestructura.', 'Node.js, Python, Next.js, Docker', 'webs']
  ],
  verServicio: 'Ver el servicio',
  serviciosNota: 'Cada proyecto es distinto, así que no publico tarifas: cuéntame qué necesitas y te paso un presupuesto cerrado por escrito, sin compromiso. Si buscas una web, mira las <a href="' + CATALOGO_PLANTILLAS + '" data-dev="' + CATALOGO_PLANTILLAS_DEV + '">plantillas de ejemplo</a>.',
  serviciosCta: 'Pide presupuesto',
  serviciosPago: 'Se paga el 50 % al empezar y el 50 % a la entrega, por transferencia, tarjeta o Bizum, siempre con factura.',
  cinta: 'Automatización en marcha',
  cintaSub: 'Lo que hace un flujo automático, en pequeño',
  cintaPasos: [
    ['Entra el trabajo manual', 'Hojas de cálculo, correos y PDF que hoy alguien copia a mano.'],
    ['El flujo lo procesa', 'Lee, valida y cruza los datos sin que nadie toque nada.'],
    ['Sale el resultado', 'Informes, avisos y datos al día, cada mañana.']
  ],
  infra: 'Mi infraestructura',
  infraSub: 'Lo que tengo montado y mantengo yo, y donde viven mis aplicaciones y las de mis clientes',
  infraTexto: 'No dependo de plataformas cerradas: tengo un servidor propio con todo lo necesario para poner una aplicación en marcha con seguridad, probarla y pasarla a producción.',
  infraLista: [
    ['Servidor propio', 'Linux con Docker en Hetzner (Alemania, UE). Cada aplicación en su contenedor, detrás de un único proxy con HTTPS.'],
    ['Entornos DEV y PRO', 'Cada app se prueba antes de llegar a producción, con «Volver a la anterior» en un clic y vuelta atrás automática en las apps que despliega el propio servidor.'],
    ['Inicio de sesión único', 'Keycloak para todas las aplicaciones, con grupos por app y por entorno.'],
    ['Dominios y certificados', 'Nginx Proxy Manager con HTTPS de Let\'s Encrypt y, en los dominios que están en Cloudflare, el DNS se crea solo.'],
    ['Correo con marca', 'Servicio Mail sobre Resend: las apps envían desde ' + SOPORTE + ', con SPF, DKIM y DMARC.'],
    ['Documentos PDF', 'Report Server para facturas, pedidos y albaranes desde plantillas.'],
    ['Despliegue continuo', 'GitHub Actions construye cada versión y la publica en GitHub Container Registry.'],
    ['Copias y avisos', 'Copias nocturnas de las bases de datos de las apps principales y comprobación continua de que cada app responde.']
  ],
  infraEnlace: 'Ver la plataforma en GitHub',
  infraLeyenda: ['Proxy con HTTPS', 'Servidor', 'Apps en contenedores', 'Copia cada noche'],
  arce: 'Arce Data Lab',
  arceSub: 'Mi marca: datos, automatización e IA para pymes',
  clubbyteLinea: 'También hago <strong>Club Byte</strong>, un canal para que niños de 8 a 12 años se interesen por la tecnología:',
  arceTexto: '<strong>Arce Data Lab</strong> es el laboratorio desde el que construyo aplicaciones, cuadros de mando y asistentes de IA para pymes e industria, con su propia plataforma de despliegue, correo y documentos. Todo lo que ves en los proyectos marcados como producto propio vive allí.',
  arceEnlaces: [['Demos para clientes', DEMOS], ['TikTok @arcedatalab', TIKTOK]],
  clubbyteTitulo: 'Club Byte',
  clubbyteTexto: '<strong>Club Byte</strong> es un proyecto personal de animación 3D, aparte de Arce Data Lab: explica a niños y niñas de 8 a 12 años cómo funciona la informática con Lía, Teo y el robot Bit. Su hermano mayor, Byte, es el asistente de Arce Data Lab que te acompaña en esta página. Cada capítulo acaba con un reto sin pantalla para hacer en casa o en clase.',
  clubbyteEnlaces: [['YouTube @clubbyte_es', CLUBBYTE_YOUTUBE], ['Blog para familias y docentes', CLUBBYTE_BLOG]],
  bitAlt: 'Byte, el asistente de Arce Data Lab',
  preguntas: 'Preguntas frecuentes',
  preguntasSub: 'Lo que más me preguntan, en una frase cada una',
  faq: [
    ['¿Quién es Henry Arce?', 'Luis Henry Arce Inga, conocido como Henry Arce, es analista de datos y desarrollador en Alicante (España), especializado en automatización de procesos, IA aplicada y Power BI, y fundador de Arce Data Lab.'],
    ['¿Qué es Arce Data Lab?', 'Arce Data Lab es la marca de Henry Arce para construir aplicaciones a medida, cuadros de mando e integraciones con IA para pymes e industria; su web es arcedatalab.com.'],
    ['¿Qué servicios ofrece Arce Data Lab?', 'Automatización de procesos, cuadros de mando con Power BI y Microsoft Fabric, asistentes de IA sobre los datos del negocio y aplicaciones a medida (ERP, CRM, citas), desplegadas en infraestructura propia en la UE.'],
    ['¿Qué tipo de proyectos hace?', 'Automatiza tareas repetitivas, conecta ERP, CRM y bases de datos, crea informes de Power BI y Microsoft Fabric, y pone asistentes de IA a responder sobre los datos del negocio en solo lectura.'],
    ['¿Trabaja con pymes?', 'Sí: con pymes y fábricas que tienen tareas manuales o datos que no cuadran, en remoto o desde Alicante.'],
    ['¿Mis datos están seguros?', 'Sí: se trabaja con acceso de solo lectura cuando es posible y las aplicaciones viven en servidores de la UE con copias cada noche.'],
    ['¿Dónde publica contenido?', 'En LinkedIn sobre BI, datos e IA aplicada, en TikTok (@arcedatalab) con consejos rápidos de automatización y datos, y en Instagram (@henry_arce_dev). Pronto también en YouTube, en el canal Imagina en IT.'],
    ['¿Cómo contactar?', 'Por correo a ' + CORREO + ', por WhatsApp al ' + TELEFONO + ' o por LinkedIn; para soporte de las aplicaciones, ' + SOPORTE + '.']
  ],
  faqServicios: [
    ['¿Cuánto cuesta un proyecto?', 'Depende de cuántas fuentes de datos haya, de cómo estén y de lo que haya que construir. Cuéntame tu caso y te paso un presupuesto cerrado por escrito, sin compromiso.'],
    ['¿Cuánto tarda?', 'Depende mucho de cada caso: de cuántas fuentes de datos hay, de cómo están y de lo que haga falta construir. Por eso el plazo se cierra por escrito después del diagnóstico gratis, cuando ya he visto tus datos, y se cumple.'],
    ['¿Cómo se empieza?', 'Me escribes por WhatsApp o por correo, vemos tu caso (si hace falta, en una videollamada gratis de 45 minutos) y te paso el presupuesto por escrito.']
  ],
  soporte: 'Soporte de las aplicaciones',
  bit: {
    nombre: 'Byte, el asistente de Arce Data Lab',
    hola: 'Hola, soy Byte, el asistente de Arce Data Lab. Te acompaño por la web y te resumo cada proyecto.',
    servicios: 'Si en tu empresa una tarea se repite cada semana, probablemente se puede automatizar.',
    infraestructura: 'Esta web y las aplicaciones de los clientes funcionan aquí: contenedores, HTTPS y copias cada noche.',
    arcedatalab: 'Arce Data Lab desarrolla software, cuadros de mando y asistentes de IA para pymes.',
    proyectos: 'Abre cualquier proyecto y te resumo el problema, la solución y el resultado.',
    ficha: 'Resumen del proyecto.',
    jugar: ['Mientras lees, reviso los datos.', 'Comprobación de sistemas: todo en orden.', 'Sigo aquí. Avísame si quieres un resumen.', 'Revisando que todas las aplicaciones respondan.'],
    dormir: 'Modo de ahorro de energía. Mueve el ratón y vuelvo.',
    despertar: 'De vuelta. ¿En qué te ayudo?',
    cinta: 'Así funciona una automatización: entran datos manuales y sale un informe listo, sin intervención.',
    trayectoria: 'Consultoría, banca e industria: experiencia con datos reales y plazos reales.',
    tecnologias: 'Herramientas probadas en producción, elegidas según el caso.',
    preguntas: 'Respuestas breves a lo que más se pregunta antes de empezar un proyecto.',
    contacto: '¿Hablamos de tu caso? Escribe a ' + CORREO + ' y Henry te responde.',
    pulsar: ['Aquí estoy. Si me haces doble clic, le dejo un mensaje a Henry.', '¿Te resumo algún proyecto? Abre cualquiera.', 'Consejo: empieza automatizando la tarea que más tiempo te quita.', 'Si los datos no cuadran, casi siempre hay una causa que se puede corregir.', 'Un byte son 8 bits. Un buen proceso, cero tareas repetidas.'],
    mensaje: {
      titulo: 'Déjale un mensaje a Henry',
      sub: 'Byte lo prepara y se abre tu correo o WhatsApp con todo escrito. No se guarda nada en esta web.',
      nombre: 'Tu nombre', empresa: 'Empresa (opcional)', texto: '¿En qué te puede ayudar?',
      ejemplo: 'Ej.: cada lunes copiamos las ventas del ERP a un Excel y tardamos 3 horas.',
      correo: 'Enviar por correo', whatsapp: 'Enviar por WhatsApp', cerrar: 'Cerrar',
      vacio: 'Escribe al menos una frase para que Henry sepa qué necesitas.',
      abriendo: 'Abriendo tu aplicación…',
      listo: 'Listo: revisa la ventana que se ha abierto y pulsa enviar allí. Henry suele contestar en el día.',
      fallo: '¿No se ha abierto nada? Copia el mensaje y mándalo a ',
      copiar: 'Copiar mensaje', copiado: 'Copiado',
      asunto: 'Mensaje desde arcedatalab.com', hola: 'Hola Henry, soy'
    },
    ocultar: 'Ocultar a Byte',
    mostrar: 'Mostrar a Byte',
    canal: 'Ver Club Byte'
  }
};

// Textos comunes de las páginas de cada servicio, la calculadora y el laboratorio.
UI.serv = {
  incluye: 'Qué incluye',
  como: 'Cómo trabajamos',
  relacionados: 'Proyectos relacionados',
  otros: 'Otros servicios',
  calcular: 'Calcular el precio',
  relacionado: 'Servicio relacionado',
  probar: 'Probarlo en el laboratorio',
  antesAhora: 'Antes y después',
  antesAhoraSub: 'El mismo contenido, rediseñado: la portada de mis demos para clientes. Arrastra la línea para comparar.',
  antes: 'Antes', ahora: 'Ahora',
  antesAlt: 'Portada de las demos antes del rediseño',
  ahoraAlt: 'Portada de las demos después del rediseño',
  plantillas: 'Ver plantillas de ejemplo',
  verPlantillas: 'Ver las plantillas',
  plantillasSub: '28 webs de ejemplo con negocios inventados, para que veas estilos antes de empezar.',
  deslizar: 'Comparar antes y después',
  pasos: [
    ['Diagnóstico gratis', '45 minutos por videollamada para ver tus datos, tus tareas y lo que de verdad te quita tiempo.'],
    ['Propuesta por escrito', 'Qué se construye, cuántas rondas de cambios, el precio cerrado y el plazo, que se fija cuando ya he visto los datos.'],
    ['Construcción', 'Te enseño avances por el camino. Se paga el 50 % al empezar y el 50 % a la entrega, siempre con factura.'],
    ['Entrega y formación', 'Lo dejo funcionando, documentado y explicado a tu equipo. Si quieres, sigo con un mantenimiento mensual.']
  ]
};

// «¿Por qué trabajar conmigo?»: hechos comprobables, sin frases de folleto.
UI.porque = {
  titulo: '¿Por qué trabajar conmigo?',
  sub: 'Lo que cambia frente a contratar una agencia o un programa genérico',
  lista: [
    ['Hablas con quien lo hace', 'Quien te escucha en el diagnóstico es quien diseña, programa y te entrega el trabajo. Sin comerciales ni intermediarios.'],
    ['Conozco el día a día de una empresa', 'Trabajo con datos desde 2019, primero en consultoras y hoy dentro de la industria, con ERP como A3, SAP o Clavei.'],
    ['Precio cerrado y por escrito', 'Antes de empezar sabes qué se construye, cuántas rondas de cambios hay y cuánto cuesta. Sin sorpresas al final.'],
    ['Tus datos, cuidados', 'Trabajo en solo lectura siempre que se puede y las aplicaciones viven en servidores de la UE con copias cada noche.'],
    ['Sin atarte a mí', 'Te entrego el trabajo documentado y mucho de lo que hago es open source: puedes ver cómo trabajo antes de llamarme.'],
    ['Mido lo que se gana', 'Apunto cuánto tiempo lleva hoy la tarea y cuánto después, para que sepas si ha merecido la pena.']
  ]
};

// Portada simple (26/10/2026): un mensaje por bloque y un solo botón,
// «Pide presupuesto», que abre WhatsApp. Sin precios en ningún sitio.
const WHATSAPP_PRESUPUESTO = WHATSAPP + '?text=' + encodeURIComponent('Hola Henry, quiero pedir presupuesto para mi empresa. Te cuento: ');
UI.p = {
  menu: { hacemos: 'Qué hacemos', lab: 'Laboratorio', proyectos: 'Proyectos', sobre: 'Sobre mí' },
  cta: 'Pide presupuesto',
  ctaHref: WHATSAPP_PRESUPUESTO,
  carruselAria: 'Lo que hace Arce Data Lab',
  anterior: 'Mensaje anterior',
  siguiente: 'Mensaje siguiente',
  pausar: 'Pausar el pase',
  seguir: 'Reanudar el pase',
  diapo: 'Mensaje {n} de {t}',
  carrusel: [
    { ante: 'Analista de datos y desarrollador · Alicante', titulo: 'Automatizo procesos y pongo la IA a trabajar con los datos del negocio.', texto: 'Soy Henry Arce, fundador de Arce Data Lab. Encuentro las tareas manuales de un equipo, las convierto en flujos, asistentes e informes, y mido lo que se gana.', boton: 'Pide presupuesto', href: 'cta', img: 'img/ada/cabecera.svg', alt: 'Ada en el centro, conectada con el ERP Sindri en el PC, las tareas de Aris en la tablet, la PDA de Efesto, las campañas en el móvil, y un informe, la agenda y una incidencia de Odin flotando' },
    { ante: 'Sindri · Brokkr · Efesto', titulo: 'ERP, CRM y planta, hablando entre sí.', texto: 'Lo que cierra el comercial llega al ERP, y la fábrica lo produce y lo registra sin copiar nada.', boton: 'Probarlo en el laboratorio', href: 'lab/#efesto', img: 'img/ada/efesto.webp', alt: 'Efesto: máquinas de la planta conectadas con Sindri' },
    { ante: 'Datos y reporting', titulo: 'Tus números, al día cada mañana.', texto: 'Un cuadro de mando con las cifras cuadradas que se actualiza solo, sin copiar Excel.', boton: 'Ver un informe de ejemplo', href: 'lab/#reporting', img: 'img/ada/informe.webp', alt: 'Informe comercial de ejemplo con ventas por mes y mejores clientes' }
  ],
  lab: {
    titulo: 'Pruébalo en el laboratorio',
    sub: 'Ada y los productos con los que trabajo, con datos inventados. No se guarda nada.',
    pestanas: [
      ['Ada', 'ada', 'pedidos', 'Cada departamento tiene sus puestos (recepción, gestión, supervisión y registro) y se pasan el trabajo hasta el ERP. Tú solo revisas lo que no está claro.', 'sindri'],
      ['Sindri · ERP', 'sindri', 'sindri', 'Pedidos, almacén con lotes, fabricación y facturas preparadas para VERI*FACTU.', 'sindri'],
      ['Brokkr · CRM', 'brokkr', 'brokkr', 'El comercial trabaja en la tablet y lo que cierra llega solo al ERP.', 'brokkr'],
      ['Efesto · planta', 'efesto', 'efesto', 'Lee las máquinas de la fábrica y lleva la producción al ERP, aunque se corte la red.', 'efesto'],
      ['Aris · tareas', 'aris', 'aris', 'Kanban, sprints y wiki para tu equipo. Las incidencias de Odin entran como tareas.', 'tareas'],
      ['Reporting', 'reporting', 'informe', 'Ventas, cobros y stock en Power BI, al día cada mañana.', 'reporting']
    ],
    alt: '{o} en el laboratorio',
    boton: 'Probarlo en el laboratorio',
    todos: 'Ver todos los proyectos'
  },
  hacemos: {
    titulo: 'Qué hacemos',
    lista: [
      ['escritorio', 'Software de gestión', 'ERP, CRM, tareas e incidencias a la medida de tu empresa, o conectados a los que ya usas.', 'servicios/webs/'],
      ['grafico', 'Datos y reporting', 'Power BI y Fabric sobre tu ERP o tus Excel, con las cifras cuadradas y al día.', 'servicios/power-bi/'],
      ['flujo', 'Automatización', 'Correos, pedidos, avisos e informes que pasan solos entre tus programas.', 'servicios/automatizacion-n8n/']
    ],
    ver: 'Saber más'
  },
  pasos: {
    titulo: 'Cómo empezamos',
    lista: [
      ['Me cuentas tu caso', 'Por WhatsApp o en una videollamada gratis de 45 minutos.'],
      ['Te paso el presupuesto', 'Por escrito: qué se hace, cuánto cuesta y para cuándo.'],
      ['Lo dejo funcionando', 'Documentado y explicado a tu equipo.']
    ]
  },
  faq: [
    ['¿Cuánto cuesta?', 'Depende de lo que haya que construir. Cuéntame tu caso y te paso un presupuesto cerrado por escrito, sin compromiso.'],
    ['¿Trabajas con pymes?', 'Sí: con pymes y fábricas que tienen tareas manuales o datos que no cuadran, en remoto o desde Alicante.'],
    ['¿Mis datos están seguros?', 'Se trabaja en solo lectura siempre que se puede y las aplicaciones viven en servidores de la UE con copias cada noche.'],
    ['¿Qué es Arce Data Lab?', 'Es mi marca: el laboratorio desde el que construyo automatizaciones, cuadros de mando, asistentes de IA y aplicaciones a medida para pymes e industria.']
  ],
  final: {
    titulo: 'Cuéntame tu caso',
    texto: 'Si en tu equipo hay tareas que se repiten o datos que no cuadran, escríbeme y te paso presupuesto sin compromiso.',
    cliente: '¿Ya eres cliente?',
    clienteTexto: 'Para dudas o incidencias con tu aplicación, escribe a soporte y te respondo en el día.',
    clienteBoton: 'Escribir a soporte'
  },
  sobre: {
    titulo: 'Sobre mí',
    descripcion: 'Henry Arce, analista de datos y desarrollador en Alicante: trayectoria, tecnologías, infraestructura propia y lo que escribo en LinkedIn.',
    sub: 'Soy Henry Arce, analista de datos y desarrollador en Alicante, y fundador de Arce Data Lab. Trabajo con datos desde 2019, primero en consultoras y hoy dentro de la industria.'
  },
  todosTitulo: 'Todos los proyectos',
  todosDescripcion: 'Proyectos de Henry Arce y Arce Data Lab: ERP, CRM, asistentes de IA, automatizaciones y cuadros de mando, con el problema que resolvían y el resultado.'
};

// Laboratorio de demos (carpeta lab/, lo compila el hilo de demos): botón
// «Probarlo» en las fichas de estos proyectos. El enlace es relativo
// (…/lab/#id) para que funcione igual en DEV (/web/lab/) y en arcedatalab.com/lab/.
const LAB_DEMOS = ['ada', 'sindri', 'brokkr', 'efesto', 'tareas', 'servicios', 'reporting', 'asistente'];

// Una página por servicio, en /servicios/<id>/. El título es lo que escribe el
// cliente en Google. proyectos: ids de PROYECTOS que se enlazan desde aquí (y
// que enlazan de vuelta a este servicio).
const SERVICIOS = [
  {
    id: 'power-bi', icono: 'grafico',
    proyectos: ['reporting', 'escritorio', 'comercial', 'grafo', 'reader', 'themelab', 'calculate'],
    titulo: 'Consultor de Power BI para pymes | Arce Data Lab',
    corto: 'Power BI',
    h1: 'Consultor de Power BI para pymes',
    descripcion: 'Cuadros de mando de Power BI sobre tu ERP, Excel o SQL, con las cifras cuadradas y actualizados cada mañana. Pide presupuesto sin compromiso.',
    intro: 'Si los números de tu empresa viven en varios Excel y cada mes alguien pasa horas juntándolos, un cuadro de mando de Power BI lo hace solo. Lo conecto a tu ERP, a tus hojas o a tu base de datos, cuadro las cifras con contabilidad y te lo entrego documentado.',
    incluye: [
      ['Datos ordenados', 'Limpieza y modelo de datos con Power Query: una sola versión de cada cifra, aunque venga de varios sitios.'],
      ['Medidas DAX', 'Ventas, márgenes, cobros, stock o producción, comparados con el año anterior y con tus objetivos.'],
      ['Diseño claro', 'Páginas pensadas para decidir: lo importante arriba, filtros sencillos y versión para el móvil.'],
      ['Actualización sola', 'El informe se refresca cada mañana con la puerta de enlace, sin que nadie copie nada.'],
      ['Documentación', 'Qué mide cada cifra y de dónde sale, para que tu equipo confíe en ella y la pueda mantener.']
    ],
    tec: 'Power BI, DAX, Power Query, Microsoft Fabric, SQL Server, A3 ERP, SharePoint',
    // Lotes de análisis: paquetes de informes por área, cada uno con su demo en lab/#<id>.
    lotesTitulo: 'Lotes de análisis',
    lotesIntro: 'Informes ya pensados por área, que adapto a tu ERP y a tus nombres. Empiezas por el lote que más te duele y añades los demás cuando quieras. Pruébalos con datos inventados en el laboratorio.',
    lotesBoton: 'Probar el ejemplo',
    lotes: [
      ['bi-comercial', 'Comercial', 'Para dirección y comerciales', '¿Vendemos más que el año pasado, quién nos debe y qué hay que pedir?',
        ['Ventas por mes, cliente y familia frente al año anterior', 'Cobros por antigüedad y días medios de cobro', 'Stock bajo mínimo y rotación']],
      ['bi-fabricacion', 'Fabricación y OEE', 'Para el jefe de planta', '¿Dónde pierden tiempo las máquinas y por qué?',
        ['OEE con disponibilidad, rendimiento y calidad, por máquina y línea', 'Paradas menores y mayores por día, causa y máquina, con el tiempo medio entre paradas', 'Horas perdidas por producto']],
      ['bi-pedidos', 'Pedidos y entregas', 'Para logística y atención al cliente', '¿Cuántos pedidos llegan a tiempo y por qué se retrasan los demás?',
        ['% a tiempo por semana, almacén y transporte', 'Retrasos por motivo y por cliente', 'Pedidos en curso con su estado']],
      ['bi-calidad', 'Calidad y scrap', 'Para calidad y producción', '¿Cuántas piezas tiramos, cuánto nos cuesta y por qué?',
        ['% de scrap por mes y centro de trabajo', 'Piezas rechazadas por defecto y coste del scrap', 'Real frente a previsto por referencia y órdenes con más scrap']]
    ],
    faq: [
      ['¿Cuánto cuesta un dashboard de Power BI?', 'Depende de las fuentes de datos, del número de páginas y de los cálculos. Cuéntame tu caso y te paso un presupuesto cerrado por escrito, sin compromiso.'],
      ['¿Qué es un lote de análisis?', 'Un conjunto de páginas de Power BI pensado para un área (ventas, planta, logística o calidad) con sus indicadores ya definidos. Lo conecto a tus datos y lo ajusto a cómo trabajas, así no se empieza de cero. Cuéntame qué lotes te interesan y te paso un presupuesto cerrado.'],
      ['¿Necesito licencia de Power BI?', 'Para hacer y ver el informe en tu ordenador basta Power BI Desktop, que es gratis. Para compartirlo en la web con tu equipo hace falta Power BI Pro, que se paga a Microsoft por usuario.'],
      ['¿Funciona con mi ERP?', 'He trabajado con A3 ERP, SAP, Clavei, Cybermax y SQL Server. Si tu ERP guarda los datos en una base de datos o los exporta a Excel, se puede conectar.'],
      ['¿Puedo cambiarlo yo después?', 'Sí. Te lo entrego documentado y te explico cómo está hecho. Si prefieres no tocarlo, hay mantenimiento mensual.']
    ]
  },
  {
    id: 'automatizacion-n8n', icono: 'flujo',
    proyectos: ['ada', 'whatsapp', 'helpdesk', 'outlook', 'gateway', 'servicios', 'nifi', 'asistente'],
    titulo: 'Automatización de procesos con n8n para empresas | Arce Data Lab',
    corto: 'Automatización con n8n',
    h1: 'Automatización de procesos con n8n',
    descripcion: 'Automatizo con n8n las tareas que tu equipo repite cada semana: correos, avisos, pedidos, facturas e informes que pasan solos entre ERP, CRM, Excel y correo.',
    intro: 'Copiar pedidos del correo al ERP, mandar el mismo aviso cada lunes o pasar datos de una hoja a otra no aporta nada y se equivoca a menudo. Con n8n lo convierto en un flujo que lo hace solo, con avisos si algo falla, y lo instalo en un servidor en la UE.',
    incluye: [
      ['Mapa de la tarea', 'Vemos juntos qué se hace a mano, cuántas veces y cuánto tiempo se lleva, para empezar por lo que más rinde.'],
      ['El flujo en n8n', 'Conectado a tus programas: correo, Excel o Google Sheets, ERP, CRM, formularios, WhatsApp o cualquier API.'],
      ['Pruebas con datos reales', 'Antes de ponerlo en marcha, con tus casos raros incluidos.'],
      ['Avisos si algo falla', 'Si un paso no sale bien, te llega un aviso con lo que ha pasado, en vez de un error en silencio.'],
      ['Una hora de formación', 'Para que tu equipo sepa qué hace el flujo y cómo pararlo o cambiarlo.']
    ],
    tec: 'n8n, Python, Power Automate, Apps Script, API REST, webhooks',
    faq: [
      ['¿Qué es n8n?', 'n8n es una herramienta de automatización que conecta programas entre sí con flujos visuales. Se puede instalar en tu propio servidor, así tus datos no salen de la UE.'],
      ['¿Qué tareas se pueden automatizar?', 'Las que se repiten y siguen siempre los mismos pasos: copiar datos entre programas, enviar avisos o correos, generar informes o PDF, revisar formularios y clasificar mensajes.'],
      ['¿Cuánto cuesta una automatización?', 'Depende de cuántas aplicaciones se conectan y de los casos especiales. Cuéntame tu caso y te paso un presupuesto cerrado por escrito.'],
      ['¿Qué pasa si cambia un programa?', 'El flujo avisa cuando algo deja de funcionar y se ajusta. Con el mantenimiento mensual, lo hago yo.']
    ]
  },
  {
    id: 'webs', icono: 'escritorio', antesAhora: true,
    proyectos: ['plantillas', 'tienda', 'crm', 'sindri', 'brokkr', 'gestor', 'tareas', 'nutricion', 'plataforma'],
    titulo: 'Diseño de webs y aplicaciones a medida para pymes | Arce Data Lab',
    corto: 'Webs y aplicaciones',
    h1: 'Webs y aplicaciones a medida para pymes',
    descripcion: 'Webs rápidas y aplicaciones a medida para pymes: reservas, tienda online, CRM o incidencias, con tu marca y en servidores de la UE.',
    intro: 'Una web que carga rápido, sale en Google y deja que el cliente reserve o compre sin llamarte. O una aplicación hecha para cómo trabaja tu empresa, en vez de adaptarte tú a un programa genérico. La hago, la publico en mi propia infraestructura y la mantengo.',
    incluye: [
      ['Diseño con tu marca', 'Adaptado al móvil, accesible y sin plantillas pesadas.'],
      ['SEO desde el principio', 'Títulos, datos estructurados, mapa del sitio y velocidad, para que Google la entienda.'],
      ['Lo que necesites dentro', 'Reservas y citas, tienda, formularios, área de clientes, CRM o un panel de gestión.'],
      ['Servidor en la UE', 'HTTPS, copias cada noche y entornos de prueba y producción.'],
      ['Textos legales', 'Aviso legal, privacidad y cookies, adaptados a lo que hace tu web.']
    ],
    tec: 'HTML y CSS, Node.js, Next.js, Python, PostgreSQL, Docker',
    faq: [
      ['¿Cuánto cuesta una web?', 'Depende de las páginas y de lo que tenga que hacer: no es lo mismo una web de presentación que una con reservas o tienda. Cuéntame qué necesitas y te paso un presupuesto cerrado por escrito.'],
      ['¿Usas WordPress?', 'No por defecto: hago webs a medida, más rápidas y con menos mantenimiento de seguridad. Si ya tienes WordPress y te funciona, lo miramos.'],
      ['¿Dónde se aloja?', 'En mi servidor en Alemania (UE), con HTTPS, copias cada noche y comprobación continua de que responde. También puedo dejarla en tu propio hosting.'],
      ['¿Puedo cambiar los textos yo?', 'Si lo necesitas, la web lleva un panel sencillo para cambiar textos y fotos; si no, me lo pides y lo cambio con el mantenimiento mensual.']
    ]
  }
];

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
  { t: UI, areas: AREAS, proyectos: PROYECTOS, servicios: SERVICIOS, trayectoria: TRAYECTORIA, tecnologias: TECNOLOGIAS, carpeta: '', base: '', otro: 'en/' },
  {
    t: Object.assign({}, EN.UI, {
      arceEnlaces: UI.arceEnlaces.map((e, i) => [EN.UI.arceEnlacesTextos[i], e[1]]),
      clubbyteEnlaces: UI.clubbyteEnlaces.map((e, i) => [EN.UI.clubbyteEnlacesTextos[i], e[1]]),
      datosClave: UI.datosClave.map((x, i) => [i === 1 ? x[0] : EN.UI.datosClave[i][0], EN.UI.datosClave[i][1]]),
      serv: EN.SERV,
      porque: EN.PORQUE,
      p: EN.PORTADA
    }),
    servicios: SERVICIOS.map(s => {
      if (!EN.SERVICIOS[s.id]) throw new Error('Falta la traducción del servicio ' + s.id + ' en contenido.en.js');
      return Object.assign({}, s, EN.SERVICIOS[s.id]);
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
    sameAs: [LINKEDIN, GITHUB, TIKTOK, INSTAGRAM]
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
    sameAs: [TIKTOK, INSTAGRAM, LINKEDIN],
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
        mainEntity: t.p.faq.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } }))
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
          { '@type': 'ListItem', position: 2, name: t.proyectos, item: inicio + 'proyectos/' },
          { '@type': 'ListItem', position: 3, name: plano(p.corto) }
        ]
      },
      persona(d)
    ]
  };
}

// Orden de los proyectos en la portada: primero los que más dicen a una pyme
// (datos, IA, ERP); Club Byte, al final. Los demás, en el orden de PROYECTOS.
const DESTACADOS = ['reporting', 'asistente', 'sindri', 'tareas', 'efesto', 'brokkr', 'plantillas', 'whatsapp', 'gestor', 'servicios', 'crm', 'gateway', 'escritorio', 'tienda', 'plataforma'];

// Proyectos principales: tarjeta grande con su demo del laboratorio. El primero
// ocupa todo el ancho. Los demás proyectos salen en la lista corta de debajo.
// RELACIONADOS: otras demos que se enseñan dentro de la tarjeta de un principal.
const PRINCIPALES = ['ada', 'sindri', 'asistente', 'reporting', 'tareas'];
const RELACIONADOS = { sindri: ['efesto', 'brokkr'] };

// Logos propios de algunas apps: salen en su tarjeta en lugar del pictograma.
const LOGOS = { sindri: 'img/logo-sindri.webp', gestor: 'img/logo-odin.webp', tareas: 'img/logo-aris.webp', brokkr: 'img/logo-brokkr.webp' };

// Logo de Arce Data Lab: media hoja de arce con el nombre encima, a la manera
// del de NERV, y el lema de Cleóbulo («la medida es lo mejor»). Va en línea
// para que use la tipografía de la página.
const HOJA_ARCE = 'M0,-150 L12,-120 L27,-129 L24,-93 L33,-69 L51,-84 L60,-75 L90,-114 L96,-87 L126,-96 L114,-60 L135,-51 L96,-21 L63,-12 L87,6 L93,24 L66,24 L72,42 L39,33 L12,45 L7.5,45 L7.5,114 L0,114 Z';
function logoArce(lema) {
  return '<svg class="logo-arce" viewBox="-12 -162 330 290" role="img" aria-label="Arce Data Lab">' +
    '<path class="logo-hoja" d="' + HOJA_ARCE + '"/>' +
    '<text class="logo-nombre" x="18" y="18">ARCE</text>' +
    '<text class="logo-lab" x="22" y="56">DATA LAB</text>' +
    '<text class="logo-lema" x="22" y="88">ΜΕΤΡΟΝ ΑΡΙΣΤΟΝ</text>' +
    '<text class="logo-lema" x="22" y="108">' + lema + '</text></svg>';
}
const AL_FINAL = ['clubbyte'];

function enPortada(lista) {
  const peso = p => DESTACADOS.includes(p.id) ? DESTACADOS.indexOf(p.id) : AL_FINAL.includes(p.id) ? 1000 : 100 + lista.indexOf(p);
  return lista.slice().sort((a, b) => peso(a) - peso(b));
}

// Botón al catálogo de plantillas. En DEV, js/bit-arranque.js lo cambia por data-dev.
function botonPlantillas(t) {
  return '<p class="probar"><a class="boton" href="' + CATALOGO_PLANTILLAS + '" data-dev="' + CATALOGO_PLANTILLAS_DEV + '">' + t.serv.verPlantillas + '</a></p>';
}

function cara(p, base, tam) {
  return LOGOS[p.id] ? '<img class="tesela-logo" src="' + (base || '') + LOGOS[p.id] + '" alt="" width="' + tam + '" height="' + tam + '" loading="lazy">' : icono(p.icono);
}

function principal(p, t, todos, base) {
  const rel = (RELACIONADOS[p.id] || []).map(id => todos.find(o => o.id === id)).filter(Boolean);
  return '      <article class="principal' + (p.id === PRINCIPALES[0] ? ' ancha' : '') + '" style="--c:' + p.color + '">\n' +
    '        <span class="tesela-cara principal-cara">' + cara(p, base, 76) + '</span>\n' +
    '        <div class="principal-cuerpo">\n' +
    '          <p class="principal-etiqueta">' + p.etiqueta + '</p>\n' +
    '          <h3>' + p.titulo + '</h3>\n' +
    '          <p>' + p.resumen + '</p>\n' +
    '          <p class="principal-lab"><b>' + t.enLab + ':</b> ' + p.probar + '</p>\n' +
    (rel.length ? '          <p class="principal-rel">' + t.tambien + ': ' + rel.map(o => '<a href="' + base + 'lab/#' + o.id + '">' + o.corto + '</a>').join(' · ') + '</p>\n' : '') +
    '          <p class="principal-botones"><a class="boton" href="' + base + 'lab/#' + p.id + '">' + t.serv.probar + '</a>' +
    '<button type="button" class="ver-caso" data-detalle="d-' + p.id + '">' + t.verCaso + ' →</button></p>\n' +
    '        </div>\n      </article>';
}

function mini(p, t, base) {
  return '        <li><button type="button" class="mini" data-tipo="' + p.tipo + '" data-detalle="d-' + p.id + '" style="--c:' + p.color + '">' +
    '<span class="tesela-cara">' + cara(p, base, 40) + '</span>' +
    '<span class="mini-texto"><b>' + p.corto + '</b><span>' + t.tipos[p.tipo] + '</span></span></button></li>';
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
    (LAB_DEMOS.includes(p.id) ? '      <p class="probar"><a class="boton" href="' + base + 'lab/#' + p.id + '">' + t.serv.probar + '</a></p>\n' : '') +
    (p.ver ? '      ' + botonPlantillas(t) + '\n' : '') +
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
  <link rel="preload" href="${p.raiz}fuentes/robotoflex-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${p.raiz}css/estilos.css?v=${VERSION_CSS}">
</head>

<body>
  <a class="saltar" href="#contenido">${t.saltar}</a>

  <header class="cabecera">
    <a class="marca" href="${p.inicio}#inicio">${hojita()}Henry Arce <span>${t.lema}</span></a>
    <nav class="menu" aria-label="${t.secciones}">
      <a href="${p.inicio}servicios/"${p.ruta.startsWith('servicios/') ? ' aria-current="page"' : ''}>${t.p.menu.hacemos}</a>
      <a class="menu-extra" href="${p.raiz}lab/#sindri">${t.p.menu.lab}</a>
      <a href="${p.inicio}proyectos/"${p.ruta.startsWith('proyectos/') ? ' aria-current="page"' : ''}>${t.p.menu.proyectos}</a>
      <a class="menu-extra" href="${p.inicio}sobre-mi/"${p.ruta === 'sobre-mi/' ? ' aria-current="page"' : ''}>${t.p.menu.sobre}</a>
      <a class="idioma" href="${p.otro}" lang="${t.lang === 'es' ? 'en' : 'es'}" hreflang="${t.lang === 'es' ? 'en' : 'es'}" aria-label="${t.otroIdiomaAria}">${t.otroIdioma}</a>
      <a class="menu-cta" href="${t.p.ctaHref}" target="_blank" rel="noopener">${t.p.cta}</a>
    </nav>
  </header>
`;
}

function pagina(d) {
  const t = d.t;
  const base = d.base;
  const p = t.p;
  const enlace = h => h === 'cta' ? p.ctaHref : base + h;
  const fuera = h => h === 'cta' ? ' target="_blank" rel="noopener"' : '';
  const n = p.carrusel.length;

  return cabeza(d, { titulo: t.titulo, descripcion: t.descripcion, ogDescripcion: t.ogDescripcion, ruta: '', raiz: base, inicio: '', otro: d.otro, datos: datosPortada(d) }) + `
  <main id="contenido" class="portadilla simple">
    <section class="heroe" id="inicio" aria-roledescription="carrusel" aria-label="${p.carruselAria}">
      <div class="heroe-pista">
${p.carrusel.map((s, i) => `        <article class="heroe-diapo${i === 0 ? ' activa' : ''}" id="diapo${i}" aria-roledescription="diapositiva" aria-label="${attr(p.diapo.replace('{n}', i + 1).replace('{t}', n))}"${i === 0 ? '' : ' aria-hidden="true"'}>
          <div class="heroe-imagen${s.img === 'logo' ? ' heroe-logo' : ''}">${s.img === 'logo' ? logoArce(t.lema2) : '<img src="' + base + s.img + '" alt="' + attr(s.alt) + '" width="969" height="603"' + (i === 0 ? '' : ' loading="lazy"') + '>'}</div>
          <div class="heroe-texto">
            <p class="heroe-ante">${s.ante}</p>
            ${i === 0 ? '<h1>' + s.titulo + '</h1>' : '<p class="heroe-titulo">' + s.titulo + '</p>'}
            <p class="heroe-intro">${s.texto}</p>
            <p class="botones"><a class="boton grande" href="${enlace(s.href)}"${fuera(s.href)}${i === 0 ? '' : ' tabindex="-1"'}>${s.boton}</a></p>
          </div>
        </article>`).join('\n')}
      </div>
      <button type="button" class="heroe-flecha heroe-ant" aria-label="${p.anterior}" hidden>‹</button>
      <button type="button" class="heroe-flecha heroe-sig" aria-label="${p.siguiente}" hidden>›</button>
      <div class="heroe-mandos" hidden>
${p.carrusel.map((s, i) => '        <button type="button" class="heroe-punto' + (i === 0 ? ' activo' : '') + '" data-ir="' + i + '" aria-label="' + attr(p.diapo.replace('{n}', i + 1).replace('{t}', n)) + '"' + (i === 0 ? ' aria-current="true"' : '') + '></button>').join('\n')}
        <button type="button" class="heroe-pausa" data-pausar="${attr(p.pausar)}" data-seguir="${attr(p.seguir)}" aria-label="${p.pausar}"><span aria-hidden="true">❚❚</span></button>
      </div>
    </section>

    <section class="bloque simple-bloque" id="laboratorio" data-bit="proyectos">
      <h2 class="titular">${p.lab.titulo}</h2>
      <p class="sub centrada">${p.lab.sub}</p>
      <div class="pestanas" role="tablist" aria-label="${p.lab.titulo}">
${p.lab.pestanas.map((o, i) => '        <button type="button" role="tab" class="pestana" id="pest-' + o[1] + '" aria-controls="ofi-' + o[1] + '" aria-selected="' + (i === 0) + '"' + (i === 0 ? '' : ' tabindex="-1"') + '>' + o[0] + '</button>').join('\n')}
      </div>
${p.lab.pestanas.map((o, i) => `      <div class="oficina" role="tabpanel" id="ofi-${o[1]}" aria-labelledby="pest-${o[1]}"${i === 0 ? '' : ' hidden'}>
        <img src="${base}img/ada/${o[2]}.webp" alt="${attr(p.lab.alt.replace('{o}', o[0]))}" loading="lazy">
        <div class="oficina-texto">
          <h3>${o[0]}</h3>
          <p>${o[3]}</p>
          <p class="enlace-flecha"><a href="${base}lab/#${o[4]}">${p.lab.boton} →</a></p>
        </div>
      </div>`).join('\n')}
      <p class="botones centrados"><a class="boton secundario" href="${base}proyectos/">${p.lab.todos}</a></p>
    </section>

    <section class="bloque simple-bloque" id="que-hacemos" data-bit="servicios">
      <h2 class="titular">${p.hacemos.titulo}</h2>
      <div class="tres">
${p.hacemos.lista.map(x => '        <article class="tres-item"><span class="tres-icono">' + icono(x[0]) + '</span><h3>' + x[1] + '</h3><p>' + x[2] + '</p><p class="enlace-flecha"><a href="' + base + x[3] + '">' + p.hacemos.ver + ' →</a></p></article>').join('\n')}
      </div>
      <p class="botones centrados"><a class="boton grande" href="${p.ctaHref}" target="_blank" rel="noopener">${p.cta}</a></p>
    </section>

    <section class="bloque simple-bloque tostado" id="como">
      <h2 class="titular">${p.pasos.titulo}</h2>
      <ol class="pasos-simple">
${p.pasos.lista.map((x, i) => '        <li><span class="paso-num">' + (i + 1) + '</span><h3>' + x[0] + '</h3><p>' + x[1] + '</p></li>').join('\n')}
      </ol>
    </section>

    <section class="bloque simple-bloque" id="preguntas" data-bit="preguntas">
      <h2 class="titular">${t.preguntas}</h2>
      <div class="acordeon">
${p.faq.map(f => '        <details><summary>' + f[0] + '</summary><p>' + f[1] + '</p></details>').join('\n')}
      </div>
    </section>

    <section class="final" id="contacto" data-bit="contacto">
      <div class="final-dentro">
        <article class="final-tarjeta">
          <h2>${p.final.titulo}</h2>
          <p>${p.final.texto}</p>
          <p class="botones"><a class="boton grande" href="${p.ctaHref}" target="_blank" rel="noopener">${p.cta}</a></p>
          <p class="final-otros"><a href="mailto:${CORREO}">${CORREO}</a> · <a href="tel:${TELEFONO.replace(/\s/g, '')}">${TELEFONO}</a></p>
        </article>
        <article class="final-tarjeta">
          <h2>${p.final.cliente}</h2>
          <p>${p.final.clienteTexto}</p>
          <p class="botones"><a class="boton contorno grande" href="mailto:${SOPORTE}">${p.final.clienteBoton}</a></p>
          <p class="final-otros"><a href="mailto:${SOPORTE}">${SOPORTE}</a></p>
        </article>
      </div>
    </section>
  </main>

  ${pie(t, base, '')}

${bitHtml(t, base)}
  <script src="${base}js/portada.js?v=${VERSION_JS_PORTADA}" defer></script>
  <script src="${base}js/app.js?v=${VERSION_JS}"></script>
</body>
</html>
`;
}

// Página /proyectos/: todos los proyectos, con los principales arriba, los
// filtros y la ficha que se abre al pulsar (lo que antes iba en la portada).
function paginaProyectos(d) {
  const t = d.t;
  const raiz = '../' + d.base;
  const url = SITIO + (d.carpeta ? d.carpeta + '/' : '') + 'proyectos/';
  return cabeza(d, {
    titulo: t.p.todosTitulo + ' · Henry Arce', descripcion: attr(t.p.todosDescripcion), ogDescripcion: attr(t.p.todosDescripcion), ogTipo: 'website',
    ruta: 'proyectos/', raiz: raiz, inicio: '../', otro: '../' + d.otro + 'proyectos/',
    datos: { '@context': 'https://schema.org', '@graph': [
      { '@type': 'CollectionPage', '@id': url, url: url, name: plano(t.p.todosTitulo), inLanguage: t.lang, isPartOf: { '@id': ID_WEB }, about: { '@id': ID_PERSONA } },
      { '@type': 'ItemList', name: t.proyectos, itemListElement: d.proyectos.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: urlProyecto(d, p), name: plano(p.titulo) })) }
    ] }
  }) + `
  <main id="contenido" class="portadilla">
    <section class="bloque" id="proyectos" data-bit="proyectos">
      <h1>${t.p.todosTitulo}</h1>
      <p class="sub">${t.proyectosSub}</p>

      <h2 class="proyectos-grupo">${t.principales}</h2>
      <div class="principales">
${PRINCIPALES.map(id => principal(d.proyectos.find(p => p.id === id), t, d.proyectos, raiz)).join('\n')}
      </div>

      <h2 class="proyectos-grupo">${t.masProyectos}</h2>
      <p class="sub">${t.masSub}</p>
      <div class="filtros" role="group" aria-label="${t.filtrosAria}">
        <button type="button" class="filtro activo" data-filtro="todos">${t.todos}</button>
        <button type="button" class="filtro" data-filtro="empresa">${t.tipos.empresa}</button>
        <button type="button" class="filtro" data-filtro="producto">${t.tipos.producto}</button>
        <button type="button" class="filtro" data-filtro="abierto">${t.tipos.abierto}</button>
      </div>

      <ul class="minis">
${enPortada(d.proyectos).filter(p => !PRINCIPALES.includes(p.id)).map(p => mini(p, t, raiz)).join('\n')}
      </ul>
      <p class="sin-proyectos" id="sinProyectos" role="status" hidden>${t.sinProyectos} <a href="${t.p.ctaHref}" target="_blank" rel="noopener">${t.p.cta} →</a></p>
    </section>

${d.proyectos.map(p => detalle(p, t, raiz)).join('\n')}
  </main>

  ${pie(t, raiz, '../')}

  <dialog class="ficha" id="ficha" aria-labelledby="fichaTitulo">
    <div class="ficha-cabecera" id="fichaCabecera"></div>
    <div class="ficha-cuerpo" id="fichaCuerpo"></div>
    <button type="button" class="ficha-cerrar" id="fichaCerrar" aria-label="${t.cerrar}">×</button>
  </dialog>

${bitHtml(t, raiz)}
  <script src="${raiz}js/app.js?v=${VERSION_JS}"></script>
</body>
</html>
`;
}

// Página /sobre-mi/: lo que antes alargaba la portada (trayectoria,
// tecnologías, infraestructura, Arce Data Lab y divulgación), sin el 3D.
function paginaSobreMi(d) {
  const t = d.t;
  const raiz = '../' + d.base;
  const url = SITIO + (d.carpeta ? d.carpeta + '/' : '') + 'sobre-mi/';
  return cabeza(d, {
    titulo: t.p.sobre.titulo + ' · Henry Arce', descripcion: attr(t.p.sobre.descripcion), ogDescripcion: attr(t.p.sobre.descripcion),
    ruta: 'sobre-mi/', raiz: raiz, inicio: '../', otro: '../' + d.otro + 'sobre-mi/',
    datos: { '@context': 'https://schema.org', '@graph': [
      { '@type': 'AboutPage', '@id': url, url: url, name: plano(t.p.sobre.titulo), inLanguage: t.lang, isPartOf: { '@id': ID_WEB }, about: { '@id': ID_PERSONA }, mainEntity: { '@id': ID_PERSONA } },
      persona(d)
    ] }
  }) + `
  <main id="contenido" class="portadilla sobre-mi">
    <section class="bloque">
      <h1>${t.p.sobre.titulo}</h1>
      <p class="sub">${t.p.sobre.sub}</p>
      <div class="marcas">
        <article class="marca-tarjeta">
          <h2>Arce Data Lab</h2>
          <p>${t.arceTexto}</p>
          <p class="enlaces">${t.arceEnlaces.map(e => '<a href="' + e[1] + '" target="_blank" rel="noopener">' + e[0] + '</a>').join('')}</p>
        </article>
      </div>
    </section>

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

    <section class="bloque" id="infraestructura" data-bit="infraestructura">
      <h2>${t.infra}</h2>
      <p class="sub">${t.infraSub}</p>
      <p class="infra-texto">${t.infraTexto}</p>
      <dl class="infra">
${t.infraLista.map(x => '        <div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>').join('\n')}
      </dl>
      <p class="mas"><a href="${GITHUB}/servidor" target="_blank" rel="noopener">${t.infraEnlace}</a> · <a href="../proyectos/plataforma/">${t.verFicha}</a></p>
    </section>

    <section class="bloque" id="divulgacion">
      <h2>${t.divulgacion}</h2>
      <p class="sub">${t.divulgacionSub}</p>
      <div class="cifras">
${t.cifras.map((c, i) => '        <div><strong>' + c[0] + '</strong><span>' + c[1] + '</span>' + (PUBLICACIONES[i] ? '<a href="' + PUBLICACIONES[i] + '" target="_blank" rel="noopener">' + t.verPublicacion + '</a>' : '') + '</div>').join('\n')}
      </div>
      <p class="mas"><a href="../linkedin/">${t.verPublicaciones}</a></p>
      <p class="botones"><a class="boton grande" href="${t.p.ctaHref}" target="_blank" rel="noopener">${t.p.cta}</a></p>
    </section>
  </main>

  ${pie(t, raiz, '../')}

${bitHtml(t, raiz)}
  <script src="${raiz}js/app.js?v=${VERSION_JS}"></script>
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

      <div class="embebidas" data-a-la-vez="${LINKEDIN_A_LA_VEZ}" data-fallo="${attr(t.linkedinFallo)}">
${LINKEDIN_PUBLICACIONES.map((p, i) => '        <figure class="embebida"' + (i >= LINKEDIN_A_LA_VEZ ? ' hidden' : '') + '>\n          <iframe src="' + p.marco + '" height="' + p.alto + '" title="' + t.linkedinMarco + ' ' + (i + 1) + '" loading="lazy" allowfullscreen></iframe>\n          <figcaption><a href="' + p.enlace + '" target="_blank" rel="noopener">' + t.linkedinVer + '</a></figcaption>\n        </figure>').join('\n')}
      </div>

      <p class="mas"><a href="${LINKEDIN}" target="_blank" rel="noopener">${t.linkedinPerfil}</a></p>
    </section>
  </main>

  ${pie(t, '../' + d.base, '../')}

  <script src="${'../' + d.base}js/linkedin.js?v=${VERSION_JS_LINKEDIN}"></script>
</body>
</html>
`;
}

// Página /servicios/: lo que se ofrece y desde cuánto. La portada no enseña
// precios; quien los quiera ver llega aquí desde el menú o el contacto.
function paginaServicios(d) {
  const t = d.t;
  const url = SITIO + (d.carpeta ? d.carpeta + '/' : '') + 'servicios/';

  return cabeza(d, {
    titulo: t.serviciosTitulo + ' · Henry Arce', descripcion: t.serviciosDescripcion, ogDescripcion: t.serviciosDescripcion, ogTipo: 'website',
    ruta: 'servicios/', raiz: '../' + d.base, inicio: '../', otro: '../' + d.otro + 'servicios/',
    datos: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', '@id': url, url: url, name: plano(t.serviciosTitulo), inLanguage: t.lang, isPartOf: { '@id': ID_WEB }, about: { '@id': ID_ORG } },
        { '@type': 'FAQPage', '@id': url + '#preguntas', inLanguage: t.lang, mainEntity: t.faqServicios.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) },
        persona(d)
      ]
    }
  }) + `
  <main id="contenido" class="pagina-servicios">
    <section class="bloque">
      <h1>${t.serviciosTitulo}</h1>
      <p class="sub">${t.serviciosSub}</p>

      <div class="servicios">
${t.serviciosLista.map(x => '        <article class="servicio">' + icono(x[0]) + '<h3>' + (x[4] ? '<a href="' + x[4] + '/">' + x[1] + '</a>' : x[1]) + '</h3><p>' + x[2] + '</p><p class="tec">' + x[3] + '</p>' + (x[4] ? '<p class="precio"><a href="' + x[4] + '/">' + t.verServicio + ' →</a></p>' : '') + '</article>').join('\n')}
      </div>
      <p class="servicios-nota">${t.serviciosNota}</p>
      <p class="servicios-nota">${t.serviciosPago}</p>
      <p class="botones centrados"><a class="boton" href="${t.whatsappDiagnostico}" target="_blank" rel="noopener">${t.serviciosCta}</a><a class="boton secundario" href="mailto:${CORREO}">${CORREO}</a></p>
    </section>
${porqueHtml(t)}
    <section class="bloque">
      <h2>${t.preguntas}</h2>
      <dl class="preguntas">
${t.faqServicios.map(f => '        <div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>').join('\n')}
      </dl>
      <p class="mas"><a href="../proyectos/">${t.verProyectosHechos} →</a></p>
    </section>
  </main>

  ${pie(t, '../' + d.base, '../')}
</body>
</html>
`;
}

// Páginas legales (/privacidad/ y /condiciones/), solo en español: se escriben
// en legal/*.md y aquí se pasan a HTML. Las piden TikTok, Google y Meta para
// dar acceso a sus API.
const LEGALES = [
  { ruta: 'privacidad/', fichero: 'legal/privacidad.md', es: 'Privacidad', en: 'Privacy' },
  { ruta: 'condiciones/', fichero: 'legal/condiciones.md', es: 'Condiciones', en: 'Terms' }
];

// Enlaces del pie a las páginas legales. raiz: camino hasta la raíz del sitio.
// La hoja de Arce en pequeño, para la cabecera y el pie.
function hojita() {
  return '<svg class="hojita" viewBox="-6 -156 148 276" aria-hidden="true" focusable="false"><path d="' + HOJA_ARCE + '"/></svg>';
}

// Pie común: marca, navegación, redes y legal.
function pie(t, raiz, inicio) {
  const col = (titulo, enlaces) => '<div class="pie-col"><h2>' + titulo + '</h2><ul>' + enlaces.map(e => '<li>' + e + '</li>').join('') + '</ul></div>';
  const fuera = (url, txt) => '<a href="' + url + '" target="_blank" rel="noopener">' + txt + '</a>';
  return `<footer class="pie">
    <div class="pie-dentro">
      <div class="pie-marca">
        <a class="marca" href="${inicio}#inicio">${hojita()}Henry Arce</a>
        <p>${t.pieFrase}</p>
        <p><a href="mailto:${CORREO}">${CORREO}</a><br><a href="tel:${TELEFONO.replace(/\s/g, '')}">${TELEFONO}</a></p>
      </div>
      ${col(t.pieNav, [
        '<a href="' + inicio + 'servicios/">' + t.p.menu.hacemos + '</a>',
        '<a href="' + raiz + 'lab/#sindri">' + t.p.menu.lab + '</a>',
        '<a href="' + inicio + 'proyectos/">' + t.p.menu.proyectos + '</a>',
        '<a href="' + inicio + 'sobre-mi/">' + t.p.menu.sobre + '</a>',
        '<a href="' + inicio + '#contacto">' + t.menu.contacto + '</a>'
      ])}
      ${col(t.menu.servicios, SERVICIOS.map(x => '<a href="' + inicio + 'servicios/' + x.id + '/">' + (t.lang === 'en' ? EN.SERVICIOS[x.id].corto : x.corto) + '</a>'))}
      ${col(t.pieRedes, [fuera(LINKEDIN, 'LinkedIn'), fuera(WHATSAPP, 'WhatsApp'), fuera(INSTAGRAM, 'Instagram'), fuera(TIKTOK, 'TikTok'), fuera(GITHUB, 'GitHub')])}
      ${col('Legal', LEGALES.map(l => '<a href="' + raiz + l.ruta + '">' + (t.lang === 'en' ? l.en : l.es) + '</a>'))}
    </div>
    <p class="pie-final">© <span id="anio">${new Date().getFullYear()}</span> Henry Arce · ${t.pie}</p>
  </footer>`;
}

// Markdown sencillo (títulos, párrafos, listas, negrita y enlaces) a HTML.
function markdown(texto, raiz) {
  const enLinea = x => x
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, txt, url) => url.startsWith('/')
      ? '<a href="' + raiz + url.slice(1) + '">' + txt + '</a>'
      : '<a href="' + url + '" target="_blank" rel="noopener">' + txt + '</a>');
  const html = [];
  let lista = null;
  const cerrar = () => { if (lista) { html.push('</' + lista + '>'); lista = null; } };
  texto.split('\n').forEach(linea => {
    let m;
    if (!linea.trim()) { cerrar(); return; }
    if ((m = linea.match(/^(#{1,3}) (.*)/))) { cerrar(); const n = m[1].length; html.push('<h' + n + '>' + enLinea(m[2]) + '</h' + n + '>'); return; }
    if ((m = linea.match(/^- (.*)/))) { if (lista !== 'ul') { cerrar(); lista = 'ul'; html.push('<ul>'); } html.push('<li>' + enLinea(m[1]) + '</li>'); return; }
    if ((m = linea.match(/^\d+\. (.*)/))) { if (lista !== 'ol') { cerrar(); lista = 'ol'; html.push('<ol>'); } html.push('<li>' + enLinea(m[1]) + '</li>'); return; }
    cerrar();
    html.push('<p>' + enLinea(linea) + '</p>');
  });
  cerrar();
  return html.join('\n      ');
}

function paginaLegal(l) {
  const d = IDIOMAS[0];
  const texto = fs.readFileSync(path.join(__dirname, l.fichero), 'utf8');
  const titulo = (texto.match(/^# (.*)/m) || [])[1] || l.es;
  const url = SITIO + l.ruta;
  return cabeza(d, {
    titulo: titulo + ' · Arce Data Lab', descripcion: titulo + ' de arcedatalab.com y de las herramientas de Arce Data Lab.', ogDescripcion: titulo + ' de Arce Data Lab.', ogTipo: 'website',
    ruta: l.ruta, raiz: '../', inicio: '../', otro: '../',
    datos: { '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', '@id': url, url: url, name: titulo, inLanguage: 'es', isPartOf: { '@id': ID_WEB } }] }
  }) + `
  <main id="contenido">
    <article class="bloque legal">
      ${markdown(texto, '../')}
    </article>
  </main>

  ${pie(d.t, '../', '../')}
</body>
</html>
`;
}

// Bit, el robot de Club Byte, como acompañante. La página funciona igual sin
// él: primero se ve su foto y, cuando la página ya está quieta, js/bit-arranque.js
// carga el 3D (js/bit.js + img/bit.glb). Ver bit/README.md.
const VERSION_JS_BIT3D = huella('js/bit.js');

function bitHtml(t, base) {
  const guion = Object.assign({}, t.bit, { correoDestino: CORREO, whatsappDestino: WHATSAPP });
  const m = t.bit.mensaje;
  return `  <aside class="bit" id="bit" data-paseo="libre" aria-label="${t.bit.nombre}" data-modelo="${base}img/bit.glb?v=${huella('img/bit.glb')}" data-js="${base}js/bit.js?v=${VERSION_JS_BIT3D}">
    <p class="bit-bocadillo" id="bitBocadillo" role="status" aria-live="polite" hidden></p>
    <div class="bit-cuerpo" id="bitCuerpo">
      <img class="bit-foto" src="${base}img/bit.webp" alt="" width="104" height="160">
      <canvas class="bit-lienzo" id="bitLienzo" aria-hidden="true" hidden></canvas>
    </div>
    <button type="button" class="bit-boton" id="bitBoton" aria-expanded="true" aria-controls="bitCuerpo" title="${t.bit.ocultar}">×</button>
  </aside>
  <dialog class="byte-mensaje" id="byteMensaje" aria-labelledby="byteMensajeTitulo">
    <form method="dialog" novalidate>
      <h2 id="byteMensajeTitulo">${m.titulo}</h2>
      <p class="sub">${m.sub}</p>
      <label>${m.nombre}<input name="nombre" autocomplete="name" maxlength="80"></label>
      <label>${m.empresa}<input name="empresa" autocomplete="organization" maxlength="80"></label>
      <label>${m.texto}<textarea name="texto" rows="4" maxlength="1200" placeholder="${attr(m.ejemplo)}" required></textarea></label>
      <p class="byte-estado" id="byteEstado" role="status" aria-live="polite"></p>
      <p class="botones">
        <button type="button" class="boton" data-via="correo">${m.correo}</button>
        <button type="button" class="boton secundario" data-via="whatsapp">${m.whatsapp}</button>
      </p>
      <button type="submit" class="byte-mensaje-cerrar" aria-label="${m.cerrar}">×</button>
    </form>
  </dialog>
  <script type="application/json" id="bitGuion">${jsonLd(guion)}</script>
  <script src="${base}js/bit-arranque.js?v=${VERSION_JS_BIT}"></script>
  <script src="${base}js/bit-paseo.js?v=${VERSION_JS_PASEO}"></script>
  <script src="${base}js/cinta-arranque.js?v=${VERSION_JS_CINTA}"></script>`;
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
    <nav class="migas" aria-label="Breadcrumb"><a href="../../">${t.migas}</a> › <a href="../">${t.proyectos}</a> › <span>${p.corto}</span></nav>

    <article class="bloque proyecto" data-bit="proyectos">
      <div class="proyecto-cabecera" style="--c:${p.color}">${icono(p.icono)}</div>
      <p class="etiqueta">${p.etiqueta}</p>
      <h1>${p.titulo}</h1>
      ${cuerpo}
      ${tec}${enlaces}
      ${LAB_DEMOS.includes(p.id) ? '<p class="probar"><a class="boton" href="' + raiz + 'lab/#' + p.id + '">' + t.serv.probar + '</a></p>' : ''}${p.ver ? botonPlantillas(t) : ''}
      ${servicioDe(d, p.id) ? '<p class="proyecto-servicio">' + t.serv.relacionado + ': <a href="../../servicios/' + servicioDe(d, p.id).id + '/">' + servicioDe(d, p.id).h1 + '</a></p>' : ''}
      <p class="proyecto-contacto">${t.contactoSub}: <a href="mailto:${CORREO}">${CORREO}</a></p>
    </article>

    <section class="bloque">
      <h2>${t.otrosProyectos}</h2>
      <ul class="otros">
${otros.map(o => '        <li><a href="../' + o.id + '/">' + o.titulo + '</a> <span>· ' + t.tipos[o.tipo] + '</span></li>').join('\n')}
      </ul>
      <p class="mas"><a href="../">${t.volver}</a></p>
    </section>
  </main>

  ${pie(t, raiz, '../../')}

${bitHtml(t, raiz)}
</body>
</html>
`;
}

// ---------- Páginas de cada servicio ----------

function porqueHtml(t) {
  const p = t.porque;
  return `
    <section class="bloque porque" id="por-que">
      <h2>${p.titulo}</h2>
      <p class="sub">${p.sub}</p>
      <ol class="porque-lista">
${p.lista.map(x => '        <li><strong>' + x[0] + '</strong><span>' + x[1] + '</span></li>').join('\n')}
      </ol>
    </section>
`;
}

function antesAhoraHtml(t, raiz) {
  const s = t.serv;
  return `
    <section class="bloque" id="antes-ahora">
      <h2>${s.antesAhora}</h2>
      <p class="sub">${s.antesAhoraSub}</p>
      <figure class="antes-ahora" style="--pos:50%">
        <img class="aa-ahora" src="${raiz}img/antes-ahora/demos-ahora.webp" alt="${s.ahoraAlt}" width="640" height="760" loading="lazy">
        <img class="aa-antes" src="${raiz}img/antes-ahora/demos-antes.webp" alt="${s.antesAlt}" width="640" height="760" loading="lazy">
        <span class="aa-etiqueta aa-e-antes" aria-hidden="true">${s.antes}</span>
        <span class="aa-etiqueta aa-e-ahora" aria-hidden="true">${s.ahora}</span>
        <input type="range" min="0" max="100" value="50" aria-label="${s.deslizar}">
      </figure>
      <p class="sub">${s.plantillasSub}</p>
      <p class="botones"><a class="boton secundario" href="${CATALOGO_PLANTILLAS}" data-dev="${CATALOGO_PLANTILLAS_DEV}">${s.plantillas}</a></p>
    </section>
    <script src="${raiz}js/antes-ahora.js?v=${VERSION_JS_ANTES}" defer></script>
`;
}

// El servicio al que pertenece un proyecto (para enlazar de vuelta), o nada.
function servicioDe(d, id) {
  return d.servicios.find(s => s.proyectos.includes(id));
}

// Lotes de análisis de un servicio: tarjetas con su pregunta, lo que trae y el enlace a su demo.
function lotesHtml(s, raiz) {
  return `
    <section class="bloque" id="lotes">
      <h2>${s.lotesTitulo}</h2>
      <p class="sub lotes-intro">${s.lotesIntro}</p>
      <div class="lotes">
${s.lotes.map(l => `        <article class="lote">
          <p class="lote-para">${l[2]}</p>
          <h3>${l[1]}</h3>
          <p class="lote-pregunta">${l[3]}</p>
          <ul>${l[4].map(x => '<li>' + x + '</li>').join('')}</ul>
          <p class="enlace-flecha"><a href="${raiz}lab/#${l[0]}">${s.lotesBoton} →</a></p>
        </article>`).join('\n')}
      </div>
    </section>
`;
}

function paginaServicio(d, s) {
  const t = d.t;
  const ruta = 'servicios/' + s.id + '/';
  const url = SITIO + (d.carpeta ? d.carpeta + '/' : '') + ruta;
  const inicio = SITIO + (d.carpeta ? d.carpeta + '/' : '');
  const raiz = '../../' + d.base;
  const proyectos = s.proyectos.map(id => d.proyectos.find(p => p.id === id)).filter(Boolean);
  const otros = d.servicios.filter(o => o.id !== s.id);

  return cabeza(d, {
    titulo: s.titulo, descripcion: attr(s.descripcion), ogDescripcion: attr(s.descripcion), ogTipo: 'website',
    ruta: ruta, raiz: raiz, inicio: '../../', otro: '../../' + d.otro + ruta,
    datos: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', '@id': url, url: url, name: plano(s.h1), description: plano(s.descripcion), inLanguage: t.lang, isPartOf: { '@id': ID_WEB }, about: { '@id': url + '#servicio' }, breadcrumb: { '@id': url + '#migas' } },
        { '@type': 'Service', '@id': url + '#servicio', name: plano(s.h1), serviceType: plano(s.corto), description: plano(s.descripcion), url: url, provider: { '@id': ID_ORG }, areaServed: [{ '@type': 'Country', name: 'España' }, { '@type': 'Place', name: 'Unión Europea' }], availableLanguage: ['es', 'en'] },
        { '@type': 'BreadcrumbList', '@id': url + '#migas', itemListElement: [
          { '@type': 'ListItem', position: 1, name: plano(t.migas), item: inicio },
          { '@type': 'ListItem', position: 2, name: plano(t.serviciosTitulo), item: inicio + 'servicios/' },
          { '@type': 'ListItem', position: 3, name: plano(s.corto), item: url }
        ] },
        { '@type': 'FAQPage', '@id': url + '#preguntas', inLanguage: t.lang, mainEntity: s.faq.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) }
      ]
    }
  }) + `
  <main id="contenido" class="pagina-servicios pagina-servicio">
    <nav class="migas" aria-label="Breadcrumb"><a href="../../">${t.migas}</a> › <a href="../">${t.serviciosTitulo}</a> › <span>${s.corto}</span></nav>

    <section class="bloque servicio-cabeza">
      <span class="servicio-icono">${icono(s.icono)}</span>
      <h1>${s.h1}</h1>
      <p class="sub">${s.intro}</p>
      <p class="botones"><a class="boton" href="${t.whatsappDiagnostico}" target="_blank" rel="noopener">${t.serviciosCta}</a></p>
    </section>

    <section class="bloque">
      <h2>${t.serv.incluye}</h2>
      <div class="servicios servicio-incluye">
${s.incluye.map(x => '        <article class="servicio"><h3>' + x[0] + '</h3><p>' + x[1] + '</p></article>').join('\n')}
      </div>
      <p class="servicios-nota">${s.tec}</p>
    </section>
${s.lotes ? lotesHtml(s, raiz) : ''}
    <section class="bloque">
      <h2>${t.serv.como}</h2>
      <ol class="pasos-servicio">
${t.serv.pasos.map(x => '        <li><strong>' + x[0] + '</strong><span>' + x[1] + '</span></li>').join('\n')}
      </ol>
    </section>
${s.antesAhora ? antesAhoraHtml(t, raiz) : ''}${porqueHtml(t)}
    <section class="bloque">
      <h2>${t.serv.relacionados}</h2>
      <ul class="otros">
${proyectos.map(p => '        <li><a href="../../proyectos/' + p.id + '/">' + p.titulo + '</a> <span>· ' + t.tipos[p.tipo] + '</span></li>').join('\n')}
      </ul>
    </section>

    <section class="bloque">
      <h2>${t.preguntas}</h2>
      <dl class="preguntas">
${s.faq.map(f => '        <div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>').join('\n')}
      </dl>
      <h2 class="otros-servicios">${t.serv.otros}</h2>
      <p class="botones">${otros.map(o => '<a class="boton secundario" href="../' + o.id + '/">' + o.corto + '</a>').join('')}<a class="boton secundario" href="../">${t.serviciosTitulo}</a></p>
    </section>
  </main>

  ${pie(t, raiz, '../../')}

${bitHtml(t, raiz)}
</body>
</html>
`;
}

// sitemap.xml con las dos versiones de cada página enlazadas entre sí.
function sitemap() {
  const rutas = ['', 'proyectos/', 'sobre-mi/'].concat(['servicios/']).concat(SERVICIOS.map(x => 'servicios/' + x.id + '/')).concat(['linkedin/']).concat(PROYECTOS.map(p => 'proyectos/' + p.id + '/'));
  const entrada = ruta => ['', 'en/'].map(pre =>
    '  <url>\n    <loc>' + SITIO + pre + ruta + '</loc>\n    <lastmod>' + REVISADO + '</lastmod>\n' +
    '    <xhtml:link rel="alternate" hreflang="es" href="' + SITIO + ruta + '"/>\n' +
    '    <xhtml:link rel="alternate" hreflang="en" href="' + SITIO + 'en/' + ruta + '"/>\n' +
    '    <xhtml:link rel="alternate" hreflang="x-default" href="' + SITIO + ruta + '"/>\n  </url>').join('\n');
  const legal = l => '  <url>\n    <loc>' + SITIO + l.ruta + '</loc>\n    <lastmod>' + REVISADO + '</lastmod>\n  </url>';
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    rutas.map(entrada).join('\n') + '\n' + legal({ ruta: 'plantillas/' }) + '\n' + LEGALES.map(legal).join('\n') + '\n</urlset>\n';
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
    '- Perfiles: LinkedIn ' + LINKEDIN + ' · GitHub ' + GITHUB + ' · TikTok ' + TIKTOK + ' · Instagram ' + INSTAGRAM,
    '- Club Byte (' + CLUBBYTE_BLOG + ') es un proyecto personal de animación 3D para niños, aparte de Arce Data Lab: no es un servicio ni una marca de la empresa.', '',
    '## Servicios'
  ].concat(UI.serviciosLista.map(x => '- **' + x[1] + '**: ' + plano(x[2]) + (x[4] ? ' Más: ' + SITIO + 'servicios/' + x[4] + '/' : '')))
   .concat(['', '## Infraestructura propia']).concat(UI.infraLista.map(x => '- **' + x[0] + '**: ' + plano(x[1])))
   .concat(['', '## Proyectos']).concat(PROYECTOS.map(p => '- [' + plano(p.titulo) + '](' + urlProyecto(es, p) + '): ' + resumen(p)))
   .concat(['', '## Preguntas frecuentes']).concat(UI.faq.concat(UI.faqServicios).map(f => '- **' + f[0] + '** ' + plano(f[1])))
   .concat(['', '## Trayectoria']).concat(TRAYECTORIA.map(x => '- ' + plano(x[0]) + ': ' + plano(x[1]) + ', ' + plano(x[2])))
   .concat(['', '## Otras páginas', '- [English version](' + SITIO + 'en/)', '- [Servicios](' + SITIO + 'servicios/)', '- [Proyectos](' + SITIO + 'proyectos/)', '- [Sobre mí](' + SITIO + 'sobre-mi/)', '- [Laboratorio de demos](' + SITIO + 'lab/)'])
   .concat(SERVICIOS.map(x => '- [' + plano(x.h1) + '](' + SITIO + 'servicios/' + x.id + '/)'))
   .concat(['- [Publicaciones de LinkedIn](' + SITIO + 'linkedin/)', '']);
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

  fs.mkdirSync(path.join(carpeta, 'proyectos'), { recursive: true });
  fs.writeFileSync(path.join(carpeta, 'proyectos', 'index.html'), paginaProyectos(d));
  fs.mkdirSync(path.join(carpeta, 'sobre-mi'), { recursive: true });
  fs.writeFileSync(path.join(carpeta, 'sobre-mi', 'index.html'), paginaSobreMi(d));
  console.log(path.join(d.carpeta, 'proyectos') + ' y ' + path.join(d.carpeta, 'sobre-mi') + ' generados');

  const carpetaServicios = path.join(carpeta, 'servicios');
  fs.mkdirSync(carpetaServicios, { recursive: true });
  fs.writeFileSync(path.join(carpetaServicios, 'index.html'), paginaServicios(d));
  console.log(path.join(d.carpeta, 'servicios', 'index.html') + ' generado');

  d.servicios.forEach(x => {
    const carpetaServicio = path.join(carpetaServicios, x.id);
    fs.mkdirSync(carpetaServicio, { recursive: true });
    fs.writeFileSync(path.join(carpetaServicio, 'index.html'), paginaServicio(d, x));
  });
  console.log(path.join(d.carpeta, 'servicios') + ': ' + d.servicios.length + ' páginas de servicio');

  d.proyectos.forEach(p => {
    const carpetaProyecto = path.join(carpeta, 'proyectos', p.id);
    fs.mkdirSync(carpetaProyecto, { recursive: true });
    fs.writeFileSync(path.join(carpetaProyecto, 'index.html'), paginaProyecto(d, p));
  });
  console.log(path.join(d.carpeta, 'proyectos') + ': ' + d.proyectos.length + ' páginas de proyecto');
});

// 404.html: la sirve nginx para cualquier ruta que no exista, así que no
// puede usar rutas relativas; lleva su estilo dentro y enlaces completos.
fs.writeFileSync(path.join(__dirname, '404.html'), `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Página no encontrada · Henry Arce</title>
  <meta name="robots" content="noindex">
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #F3F6FA; color: #191C20; font-family: 'Roboto Flex', Roboto, 'Segoe UI', system-ui, sans-serif; }
    main { max-width: 520px; padding: 40px 28px; border-radius: 28px; background: #FFFFFF; text-align: center; }
    p.codigo { margin: 0; color: #1D4F7A; font-size: 64px; font-weight: 700; letter-spacing: -0.03em; }
    h1 { margin: 8px 0 0; font-size: 26px; }
    p { margin: 12px 0 0; color: #43474E; line-height: 1.6; }
    nav { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 24px; }
    a { padding: 10px 18px; border-radius: 22px; background: #D3E4F5; color: #0B2E4B; font-weight: 600; text-decoration: none; }
    a:first-child { background: #1D4F7A; color: #FFFFFF; }
  </style>
</head>
<body>
  <main>
    <p class="codigo">404</p>
    <h1>Esta página no existe</h1>
    <p>Puede que el enlace esté mal escrito o que la página se haya movido. / This page doesn’t exist.</p>
    <nav><a href="${SITIO}">Ir al inicio</a><a href="${SITIO}proyectos/">Ver proyectos</a><a href="mailto:${CORREO}">${CORREO}</a></nav>
  </main>
</body>
</html>
`);

LEGALES.forEach(l => {
  const carpeta = path.join(__dirname, l.ruta);
  fs.mkdirSync(carpeta, { recursive: true });
  fs.writeFileSync(path.join(carpeta, 'index.html'), paginaLegal(l));
  console.log(l.ruta + 'index.html generado');
});

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap());
fs.writeFileSync(path.join(__dirname, 'robots.txt'), robots());
fs.writeFileSync(path.join(__dirname, 'llms.txt'), llms());
console.log('sitemap.xml, robots.txt y llms.txt generados');
