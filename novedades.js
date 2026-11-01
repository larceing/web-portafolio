// Página /novedades/ (y /en/novedades/, /zh/novedades/): en qué estamos
// trabajando, lo último que ha salido, dónde publicamos y las publicaciones
// de LinkedIn, todo en una página. La genera construir.js.
//
// Para añadir una novedad, ponla ARRIBA de NOVEDADES con su fecha (AAAA-MM-DD),
// sus textos en es, en y zh y, si quieres, un enlace dentro de la web (ruta
// relativa a la raíz, como 'lab/#sindri') o fuera (https://...). Luego:
//   node construir.js

// Lo que tenemos entre manos ahora mismo (3 tarjetas). Sin detalles internos.
const AHORA = [
  {
    producto: 'ada',
    es: ['Ada, en marcha', 'Nuestro equipo de IA para el marketing ya prepara el contenido de nuestras redes.'],
    en: ['Ada, up and running', 'Our AI marketing team already prepares the content for our social channels.'],
    zh: ['Ada 已投入使用', '我们的 AI 营销团队已经在为我们的社交频道准备内容。'],
    enlace: 'lab/#ada'
  },
  {
    producto: 'brokkr',
    es: ['Brokkr, el CRM en tablet', 'El CRM para el comercial de una pyme industrial, conectado con Sindri. En preparación.'],
    en: ['Brokkr, the tablet CRM', 'The CRM for the sales rep of an industrial SME, connected to Sindri. Coming soon.'],
    zh: ['Brokkr：平板上的 CRM', '为工业中小企业销售人员打造的 CRM，与 Sindri 相连。即将推出。'],
    enlace: 'lab/#brokkr'
  },
  {
    producto: 'clubbyte',
    es: ['Club Byte', 'Tecnología explicada a niños de 8 a 12 años, con capítulos y reels cada semana.'],
    en: ['Club Byte', 'Technology explained to kids aged 8 to 12, with new episodes and reels every week.'],
    zh: ['Club Byte', '给 8 到 12 岁孩子讲解科技，每周更新节目和短视频。'],
    enlace: 'proyectos/clubbyte/'
  }
];

