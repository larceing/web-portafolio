// Genera la web en español (raíz), inglés (en/) y chino (zh/) a partir de los
// datos de este fichero y de las traducciones de contenido.en.js y
// contenido.zh.js, y la página de publicaciones de LinkedIn (linkedin/,
// en/linkedin/ y zh/linkedin/) a partir de publicaciones-linkedin.js.
//
//   node construir.js
//
// Para añadir o cambiar un proyecto, edita la lista PROYECTOS, añade su
// traducción en contenido.en.js y en contenido.zh.js y vuelve a ejecutarlo. El resultado es HTML
// estático: no hace falta nada más para verlo.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Huella del contenido del CSS y del JS: va en su enlace (?v=...) para que el
// navegador los pida de nuevo en cuanto cambian, aunque los guarde una semana.
const huella = f => crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, f))).digest('hex').slice(0, 10);
const VERSION_CSS = huella('css/estilos.css');
const VERSION_JS = huella('js/app.js');
const VERSION_JS_LINKEDIN = huella('js/publicaciones.js');

const VERSION_JS_BIT = huella('js/bit-arranque.js');
const VERSION_JS_PASEO = huella('js/bit-paseo.js');
const VERSION_JS_CINTA = huella('js/cinta-arranque.js');
const VERSION_JS_PORTADA = huella('js/portada.js');
const VERSION_JS_ANTES = huella('js/antes-ahora.js');
const VERSION_JS_NOVEDADES = huella('js/novedades.js');
const NovWeb = require('./js/novedades.js');
// Mensajes del cuadro de Byte: n8n «Web · Mensajes de Byte» los manda a info@ desde no-reply@.
const N8N_CONTACTO = 'https://n8n.luiscontacto03.com/webhook/contacto-web';

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
const YOUTUBE = 'https://www.youtube.com/@arcedatalab';
// Dirección fija del canal (no cambia aunque cambie el @), para los datos estructurados.
const YOUTUBE_CANAL = 'https://www.youtube.com/channel/UC8yLnwXe0BRemThW3w6WUVQ';
const PERFIL_GOOGLE = 'https://g.page/r/CSpmSyzqUmGJEBM';
// Analítica sin cookies (Umami Cloud). El script y el envío pasan por la propia
// web (/m/, ver nginx.conf) porque los bloqueadores frenan cloud.umami.is.
// data-domains: solo cuenta visitas en arcedatalab.com; en DEV y en las rutas
// del servidor no envía nada.
const UMAMI = '<script defer src="/m/s.js" data-website-id="2dd567c3-cac8-4f2f-b4ce-641a2c956a71" data-host-url="/m" data-domains="arcedatalab.com"></script>';
const INSTAGRAM = 'https://www.instagram.com/henry_arce_dev/';
// Enlace de WhatsApp con el mensaje del diagnóstico ya escrito.
const WHATSAPP_DIAGNOSTICO = WHATSAPP + '?text=' + encodeURIComponent('Hola Henry, quiero pedir presupuesto para mi empresa. Te cuento: ');
const CLUBBYTE_YOUTUBE = 'https://www.youtube.com/@clubbyte_es';
const CLUBBYTE_CANAL = 'https://www.youtube.com/channel/UCGf6S4beoxCkjF3Fyl2XIrA';
const CLUBBYTE_BLOG = 'https://clubbyte.arcedatalab.com';

// Fecha de hoy: la que se pone a una página cuando su contenido cambia.
const REVISADO = new Date().toISOString().slice(0, 10);

// Fecha de última modificación de cada página (lastmod del sitemap). Una página
// que se genera igual que la que ya hay en disco (sin contar su propia fecha)
// no se reescribe y conserva la fecha que tenía en el sitemap anterior. Así
// Google solo ve una fecha nueva en las páginas que cambian de verdad.
const FECHAS_ANTES = {};
try {
  const previo = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
  for (const m of previo.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) FECHAS_ANTES[m[1]] = m[2];
} catch (e) { /* primera generación: todas con la fecha de hoy */ }
const FECHAS = {};
const sinFecha = h => h.replace(/"dateModified":"\d{4}-\d{2}-\d{2}"/g, '');
function guardar(archivo, html) {
  const rel = path.relative(__dirname, path.dirname(archivo)).split(path.sep).join('/');
  const url = SITIO + (rel ? rel + '/' : '');
  let antes = null;
  try { antes = fs.readFileSync(archivo, 'utf8'); } catch (e) { /* página nueva */ }
  if (antes !== null && FECHAS_ANTES[url] && sinFecha(antes) === sinFecha(html)) {
    FECHAS[url] = FECHAS_ANTES[url];
    return;
  }
  FECHAS[url] = REVISADO;
  fs.writeFileSync(archivo, html);
}
const fecha = url => FECHAS[url] || FECHAS_ANTES[url] || REVISADO;

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
    caso: [
      ['Problema', 'En una fábrica pequeña, pedidos, almacén y facturas suelen vivir en programas distintos o en Excel, y la planta queda fuera del ERP.'],
      ['Qué hice', 'Un ERP con clientes, presupuestos, pedidos, hojas de ruta, albaranes, facturas preparadas para VERI*FACTU y almacén con lotes. Tiene versión de escritorio, se conecta a la planta con Efesto y a las ventas con Brokkr, recibe las horas de soporte de Odin y genera sus PDF con Report Server.'],
      ['Resultado', 'En marcha (versión 0.2) y en código abierto con licencia AGPL-3.0. Las facturas son inmutables y están preparadas para VERI*FACTU; todavía no emite facturas reales a terceros.']
    ],
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
    id: 'brokkr', corto: 'Brokkr CRM', titulo: 'Brokkr: el CRM que te dice qué hacer hoy',
    tipo: 'producto', etiqueta: 'Producto propio · 2026', icono: 'tablet', color: C.verde,
    resumen: 'CRM modular para pymes: Hoy, embudo, ficha 360 y conexión con el ERP y con cualquier programa.',
    probar: 'Haz de comercial: atiende un seguimiento vencido, registra la llamada, gana la oportunidad y mira cómo llega sola a Sindri y a n8n.',
    caso: [
      ['Problema', 'En una pyme las oportunidades se olvidan: nadie sabe cuál lleva días sin seguimiento, qué cliente se está enfriando ni por qué se pierden las ventas, y lo que se gana hay que volver a teclearlo en el ERP.'],
      ['Qué hice', 'Un CRM propio y modular. La pantalla «Hoy» dice qué toca: lo vencido, las oportunidades sin siguiente paso y los clientes que se enfrían. Embudo con importe y previsión, motivo obligatorio al perder, ficha 360 de cada empresa con una sola línea de tiempo, registro de una llamada y su siguiente paso en un gesto desde el móvil, búsqueda con Ctrl+K e informes de conversión. Permisos por rol (todo, mi equipo o lo mío) iguales en la web y en la API, y varias empresas separadas.'],
      ['Resultado', 'Al ganar una oportunidad, el cliente y las líneas llegan solos a «Por facturar» de Sindri, sin duplicar. Cualquier otro programa se conecta con webhooks firmados o con llaves de API con su propio rol. Antes de diseñarlo analicé 15 CRM libres.']
    ],
    tec: ['TypeScript', 'React', 'Fastify', 'PostgreSQL', 'Keycloak', 'Webhooks y API REST']
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
    caso: [
      ['Problema', 'Las preguntas de negocio sobre el ERP («¿cuánto le hemos vendido a este cliente este año?») acababan en un informe o en un correo a quien sabe sacar el dato.'],
      ['Qué hice', 'Un asistente que responde consultando el ERP en solo lectura. Cada tipo de consulta es una función cerrada: el modelo elige cuál usar y con qué parámetros, así no inventa datos. Se apoya en fichas de negocio editables que explican cómo se calcula cada cosa.'],
      ['Resultado', 'En uso en Grupo SPSIL desde 2026. Responde en español, inglés y chino, en texto, tabla o Excel, y no puede cambiar nada en el ERP.']
    ],
    tec: ['Python', 'Agentes', 'Base de conocimiento', 'SQL Server']
  },
  {
    id: 'reporting', corto: 'Reporting BI', titulo: 'Reporting de ventas, cobros y stock',
    tipo: 'empresa', etiqueta: 'Para Grupo SPSIL · 2025–2026', icono: 'grafico', color: C.pizarra,
    resumen: 'Ventas, cobros y stock en Power BI, migrados a Microsoft Fabric y comprobados antes y después.',
    probar: 'Filtra, cambia de página y actualiza el modelo paso a paso.',
    caso: [
      ['Problema', 'Un cambio de red cortó los orígenes de datos de los informes de Power BI de dirección, comerciales y compras.'],
      ['Qué hice', 'Migré los procesos a Dataflows y Lakehouse en Microsoft Fabric, sobre A3 ERP. Cada cambio en una vista va con su copia, su script de vuelta atrás y una comprobación de antes y después.'],
      ['Resultado', 'Los informes de ventas, cobros y stock siguen en uso sobre Fabric (2025–2026), con las cifras comprobadas en cada cambio. Son la base de los lotes de análisis.']
    ],
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
    tipo: 'empresa', etiqueta: 'Para una empresa industrial · 2026', icono: 'soporte', color: C.tinta,
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
    id: 'nifi-oee', corto: 'NiFi a Power BI', titulo: 'De la máquina a Power BI con Apache NiFi',
    tipo: 'abierto', etiqueta: 'Open source · Apache NiFi · 2026', icono: 'fabrica', color: C.tostado,
    caso: [
      ['Problema', 'En muchas plantas el OEE se calcula a mano en Excel una vez al mes: cuando el número sale malo ya nadie recuerda qué pasó, y cada encargado apunta las paradas a su manera.'],
      ['Qué hice', 'Un pipeline completo con datos inventados: tres máquinas simuladas publican por MQTT si están en marcha o paradas, la causa y las piezas buenas y malas. Apache NiFi 2 lo lee, valida el JSON contra un esquema, aplica las reglas de negocio, pone el turno y el nombre de la máquina desde el maestro de PostgreSQL y lo guarda. Los mensajes malos van a una cola de errores, cada uno con su motivo.'],
      ['Resultado', 'El OEE (disponibilidad × rendimiento × calidad) por máquina y turno, las paradas por causa y el scrap salen de vistas SQL listas para Power BI. Todo arranca con un solo <code>docker compose up</code> en unos dos minutos y, en las pruebas, ninguno de los 12.960 mensajes del histórico se perdió. Incluye la plantilla del flujo en JSON y una guía para escalar NiFi: back pressure, prioridad de colas y cuándo pasar a clúster.']
    ],
    tec: ['Apache NiFi 2', 'MQTT', 'PostgreSQL', 'Power BI', 'Python', 'Docker'],
    enlaces: [['Ver en GitHub', GITHUB + '/nifi-maquina-powerbi']],
    captura: { src: 'img/proyectos/nifi-oee-powerbi.webp', ancho: 1456, alto: 815, alt: 'Informe de Power BI del proyecto: OEE, disponibilidad, rendimiento y calidad; OEE por día y máquina; OEE por máquina y turno; minutos de parada por causa y estado actual de cada máquina', pie: 'El informe de Power BI que viene en el repositorio, con los datos inventados del simulador.' }
  },
  {
    id: 'nifi', corto: 'Apache NiFi', titulo: 'Apache NiFi: tu primer flujo',
    tipo: 'abierto', etiqueta: 'Open source · manual', icono: 'flujo', color: C.pizarra,
    texto: 'Manual paso a paso en español para instalar NiFi en Windows y montar un primer pipeline en veinte minutos, pensado para analistas que vienen de Power BI y Power Query.',
    enlaces: [['Ver en GitHub', GITHUB + '/apache-nifi-primer-flujo']],
    siguiente: 'nifi-oee'
  }
];

