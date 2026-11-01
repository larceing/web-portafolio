// Página /novedades/ (y /en/novedades/, /zh/novedades/): en qué estamos
// trabajando, lo último que ha salido, dónde publicamos y las publicaciones
// de LinkedIn, todo en una página. La genera construir.js.
//
// Para añadir una novedad, ponla ARRIBA de NOVEDADES con su fecha (AAAA-MM-DD),
// sus textos en es, en y zh y, si quieres, un enlace dentro de la web (ruta
// relativa a la raíz, como 'lab/#sindri') o fuera (https://...). Luego:
//   node construir.js

// Lo que tenemos entre manos ahora mismo (3 tarjetas).
const AHORA = [
  {
    es: ['Ada publica en nuestros canales', 'Cada semana prepara vídeos, reels y posts; cada noche repasa el día. Nada sale sin revisión.'],
    en: ['Ada publishes on our channels', 'Every week it prepares videos, reels and posts; every night it reviews the day. Nothing goes out unchecked.'],
    zh: ['Ada 在我们的频道上发布内容', '每周准备视频、短视频和帖子；每晚回顾当天情况。未经审核的内容一律不发。'],
    enlace: 'lab/#ada'
  },
  {
    es: ['Brokkr, el CRM en tablet', 'El CRM para el comercial de una pyme industrial, conectado con Sindri. En desarrollo.'],
    en: ['Brokkr, the tablet CRM', 'The CRM for the sales rep of an industrial SME, connected to Sindri. In development.'],
    zh: ['Brokkr：平板上的 CRM', '为工业中小企业销售人员打造的 CRM，与 Sindri 相连。开发中。'],
    enlace: 'lab/#brokkr'
  },
  {
    es: ['Club Byte', 'Tecnología explicada a niños de 8 a 12 años, con capítulos y reels cada semana.'],
    en: ['Club Byte', 'Technology explained to kids aged 8 to 12, with new episodes and reels every week.'],
    zh: ['Club Byte', '给 8 到 12 岁孩子讲解科技，每周更新节目和短视频。'],
    enlace: 'proyectos/clubbyte/'
  }
];

// Lo último, de más nuevo a más antiguo.
const NOVEDADES = [
  {
    fecha: '2026-11-01',
    es: ['Una web sin cookies al entrar', 'Aviso legal, privacidad y cookies publicados. No ponemos cookies propias, así que no hace falta banner; LinkedIn solo carga si tú lo pides.'],
    en: ['A website with no cookies on arrival', 'Legal notice, privacy and cookie policy are live. We set no cookies of our own, so no banner is needed; LinkedIn only loads if you ask for it.'],
    zh: ['进入网站时不设置 Cookie', '法律声明、隐私和 Cookie 政策已发布。我们不设置自己的 Cookie，因此无需弹窗；LinkedIn 只有在你要求时才会加载。'],
    enlace: 'cookies/'
  },
  {
    fecha: '2026-10-29',
    es: ['La web, también en chino', 'Toda la web en español, inglés y chino, con el selector ES · EN · 中文 en la cabecera.'],
    en: ['The website, now in Chinese too', 'The whole site in Spanish, English and Chinese, with the ES · EN · 中文 switch in the header.'],
    zh: ['网站推出中文版', '整个网站提供西班牙语、英语和中文版本，页眉中可切换 ES · EN · 中文。']
  },
  {
    fecha: '2026-10-28',
    es: ['El laboratorio, en tres idiomas y con vídeo', 'Cada producto tiene un vídeo de 20 a 25 segundos grabado en la app real, y las simulaciones funcionan en español, inglés y chino.'],
    en: ['The lab, in three languages and with video', 'Each product has a 20–25 second video recorded in the real app, and the simulations work in Spanish, English and Chinese.'],
    zh: ['实验室：三种语言，配有视频', '每个产品都有一段在真实应用中录制的 20 到 25 秒视频，模拟演示支持西班牙语、英语和中文。'],
    enlace: 'lab/#sindri'
  },
  {
    fecha: '2026-10-27',
    es: ['Plantillas de web para negocios locales', 'Un catálogo de webs de ejemplo para bares, clínicas, peluquerías y talleres, listas para adaptar.'],
    en: ['Website templates for local businesses', 'A catalogue of sample sites for bars, clinics, hair salons and garages, ready to adapt.'],
    zh: ['本地商家网站模板', '为酒吧、诊所、理发店和修车厂准备的示例网站目录，可直接改用。'],
    enlace: 'plantillas/'
  },
  {
    fecha: '2026-10-26',
    es: ['Reporting BI por lotes', 'Análisis comercial, de fabricación y OEE, de pedidos y de calidad y scrap, con su demo en el laboratorio.'],
    en: ['BI reporting in packs', 'Sales, manufacturing and OEE, orders, and quality and scrap analysis, each with its demo in the lab.'],
    zh: ['分模块的 BI 报表', '销售、生产与 OEE、订单、质量与报废分析，每个都可以在实验室里试用。'],
    enlace: 'lab/#reporting'
  },
  {
    fecha: '2026-10-26',
    es: ['Sindri con la familia Ada', 'Cuatro oficinas Ada (comercial, pedidos, producción y planta) se pasan el trabajo hasta el ERP. Pruébalo en la simulación.'],
    en: ['Sindri with the Ada family', 'Four Ada offices (sales, orders, production and plant) hand work over to the ERP. Try it in the simulation.'],
    zh: ['Sindri 与 Ada 家族', '四个 Ada 办公室（销售、订单、生产和车间）把工作一路交给 ERP。在模拟中亲自试试。'],
    enlace: 'lab/#sindri'
  },
  {
    fecha: '2026-10-25',
    es: ['La oficina de Ada, en 3D', 'Mira a cada agente de Ada trabajar en una campaña simulada, con sus herramientas y lo que espera tu OK.'],
    en: ['Ada’s office, in 3D', 'Watch each Ada agent work on a simulated campaign, with its tools and what is waiting for your OK.'],
    zh: ['Ada 的 3D 办公室', '观看每个 Ada 智能体在模拟营销活动中工作，查看它们的工具以及等待你确认的内容。'],
    enlace: 'lab/#ada'
  },
  {
    fecha: '2026-10-25',
    es: ['Abre el laboratorio', 'Simulaciones de nuestros productos que funcionan en tu navegador, con datos inventados: nada se guarda.'],
    en: ['The lab opens', 'Simulations of our products that run in your browser, with made-up data: nothing is saved.'],
    zh: ['实验室上线', '我们产品的模拟演示直接在浏览器中运行，使用虚构数据：不保存任何内容。'],
    enlace: 'lab/'
  }
];

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
    ver: 'Ver',
    seguir: 'Seguir'
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
    ver: 'See',
    seguir: 'Follow'
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
    seguir: '关注'
  }
};

module.exports = { AHORA, NOVEDADES, CANALES, TEXTOS };