// «Lo último». La fuente de verdad es la tabla «novedades» de n8n (filas con
// publicar_en = web y estado Aprobada): la página la lee al abrirse desde
// https://n8n.luiscontacto03.com/webhook/novedades-web (flujo «Ada · Novedades
// web»), que da las 7 últimas. Esta lista es la copia que sale si n8n no
// responde (y la que ven los buscadores): mantenla igual que la tabla.
// Máximo 7: productos nuevos o mejorados, capítulos y vídeos que salen y
// cosas interesantes. Sin detalles internos de cómo trabajamos.
const NOVEDADES = [
  {"fecha": "2026-11-01", "producto": "sindri", "tipo": "video", "enlace": "https://www.instagram.com/henry_arce_dev/", "video": "adl-sindri", "es": ["Vídeo nuevo: Sindri, toda tu empresa en un solo ERP", "¿Ventas, stock y facturas cada uno en su Excel? En 25 segundos, cómo se ve todo junto. Ya en Instagram y TikTok."], "en": ["New video: Sindri, your whole company in one ERP", "Sales, stock and invoices each in its own spreadsheet? In 25 seconds, how it all looks together. Now on Instagram and TikTok."], "zh": ["新视频：Sindri，一个 ERP 管好整个公司", "销售、库存和发票各用一个 Excel？25 秒看懂全部整合在一起的样子。已在 Instagram 和 TikTok 上线。"]},
  {"fecha": "2026-10-30", "producto": "imagina", "tipo": "capitulo", "enlace": "https://www.tiktok.com/@arcedatalab", "imagen": "img/novedades/iit-ep01.webp", "es": ["Capítulo completo: «La IA me hizo el dashboard… y me mintió»", "El informe decía ventas −8 %; la realidad era +26 %. En 6 partes, los tres errores que la IA no ve y cómo revisarlo antes de enviarlo."], "en": ["Full episode: “AI built my dashboard… and lied to me”", "The report said sales were down 8%; they were actually up 26%. In 6 parts: the three mistakes AI can’t see and how to check before you send it."], "zh": ["完整一集：《AI 给我做了仪表板……却骗了我》", "报告说销售下降 8%，实际却增长了 26%。分 6 集讲清 AI 看不出的三个错误，以及发送前如何检查。"]},
  {"fecha": "2026-10-28", "producto": "laboratorio", "tipo": "mejorado", "enlace": "lab/#sindri", "es": ["El laboratorio, con vídeo y en tres idiomas", "Cada producto tiene su vídeo y sus simulaciones funcionan en español, inglés y chino."], "en": ["The lab, with video and in three languages", "Every product has its own video, and the simulations work in Spanish, English and Chinese."], "zh": ["实验室：配有视频，支持三种语言", "每个产品都有自己的视频，模拟演示支持西班牙语、英语和中文。"]},
  {"fecha": "2026-10-27", "producto": "plantillas", "tipo": "nuevo", "enlace": "plantillas/", "es": ["Nuevo: plantillas de web para negocios locales", "Webs de ejemplo para bares, clínicas, peluquerías y talleres, listas para adaptar."], "en": ["New: website templates for local businesses", "Sample sites for bars, clinics, hair salons and garages, ready to adapt."], "zh": ["新品：本地商家网站模板", "为酒吧、诊所、理发店和修车厂准备的示例网站，可直接改用。"]},
  {"fecha": "2026-10-26", "producto": "reporting", "tipo": "mejorado", "enlace": "lab/#reporting", "es": ["Reporting BI: nuevos lotes de análisis", "Comercial, fabricación, pedidos y calidad, cada uno con su demo."], "en": ["Reporting BI: new analysis packs", "Sales, manufacturing, orders and quality, each with its own demo."], "zh": ["Reporting BI：新增分析模块", "销售、生产、订单和质量，每个都有演示。"]},
  {"fecha": "2026-10-26", "producto": "sindri", "tipo": "mejorado", "enlace": "lab/#sindri", "es": ["Sindri trabaja con Ada", "Del comercial a la planta en un solo ERP. Pruébalo en la simulación."], "en": ["Sindri works with Ada", "From sales to the shop floor in one ERP. Try it in the simulation."], "zh": ["Sindri 与 Ada 协同工作", "从销售到车间，尽在一个 ERP。在模拟中亲自试试。"]},
  {"fecha": "2026-10-25", "producto": "ada", "tipo": "nuevo", "enlace": "lab/#ada", "es": ["Nuevo: Ada, tu equipo de IA para el marketing", "Prepara el contenido de tus redes; tú solo lo apruebas."], "en": ["New: Ada, your AI marketing team", "It prepares your social media content; you just approve it."], "zh": ["新品：Ada，你的 AI 营销团队", "它为你准备社交媒体内容；你只需批准。"]}
];

const N8N_NOVEDADES = 'https://n8n.luiscontacto03.com/webhook/novedades-web';

// Color, vídeo e imagen de cada producto (si la fila de n8n no trae los suyos).
// video: nombre en lab/v/ (con -en / -zh por idioma); imagen: ruta desde la raíz.
const MEDIOS = {
  ada: { color: '#2C6259', video: 'adl-ada' },
  sindri: { color: '#1D4F7A', video: 'adl-sindri' },
  reporting: { color: '#3F5266', video: 'adl-reporting' },
  brokkr: { color: '#A94F0E', video: 'adl-brokkr' },
  efesto: { color: '#A94F0E', video: 'adl-efesto' },
  aris: { color: '#1D4F7A', video: 'adl-aris' },
  tareas: { color: '#1D4F7A', video: 'adl-aris' },
  linai: { color: '#A94F0E', video: 'adl-linai' },
  asistente: { color: '#A94F0E', video: 'adl-linai' },
  servicios: { color: '#2E6C9E', video: 'adl-servicios' },
  plantillas: { color: '#8A3B5C', imagen: 'plantillas/cafe-almendro/captura.jpg' },
  laboratorio: { color: '#2E6C9E', imagen: 'lab/og.jpg' },
  imagina: { color: '#6D28D9', imagen: 'img/novedades/iit-ep01.webp' },
  clubbyte: { color: '#C2410C' },
  otro: { color: '#1D4F7A' }
};