const TRAYECTORIA = [
  ['Abr 2026 – actualidad', 'Business Applications Administrator', 'F&amp;D Shower Tray (ES Group)', 'Responsable de los ERP del grupo para dos plantas de producción. Integraciones con SAP, lectura de datos de máquinas, EDI, un helpdesk propio, control horario y costes de IT, y soporte a la migración a Azure.'],
  ['Ene 2025 – mar 2026', 'Data Analyst · Transformación digital', 'Grupo SPSIL', 'Análisis de datos, automatización y desarrollo para un fabricante: Microsoft Fabric para centralizar y gobernar el dato, Power BI para dirección y comerciales, y aplicaciones de escritorio en Python para logística y aprovisionamiento.'],
  ['Nov 2023 – jul 2024', 'Analista programador', 'Inforges', 'Área de innovación y transformación digital: ETL y almacenes de datos, informes en Power BI y Excel, e indicadores de proveedores (SLA, disponibilidad, MTBF, MTTR) con su documentación funcional y técnica.'],
  ['Feb 2022 – nov 2023', 'Business Intelligence Developer', 'NTT DATA', 'Soluciones de BI para el sector bancario: cuadros de mando de indicadores financieros y operativos, procesos ETL e integración de datos desde Azure Databricks, AWS, SharePoint y Oracle.'],
  ['2020 – 2022', 'Técnico en Sistemas de Telecomunicaciones e Informáticos', 'IES El Palmeral', 'Premio a la Excelencia Académica 2022 y premiado en el campeonato CV Skills 2021, modalidad de Electrónica.'],
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

// Página /sobre-mi/: la «carrera» de Henry, tipo CV, para mandarla a quien
// quiera conocer su trayectoria. Sin precios ni «Pide presupuesto».
// La experiencia y la formación salen de TRAYECTORIA (mismo orden): aquí van
// los logros de cada puesto. Lo inglés, en contenido.en.js (CARRERA).
const CARRERA = {
  descripcion: 'Henry Arce (Luis Henry Arce Inga), analista de datos y desarrollador en Alicante: experiencia, habilidades, formación y proyectos.',
  puesto: 'Analista de datos y desarrollador',
  lema: 'Automatización, IA aplicada y Power BI',
  lugar: 'Alicante, España · presencial o en remoto',
  fotoAlt: 'Henry Arce',
  resumen: 'Trabajo con datos desde 2019: primero en consultoras (NTT DATA e Inforges), después en la transformación digital de un fabricante y hoy como responsable de los ERP de un grupo industrial con dos plantas. Me muevo entre el dato, el código y el negocio: encuentro las tareas manuales de un equipo, las convierto en informes, flujos y asistentes de IA, y mido lo que se gana.',
  botones: { correo: 'Escríbeme', linkedin: 'LinkedIn', github: 'GitHub', pdf: 'Guardar en PDF' },
  datos: [
    ['2019', 'trabajando con datos'],
    ['4', 'empresas, de la consultoría a la industria'],
    ['2', 'plantas de producción con sus ERP a mi cargo'],
    ['SPSIL', 'a cargo del sistema de datos del grupo, en Microsoft Fabric']
  ],
  experiencia: 'Experiencia',
  experienciaSub: 'De la consultora a la fábrica',
  logros: [
    ['Responsable de los ERP del grupo (Clavei y Cybermax) en dos plantas de producción.', 'Facturación unificada entre las dos plantas.', 'Integraciones con SAP y EDI con clientes y proveedores.', 'Lectura de datos de las máquinas de planta.', 'Helpdesk propio, control horario y control de costes de IT.', 'Apoyo a la migración a Azure.'],
    ['A cargo del sistema de datos del grupo: Microsoft Fabric para centralizar y gobernar el dato.', 'Cuadros de mando en Power BI para dirección y equipo comercial.', 'Aplicaciones de escritorio en Python para logística y aprovisionamiento.', 'Automatización de tareas repetitivas entre departamentos.'],
    ['Procesos ETL y almacenes de datos.', 'Informes en Power BI y Excel.', 'Indicadores de proveedores: SLA, disponibilidad, MTBF y MTTR.', 'Documentación funcional y técnica de cada entrega.'],
    ['Cuadros de mando de indicadores financieros y operativos para banca.', 'Procesos ETL e integración de datos desde Azure Databricks, AWS, SharePoint y Oracle.'],
    ['Premio a la Excelencia Académica 2022.', 'Premiado en el campeonato CV Skills 2021, modalidad de Electrónica.'],
    ['Paneles de ventas, inventario y producción.', 'Automatización de informes con Python y macros de Excel.']
  ],
  formacion: 'Formación y premios',
  formacionSub: 'Ciclo superior y competiciones',
  habilidades: 'Lo que sé hacer',
  habilidadesSub: 'Habilidades y herramientas que uso en el día a día',
  competencias: [
    ['Datos y BI', 'Modelos de datos, DAX y cuadros de mando que la dirección usa de verdad.'],
    ['Automatización', 'Quitar tareas manuales con flujos, scripts e integraciones entre sistemas.'],
    ['IA aplicada', 'Asistentes y agentes que trabajan con los datos del negocio, con control humano.'],
    ['ERP e integración', 'Administrar ERP, conectar SAP, EDI y máquinas de planta.'],
    ['Desarrollo', 'Aplicaciones web y de escritorio, de la base de datos a la pantalla.'],
    ['Infraestructura', 'Servidor propio con Docker, inicio de sesión único, DEV/PRO y despliegue continuo.']
  ],
  herramientas: 'Herramientas',
  propios: 'Proyectos propios',
  propiosSub: 'Lo que construyo por mi cuenta con Arce Data Lab',
  propiosTexto: 'Además de mi trabajo, tengo <strong>Arce Data Lab</strong>, mi laboratorio: ahí construyo y pruebo mis propias aplicaciones y hago proyectos freelance.',
  proyectos: [
    ['ada', 'Ada', 'Automatización con n8n e IA: prepara, revisa y publica los vídeos y posts de cinco canales, y nada sale sin revisión.'],
    ['sindri', 'Sindri', 'ERP para fábricas pequeñas: pedidos, almacén con lotes, facturas para VERI*FACTU y la planta conectada.'],
    ['plataforma', 'Mi plataforma', 'Servidor con Docker, Keycloak, DEV/PRO, copias y despliegue con GitHub Actions.'],
    ['github', 'Open source', 'Auditor de Power BI, calendario de Outlook para tus programas, manual de Apache NiFi y más, en GitHub.']
  ],
  verProyectos: 'Ver todos los proyectos',
  contacto: '¿Hablamos?',
  contactoTexto: 'Si quieres conocerme para un puesto, una colaboración o un proyecto, escríbeme y te respondo.'
};

// Textos de la página en español. Los de inglés están en contenido.en.js.
const UI = {
  lang: 'es',
  titulo: 'Henry Arce · Automatización, IA y Power BI | Arce Data Lab',
  descripcion: 'Henry Arce, fundador de Arce Data Lab (Alicante): automatización, IA aplicada, Power BI y apps a medida para pymes e industria. Proyectos reales y open source.',
  ogDescripcion: 'Automatización, IA aplicada y datos para pymes e industria. Proyectos reales, cuadros de mando y open source.',
  locale: 'es_ES',
  idiomaNombre: 'Español',
  linkedinTitulo: 'Publicaciones en LinkedIn',
  linkedinDescripcion: 'Publicaciones de Henry Arce en LinkedIn sobre BI, datos e IA aplicada.',
  linkedinSub: 'Lo que escribo sobre BI, datos e IA aplicada',
  linkedinMarco: 'Publicación de LinkedIn',
  linkedinVer: 'Leer en LinkedIn',
  linkedinFallo: 'LinkedIn no ha cargado esta publicación (a veces la bloquea el navegador). Puedes verla en LinkedIn con el enlace de abajo.',
  linkedinAviso: '¿Prefieres leerlas completas aquí? Se abre el visor de LinkedIn, que guarda sus propias cookies en tu navegador; hasta que pulses el botón no se carga nada de LinkedIn.',
  linkedinCookies: 'Política de cookies',
  linkedinCargar: 'Ver completas aquí',
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
    ['bot', 'Asistentes de IA sobre tus datos', 'Un asistente que responde preguntas del negocio consultando tus datos en solo lectura, sin inventar cifras, en texto o en Excel.', 'Agentes, Claude, OpenAI, SQL', 'asistente-ia'],
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
    ['¿Dónde publica contenido?', 'En LinkedIn sobre BI, datos e IA aplicada, en TikTok (@arcedatalab) con consejos rápidos de automatización y datos, en Instagram (@henry_arce_dev) y en YouTube (@arcedatalab), con vídeos de Power BI, datos e IA.'],
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
      sub: 'Le llega directamente a Henry. Tus datos solo se usan para contestarte.',
      nombre: 'Tu nombre', empresa: 'Empresa (opcional)', contacto: 'Tu correo o teléfono', contactoEj: 'Para poder contestarte', texto: '¿En qué te puede ayudar?',
      ejemplo: 'Ej.: cada lunes copiamos las ventas del ERP a un Excel y tardamos 3 horas.',
      correo: 'Enviar mensaje', whatsapp: 'Mejor por WhatsApp', cerrar: 'Cerrar',
      vacio: 'Escribe al menos una frase para que Henry sepa qué necesitas.',
      sinContacto: 'Déjale un correo o un teléfono para que pueda contestarte.',
      abriendo: 'Enviando…',
      listo: '¡Enviado! Henry suele contestar en el día.',
      muchos: 'Has enviado varios mensajes seguidos. Prueba dentro de un rato.',
      fallo: 'No se ha podido enviar. Copia el mensaje y mándalo a ',
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
  siguientePaso: 'Siguiente paso',
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
    { ante: 'Ada · pedidos', titulo: 'Los pedidos que llegan por correo, dentro del ERP solos.', texto: 'Ada lee el correo y el PDF, reconoce al cliente y los productos, y solo te pregunta lo que no está claro.', boton: 'Probarlo en el laboratorio', href: 'lab/#ada', img: 'img/ada/pedidos.webp', alt: 'Ada recibiendo pedidos por correo y pasándolos al ERP' },
    { ante: 'Lin-AI · asistente', titulo: 'Pregúntale a tu ERP como a un compañero.', texto: '«¿Cuánto le hemos vendido a este cliente este año?» Lin-AI responde con los datos de tu empresa, sin abrir informes.', boton: 'Probarlo en el laboratorio', href: 'lab/#asistente', img: 'img/ada/asistente.webp', alt: 'Lin-AI respondiendo preguntas sobre los datos del ERP' },
    { ante: 'Aris · tareas', titulo: 'Todo el equipo, en el mismo tablero.', texto: 'Tareas, sprints y wiki en un sitio; las incidencias entran solas como tareas y nadie pierde el hilo.', boton: 'Probarlo en el laboratorio', href: 'lab/#tareas', img: 'img/ada/aris.webp', alt: 'Tablero de Aris con tareas por columnas' },
    { ante: 'Datos y reporting', titulo: 'Tus números, al día cada mañana.', texto: 'Un cuadro de mando con las cifras cuadradas que se actualiza solo, sin copiar Excel.', boton: 'Ver un informe de ejemplo', href: 'lab/#reporting', img: 'img/ada/informe.webp', alt: 'Informe comercial de ejemplo con ventas por mes y mejores clientes' },
    { ante: 'Páginas web para negocios', titulo: 'Una web que trae clientes, no solo visitas.', texto: 'Webs, tiendas y reservas para tu negocio, pensadas primero para el móvil: que el cliente reserve, pida cita o encargue en dos toques.', boton: 'Ver plantillas de ejemplo', href: 'plantillas/', img: 'img/ada/webs.webp', alt: 'Dos plantillas de ejemplo: un restaurante en el ordenador y una barbería en el móvil' }
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
      ['Reporting', 'reporting', 'informe', 'Ventas, cobros y stock en Power BI, al día cada mañana.', 'reporting'],
      ['Webs · plantillas', 'webs', 'webs', 'Webs para negocios pensadas para el móvil: reservas, citas y pedidos. 28 ejemplos con negocios inventados que puedes abrir y probar.', '', 'plantillas/', 'Ver las plantillas']
    ],
    alt: '{o} en el laboratorio',
    boton: 'Probarlo en el laboratorio',
    ficha: 'Ver el proyecto',
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
    titulo: 'Consultor de Power BI en Alicante para pymes | Arce Data Lab',
    corto: 'Power BI',
    h1: 'Consultor de Power BI en Alicante para pymes',
    descripcion: 'Consultor de Power BI en Alicante: cuadros de mando sobre tu ERP, Excel o SQL, con las cifras cuadradas y actualizados cada mañana. Presupuesto sin compromiso.',
    intro: 'Si los números de tu empresa viven en varios Excel y cada mes alguien pasa horas juntándolos, un cuadro de mando de Power BI lo hace solo. Lo conecto a tu ERP, a tus hojas o a tu base de datos, cuadro las cifras con contabilidad y te lo entrego documentado. Trabajo desde Alicante con empresas de Alicante, Elche y alrededores, y en remoto con el resto de España.',
    incluye: [
      ['Datos ordenados', 'Limpieza y modelo de datos con Power Query: una sola versión de cada cifra, aunque venga de varios sitios.'],
      ['Medidas DAX', 'Ventas, márgenes, cobros, stock o producción, comparados con el año anterior y con tus objetivos.'],
      ['Diseño claro', 'Páginas pensadas para decidir: lo importante arriba, filtros sencillos y versión para el móvil.'],
      ['Actualización sola', 'El informe se refresca cada mañana con la puerta de enlace, sin que nadie copie nada.'],
      ['Documentación', 'Qué mide cada cifra y de dónde sale, para que tu equipo confíe en ella y la pueda mantener.']
    ],
    tec: 'Power BI, DAX, Power Query, Microsoft Fabric, SQL Server, A3 ERP, SharePoint',
    local: {
      titulo: 'Power BI para las empresas de la provincia de Alicante',
      intro: 'Cada sector de la provincia tiene sus propias preguntas. Estas son las que más se repiten y lo que un cuadro de mando les responde.',
      sectores: [
        ['Calzado · Elche, Elda y Petrer', 'Ventas por temporada, modelo y talla, pedidos de clientes frente a lo fabricado y stock por almacén.'],
        ['Juguete · Ibi y Onil', 'La campaña de Navidad semana a semana, stock por referencia y previsión de lo que hay que fabricar o pedir.'],
        ['Textil · Alcoy y Cocentaina', 'Producción y mermas por artículo, margen real por cliente y pedidos en curso.'],
        ['Agroalimentaria · Vega Baja y Vinalopó', 'Trazabilidad por lote, mermas, cobros a distribuidores y ventas por canal.'],
        ['Industria · plástico, metal y mármol', 'OEE, paradas y scrap por máquina, con datos del ERP y de la planta.']
      ]
    },
    // Lotes de análisis: paquetes de informes por área, cada uno con su demo en lab/#<id>.
    lotesTitulo: 'Lotes de análisis',
    lotesIntro: 'Informes ya pensados por área, que adapto a tu ERP y a tus nombres. Empiezas por el lote que más te duele y añades los demás cuando quieras. Pruébalos con datos inventados en el laboratorio.',
    lotesBoton: 'Probar el ejemplo',
    // Vídeo del canal de YouTube: miniatura propia que enlaza a YouTube (sin iframe ni nada de fuera).
    video: {
      id: 'g_qpzPODsXE', img: 'img/videos/tabla-calendario.webp',
      titulo: 'En vídeo: tabla calendario en Power Query',
      texto: 'La tabla calendario que uso en todos mis informes, con el código para copiar. Es la base para comparar con el año anterior.',
      alt: 'Miniatura del vídeo «Tabla calendario en Power Query en 5 minutos»',
      ver: 'Ver en YouTube', canal: 'Más vídeos en el canal'
    },
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
      ['¿Vienes a la empresa?', 'Sí. En la provincia de Alicante (Alicante, Elche, Elda, Alcoy, Ibi y alrededores) voy a conocer el proceso y a la puesta en marcha; el resto del trabajo se hace en remoto.'],
      ['¿Trabajas fuera de Alicante?', 'Sí, en remoto con empresas del resto de España y de Europa. Las reuniones son por videollamada.'],
      ['¿Qué es un lote de análisis?', 'Un conjunto de páginas de Power BI pensado para un área (ventas, planta, logística o calidad) con sus indicadores ya definidos. Lo conecto a tus datos y lo ajusto a cómo trabajas, así no se empieza de cero. Cuéntame qué lotes te interesan y te paso un presupuesto cerrado.'],
      ['¿Necesito licencia de Power BI?', 'Para hacer y ver el informe en tu ordenador basta Power BI Desktop, que es gratis. Para compartirlo en la web con tu equipo hace falta Power BI Pro, que se paga a Microsoft por usuario.'],
      ['¿Funciona con mi ERP?', 'He trabajado con A3 ERP, SAP, Clavei, Cybermax y SQL Server. Si tu ERP guarda los datos en una base de datos o los exporta a Excel, se puede conectar.'],
      ['¿Puedo cambiarlo yo después?', 'Sí. Te lo entrego documentado y te explico cómo está hecho. Si prefieres no tocarlo, hay mantenimiento mensual.'],
      ['Mi informe de Power BI no se actualiza, ¿me ayudas?', 'Sí. Aquí tienes <a href="../power-bi-no-actualiza/">las causas más habituales y cómo arreglarlas</a>. Si no das con ello, lo reviso contigo.'],
      ['Mi informe de Power BI va lento, ¿qué hago?', 'Mira primero <a href="../power-bi-lento/">las seis causas más habituales y cómo acelerarlo</a>. Si sigue lento, lo mido contigo y te digo qué cambiar.'],
      ['Me sale un error de la puerta de enlace, ¿qué hago?', 'Aquí tienes <a href="../error-puerta-de-enlace-power-bi/">las seis causas más habituales y cómo arreglarlas</a>. Si sigue fallando, lo reviso contigo.']
    ]
  },
  {
    id: 'power-bi-fabricas', icono: 'fabrica',
    proyectos: ['nifi-oee', 'efesto', 'sindri', 'reporting', 'escritorio'],
    titulo: 'Power BI para fábricas: OEE, paradas y scrap | Arce Data Lab',
    corto: 'Power BI para fábricas',
    h1: 'Power BI para fábricas: OEE, paradas y scrap',
    descripcion: 'Cuadros de mando de Power BI para pymes industriales: OEE por máquina, paradas por causa y coste del scrap, con datos del ERP y de la planta.',
    intro: 'El OEE mide qué parte del tiempo de una máquina se convierte en piezas buenas: disponibilidad por rendimiento por calidad. Con Power BI lo ves cada mañana por máquina, línea y turno, junto a las paradas y el scrap que lo bajan, sin montar el Excel a mano.',
    incluye: [
      ['OEE por máquina y línea', 'Disponibilidad, rendimiento y calidad por separado, para saber cuál de los tres te está costando.'],
      ['Paradas por causa', 'Paradas menores y mayores por día, máquina y motivo, con el tiempo medio entre paradas.'],
      ['Scrap y su coste', 'Piezas rechazadas por defecto y centro de trabajo, y lo que cuestan, frente a lo previsto.'],
      ['Datos de la planta', 'Del ERP, del MES o de las propias máquinas (OPC UA, Modbus, Siemens S7…) en solo lectura, sin abrir puertos de la fábrica.'],
      ['Definiciones por escrito', 'Qué cuenta como parada, como pieza mala o como tiempo planificado, acordado con el jefe de planta.']
    ],
    tec: 'Power BI, DAX, Power Query, Microsoft Fabric, SQL Server, OPC UA, Modbus, MQTT',
    lotesTitulo: 'Lotes de análisis para planta',
    lotesIntro: 'Informes ya pensados para producción, que adapto a tus máquinas y a tus nombres. Pruébalos con datos inventados en el laboratorio.',
    lotesBoton: 'Probar el ejemplo',
    faq: [
      ['¿Qué es el OEE y cómo se calcula?', 'El OEE (eficiencia general de los equipos) es disponibilidad × rendimiento × calidad. Si una máquina estuvo parada el 10 % del tiempo planificado, fue al 90 % de su velocidad ideal y el 95 % de las piezas salieron buenas, su OEE es 0,9 × 0,9 × 0,95 = 77 %.'],
      ['¿Necesito un MES o sensores nuevos?', 'No siempre. Se puede empezar con lo que ya registra el ERP o los partes de producción. Si quieres el dato de la máquina en tiempo real, se lee del PLC o del SCADA en solo lectura.'],
      ['¿Funciona con fábricas pequeñas?', 'Sí. Está pensado para pymes industriales con pocas líneas, donde el OEE se suele calcular a mano en Excel una vez al mes.'],
      ['¿Cuánto cuesta?', 'Depende de las máquinas, de dónde salen los datos y de cuántos lotes quieras. Cuéntame tu planta y te paso un presupuesto cerrado por escrito, sin compromiso.']
    ]
  },
  {
    id: 'power-bi-no-actualiza', icono: 'ciclo',
    proyectos: ['reporting', 'escritorio'],
    titulo: 'Power BI no se actualiza: causas y solución | Arce Data Lab',
    corto: 'Power BI que no se actualiza',
    h1: 'Tu informe de Power BI no se actualiza: causas y solución',
    descripcion: 'Por qué falla la actualización de Power BI y cómo arreglarlo: credenciales caducadas, puerta de enlace, archivos movidos, columnas cambiadas y límites de tiempo.',
    intro: 'Abres el informe y los datos son de ayer, o te llega un correo de «error de actualización». Casi siempre es una de estas seis causas, y la mayoría se arregla en minutos. Empieza por el historial de actualizaciones del modelo semántico en el servicio de Power BI: ahí está el mensaje de error. Si no das con ello, lo reviso contigo.',
    causasTitulo: 'Las seis causas más habituales',
    causasIntro: 'De la más frecuente a la menos. En cada una, la pista que la delata y qué hacer.',
    causaEtiqueta: 'Causa',
    causas: [
      ['Credenciales caducadas', 'Alguien cambió la contraseña de la base de datos, de Microsoft 365 o del usuario con el que se conecta el informe.',
        ['En el servicio de Power BI, abre la configuración del modelo semántico, entra en «Credenciales del origen de datos» y vuelve a iniciar sesión.', 'Usa una cuenta de servicio cuya contraseña no caduque, en vez de la de una persona.']],
      ['La puerta de enlace no responde', 'Los datos vienen de un servidor o de una carpeta de la empresa, y el error habla de la puerta de enlace (gateway).',
        ['Comprueba que el equipo donde está instalada está encendido, con conexión y sin suspensión.', 'Actualízala: Microsoft publica una versión nueva casi cada mes.', 'Mejor en un servidor que en el portátil de alguien.']],
      ['Un archivo se movió o cambió de nombre', 'El informe lee un Excel o un CSV y alguien lo cambió de carpeta, de nombre o de hoja.',
        ['Vuelve a apuntar la ruta en Power Query, en «Configuración del origen de datos».', 'Guarda los archivos en SharePoint o OneDrive y conéctate por su dirección web: así no hace falta puerta de enlace.']],
      ['Ha cambiado una columna', 'El error dice que no encuentra una columna («The column … of the table wasn’t found»).',
        ['Alguien renombró o quitó una columna en el Excel o en la vista del ERP.', 'Ajusta el paso de Power Query que la usa, o acuerda que el origen mantenga los nombres.']],
      ['La programación se desactivó sola', 'El informe dejó de actualizarse sin errores nuevos y la actualización programada aparece desactivada.',
        ['Power BI la desactiva tras cuatro fallos seguidos, y la pausa si nadie abre el informe en dos meses.', 'Arregla la causa, abre el informe y vuelve a activar la programación.']],
      ['Tarda demasiado', 'El error habla de tiempo de espera agotado o de tamaño.',
        ['Con Power BI Pro, cada actualización programada tiene un máximo de dos horas.', 'Quita columnas y filas que no se usan, filtra en el origen y valora la actualización incremental.']]
    ],
    incluye: [
      ['Diagnóstico', 'Reviso el historial de actualizaciones, la puerta de enlace y las credenciales hasta dar con el fallo.'],
      ['Arreglo', 'Corrijo la causa: credenciales, rutas, pasos de Power Query o la configuración de la puerta de enlace.'],
      ['Rutas que no se rompen', 'Paso los Excel a SharePoint o OneDrive, para que mover un archivo no vuelva a romper el informe.'],
      ['Aviso si vuelve a fallar', 'Configuro los correos de error para que le lleguen a quien lo tiene que arreglar, no solo al dueño del informe.'],
      ['Informe más ligero', 'Si tarda demasiado, reduzco datos y pasos de Power Query para que se actualice en minutos.']
    ],
    tec: 'Servicio de Power BI, puerta de enlace de datos local, Power Query, SharePoint, OneDrive, SQL Server',
    faq: [
      ['¿Por qué mi Power BI no se actualiza hoy?', 'Mira primero el historial de actualizaciones del modelo semántico: el mensaje de error suele decir la causa. Las más habituales son credenciales caducadas, la puerta de enlace apagada o un archivo que se ha movido.'],
      ['¿Y si el problema es de Power BI?', 'Puede pasar, aunque es raro. Mira la página de estado del servicio de Power BI. Si hay una incidencia, no toques nada: la actualización vuelve a funcionar cuando Microsoft la resuelve.'],
      ['¿Cuántas veces al día se puede actualizar?', 'Con Power BI Pro, hasta 8 actualizaciones programadas al día. Con Premium por usuario o una capacidad de Fabric, hasta 48.'],
      ['¿Cuánto cuesta que lo arregles?', 'Depende de la causa. Cuéntame qué error te sale y te paso un presupuesto cerrado antes de empezar, sin compromiso.']
    ]
  },
  {
    id: 'power-bi-lento', icono: 'lupa',
    proyectos: ['reader', 'reporting', 'grafo', 'calculate'],
    titulo: 'Power BI lento: por qué tarda y cómo acelerarlo | Arce Data Lab',
    corto: 'Power BI lento',
    h1: 'Tu informe de Power BI va lento: causas y solución',
    descripcion: 'Por qué tu informe de Power BI tarda en cargar y cómo acelerarlo: demasiados objetos visuales, modelo grande, DAX pesado, relaciones dobles o DirectQuery.',
    intro: 'Abres el informe y los gráficos se quedan cargando, o cada filtro tarda segundos. Casi siempre es una de estas seis causas. Empieza por el Analizador de rendimiento de Power BI Desktop (cinta Optimizar): te dice qué objeto visual tarda y en qué se le va el tiempo. Si no das con ello, lo reviso contigo.',
    causasTitulo: 'Las seis causas más habituales',
    causasIntro: 'En cada una, la pista que la delata y qué hacer. El Analizador de rendimiento te dice por cuál empezar.',
    causaEtiqueta: 'Causa',
    causas: [
      ['Demasiados objetos visuales en una página', 'La página tarda al abrirse y, en el Analizador, muchos objetos visuales pasan tiempo en «Otros»: esperan a que terminen los demás.',
        ['Deja en cada página solo lo necesario.', 'Lleva el detalle a una página de obtención de detalles o a una información sobre herramientas de página.', 'Prueba los objetos visuales personalizados uno a uno: uno mal hecho frena todo el informe.']],
      ['Una tabla que lo enseña todo', 'Una tabla o una matriz muestra miles de filas sin filtrar, y es lo que más tarda en el Analizador.',
        ['Ponle un filtro Top N para limitar las filas, con un máximo mayor del que nadie va a mirar.', 'Abre la página con un filtro razonable ya puesto, como el mes actual, en vez de todo el histórico.']],
      ['El modelo carga más datos de los que usa', 'El archivo pesa mucho, también tarda al actualizar y todo el informe va lento, no un objeto visual concreto.',
        ['Quita las columnas y las filas que no usa ningún informe; por ejemplo, carga solo los últimos años.', 'Desactiva «Fecha y hora automáticas»: crea una tabla oculta por cada columna de fecha.', 'Crea las columnas nuevas en Power Query mejor que como columnas calculadas en DAX.']],
      ['Medidas DAX pesadas', 'En el Analizador, lo que más tarda es la «Consulta DAX».',
        ['Guarda en una variable (VAR) lo que la medida calcula dos veces, para que lo calcule una sola.', 'Dentro de CALCULATE, usa condiciones simples sobre una columna en vez de FILTER sobre la tabla entera.', 'Copia la consulta desde el Analizador y pruébala en la vista de consultas DAX hasta que baje.']],
      ['Relaciones en las dos direcciones', 'En la vista de modelo, alguna relación tiene flechas en los dos sentidos.',
        ['Déjalas en una sola dirección salvo que hagan falta: las dobles dan más trabajo a cada consulta.', 'Si era para que una segmentación muestre solo opciones con datos, fíltrala con una medida «no está en blanco».', 'Si una medida necesita filtrar en los dos sentidos, actívalo solo en esa medida con CROSSFILTER.']],
      ['DirectQuery o un origen lento', 'Los datos no están importados: cada filtro pregunta a la base de datos, y en el Analizador la «Consulta directa» se lleva el tiempo.',
        ['Valora importar los datos: es la opción que Microsoft recomienda por defecto y responde desde memoria.', 'Si necesitas DirectQuery, deja las medidas simples (SUM, COUNT, MIN, MAX, AVERAGE) y evita las relaciones dobles.', 'Acerca la puerta de enlace y la base de datos a la región de tu Power BI para recortar la latencia.']]
    ],
    incluye: [
      ['Diagnóstico', 'Mido el informe con el Analizador de rendimiento y veo qué página, qué objeto visual y qué medida se llevan el tiempo.'],
      ['Modelo más ligero', 'Quito columnas, filas e historial que nadie usa, y lo que engorda el modelo sin aportar nada.'],
      ['DAX más rápido', 'Reescribo las medidas que más tardan y compruebo que dan las mismas cifras que antes.'],
      ['Páginas más claras', 'Menos objetos visuales por página y el detalle aparte, para que abra antes y se entienda mejor.'],
      ['Antes y después', 'Te paso los tiempos de carga medidos antes y después del cambio, página por página.']
    ],
    tec: 'Power BI Desktop, servicio de Power BI, Analizador de rendimiento, DAX, Power Query, DirectQuery, SQL Server',
    faq: [
      ['¿Por qué mi Power BI va tan lento?', 'Casi siempre por una de estas causas: demasiados objetos visuales en la página, un modelo con más datos de los necesarios, medidas DAX pesadas, relaciones en las dos direcciones o un origen lento con DirectQuery. El Analizador de rendimiento te dice cuál.'],
      ['¿Cómo sé qué objeto visual es el lento?', 'Abre el Analizador de rendimiento (cinta Optimizar en Power BI Desktop, o menú Ver al editar el informe en el servicio), pulsa «Iniciar grabación» y luego «Actualizar objetos visuales». Verás cuánto tarda cada uno y en qué.'],
      ['¿Es mejor importar los datos o usar DirectQuery?', 'Importar, salvo que tengas un motivo: los datos se consultan desde memoria y responden rápido. Con DirectQuery cada objeto visual pregunta a la base de datos, así que va tan rápido como ella. Tiene sentido si necesitas el dato casi al momento o no cabe en el modelo.'],
      ['¿Cuánto cuesta que lo acelere?', 'Depende de la causa y del tamaño del modelo. Cuéntame qué informe va lento y te paso un presupuesto cerrado antes de empezar, sin compromiso.']
    ]
  },
  {
    id: 'error-puerta-de-enlace-power-bi', icono: 'tunel',
    proyectos: ['gateway', 'reporting', 'escritorio'],
    titulo: 'Error puerta de enlace Power BI: causas y arreglo | Arce Data Lab',
    corto: 'Error de puerta de enlace en Power BI',
    h1: 'Error de la puerta de enlace de Power BI: causas y solución',
    descripcion: 'Por qué falla la puerta de enlace de Power BI y cómo arreglarlo: equipo apagado, conexión mal configurada, credenciales, puertos o niveles de privacidad.',
    intro: 'La puerta de enlace de datos es el programa que deja al servicio de Power BI leer los datos que tienes en la empresa: un SQL Server, el ERP o una carpeta compartida. Si falla, el informe no se actualiza. Casi siempre es una de estas seis causas. Empieza por el mensaje del historial de actualizaciones y por la pestaña Estado de la aplicación de la puerta de enlace. Si no das con ello, lo reviso contigo.',
    causasTitulo: 'Las seis causas más habituales',
    causasIntro: 'En cada una, la pista que la delata (casi siempre, el texto del error) y qué hacer.',
    causaEtiqueta: 'Causa',
    causas: [
      ['La puerta de enlace está desconectada', 'El error dice «Your data gateway is offline or couldn’t be reached», o en «Administrar conexiones y puertas de enlace» aparece sin conexión.',
        ['Comprueba que el equipo donde está instalada está encendido, con internet y sin suspensión. Microsoft desaconseja instalarla en un portátil.', 'Abre la aplicación de la puerta de enlace y reiníciala desde «Configuración del servicio».', 'Si lleva meses sin tocarse, actualízala: Microsoft solo da soporte a las seis últimas versiones.']],
      ['Falta la conexión del origen de datos', 'Al programar la actualización no te deja elegir la puerta de enlace, o el error dice que no hay ninguna configurada para los orígenes de datos.',
        ['En «Administrar conexiones y puertas de enlace», crea una conexión para cada origen de la empresa que use el informe, todas en la misma puerta de enlace.', 'Escribe el servidor y la base de datos igual que en Power BI Desktop: si allí pusiste una IP o SERVIDOR\\INSTANCIA, aquí también.', 'Pide al administrador que te añada como usuario de la conexión.']],
      ['Credenciales mal en la conexión', 'El error dice «Invalid connection credentials» o «Login failed for user».',
        ['Con la puerta de enlace, las credenciales no van en el modelo semántico: se cambian en la conexión, dentro de «Administrar conexiones y puertas de enlace».', 'Revisa que el método de autenticación (Windows o básica) sea el que pide el origen.', 'Usa una cuenta de servicio cuya contraseña no caduque.']],
      ['Llega a la puerta de enlace, pero no al origen', 'El error dice «We reached the data gateway, but the gateway can’t access the on-premises data source», o sale el código DM_GWPipeline_Gateway_DataSourceAccessError.',
        ['Abre Power BI Desktop en el equipo de la puerta de enlace y actualiza el informe desde ahí: si ahí falla, el problema está en ese equipo.', 'Instala en ese equipo los controladores que pida el origen, como el ODBC de 64 bits del ERP.', 'Si lee archivos de una carpeta compartida, comprueba que ese equipo y la cuenta de la conexión pueden abrirla.']],
      ['El cortafuegos o el proxy la bloquean', 'Al iniciar sesión en la aplicación sale «Network request returned unexpected error», o la actualización falla con «Unable to connect to the remote server».',
        ['En la aplicación, ve a Diagnósticos y lanza la prueba de puertos de red.', 'La puerta de enlace solo necesita conexiones de salida: 443, 5671-5672 y 9350-9354. No hay que abrir puertos de entrada.', 'Si el proxy solo deja pasar los puertos 80 y 443, activa el modo HTTPS en la pestaña Red.']],
      ['Se mezclan datos con distinta privacidad', 'En Power BI Desktop se actualiza bien, pero en el servicio falla con «Information is needed in order to combine data».',
        ['Pasa en informes que combinan varios orígenes con la opción «Ignorar siempre los niveles de privacidad», que el servicio no tiene.', 'En Power BI Desktop, quita esa opción en Opciones > Privacidad, tanto en Global como en el archivo actual.', 'Vuelve a publicar y pon el nivel de privacidad «Organizativo» en el servicio.']]
    ],
    incluye: [
      ['Diagnóstico', 'Reviso el error, los registros de la puerta de enlace y la prueba de puertos hasta dar con el fallo.'],
      ['Arreglo', 'Corrijo la causa: el servicio de la puerta de enlace, las conexiones, las credenciales o los pasos de Power Query.'],
      ['Puerta de enlace en su sitio', 'Si está en un portátil, la paso a un servidor siempre encendido, con la clave de recuperación guardada a buen recaudo.'],
      ['Al día', 'La actualizo a la última versión y dejo apuntado cómo hacerlo cada mes.'],
      ['Menos dependencia', 'Si los datos son Excel, los paso a SharePoint o OneDrive, que no necesitan puerta de enlace.']
    ],
    tec: 'Puerta de enlace de datos local, servicio de Power BI, Power BI Desktop, Power Query, SQL Server, ODBC, SharePoint',
    faq: [
      ['¿Qué es la puerta de enlace de datos de Power BI?', 'Un programa de Windows que se instala en un equipo de tu red y hace de puente entre tus datos y el servicio de Power BI. Solo abre conexiones de salida, así que no hay que abrir puertos de entrada en tu red.'],
      ['¿Necesito puerta de enlace si mis datos están en SharePoint o OneDrive?', 'No. SharePoint, OneDrive y las bases de datos en la nube, como Azure SQL, se conectan directamente desde el servicio. Hace falta para lo que está dentro de tu red: un servidor, el ERP o una carpeta compartida.'],
      ['¿Se actualiza sola la puerta de enlace?', 'No. Microsoft publica una versión nueva cada mes y solo da soporte a las seis últimas, así que hay que instalarla a mano de vez en cuando.'],
      ['¿Cuánto cuesta que lo arregles?', 'Depende de la causa. Cuéntame qué error te sale y te paso un presupuesto cerrado antes de empezar, sin compromiso.']
    ]
  },
  {
    id: 'automatizacion-n8n', icono: 'flujo',
    proyectos: ['ada', 'whatsapp', 'helpdesk', 'outlook', 'gateway', 'servicios', 'nifi', 'nifi-oee', 'asistente'],
    titulo: 'Automatización de procesos con n8n en Alicante | Arce Data Lab',
    corto: 'Automatización con n8n',
    h1: 'Automatización de procesos con n8n en Alicante',
    descripcion: 'Automatización con n8n en Alicante: las tareas que tu equipo repite cada semana (correos, avisos, pedidos, facturas e informes) pasan solas entre ERP, CRM, Excel y correo.',
    intro: 'Copiar pedidos del correo al ERP, mandar el mismo aviso cada lunes o pasar datos de una hoja a otra no aporta nada y se equivoca a menudo. Con n8n lo convierto en un flujo que lo hace solo, con avisos si algo falla, y lo instalo en un servidor en la UE. Trabajo desde Alicante con empresas de Alicante, Elche y alrededores, y en remoto con el resto de España.',
    incluye: [
      ['Mapa de la tarea', 'Vemos juntos qué se hace a mano, cuántas veces y cuánto tiempo se lleva, para empezar por lo que más rinde.'],
      ['El flujo en n8n', 'Conectado a tus programas: correo, Excel o Google Sheets, ERP, CRM, formularios, WhatsApp o cualquier API.'],
      ['Pruebas con datos reales', 'Antes de ponerlo en marcha, con tus casos raros incluidos.'],
      ['Avisos si algo falla', 'Si un paso no sale bien, te llega un aviso con lo que ha pasado, en vez de un error en silencio.'],
      ['Una hora de formación', 'Para que tu equipo sepa qué hace el flujo y cómo pararlo o cambiarlo.']
    ],
    tec: 'n8n, Python, Power Automate, Apps Script, API REST, webhooks',
    local: {
      titulo: 'Automatización para las empresas de la provincia de Alicante',
      intro: 'Las tareas manuales cambian según el sector. Estas son las que más veo en la provincia y se pueden quitar con un flujo.',
      sectores: [
        ['Calzado · Elche, Elda y Petrer', 'Pedidos de clientes que llegan por correo o en Excel, grabados en el ERP, y avisos de cambios de última hora.'],
        ['Juguete · Ibi y Onil', 'Pedidos de campaña, avisos de stock bajo y el resumen diario para dirección en temporada alta.'],
        ['Textil · Alcoy y Cocentaina', 'Partes de producción que dejan de copiarse a mano y órdenes que pasan solas del ERP a la planta.'],
        ['Agroalimentaria · Vega Baja y Vinalopó', 'Albaranes y lotes registrados sin teclear, y avisos a clientes y transportistas.'],
        ['Industria · plástico, metal y mármol', 'Avisos de máquinas e incidencias, informes diarios de producción y facturas de proveedores leídas solas.']
      ]
    },
    faq: [
      ['¿Qué es n8n?', 'n8n es una herramienta de automatización que conecta programas entre sí con flujos visuales. Se puede instalar en tu propio servidor, así tus datos no salen de la UE.'],
      ['¿Qué tareas se pueden automatizar?', 'Las que se repiten y siguen siempre los mismos pasos: copiar datos entre programas, enviar avisos o correos, generar informes o PDF, revisar formularios y clasificar mensajes.'],
      ['¿Cuánto cuesta una automatización?', 'Depende de cuántas aplicaciones se conectan y de los casos especiales. Cuéntame tu caso y te paso un presupuesto cerrado por escrito.'],
      ['¿Vienes a la empresa?', 'Sí. En la provincia de Alicante (Alicante, Elche, Elda, Alcoy, Ibi y alrededores) voy a conocer el proceso y a la puesta en marcha; el resto del trabajo se hace en remoto.'],
      ['¿Trabajas fuera de Alicante?', 'Sí, en remoto con empresas del resto de España y de Europa. Las reuniones son por videollamada.'],
      ['¿Qué pasa si cambia un programa?', 'El flujo avisa cuando algo deja de funcionar y se ajusta. Con el mantenimiento mensual, lo hago yo.']
    ]
  },
  {
    id: 'pedidos-por-correo', icono: 'sobre',
    proyectos: ['ada', 'outlook', 'sindri', 'helpdesk', 'gateway'],
    titulo: 'Automatizar pedidos por correo al ERP | Arce Data Lab',
    corto: 'Pedidos por correo al ERP',
    h1: 'Automatizar los pedidos que llegan por correo',
    descripcion: 'Los pedidos que llegan por correo o en PDF, leídos, comprobados y grabados en tu ERP sin teclearlos. Tú solo revisas lo que no está claro.',
    intro: 'En muchas distribuidoras y fábricas alguien pasa cada mañana copiando pedidos del correo al ERP, línea a línea. Se puede automatizar: el sistema lee el correo y el PDF, reconoce al cliente y los productos, comprueba precios y stock, y graba el pedido. Solo te pregunta lo que no está claro.',
    incluye: [
      ['Entrar y clasificar', 'Lee el buzón de pedidos y separa lo que es un pedido de lo que no: consultas, facturas o publicidad.'],
      ['Extraer', 'Saca cliente, referencias, cantidades y fechas del cuerpo del correo, de un PDF o de un Excel adjunto.'],
      ['Validar', 'Comprueba con tu ERP que el cliente y las referencias existen, y avisa de precios, mínimos o stock que no cuadran.'],
      ['Registrar', 'Graba el pedido en el ERP por su API o por la vía que admita, y guarda el correo original enlazado.'],
      ['Seguir', 'Una bandeja de revisión con lo dudoso y un resumen diario de lo que entró, lo que se grabó y lo que espera.']
    ],
    tec: 'n8n, Python, IA (OpenAI o Claude), Microsoft 365 o Gmail, API del ERP, SQL Server',
    faq: [
      ['¿Funciona con pedidos en PDF o escaneados?', 'Sí, con PDF de texto y con la mayoría de escaneados legibles. Lo que el sistema no lee con seguridad va a la bandeja de revisión en lugar de grabarse.'],
      ['¿Qué pasa si se equivoca?', 'No graba nada dudoso: si falta un dato o algo no cuadra con el ERP, te lo pregunta. Cada pedido grabado queda enlazado a su correo, para comprobarlo.'],
      ['¿Con qué ERP funciona?', 'Con los que tienen API o una base de datos accesible. Si tu ERP solo importa ficheros, se prepara el fichero de importación.'],
      ['¿Cuánto cuesta?', 'Depende de cuántos formatos de pedido recibes y de cómo se conecta tu ERP. Cuéntame tu caso y te paso un presupuesto cerrado por escrito, sin compromiso.']
    ]
  },
  {
    id: 'asistente-ia', icono: 'bot',
    proyectos: ['asistente', 'reporting', 'gateway', 'whatsapp', 'gobernanza'],
    titulo: 'Asistente de IA conectado a tu ERP | Arce Data Lab',
    corto: 'Asistente de IA para tu ERP',
    h1: 'Un asistente de IA que responde con los datos de tu ERP',
    descripcion: 'Pregunta a tu ERP en lenguaje normal y recibe la respuesta en texto, tabla o Excel. Solo lectura y consultas aprobadas, para que no invente cifras.',
    intro: '«¿Cuánto le hemos vendido a este cliente este año?» Hoy esa pregunta acaba en un informe o en un correo a quien sabe sacar el dato. Un asistente conectado al ERP la responde al momento. La IA no escribe SQL: elige entre consultas ya aprobadas, así cada cifra sale de un cálculo revisado.',
    incluye: [
      ['Consultas cerradas', 'Cada tipo de pregunta es una consulta revisada. La IA elige cuál usar y con qué filtros, y no puede inventar datos.'],
      ['Solo lectura', 'El asistente no puede cambiar nada en tu ERP. Se conecta con un usuario de lectura.'],
      ['Fichas de negocio', 'Cómo se calcula cada cifra en tu empresa, por escrito y editable, para que el asistente responda como lo haría tu equipo.'],
      ['Texto, tabla o Excel', 'La respuesta, en el formato que se necesite, en español, inglés o chino.'],
      ['Registro de preguntas', 'Qué se pregunta y qué consulta se usó, para revisar las respuestas y añadir las que falten.']
    ],
    tec: 'Python, OpenAI o Claude, SQL Server, A3 ERP, Microsoft Fabric',
    faq: [
      ['¿Puede inventarse una cifra?', 'No. La IA no escribe la consulta: solo elige entre las aprobadas y les pasa los filtros. Si una pregunta no encaja en ninguna, lo dice en vez de inventar.'],
      ['¿Mis datos salen de la empresa?', 'El modelo de IA recibe la pregunta y el resultado de la consulta, no la base de datos. El acceso al ERP es de solo lectura.'],
      ['¿Hay alguno funcionando?', 'Sí. Lin-AI responde preguntas de negocio sobre el ERP de Grupo SPSIL desde 2026. Puedes probar una demo con datos inventados en el laboratorio.'],
      ['¿Cuánto cuesta?', 'Depende de cuántos tipos de pregunta quieres cubrir y de cómo es tu ERP. Cuéntame tu caso y te paso un presupuesto cerrado por escrito, sin compromiso.']
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

// La página de fábricas reutiliza los lotes de planta de la de Power BI.
const LOTES_PLANTA = ['bi-fabricacion', 'bi-calidad', 'bi-pedidos'];
SERVICIOS.find(x => x.id === 'power-bi-fabricas').lotes = SERVICIOS.find(x => x.id === 'power-bi').lotes.filter(l => LOTES_PLANTA.includes(l[0]));

const EN = require('./contenido.en.js');
const ZH = require('./contenido.zh.js');
[EN, ZH].forEach(X => { X.SERVICIOS['power-bi-fabricas'].lotes = X.SERVICIOS['power-bi'].lotes.filter(l => LOTES_PLANTA.includes(l[0])); });

// Publicaciones de la página /linkedin/. Cada elemento es el código de
// «Insertar esta publicación» o el enlace de la publicación; de él solo se
// toman la referencia (urn:li:...) y la altura, y el <iframe> se escribe aquí.
const ALTO_LINKEDIN = 640;

// Cuántas publicaciones se ven a la vez. Si en la lista hay más, cada semana
// se eligen otras al azar (js/publicaciones.js); si hay menos, cambia el orden.
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
  // La fecha va dentro del número de la publicación (los primeros 41 bits son milisegundos).
  const numero = urn.split(':').pop();
  const fecha = new Date(Number(BigInt(numero) >> 22n));
  const slug = (legible.match(/\/posts\/[^_]+_(.+)-(?:activity|share|ugcPost)-\d+/) || [])[1] || '';
  return { marco: marco, alto: alto, enlace: enlace, numero: numero, fecha: fecha, slug: slug };
}

// Título de cada tarjeta: el de las cifras de divulgación si es una de esas
// publicaciones (en el idioma de la página) o, si no, el del propio enlace.
function tarjetaLinkedin(t, p) {
  const i = PUBLICACIONES.findIndex(u => u && u.includes(p.numero));
  let titulo, cifra = '';
  if (i >= 0 && t.cifras[i]) {
    const partes = t.cifras[i][1].split(' · ');
    titulo = partes.slice(1).join(' · ') || partes[0];
    cifra = t.cifras[i][0] + ' ' + partes[0];
  } else {
    const texto = p.slug.replace(/-/g, ' ').trim();
    titulo = texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : t.linkedinMarco;
  }
  const fecha = new Intl.DateTimeFormat(t.lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(p.fecha);
  return { titulo: titulo, cifra: cifra, fecha: fecha, iso: p.fecha.toISOString().slice(0, 10) };
}

const LINKEDIN_PUBLICACIONES = require('./publicaciones-linkedin.js').map(publicacionLinkedin);
const NV = require('./novedades.js');

// Cada idioma: sus textos, sus datos, la carpeta donde se escribe y la ruta
// hasta la raíz (para css, js e img). Las traducciones (contenido.en.js y
// contenido.zh.js) se combinan con los datos en español: lo que no traducen
// (iconos, colores, enlaces) sale de aquí.
const TRADUCCIONES = { en: EN, zh: ZH };

function idiomaTraducido(id) {
  const X = TRADUCCIONES[id];
  const fichero = 'contenido.' + id + '.js';
  return {
    id: id,
    t: Object.assign({}, X.UI, {
      arceEnlaces: UI.arceEnlaces.map((e, i) => [X.UI.arceEnlacesTextos[i], e[1]]),
      clubbyteEnlaces: UI.clubbyteEnlaces.map((e, i) => [X.UI.clubbyteEnlacesTextos[i], e[1]]),
      datosClave: UI.datosClave.map((x, i) => [i === 1 ? x[0] : X.UI.datosClave[i][0], X.UI.datosClave[i][1]]),
      serv: X.SERV,
      porque: X.PORQUE,
      p: X.PORTADA
    }),
    servicios: SERVICIOS.map(s => {
      if (!X.SERVICIOS[s.id]) throw new Error('Falta la traducción del servicio ' + s.id + ' en ' + fichero);
      return Object.assign({}, s, X.SERVICIOS[s.id]);
    }),
    areas: AREAS.map((a, i) => Object.assign({}, a, X.AREAS[i])),
    proyectos: PROYECTOS.map(p => {
      if (!X.PROYECTOS[p.id]) throw new Error('Falta la traducción del proyecto ' + p.id + ' en ' + fichero);
      return Object.assign({}, p, X.PROYECTOS[p.id]);
    }),
    trayectoria: X.TRAYECTORIA,
    tecnologias: X.TECNOLOGIAS,
    carrera: X.CARRERA,
    carpeta: id, base: '../'
  };
}

const IDIOMAS = [
  { id: 'es', t: UI, areas: AREAS, proyectos: PROYECTOS, servicios: SERVICIOS, trayectoria: TRAYECTORIA, tecnologias: TECNOLOGIAS, carrera: CARRERA, carpeta: '', base: '' },
  idiomaTraducido('en'),
  idiomaTraducido('zh')
];

// Selector de idioma de la cabecera: código de la carpeta, texto del botón,
// atributo lang/hreflang y nombre completo.
const SELECTOR = [
  { id: 'es', boton: 'ES', lang: 'es', nombre: 'Español' },
  { id: 'en', boton: 'EN', lang: 'en', nombre: 'English' },
  { id: 'zh', boton: '中文', lang: 'zh-Hans', nombre: '中文' }
];
const prefijo = id => id === 'es' ? '' : id + '/';


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
// Título de una ficha: con la firma « · Henry Arce» si cabe en 65 caracteres,
// que es lo que Google suele enseñar sin recortar; si no, sin ella.
const conFirma = t => (t + ' · Henry Arce').length <= 65 ? t + ' · Henry Arce' : t;
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
    jobTitle: { es: 'Analista de datos y desarrollador · automatización e IA aplicada', en: 'Data analyst and developer · automation and applied AI', zh: '数据分析师与开发者 · 自动化与 AI 应用' }[d.id],
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

// Zona de servicio: la del perfil de empresa de Google (sin dirección pública), más la
// Comunidad Valenciana y España. La usan la organización y cada Service.
const ZONA = ['Alicante', 'Elche', 'San Vicente del Raspeig', "Sant Joan d'Alacant", 'Murcia']
  .map(c => ({ '@type': 'City', name: c }))
  .concat({ '@type': 'AdministrativeArea', name: 'Comunidad Valenciana' }, { '@type': 'Country', name: 'España' });

function organizacion() {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ID_ORG,
    name: 'Arce Data Lab',
    url: ARCE,
    email: CORREO,
    logo: SITIO + 'img/monograma.png',
    founder: { '@id': ID_PERSONA },
    areaServed: ZONA,
    hasMap: PERFIL_GOOGLE,
    address: { '@type': 'PostalAddress', addressLocality: 'Alicante', addressCountry: 'ES' },
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer service', email: CORREO, availableLanguage: ['es', 'en'] },
      { '@type': 'ContactPoint', contactType: 'technical support', email: SOPORTE, availableLanguage: ['es'] }
    ],
    sameAs: [YOUTUBE, YOUTUBE_CANAL, TIKTOK, INSTAGRAM, LINKEDIN, PERFIL_GOOGLE],
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Servicios',
      itemListElement: UI.serviciosLista.map(x => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: x[1], description: plano(x[2]), provider: { '@id': ID_ORG }, areaServed: ZONA } }))
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
      { '@type': 'WebSite', '@id': ID_WEB, url: SITIO, name: 'Henry Arce · Arce Data Lab', inLanguage: ['es', 'en', 'zh-Hans'], publisher: { '@id': ID_PERSONA } },
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
// Ficha del proyecto de una pestaña del laboratorio de la portada: la pestaña
// (o[1]) o su demo (o[4]), si existe como proyecto. Enlaza a una página que
// se indexa, porque /lab/ lleva noindex.
const fichaPestana = o => [o[1], o[4]].find(id => id && PROYECTOS.some(x => x.id === id)) || '';

const DESTACADOS = ['reporting', 'asistente', 'sindri', 'tareas', 'efesto', 'brokkr', 'plantillas', 'whatsapp', 'gestor', 'servicios', 'crm', 'gateway', 'escritorio', 'tienda', 'plataforma'];

// Proyectos principales: tarjeta grande con su demo del laboratorio. El primero
// ocupa todo el ancho. Los demás proyectos salen en la lista corta de debajo.
// RELACIONADOS: otras demos que se enseñan dentro de la tarjeta de un principal.
const PRINCIPALES = ['ada', 'sindri', 'asistente', 'reporting', 'tareas'];
const RELACIONADOS = { sindri: ['efesto', 'brokkr'] };

// Logos propios de algunas apps: salen en su tarjeta en lugar del pictograma.
const LOGOS = { sindri: 'img/logo-sindri.webp', gestor: 'img/logo-odin.webp', tareas: 'img/logo-aris.webp', brokkr: 'img/logo-brokkr.webp', ada: 'img/logo-ada.webp', asistente: 'img/logo-linai.webp', reporting: 'img/logo-reporting.webp', efesto: 'img/logo-efesto.webp' };

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

// Sello de cada proyecto: todos con la misma pieza (cuadrado claro con borde),
// y dentro su logo real, su monograma (productos sin logo todavía) o su
// pictograma en el color del proyecto. Así cada uno tiene su cara sin romper
// la unidad de la página.
const MONOGRAMAS = { servicios: 'Rs', crm: 'Fo', plataforma: 'Pl', clubbyte: 'CB' };
function cara(p, base, tam) {
  if (LOGOS[p.id]) return '<img class="tesela-logo" src="' + (base || '') + LOGOS[p.id] + '" alt="" width="' + tam + '" height="' + tam + '" loading="lazy">';
  if (MONOGRAMAS[p.id]) return '<span class="monograma" aria-hidden="true">' + MONOGRAMAS[p.id] + '</span>';
  return icono(p.icono);
}