// Dónde publicamos. Solo cuentas de Arce Data Lab (nunca la personal luis_arce_3).
const CANALES = [
  { red: 'YouTube', usuario: '@arcedatalab', url: 'https://www.youtube.com/@arcedatalab',
    es: 'Vídeos de producto y demos', en: 'Product videos and demos', zh: '产品视频和演示' },
  { red: 'LinkedIn', usuario: 'Henry Arce', url: 'https://www.linkedin.com/in/luis-henry-programador',
    es: 'BI, datos e IA aplicada', en: 'BI, data and applied AI', zh: 'BI、数据与应用 AI' },
  { red: 'Instagram', usuario: '@henry_arce_dev', url: 'https://www.instagram.com/henry_arce_dev/',
    es: 'Reels y lo que vamos haciendo', en: 'Reels and work in progress', zh: '短视频和工作进展' },
  { red: 'TikTok', usuario: '@arcedatalab', url: 'https://www.tiktok.com/@arcedatalab',
    es: 'Vídeos cortos de producto', en: 'Short product videos', zh: '产品短视频' },
  { red: 'GitHub', usuario: 'larceing', url: 'https://github.com/larceing',
    es: 'El código abierto: Sindri, Aris…', en: 'Open source: Sindri, Aris…', zh: '开源代码：Sindri、Aris……' },
  { red: 'YouTube', usuario: 'Club Byte', url: 'https://www.youtube.com/@clubbyte_es',
    es: 'Tecnología para niños', en: 'Technology for kids', zh: '给孩子的科技节目' }
];

// Textos fijos de la página.
const TEXTOS = {
  es: {
    menu: 'Novedades',
    titulo: 'Novedades',
    descripcion: 'En qué está trabajando Arce Data Lab, lo último que ha salido, dónde publicamos y las publicaciones de LinkedIn.',
    sub: 'En qué estamos trabajando, lo último que ha salido y dónde nos puedes seguir.',
    ahora: 'Ahora mismo',
    ultimas: 'Lo último',
    canales: 'Dónde publicamos',
    canalesSub: 'Todo lo que hacemos sale aquí. Síguenos donde te sea más cómodo.',
    linkedin: 'En LinkedIn',
    ver: 'Verlo',
    seguir: 'Seguir',
    tipos: { nuevo: 'Nuevo', mejorado: 'Mejorado', en_preparacion: 'En preparación', video: 'Vídeo', capitulo: 'Capítulo' },
    play: 'Ver el vídeo'
  },
  en: {
    menu: 'News',
    titulo: 'News',
    descripcion: 'What Arce Data Lab is working on, the latest releases, where we publish and our LinkedIn posts.',
    sub: 'What we are working on, what has just come out and where you can follow us.',
    ahora: 'Right now',
    ultimas: 'Latest',
    canales: 'Where we publish',
    canalesSub: 'Everything we make goes out here. Follow us wherever suits you best.',
    linkedin: 'On LinkedIn',
    ver: 'See it',
    seguir: 'Follow',
    tipos: { nuevo: 'New', mejorado: 'Improved', en_preparacion: 'Coming soon', video: 'Video', capitulo: 'Episode' },
    play: 'Watch the video'
  },
  zh: {
    menu: '动态',
    titulo: '动态',
    descripcion: 'Arce Data Lab 正在做什么、最新发布、我们在哪里发布内容，以及 LinkedIn 文章。',
    sub: '我们正在做的事、最新发布的内容，以及在哪里关注我们。',
    ahora: '正在进行',
    ultimas: '最新动态',
    canales: '我们在哪里发布',
    canalesSub: '我们做的一切都会发布在这里。选择你最方便的平台关注我们。',
    linkedin: 'LinkedIn 上',
    ver: '查看',
    seguir: '关注',
    tipos: { nuevo: '新品', mejorado: '更新', en_preparacion: '即将推出', video: '视频', capitulo: '新一集' },
    play: '观看视频'
  }
};

module.exports = { AHORA, NOVEDADES, CANALES, TEXTOS, MEDIOS, N8N_NOVEDADES };