function principal(p, t, todos, base) {
  const rel = (RELACIONADOS[p.id] || []).map(id => todos.find(o => o.id === id)).filter(Boolean);
  return '      <article class="principal' + (p.id === PRINCIPALES[0] ? ' ancha' : '') + '" style="--c:' + p.color + '">\n' +
    '        <div class="principal-cuerpo">\n' +
    '          <div class="principal-cab"><span class="tesela-cara sello">' + cara(p, base, 64) + '</span>' +
    '<p class="principal-etiqueta">' + p.etiqueta + '</p></div>\n' +
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
    '<span class="tesela-cara sello">' + cara(p, base, 40) + '</span>' +
    '<span class="mini-texto"><b>' + p.corto + '</b><span>' + t.tipos[p.tipo] + '</span></span></button></li>';
}

function detalle(p, t, base, d) {
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
    (p.siguiente ? '      ' + siguienteHtml(d, p, base + 'proyectos/') + '\n' : '') +
    '      <p class="pagina-proyecto"><a href="' + base + 'proyectos/' + p.id + '/">' + t.verFicha + ' →</a></p>\n    </div>';
}

// Cabecera HTML y menú, comunes a la portada y a la página de LinkedIn.
// p.ruta: la página dentro de cada idioma ('' o 'linkedin/'). p.raiz: camino
// hasta la raíz del sitio (css, js, img). p.inicio: camino hasta la portada
// del mismo idioma. p.soloEs: la página solo existe en español (legales).
// Botones ES · EN · 中文 que llevan a la misma página en cada idioma, con
// rutas relativas para que funcionen igual en arcedatalab.com y en DEV.
function selectorIdioma(d, p) {
  const raizSitio = '../'.repeat((d.carpeta ? 1 : 0) + p.ruta.split('/').filter(Boolean).length);
  const enlaces = SELECTOR.map(x => {
    const actual = x.id === d.id;
    const href = raizSitio + prefijo(x.id) + (p.soloEs ? '' : p.ruta);
    return '<a href="' + (href || './') + '" lang="' + x.lang + '" hreflang="' + x.lang + '" title="' + x.nombre + '"' + (actual ? ' aria-current="true"' : '') + '>' + x.boton + '</a>';
  });
  return '<span class="idiomas" role="group" aria-label="Idioma · Language · 语言">' + enlaces.join('') + '</span>';
}

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
${p.soloEs ? '' : SELECTOR.map(x => '  <link rel="alternate" hreflang="' + x.lang + '" href="' + SITIO + prefijo(x.id) + p.ruta + '">\n').join('')}  <link rel="alternate" hreflang="x-default" href="${SITIO}${p.ruta}">
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
  <link rel="icon" href="${p.raiz}favicon.ico" sizes="48x48">
  <link rel="icon" href="${p.raiz}img/monograma.svg" type="image/svg+xml">
  <link rel="icon" href="${p.raiz}img/monograma.png" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="${p.raiz}img/monograma.png">
  <link rel="me" href="${LINKEDIN}">
  <link rel="me" href="${GITHUB}">
  <script type="application/ld+json">${jsonLd(p.datos)}</script>
  <link rel="preload" href="${p.raiz}fuentes/robotoflex-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${p.raiz}css/estilos.css?v=${VERSION_CSS}">
  ${UMAMI}
</head>

<body>
  <a class="saltar" href="#contenido">${t.saltar}</a>

  <header class="cabecera">
    <a class="marca" href="${p.inicio}#inicio">${hojita()}Henry Arce <span>${t.lema}</span></a>
    <nav class="menu" aria-label="${t.secciones}">
      <a href="${p.inicio}servicios/"${p.ruta.startsWith('servicios/') ? ' aria-current="page"' : ''}>${t.p.menu.hacemos}</a>
      <a class="menu-extra" href="${p.raiz}lab/#sindri">${t.p.menu.lab}</a>
      <a href="${p.inicio}proyectos/"${p.ruta.startsWith('proyectos/') ? ' aria-current="page"' : ''}>${t.p.menu.proyectos}</a>
      <a class="menu-extra" href="${p.inicio}novedades/"${p.ruta === 'novedades/' ? ' aria-current="page"' : ''}>${NV.TEXTOS[d.id].menu}</a>
      <a class="menu-extra" href="${p.inicio}sobre-mi/"${p.ruta === 'sobre-mi/' ? ' aria-current="page"' : ''}>${t.p.menu.sobre}</a>
      ${selectorIdioma(d, p)}
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

  return cabeza(d, { titulo: t.titulo, descripcion: t.descripcion, ogDescripcion: t.ogDescripcion, ruta: '', raiz: base, inicio: '', datos: datosPortada(d) }) + `
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
          <p class="enlace-flecha"><a href="${base}${o[5] || 'lab/#' + o[4]}">${o[6] || p.lab.boton} →</a></p>${fichaPestana(o) ? `
          <p class="enlace-flecha"><a href="${base}proyectos/${fichaPestana(o)}/">${p.lab.ficha} →</a></p>` : ''}
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
    ruta: 'proyectos/', raiz: raiz, inicio: '../',
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

${d.proyectos.map(p => detalle(p, t, raiz, d)).join('\n')}
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

// Página /sobre-mi/: la carrera de Henry, tipo CV, para mandarla a quien
// quiera conocer su trayectoria (experiencia, habilidades, formación y
// proyectos). Sin precios ni «Pide presupuesto». Se puede guardar en PDF:
// el botón llama a window.print() y la hoja de impresión quita menú y pie.
function paginaSobreMi(d) {
  const t = d.t;
  const c = d.carrera;
  const raiz = '../' + d.base;
  const url = SITIO + (d.carpeta ? d.carpeta + '/' : '') + 'sobre-mi/';
  const puesto = (x, i) => {
    const logros = c.logros[i] || [];
    return '        <li class="cv-puesto">\n' +
      '          <p class="cuando">' + x[0] + '</p>\n' +
      '          <div>\n' +
      '            <h3>' + x[1] + ' <span>· ' + x[2] + '</span></h3>\n' +
      (logros.length ? '' : '            <p>' + x[3] + '</p>\n') +
      (logros.length ? '            <ul>' + logros.map(l => '<li>' + l + '</li>').join('') + '</ul>\n' : '') +
      '          </div>\n' +
      '        </li>';
  };
  // La formación es la entrada de IES El Palmeral; el resto, experiencia.
  const esFormacion = x => /IES /.test(x[2]);
  const experiencia = d.trayectoria.map((x, i) => [x, i]).filter(([x]) => !esFormacion(x));
  const formacion = d.trayectoria.map((x, i) => [x, i]).filter(([x]) => esFormacion(x));
  const enlaceProyecto = id => id === 'github' ? GITHUB : '../proyectos/' + id + '/';
  const fuera = id => id === 'github' ? ' target="_blank" rel="noopener"' : '';

  return cabeza(d, {
    titulo: t.p.sobre.titulo + ' · Henry Arce', descripcion: attr(c.descripcion), ogDescripcion: attr(c.descripcion),
    ruta: 'sobre-mi/', raiz: raiz, inicio: '../',
    datos: { '@context': 'https://schema.org', '@graph': [
      { '@type': 'ProfilePage', '@id': url, url: url, name: plano(t.p.sobre.titulo), inLanguage: t.lang, isPartOf: { '@id': ID_WEB }, about: { '@id': ID_PERSONA }, mainEntity: { '@id': ID_PERSONA } },
      persona(d)
    ] }
  }) + `
  <main id="contenido" class="portadilla sobre-mi cv">
    <section class="bloque cv-cabeza">
      <img class="cv-foto" src="${raiz}img/henry.webp" alt="${c.fotoAlt}" width="160" height="160">
      <div>
        <p class="cv-antetitulo">${t.p.sobre.titulo}</p>
        <h1>Henry Arce</h1>
        <p class="cv-puesto-actual">${c.puesto} · ${c.lema}</p>
        <p class="cv-lugar">${c.lugar}</p>
        <p class="cv-resumen">${c.resumen}</p>
        <p class="botones cv-botones">
          <a class="boton" href="mailto:${CORREO}">${c.botones.correo}</a>
          <a class="boton contorno" href="${LINKEDIN}" target="_blank" rel="noopener">${c.botones.linkedin}</a>
          <a class="boton contorno" href="${GITHUB}" target="_blank" rel="noopener">${c.botones.github}</a>
          <button class="boton contorno cv-pdf" type="button" hidden>${c.botones.pdf}</button>
        </p>
        <p class="cv-solo-papel">${CORREO} · ${LINKEDIN.replace('https://www.', '')} · ${GITHUB.replace('https://', '')} · ${SITIO.replace(/^https:\/\/|\/$/g, '')}</p>
      </div>
    </section>

    <section class="bloque cv-datos-bloque" aria-label="${c.puesto}">
      <dl class="cv-datos">
${c.datos.map(x => '        <div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>').join('\n')}
      </dl>
    </section>

    <section class="bloque" id="experiencia">
      <h2>${c.experiencia}</h2>
      <p class="sub">${c.experienciaSub}</p>
      <ol class="lista cv-lista">
${experiencia.map(([x, i]) => puesto(x, i)).join('\n')}
      </ol>
    </section>

    <section class="bloque" id="habilidades">
      <h2>${c.habilidades}</h2>
      <p class="sub">${c.habilidadesSub}</p>
      <div class="cv-competencias">
${c.competencias.map(x => '        <div><h3>' + x[0] + '</h3><p>' + x[1] + '</p></div>').join('\n')}
      </div>
      <h3 class="cv-herramientas-titulo">${c.herramientas}</h3>
      <dl class="cv-herramientas">
${d.tecnologias.map(x => '        <div><dt>' + x[0] + '</dt><dd>' + x[1].split(', ').map(h => '<span>' + h + '</span>').join('') + '</dd></div>').join('\n')}
      </dl>
    </section>

    <section class="bloque" id="formacion">
      <h2>${c.formacion}</h2>
      <p class="sub">${c.formacionSub}</p>
      <ol class="lista cv-lista">
${formacion.map(([x, i]) => puesto(x, i)).join('\n')}
      </ol>
    </section>

    <section class="bloque" id="proyectos-propios">
      <h2>${c.propios}</h2>
      <p class="sub">${c.propiosSub}</p>
      <p class="cv-texto">${c.propiosTexto}</p>
      <div class="cv-proyectos">
${c.proyectos.map(x => '        <a class="cv-proyecto" href="' + enlaceProyecto(x[0]) + '"' + fuera(x[0]) + '><h3>' + x[1] + '</h3><p>' + x[2] + '</p></a>').join('\n')}
      </div>
      <p class="mas"><a href="../proyectos/">${c.verProyectos}</a></p>
    </section>

    <section class="bloque" id="divulgacion">
      <h2>${t.divulgacion}</h2>
      <p class="sub">${t.divulgacionSub}</p>
      <div class="cifras">
${t.cifras.map((x, i) => '        <div><strong>' + x[0] + '</strong><span>' + x[1] + '</span>' + (PUBLICACIONES[i] ? '<a href="' + PUBLICACIONES[i] + '" target="_blank" rel="noopener">' + t.verPublicacion + '</a>' : '') + '</div>').join('\n')}
      </div>
      <p class="mas"><a href="../novedades/#linkedin">${t.verPublicaciones}</a></p>
    </section>

    <section class="bloque cv-contacto" id="contacto">
      <h2>${c.contacto}</h2>
      <p class="sub">${c.contactoTexto}</p>
      <p class="botones">
        <a class="boton grande" href="mailto:${CORREO}">${CORREO}</a>
        <a class="boton contorno" href="${LINKEDIN}" target="_blank" rel="noopener">${c.botones.linkedin}</a>
      </p>
    </section>
  </main>

  ${pie(t, raiz, '../')}

${bitHtml(t, raiz)}
  <script src="${raiz}js/app.js?v=${VERSION_JS}"></script>
</body>
</html>
`;
}

// Página /linkedin/: una tarjeta propia por publicación (fecha, título, cifra y
// enlace), que se ve aunque el navegador bloquee LinkedIn. El visor oficial solo
// se carga si la persona lo pide (cookies de terceros). Las clases e ids no
// llevan «linkedin»: los filtros de Brave y uBlock esconden lo que lo lleva.
function paginaLinkedin(d) {
  // /linkedin/ ya no es una página propia: sus publicaciones están en
  // /novedades/. Se deja esta para no romper enlaces antiguos.
  const destino = '../novedades/#linkedin';
  return `<!DOCTYPE html>
<html lang="${d.t.lang}">
<head>
  <meta charset="utf-8">
  <title>${NV.TEXTOS[d.id].titulo} · Henry Arce</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${SITIO}${prefijo(d.id)}novedades/">
  <meta http-equiv="refresh" content="0; url=${destino}">
</head>
<body>
  <p><a href="${destino}">${NV.TEXTOS[d.id].titulo}</a></p>
</body>
</html>
`;
}

// Página /novedades/: en qué estamos trabajando, lo último, dónde publicamos
// y las publicaciones de LinkedIn (las tarjetas propias de antes). Los textos
// están en novedades.js.
function fechaLarga(iso, id) {
  const loc = { es: 'es-ES', en: 'en-GB', zh: 'zh-CN' }[id];
  return new Date(iso + 'T12:00:00Z').toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function paginaNovedades(d) {
  const t = d.t;
  const n = NV.TEXTOS[d.id];
  const raiz = '../' + d.base;
  const enlace = u => !u ? '' : /^https?:/.test(u) ? u : raiz + (d.id !== 'es' && !/^(lab|plantillas|cookies)\b/.test(u) ? d.id + '/' : '') + u;
  const url = SITIO + prefijo(d.id) + 'novedades/';
  const ctxNov = { lang: d.id, raiz: raiz, medios: NV.MEDIOS, textos: { ver: n.ver, play: n.play, tipos: n.tipos } };
  return cabeza(d, {
    titulo: n.titulo + ' · Henry Arce', descripcion: attr(n.descripcion), ogDescripcion: attr(n.descripcion), ogTipo: 'website',
    ruta: 'novedades/', raiz: raiz, inicio: '../',
    datos: { '@context': 'https://schema.org', '@graph': [
      { '@type': 'CollectionPage', '@id': url, url: url, name: n.titulo, description: n.descripcion, inLanguage: t.lang, isPartOf: { '@id': ID_WEB }, about: { '@id': ID_PERSONA } },
      { '@type': 'ItemList', name: n.ultimas, itemListElement: NV.NOVEDADES.slice(0, 7).map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x[d.id][0], description: x[d.id][1] })) },
      persona(d)
    ] }
  }) + `
  <main id="contenido">
    <section class="bloque novedades">
      <h1>${n.titulo}</h1>
      <p class="sub">${n.sub}</p>

      <h2 class="proyectos-grupo">${n.ahora}</h2>
      <div class="ahora">
${NV.AHORA.map(x => '        <a class="ahora-item" style="--c:' + ((NV.MEDIOS[x.producto] || NV.MEDIOS.otro).color) + '" href="' + enlace(x.enlace) + '"><b>' + x[d.id][0] + '</b><span>' + x[d.id][1] + '</span></a>').join('\n')}
      </div>

      <h2 class="proyectos-grupo">${n.ultimas}</h2>
      <div class="novedades-lista" id="novedadesLista" data-fuente="${NV.N8N_NOVEDADES}" data-ctx="${attr(JSON.stringify(ctxNov))}">
${NovWeb.pintar(NV.NOVEDADES, ctxNov)}
      </div>

      <h2 class="proyectos-grupo" id="canales">${n.canales}</h2>
      <p class="sub">${n.canalesSub}</p>
      <ul class="canales">
${NV.CANALES.map(c => '        <li><a href="' + c.url + '" target="_blank" rel="noopener"><span class="canal-red">' + c.red + '</span><b>' + c.usuario + '</b><span>' + c[d.id] + '</span><span class="canal-ir">' + n.seguir + ' →</span></a></li>').join('\n')}
      </ul>
    </section>

    <section class="bloque publicaciones" id="linkedin">
      <h2>${n.linkedin}</h2>
      <p class="sub">${t.linkedinSub}</p>

      <div class="entradas" data-a-la-vez="${LINKEDIN_A_LA_VEZ}" data-fallo="${attr(t.linkedinFallo)}">
${LINKEDIN_PUBLICACIONES.map((p, i) => {
  const k = tarjetaLinkedin(t, p);
  return '        <article class="entrada"' + (i >= LINKEDIN_A_LA_VEZ ? ' hidden' : '') + ' data-marco="' + p.marco + '" data-alto="' + p.alto + '" data-titulo="' + attr(t.linkedinMarco + ': ' + plano(k.titulo)) + '">\n' +
    '          <p class="entrada-meta"><span class="entrada-sello" aria-hidden="true">in</span><time datetime="' + k.iso + '">' + k.fecha + '</time></p>\n' +
    '          <h3>' + k.titulo + '</h3>\n' +
    (k.cifra ? '          <p class="entrada-cifra">' + k.cifra + '</p>\n' : '') +
    '          <p class="entrada-ir"><a href="' + p.enlace + '" target="_blank" rel="noopener">' + t.linkedinVer + ' →</a></p>\n' +
    '        </article>';
}).join('\n')}
      </div>

      <div class="visor-aviso" id="visorAviso">
        <p>${t.linkedinAviso} <a href="${raiz}cookies/">${t.linkedinCookies}</a></p>
        <button type="button" class="boton" id="visorCargar">${t.linkedinCargar}</button>
      </div>

      <p class="mas"><a href="${LINKEDIN}" target="_blank" rel="noopener">${t.linkedinPerfil}</a></p>
    </section>
  </main>

  ${pie(t, raiz, '../')}

  <script src="${raiz}js/novedades.js?v=${VERSION_JS_NOVEDADES}" defer></script>
  <script src="${raiz}js/publicaciones.js?v=${VERSION_JS_LINKEDIN}"></script>
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
    ruta: 'servicios/', raiz: '../' + d.base, inicio: '../',
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

// Páginas legales, solo en español: se escriben en legal/*.md y aquí se pasan
// a HTML. Aviso legal (LSSI art. 10), privacidad (RGPD art. 13), cookies
// (LSSI art. 22.2) y condiciones. Privacidad y condiciones las piden también
// TikTok, Google y Meta para dar acceso a sus API. Si se añade una, hay que
// añadir su carpeta al Dockerfile.
const LEGALES = [
  { ruta: 'aviso-legal/', fichero: 'legal/aviso-legal.md', es: 'Aviso legal', en: 'Legal notice', zh: '法律声明' },
  { ruta: 'privacidad/', fichero: 'legal/privacidad.md', es: 'Privacidad', en: 'Privacy', zh: '隐私政策' },
  { ruta: 'cookies/', fichero: 'legal/cookies.md', es: 'Cookies', en: 'Cookies', zh: 'Cookie 政策' },
  { ruta: 'condiciones/', fichero: 'legal/condiciones.md', es: 'Condiciones', en: 'Terms', zh: '使用条款' }
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
        '<a href="' + inicio + 'novedades/">' + NV.TEXTOS[t.lang.slice(0, 2)].menu + '</a>',
        '<a href="' + inicio + 'sobre-mi/">' + t.p.menu.sobre + '</a>',
        '<a href="' + inicio + '#contacto">' + t.menu.contacto + '</a>'
      ])}
      ${col(t.menu.servicios, SERVICIOS.map(x => '<a href="' + inicio + 'servicios/' + x.id + '/">' + (TRADUCCIONES[t.lang.slice(0, 2)] ? TRADUCCIONES[t.lang.slice(0, 2)].SERVICIOS[x.id].corto : x.corto) + '</a>'))}
      ${col(t.pieRedes, [fuera(YOUTUBE, 'YouTube'), fuera(LINKEDIN, 'LinkedIn'), fuera(INSTAGRAM, 'Instagram'), fuera(TIKTOK, 'TikTok'), fuera(GITHUB, 'GitHub'), fuera(WHATSAPP, 'WhatsApp')])}
      ${col('Legal', LEGALES.map(l => '<a href="' + raiz + l.ruta + '">' + (l[t.lang.slice(0, 2)] || l.es) + '</a>'))}
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
    ruta: l.ruta, raiz: '../', inicio: '../', soloEs: true,
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
  const guion = Object.assign({}, t.bit, { correoDestino: CORREO, whatsappDestino: WHATSAPP, contactoUrl: N8N_CONTACTO, idioma: t.lang.slice(0, 2) });
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
      <label>${m.contacto}<input name="contacto" autocomplete="email" maxlength="120" placeholder="${attr(m.contactoEj)}" required></label>
      <label class="byte-trampa" aria-hidden="true">Web<input name="web" tabindex="-1" autocomplete="off"></label>
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
    titulo: conFirma(plano(p.titulo)), descripcion: attr(resumen(p)), ogDescripcion: attr(resumen(p)), ogTipo: 'article',
    ruta: 'proyectos/' + p.id + '/', raiz: raiz, inicio: '../../',
    datos: datosProyecto(d, p)
  }) + `
  <main id="contenido">
    <nav class="migas" aria-label="Breadcrumb"><a href="../../">${t.migas}</a> › <a href="../">${t.proyectos}</a> › <span>${p.corto}</span></nav>

    <article class="bloque proyecto" data-bit="proyectos">
      <div class="proyecto-cabecera" style="--c:${p.color}"><span class="tesela-cara sello">${cara(p, raiz, 72)}</span></div>
      <p class="etiqueta">${p.etiqueta}</p>
      <h1>${p.titulo}</h1>
      ${cuerpo}
      ${capturaHtml(p, raiz)}
      ${tec}${enlaces}
      ${LAB_DEMOS.includes(p.id) ? '<p class="probar"><a class="boton" href="' + raiz + 'lab/#' + p.id + '">' + t.serv.probar + '</a></p>' : ''}${p.ver ? botonPlantillas(t) : ''}
      ${siguienteHtml(d, p, '../')}${servicioDe(d, p.id) ? '<p class="proyecto-servicio">' + t.serv.relacionado + ': <a href="../../servicios/' + servicioDe(d, p.id).id + '/">' + servicioDe(d, p.id).h1 + '</a></p>' : ''}
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
// «Siguiente paso»: enlace de un proyecto a otro que lo continúa (p. ej. del
// manual de NiFi al caso práctico). camino: ruta hasta la carpeta proyectos/.
// Captura opcional de un proyecto (p.captura), debajo del caso.
function capturaHtml(p, raiz) {
  const c = p.captura;
  return c ? '<figure class="proyecto-captura"><img src="' + raiz + c.src + '" alt="' + attr(c.alt) + '" width="' + c.ancho + '" height="' + c.alto + '" loading="lazy">' + (c.pie ? '<figcaption>' + c.pie + '</figcaption>' : '') + '</figure>' : '';
}

function siguienteHtml(d, p, camino) {
  const o = p.siguiente && d.proyectos.find(x => x.id === p.siguiente);
  return o ? '<p class="proyecto-siguiente">' + d.t.serv.siguientePaso + ': <a href="' + camino + o.id + '/">' + o.titulo + ' →</a></p>' : '';
}

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

// Causas de un problema (página de Power BI que no se actualiza): tarjetas con la pista
// que delata cada causa y qué hacer. Usa el mismo estilo que los lotes.
function causasHtml(s) {
  return `
    <section class="bloque" id="causas">
      <h2>${s.causasTitulo}</h2>
      <p class="sub lotes-intro">${s.causasIntro}</p>
      <div class="lotes">
${s.causas.map((c, i) => `        <article class="lote">
          <p class="lote-para">${s.causaEtiqueta} ${i + 1}</p>
          <h3>${c[0]}</h3>
          <p class="lote-pregunta">${c[1]}</p>
          <ul>${c[2].map(x => '<li>' + x + '</li>').join('')}</ul>
        </article>`).join('\n')}
      </div>
    </section>
`;
}

// Bloque local: sectores de la provincia de Alicante y lo que el servicio les resuelve.
// Una sola página por servicio, sin copias por ciudad.
function localHtml(s) {
  return `
    <section class="bloque servicio-local">
      <h2>${s.local.titulo}</h2>
      <p class="sub">${s.local.intro}</p>
      <div class="servicios servicio-incluye">
${s.local.sectores.map(x => '        <article class="servicio"><h3>' + x[0] + '</h3><p>' + x[1] + '</p></article>').join('\n')}
      </div>
    </section>
`;
}

// Vídeo de YouTube en una página de servicio: miniatura servida desde la web y enlace
// al vídeo. No se carga nada de YouTube hasta que la persona pulsa.
function videoHtml(v, raiz) {
  const url = 'https://www.youtube.com/watch?v=' + v.id;
  return `
    <section class="bloque video-servicio">
      <a class="video-mini" href="${url}" target="_blank" rel="noopener"><img src="${raiz}${v.img}" alt="${attr(v.alt)}" width="640" height="360" loading="lazy"><span class="video-play" aria-hidden="true"></span></a>
      <div>
        <h2>${v.titulo}</h2>
        <p class="sub">${v.texto}</p>
        <p class="botones"><a class="boton secundario" href="${url}" target="_blank" rel="noopener">${v.ver}</a><a class="boton secundario" href="${YOUTUBE}" target="_blank" rel="noopener">${v.canal}</a></p>
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
    ruta: ruta, raiz: raiz, inicio: '../../',
    datos: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', '@id': url, url: url, name: plano(s.h1), description: plano(s.descripcion), inLanguage: t.lang, isPartOf: { '@id': ID_WEB }, about: { '@id': url + '#servicio' }, breadcrumb: { '@id': url + '#migas' } },
        { '@type': 'Service', '@id': url + '#servicio', name: plano(s.h1), serviceType: plano(s.corto), description: plano(s.descripcion), url: url, provider: { '@id': ID_ORG }, areaServed: ZONA.concat({ '@type': 'Place', name: 'Unión Europea' }), availableLanguage: ['es', 'en'] },
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
${s.causas ? causasHtml(s) : ''}
    <section class="bloque">
      <h2>${t.serv.incluye}</h2>
      <div class="servicios servicio-incluye">
${s.incluye.map(x => '        <article class="servicio"><h3>' + x[0] + '</h3><p>' + x[1] + '</p></article>').join('\n')}
      </div>
      <p class="servicios-nota">${s.tec}</p>
    </section>
${s.local ? localHtml(s) : ''}${s.lotes ? lotesHtml(s, raiz) : ''}${s.video ? videoHtml(s.video, raiz) : ''}
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

// sitemap.xml con las tres versiones (es, en, zh) de cada página enlazadas entre sí.
function sitemap() {
  const rutas = ['', 'proyectos/', 'sobre-mi/'].concat(['servicios/']).concat(SERVICIOS.map(x => 'servicios/' + x.id + '/')).concat(['novedades/']).concat(PROYECTOS.map(p => 'proyectos/' + p.id + '/'));
  const entrada = ruta => SELECTOR.map(pre =>
    '  <url>\n    <loc>' + SITIO + prefijo(pre.id) + ruta + '</loc>\n    <lastmod>' + fecha(SITIO + prefijo(pre.id) + ruta) + '</lastmod>\n' +
    SELECTOR.map(x => '    <xhtml:link rel="alternate" hreflang="' + x.lang + '" href="' + SITIO + prefijo(x.id) + ruta + '"/>\n').join('') +
    '    <xhtml:link rel="alternate" hreflang="x-default" href="' + SITIO + ruta + '"/>\n  </url>').join('\n');
  const legal = l => '  <url>\n    <loc>' + SITIO + l.ruta + '</loc>\n    <lastmod>' + fecha(SITIO + l.ruta) + '</lastmod>\n  </url>';
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
   .concat(['', '## Otras páginas', '- [English version](' + SITIO + 'en/)', '- [中文版](' + SITIO + 'zh/)', '- [Servicios](' + SITIO + 'servicios/)', '- [Proyectos](' + SITIO + 'proyectos/)', '- [Sobre mí](' + SITIO + 'sobre-mi/)', '- [Laboratorio de demos](' + SITIO + 'lab/)'])
   .concat(SERVICIOS.map(x => '- [' + plano(x.h1) + '](' + SITIO + 'servicios/' + x.id + '/)'))
   .concat(['- [Novedades: en qué trabajamos, dónde publicamos y LinkedIn](' + SITIO + 'novedades/)', '']);
  return lineas.join('\n');
}

// En inglés y en chino, los enlaces al laboratorio llevan ?lang= para que
// se abra en el mismo idioma aunque el visitante eligiera otro antes.
// Solo la carpeta lab/ exacta: no «themelab/» ni «theme-lab/».
function conIdiomaLab(d, html) {
  if (d.id === 'es') return html;
  return html.replace(/(href="(?:[^"]*\/)?lab\/)(#[^"]*)?"/g, (m, ruta, ancla) => ruta + '?lang=' + d.id + (ancla || '') + '"');
}

IDIOMAS.forEach(d => {
  const carpeta = path.join(__dirname, d.carpeta);
  fs.mkdirSync(carpeta, { recursive: true });
  guardar(path.join(carpeta, 'index.html'), conIdiomaLab(d, pagina(d)));
  console.log(path.join(d.carpeta, 'index.html') + ' generado: ' + d.proyectos.length + ' proyectos');

  const carpetaLinkedin = path.join(carpeta, 'linkedin');
  fs.mkdirSync(carpetaLinkedin, { recursive: true });
  guardar(path.join(carpetaLinkedin, 'index.html'), conIdiomaLab(d, paginaLinkedin(d)));
  const carpetaNovedades = path.join(carpeta, 'novedades');
  fs.mkdirSync(carpetaNovedades, { recursive: true });
  guardar(path.join(carpetaNovedades, 'index.html'), conIdiomaLab(d, paginaNovedades(d)));
  console.log(path.join(d.carpeta, 'novedades', 'index.html') + ' generado: ' + NV.NOVEDADES.length + ' novedades y ' + LINKEDIN_PUBLICACIONES.length + ' publicaciones (linkedin/ lleva a novedades/)');

  fs.mkdirSync(path.join(carpeta, 'proyectos'), { recursive: true });
  guardar(path.join(carpeta, 'proyectos', 'index.html'), conIdiomaLab(d, paginaProyectos(d)));
  fs.mkdirSync(path.join(carpeta, 'sobre-mi'), { recursive: true });
  guardar(path.join(carpeta, 'sobre-mi', 'index.html'), conIdiomaLab(d, paginaSobreMi(d)));
  console.log(path.join(d.carpeta, 'proyectos') + ' y ' + path.join(d.carpeta, 'sobre-mi') + ' generados');

  const carpetaServicios = path.join(carpeta, 'servicios');
  fs.mkdirSync(carpetaServicios, { recursive: true });
  guardar(path.join(carpetaServicios, 'index.html'), conIdiomaLab(d, paginaServicios(d)));
  console.log(path.join(d.carpeta, 'servicios', 'index.html') + ' generado');

  d.servicios.forEach(x => {
    const carpetaServicio = path.join(carpetaServicios, x.id);
    fs.mkdirSync(carpetaServicio, { recursive: true });
    guardar(path.join(carpetaServicio, 'index.html'), conIdiomaLab(d, paginaServicio(d, x)));
  });
  console.log(path.join(d.carpeta, 'servicios') + ': ' + d.servicios.length + ' páginas de servicio');

  d.proyectos.forEach(p => {
    const carpetaProyecto = path.join(carpeta, 'proyectos', p.id);
    fs.mkdirSync(carpetaProyecto, { recursive: true });
    guardar(path.join(carpetaProyecto, 'index.html'), conIdiomaLab(d, paginaProyecto(d, p)));
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
  guardar(path.join(carpeta, 'index.html'), paginaLegal(l));
  console.log(l.ruta + 'index.html generado');
});

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap());
fs.writeFileSync(path.join(__dirname, 'robots.txt'), robots());
fs.writeFileSync(path.join(__dirname, 'llms.txt'), llms());
console.log('sitemap.xml, robots.txt y llms.txt generados');
