// Textos de la versión en chino (simplificado). Misma estructura que
// contenido.en.js: construir.js los combina con los datos en español y lo que
// no aparezca aquí (iconos, colores, enlaces) se toma de allí.
// PROYECTOS va por id; AREAS, TRAYECTORIA y TECNOLOGIAS, en el mismo orden.

module.exports = {
  PORQUE: {
    titulo: '为什么选择和我合作？',
    sub: '和找广告公司或买现成软件相比，有什么不同',
    lista: [
      ['你直接和动手做的人沟通', '评估时听你讲需求的人，就是设计、编写并交付成果的人。没有销售，也没有中间人。'],
      ['我了解企业的日常运转', '我从 2019 年开始做数据工作，先在咨询公司，现在在制造业企业内部，用过 A3、SAP、Clavei 等 ERP。'],
      ['书面固定报价', '开始之前你就知道要做什么、有几轮修改、花多少钱。最后不会有意外。'],
      ['认真保护你的数据', '能只读就只读，应用部署在欧盟的服务器上，每晚备份。'],
      ['不被绑定', '我交付时附带完整文档，而且我做的很多东西是开源的：联系我之前，你就能看到我是怎么工作的。'],
      ['我会衡量你的收获', '我会记录这项工作现在要花多长时间、之后要花多长时间，让你知道值不值得。']
    ]
  },
  SERV: {
    incluye: '包含内容',
    como: '合作流程',
    relacionados: '相关项目',
    otros: '其他服务',
    calcular: '估算价格',
    relacionado: '相关服务',
    probar: '在实验室试用',
    antesAhora: '改版前后',
    antesAhoraSub: '同样的内容，重新设计：我给客户做演示网站的首页。拖动分隔线对比。',
    antes: '改版前', ahora: '改版后',
    antesAlt: '演示网站首页改版前',
    ahoraAlt: '演示网站首页改版后',
    deslizar: '对比改版前后',
    plantillas: '查看网站模板示例',
    verPlantillas: '查看模板',
    plantillasSub: '28 个虚构商家的示例网站，开始之前可以先看看各种风格（模板为西班牙语）。',
    pasos: [
      ['免费评估', '45 分钟视频通话，一起看你的数据、你的工作，以及真正占用时间的事情。'],
      ['书面方案', '做什么、几轮修改、固定价格和交付时间，在看过数据后确定。'],
      ['开发', '过程中随时给你看进度。开始时付 50%，交付时付 50%，均开具发票。'],
      ['交付与培训', '系统上线运行，附带文档，并向你的团队讲解清楚。如有需要，可以继续按月维护。']
    ]
  },
  PORTADA: {
    menu: { hacemos: '我们做什么', lab: '实验室', proyectos: '项目', sobre: '关于我' },
    cta: '获取报价',
    ctaHref: 'https://wa.me/34633424223?text=' + encodeURIComponent('你好 Henry，我想为我的公司询价。具体需求是：'),
    carruselAria: 'Arce Data Lab 做什么',
    anterior: '上一条',
    siguiente: '下一条',
    pausar: '暂停轮播',
    seguir: '继续轮播',
    diapo: '第 {n} 条，共 {t} 条',
    carrusel: [
      { ante: '数据分析师与开发者 · 西班牙阿利坎特', titulo: '我让流程自动化，让 AI 处理业务数据。', texto: '我是 Henry Arce，Arce Data Lab 的创始人。我找出团队里的手工重复工作，把它们变成自动化流程、智能助手和报表，并衡量带来的收益。', boton: '获取报价', href: 'cta', img: 'img/ada/cabecera.svg', alt: 'Ada 位于中央，连接着电脑上的 Sindri ERP、平板上的 Aris 任务、Efesto 手持终端、手机上的营销活动，上方浮着报表、周计划和一张 Odin 工单' },
      { ante: 'Sindri · Brokkr · Efesto', titulo: 'ERP、CRM 和车间，彼此打通。', texto: '销售谈成的订单直接进入 ERP，工厂据此生产并记录，不用重复录入。', boton: '在实验室试用', href: 'lab/#efesto', img: 'img/ada/efesto.webp', alt: 'Efesto：车间设备连接到 Sindri' },
      { ante: '数据与报表', titulo: '你的数据，每天早上自动更新。', texto: '一个数字对得上、自动刷新的看板，不用再复制 Excel。', boton: '查看示例报表', href: 'lab/#reporting', img: 'img/ada/informe.webp', alt: '示例销售报表，包含月度销售额和主要客户' },
      { ante: '商家网站', titulo: '带来客户，而不只是访问量的网站。', texto: '为你的生意做网站、网店和预约系统，优先适配手机：客户点两下就能预约、挂号或下单。', boton: '查看网站模板示例', href: 'plantillas/', img: 'img/ada/webs.webp', alt: '两个示例模板：电脑上的餐厅网站和手机上的理发店网站' }
    ],
    lab: {
      titulo: '在实验室试用',
      sub: 'Ada 和我做的产品，使用虚构数据。不会保存任何内容。',
      pestanas: [
        ['Ada', 'ada', 'pedidos', '每个部门都有自己的工位（接收、处理、审核和登记），把工作一步步传到 ERP。你只需要检查不清楚的地方。', 'sindri'],
        ['Sindri · ERP', 'sindri', 'sindri', '订单、按批次管理的库存、生产，以及符合 VERI*FACTU 的发票。', 'sindri'],
        ['Brokkr · CRM', 'brokkr', 'brokkr', '销售在平板上工作，谈成的订单自动进入 ERP。', 'brokkr'],
        ['Efesto · 车间', 'efesto', 'efesto', '读取工厂设备数据并把产量发送到 ERP，断网时也不丢数据。', 'efesto'],
        ['Aris · 任务', 'aris', 'aris', '为团队提供看板、冲刺和知识库。Odin 的工单会自动变成任务。', 'tareas'],
        ['报表', 'reporting', 'informe', '在 Power BI 中查看销售、回款和库存，每天早上自动更新。', 'reporting'],
        ['网站 · 模板', 'webs', 'webs', '为商家打造的移动优先网站：预约、挂号和下单。28 个虚构商家的示例，可以直接打开试用。', '', 'plantillas/', '查看模板']
      ],
      alt: '实验室中的 {o}',
      boton: '在实验室试用',
      todos: '查看全部项目'
    },
    hacemos: {
      titulo: '我们做什么',
      lista: [
        ['escritorio', '企业管理软件', '围绕你的公司打造 ERP、CRM、任务和工单系统，或与你现有的系统对接。', 'servicios/webs/'],
        ['grafico', '数据与报表', '基于你的 ERP 或 Excel 搭建 Power BI 和 Fabric，数字准确对得上。', 'servicios/power-bi/'],
        ['flujo', '自动化', '邮件、订单、提醒和报表在你的各个软件之间自动流转。', 'servicios/automatizacion-n8n/']
      ],
      ver: '了解更多'
    },
    pasos: {
      titulo: '如何开始',
      lista: [
        ['你介绍情况', '通过 WhatsApp，或一次 45 分钟的免费视频通话。'],
        ['我发给你报价', '书面说明：做什么、多少钱、什么时候完成。'],
        ['我让它跑起来', '附带文档，并向你的团队讲解清楚。']
      ]
    },
    faq: [
      ['费用是多少？', '取决于要做什么。告诉我你的情况，我会给你一份书面固定报价，不需要任何承诺。'],
      ['你和中小企业合作吗？', '是的：和有手工重复工作或数字对不上的中小企业和工厂合作，可远程，也可在阿利坎特当面合作。'],
      ['我的数据安全吗？', '能只读就只读，应用部署在欧盟的服务器上，每晚备份。'],
      ['Arce Data Lab 是什么？', '这是我的品牌：我为中小企业和制造业打造自动化流程、数据看板、AI 助手和定制应用的实验室。']
    ],
    final: {
      titulo: '说说你的情况',
      texto: '如果你的团队有重复不断的工作，或者数字总是对不上，给我发消息，我会给你报价，不需要任何承诺。',
      cliente: '已经是客户？',
      clienteTexto: '如果你的应用有疑问或故障，请发邮件给技术支持，我当天回复。',
      clienteBoton: '发邮件给技术支持'
    },
    sobre: {
      titulo: '关于我',
      descripcion: 'Henry Arce，西班牙阿利坎特的数据分析师与开发者：职业经历、技术、自建基础设施，以及我在 LinkedIn 上写的内容。',
      sub: '我是 Henry Arce，西班牙阿利坎特的数据分析师与开发者，Arce Data Lab 的创始人。我从 2019 年开始做数据工作，先在咨询公司，现在在制造业企业内部。'
    },
    todosTitulo: '全部项目',
    todosDescripcion: 'Henry Arce 和 Arce Data Lab 的项目：ERP、CRM、AI 助手、自动化和数据看板，附带解决的问题和结果。'
  },
  SERVICIOS: {
    'power-bi': {
      titulo: '面向中小企业的 Power BI 顾问 | Arce Data Lab',
      corto: 'Power BI',
      h1: '面向中小企业的 Power BI 顾问',
      descripcion: '基于你的 ERP、Excel 或 SQL 搭建 Power BI 看板，数字准确，每天早上自动刷新。免费获取报价，无需承诺。',
      intro: '如果公司的数据分散在好几个 Excel 里，每个月都有人要花几个小时汇总，一个 Power BI 看板就能自动完成。我把它连接到你的 ERP、电子表格或数据库，和财务数据逐项核对，并附带文档交付。',
      incluye: [
        ['整理好的数据', '用 Power Query 清洗数据并建立数据模型：每个数字只有一个版本，即使来自多个来源。'],
        ['DAX 度量值', '销售、毛利、回款、库存或产量，与去年和目标对比。'],
        ['清晰的设计', '为决策而设计的页面：重点放在前面，筛选简单，并有手机版布局。'],
        ['自动刷新', '报表每天早上通过网关自动刷新，不需要任何人复制数据。'],
        ['文档', '每个数字衡量什么、来自哪里，让你的团队信任它、也能维护它。']
      ],
      lotesTitulo: '分析包',
      lotesIntro: '为每个部门预先设计好的报表，按你的 ERP 和你们的叫法调整。从最让你头疼的那个分析包开始，之后随时可以增加其他的。可以在实验室用虚构数据试用。',
      lotesBoton: '试用示例',
      lotes: [
        ['bi-comercial', '销售', '适用于管理层和销售团队', '我们卖得比去年多吗？谁欠我们钱？哪些货需要补？',
          ['按月份、客户和产品系列统计的销售额，与去年对比', '按账龄统计的应收账款和平均回款天数', '低于安全库存的物料和周转率']],
        ['bi-fabricacion', '生产与 OEE', '适用于车间主管', '设备在哪里浪费了时间？为什么？',
          ['按设备和产线统计的 OEE：可用率、性能和质量', '按天、原因和设备统计的小停机和大停机，以及平均故障间隔时间', '按产品统计的损失工时']],
        ['bi-pedidos', '订单与交付', '适用于物流和客服', '有多少订单按时送达？其余的为什么延误？',
          ['按周、仓库和承运商统计的准时交付率', '按原因和客户统计的延误', '未完成订单及其状态']],
        ['bi-calidad', '质量与废品', '适用于质量和生产部门', '我们报废了多少零件？花了多少钱？为什么？',
          ['按月份和工作中心统计的废品率', '按缺陷统计的不合格品和废品成本', '按零件号统计的实际与预计对比，以及废品最多的工单']]
      ],
      faq: [
        ['一个 Power BI 看板要多少钱？', '取决于数据来源、页面数量和计算的复杂度。告诉我你的情况，我会给你一份书面固定报价，不需要任何承诺。'],
        ['什么是分析包？', '为某个部门（销售、车间、物流或质量）设计好的一组 Power BI 页面，指标已经定义好。我把它连接到你的数据，并按你们的工作方式调整，不用从零开始。告诉我你对哪些分析包感兴趣，我会给你固定报价。'],
        ['我需要 Power BI 许可证吗？', '在自己电脑上制作和查看报表，用免费的 Power BI Desktop 就够了。要在线分享给团队，需要 Power BI Pro，按用户向微软付费。'],
        ['能对接我的 ERP 吗？', '我用过 A3 ERP、SAP、Clavei、Cybermax 和 SQL Server。只要你的 ERP 把数据存在数据库里，或能导出到 Excel，就能对接。'],
        ['之后我能自己修改吗？', '可以。我交付时附带文档，并讲解它是怎么搭建的。如果你不想自己动手，可以选择按月维护。']
      ]
    },
    'automatizacion-n8n': {
      titulo: '用 n8n 实现企业流程自动化 | Arce Data Lab',
      corto: 'n8n 自动化',
      h1: '用 n8n 实现流程自动化',
      descripcion: '我用 n8n 把团队每周重复的工作自动化：邮件、提醒、订单和报表在你的各个软件之间自动流转。',
      intro: '把邮件里的订单抄进 ERP、每周一发同样的提醒、把数据从一张表搬到另一张表，这些工作没有价值，还经常出错。我用 n8n 把它变成自动运行的流程，出错时会提醒，并部署在欧盟的服务器上。',
      incluye: [
        ['工作梳理', '我们一起看哪些工作是手工做的、多久做一次、花多长时间，从回报最高的开始。'],
        ['n8n 流程', '连接你的软件：邮件、Excel 或 Google Sheets、ERP、CRM、表单、WhatsApp 或任何 API。'],
        ['用真实数据测试', '上线之前测试，包括你那些特殊情况。'],
        ['出错提醒', '某一步出错时，你会收到说明原因的提醒，而不是悄无声息地失败。'],
        ['一小时培训', '让你的团队知道流程做什么，以及如何暂停或修改。']
      ],
      faq: [
        ['n8n 是什么？', 'n8n 是一个用可视化流程连接各种软件的自动化工具。它可以安装在你自己的服务器上，数据留在欧盟。'],
        ['哪些工作可以自动化？', '重复且步骤固定的工作：在软件之间复制数据、发送提醒或邮件、生成报表或 PDF、检查表单、分类消息。'],
        ['一个自动化流程要多少钱？', '取决于要连接多少个应用，以及特殊情况的多少。告诉我你的情况，我会给你一份书面固定报价。'],
        ['如果某个软件变了怎么办？', '流程停止工作时会提醒你，然后做相应调整。如果有按月维护，由我来处理。']
      ]
    },
    webs: {
      titulo: '面向中小企业的定制网站和 Web 应用 | Arce Data Lab',
      corto: '网站和应用',
      h1: '面向中小企业的定制网站和 Web 应用',
      descripcion: '为中小企业打造快速的网站和定制应用：预约、网店、CRM 或工单系统，使用你的品牌，部署在欧盟服务器上。',
      intro: '一个加载快、能在 Google 上被找到、让客户不用打电话就能预约或购买的网站。或者一个围绕你公司运作方式打造的应用，而不是让你去适应通用软件。我负责开发、部署在我自己的基础设施上，并负责维护。',
      incluye: [
        ['使用你的品牌设计', '适配手机、无障碍，不用笨重的模板。'],
        ['一开始就做好 SEO', '标题、结构化数据、站点地图和速度，让 Google 读懂你的网站。'],
        ['按需增加功能', '预约和挂号、网店、表单、客户专区、CRM 或管理后台。'],
        ['欧盟服务器', 'HTTPS、每晚备份，测试环境和正式环境分开。'],
        ['法律页面', '法律声明、隐私和 Cookie 政策，按你网站的实际功能编写。']
      ],
      faq: [
        ['做一个网站要多少钱？', '取决于页面数量和功能：展示型网站和带预约或网店的网站不一样。告诉我你需要什么，我会给你一份书面固定报价。'],
        ['你用 WordPress 吗？', '默认不用：我做定制网站，速度更快，安全维护更少。如果你已经有 WordPress 并且用得好，我们可以一起看看。'],
        ['网站托管在哪里？', '在我位于德国（欧盟）的服务器上，有 HTTPS、每晚备份，并持续检查是否正常响应。也可以放在你自己的主机上。'],
        ['我能自己改文字吗？', '如果需要，网站会带一个简单的后台，可以修改文字和图片；不需要的话，告诉我，我在按月维护中帮你改。']
      ]
    }
  },
  UI: {
    lang: 'zh-Hans',
    titulo: 'Henry Arce · 自动化、AI 应用与 Power BI | Arce Data Lab',
    descripcion: 'Henry Arce，Arce Data Lab 创始人（西班牙阿利坎特）：为中小企业和制造业提供自动化、AI 应用、Power BI 和定制应用。真实项目与开源作品。',
    ogDescripcion: '为中小企业和制造业提供自动化、AI 应用和数据服务。真实项目、数据看板与开源作品。',
    locale: 'zh_CN',
    idiomaNombre: '中文',
    linkedinTitulo: 'LinkedIn 文章',
    linkedinDescripcion: 'Henry Arce 在 LinkedIn 上关于 BI、数据和 AI 应用的文章。',
    linkedinSub: '我写的关于 BI、数据和 AI 应用的内容（西班牙语）',
    linkedinMarco: 'LinkedIn 文章',
    linkedinVer: '在 LinkedIn 上打开',
    linkedinFallo: 'LinkedIn 没有加载这篇文章（有些浏览器会拦截）。可以通过下面的链接在 LinkedIn 上阅读。',
    sinProyectos: '这一类暂时还没有项目。如果你有想法，欢迎告诉我。',
    linkedinPerfil: '在我的 LinkedIn 主页查看全部',
    verPublicaciones: '在这里阅读文章',
    saltar: '跳到正文',
    lema: '自动化 · AI · 数据',
    secciones: '栏目',
    menu: { servicios: '服务', arce: 'Arce Data Lab', proyectos: '项目', trayectoria: '经历', tecnologias: '技术', preguntas: '常见问题', contacto: '联系' },
    otroIdioma: 'Español',
    otroIdiomaAria: 'Versión en español',
    antetitulo: '数据分析师与开发者 · 西班牙阿利坎特',
    lema2: '适度即是最好',
    h1: '我让流程自动化，让 AI <em>处理业务数据。</em>',
    intro: '我是 Henry Arce，常驻西班牙阿利坎特的数据分析师与开发者，<a href="#arcedatalab">Arce Data Lab</a> 的创始人。我找出团队里的手工重复工作，把它们变成自动化流程、智能助手和报表，并衡量带来的收益。从 2019 年开始，先在咨询公司，现在在制造业企业内部。',
    fotoAlt: 'Henry Arce 在瓦伦西亚艺术科学城',
    areasAria: '工作领域',
    verProyectos: '查看项目',
    franja: '你的数据还在 Excel 里？我免费帮你看 45 分钟。',
    inicioBotones: ['查看项目', '聊聊吧'],
    datosClave: [
      ['2019', '开始做数据工作，从咨询公司到工厂车间'],
      ['', '个有文档的项目，附带问题和结果'],
      ['139,760', '我阅读量最高的 LinkedIn 文章的展示次数'],
      ['欧盟', '自有服务器，每晚备份']
    ],
    queHago: '你的公司能获得什么',
    queHagoSub: '从最简单到最完整。我们从最占用你时间的事情开始。',
    nivelesNombres: ['入门', '进阶', '完整'],
    niveles: [
      ['flujo', '工作自动化', ['自动发送的提醒和邮件', '不用手工复制就能填好的表单和表格', '贯穿 ERP、CRM 和邮件的完整流程']],
      ['bot', 'AI 助手', ['回答常见问题', '能检索你文档的助手', '查询你的 ERP 且不编造数字的 AI']],
      ['grafico', '数据与 Power BI', ['整理好的 Excel，数字对得上', '只显示关键信息的看板', '每天早上自动刷新的报表']],
      ['escritorio', '定制应用', ['带预约或挂号的网站', 'CRM 或工单管理系统', '打通的 ERP 和 CRM，使用你的品牌']]
    ],
    verServicios: '查看服务',
    verTodos: '查看全部 {n} 个项目',
    verProyectosHechos: '查看已完成的项目',
    serviciosTitulo: '服务',
    serviciosDescripcion: '为中小企业提供 n8n 流程自动化、Power BI 看板、AI 助手和定制网站。免费获取报价，无需承诺。',
    whatsappDiagnostico: 'https://wa.me/34633424223?text=' + encodeURIComponent('你好 Henry，我想为我的公司询价。具体需求是：'),
    proyectos: '项目',
    proyectosSub: '主要项目可以在实验室用虚构数据试用。其他项目在下面简要列出。',
    principales: '主要项目',
    masProyectos: '更多项目',
    masSub: '点开任意一个，查看它解决了什么问题、我是怎么做的',
    enLab: '在实验室中',
    verCaso: '查看案例',
    tambien: '实验室中还有',
    filtrosAria: '筛选项目',
    todos: '全部',
    tipos: { producto: '自有产品', empresa: '为企业开发', abierto: '开源' },
    enlaces: { 'Probar la demo': '试用演示', 'Código': '代码', 'Ver en GitHub': '在 GitHub 上查看', 'Ver el canal': '观看频道', 'Leer el blog': '阅读博客', 'Mail en GitHub': 'GitHub 上的 Mail', 'Report Server en GitHub': 'GitHub 上的 Report Server' },
    trayectoria: '经历',
    trayectoriaSub: '从咨询公司到工厂车间',
    tecnologias: '技术',
    tecnologiasSub: '我使用的工具',
    divulgacion: '写作',
    divulgacionSub: '我在 LinkedIn 上用西班牙语写 BI 和 AI 应用',
    cifras: [
      ['139,760', '次展示 · Windows CMD 命令速查表'],
      ['51,431', '次展示 · 数据从业者必须掌握的 10 个术语'],
      ['29,131', '次展示 · VBA，Excel 的智慧老爷爷']
    ],
    contacto: '聊聊吧',
    contactoSub: '如果你的团队有重复不断的工作，或者数据对不上，告诉我',
    verPublicacion: '查看文章',
    telefono: '也可以用 WhatsApp',
    pie: '西班牙阿利坎特',
    pieFrase: '为想用数据做决策的企业提供数据、Power BI 和定制开发。',
    pieNav: '网站',
    pieRedes: '社交媒体',
    escribemeWhatsapp: '在 WhatsApp 上给我发消息',
    cerrar: '关闭',
    verFicha: '完整项目页面',
    volver: '返回全部项目',
    migas: '首页',
    otrosProyectos: '其他项目',
    servicios: '服务',
    serviciosSub: '通过 Arce Data Lab，我能为你的公司做什么',
    serviciosLista: [
      ['flujo', '流程自动化', '我消除重复的手工工作：自动生成的报表、在软件之间自动流转的数据、自动提醒和邮件。', 'n8n、Python、Power Automate、API', 'automatizacion-n8n'],
      ['grafico', '数据看板与 BI', '基于你的 ERP 或电子表格搭建 Power BI 和 Microsoft Fabric：销售、回款、库存和生产，数字经过核对并有文档说明。', 'Power BI、DAX、Fabric、SQL', 'power-bi'],
      ['bot', '基于你数据的 AI 助手', '以只读方式查询你的数据来回答业务问题的助手，不编造数字，可以用文字或 Excel 回答。', '智能体、Claude、OpenAI、SQL', ''],
      ['escritorio', '定制网站和应用', 'ERP、CRM、预约、工单或网店：带登录、备份并部署在我自有基础设施上的网站和 Web 应用。', 'Node.js、Python、Next.js、Docker', 'webs']
    ],
    verServicio: '查看服务',
    serviciosNota: '每个项目都不一样，所以我不公开价目：告诉我你需要什么，我会给你一份书面固定报价，不需要任何承诺。如果你需要网站，可以先看看<a href="https://arcedatalab.com/plantillas/" data-dev="https://dev.luiscontacto03.com/web/plantillas/">网站模板示例</a>。',
    serviciosCta: '获取报价',
    serviciosPago: '开始时付 50%，交付时付 50%，可银行转账或刷卡，均开具发票。',
    cinta: '自动化在运行',
    cintaSub: '一个自动化流程在做什么，缩小版演示',
    cintaPasos: [
      ['手工工作进来', '今天还需要有人手工复制的表格、邮件和 PDF。'],
      ['流程自动处理', '读取、检查并匹配数据，无需人工干预。'],
      ['结果输出', '每天早上得到报表、提醒和最新数据。']
    ],
    infra: '我的基础设施',
    infraLeyenda: ['HTTPS 代理', '服务器', '容器中的应用', '每晚备份'],
    infraSub: '我自己运行和维护的系统，我的应用和客户的应用都在这里',
    infraTexto: '我不依赖封闭平台：我运行自己的服务器，具备安全上线、测试并发布到正式环境所需的一切。',
    infraLista: [
      ['自有服务器', 'Hetzner（德国，欧盟）上的 Linux + Docker。每个应用一个容器，统一经过 HTTPS 代理。'],
      ['DEV 和 PRO 环境', '每个应用上线前都先测试，一键“回滚”，服务器自己部署的应用还能自动回滚。'],
      ['单点登录', '所有应用使用 Keycloak，按应用和环境划分用户组。'],
      ['域名和证书', 'Nginx Proxy Manager 配合 Let’s Encrypt 提供 HTTPS；托管在 Cloudflare 的域名自动创建 DNS 记录。'],
      ['品牌邮箱', '基于 Resend 的 Mail 服务：应用从 soporte@arcedatalab.com 发信，配置了 SPF、DKIM 和 DMARC。'],
      ['PDF 文档', 'Report Server 用模板生成发票、订单和送货单。'],
      ['持续部署', 'GitHub Actions 构建每个版本，并发布到 GitHub Container Registry。'],
      ['备份与告警', '主要应用的数据库每晚备份，并持续检查每个应用是否正常响应。']
    ],
    infraEnlace: '在 GitHub 上查看这个平台',
    arce: 'Arce Data Lab',
    arceSub: '我的品牌：为中小企业提供数据、自动化和 AI',
    clubbyteLinea: '我还在做 <strong>Club Byte</strong>，一个让 8 到 12 岁孩子爱上科技的西班牙语频道：',
    arceTexto: '<strong>Arce Data Lab</strong> 是我为中小企业和制造业打造应用、数据看板和 AI 助手的实验室，有自己的部署平台、邮件和文档服务。所有标为自有产品的项目都在这里。',
    arceEnlacesTextos: ['客户演示', 'TikTok @arcedatalab'],
    clubbyteTitulo: 'Club Byte',
    clubbyteTexto: '<strong>Club Byte</strong> 是一个独立于 Arce Data Lab 的个人 3D 动画项目，使用西班牙语：通过 Lía、Teo 和机器人 Bit，向 8 到 12 岁的孩子讲解计算机是怎么工作的。它的大哥 Byte 就是在这个页面陪着你的 Arce Data Lab 助手。每一集最后都有一个不用屏幕的挑战，可以在家里或课堂上完成。',
    clubbyteEnlacesTextos: ['YouTube @clubbyte_es', '面向家长和老师的博客'],
    bitAlt: 'Byte，Arce Data Lab 的助手',
    preguntas: '常见问题',
    preguntasSub: '大家最常问的问题，每个一句话回答',
    faq: [
      ['Henry Arce 是谁？', 'Luis Henry Arce Inga，通常称为 Henry Arce，是常驻西班牙阿利坎特的数据分析师与开发者，专注于流程自动化、AI 应用和 Power BI，也是 Arce Data Lab 的创始人。'],
      ['Arce Data Lab 是什么？', 'Arce Data Lab 是 Henry Arce 的品牌，为中小企业和制造业打造定制应用、数据看板和 AI 集成；网站是 arcedatalab.com。'],
      ['Arce Data Lab 提供哪些服务？', '流程自动化、Power BI 和 Microsoft Fabric 数据看板、基于业务数据的 AI 助手，以及定制应用（ERP、CRM、预约），部署在欧盟的自有基础设施上。'],
      ['他做哪些类型的项目？', '把重复工作自动化，打通 ERP、CRM 和数据库，制作 Power BI 和 Microsoft Fabric 报表，并让 AI 助手以只读方式回答业务数据问题。'],
      ['他和中小企业合作吗？', '是的：和有手工重复工作或数据对不上的中小企业和工厂合作，可远程，也可在阿利坎特当面合作。'],
      ['我的数据安全吗？', '安全：尽可能使用只读访问，应用运行在欧盟的服务器上，每晚备份。'],
      ['他在哪里发布内容？', '在 LinkedIn 上写 BI、数据和 AI 应用，在 TikTok（@arcedatalab）上分享自动化和数据小技巧，还有 Instagram（@henry_arce_dev）。很快也会在 YouTube 的 Imagina en IT 频道发布。'],
      ['怎么联系他？', '发邮件到 info@arcedatalab.com，WhatsApp +34 633 42 42 23，或通过 LinkedIn；应用技术支持请发邮件到 soporte@arcedatalab.com。']
    ],
    faqServicios: [
      ['一个项目要多少钱？', '取决于有多少个数据来源、数据的状态，以及需要做什么。告诉我你的情况，我会给你一份书面固定报价，不需要任何承诺。'],
      ['需要多长时间？', '每个情况差别很大：有多少个数据来源、数据的状态，以及需要做什么。所以交付时间在免费评估、看过你的数据之后书面约定，并且会按时完成。'],
      ['怎么开始？', '你通过 WhatsApp 或邮件联系我，我们一起看你的情况（需要的话进行 45 分钟的免费视频通话），然后我把书面报价发给你。']
    ],
    soporte: '应用技术支持',
    bit: {
      nombre: 'Byte，Arce Data Lab 的助手',
      hola: '你好，我是 Byte，Arce Data Lab 的助手。我会带你浏览这个网站，并总结每个项目。',
      servicios: '如果你公司里有每周都重复的工作，那它很可能可以自动化。',
      infraestructura: '这个网站和客户的应用都运行在这里：容器、HTTPS 和每晚备份。',
      arcedatalab: 'Arce Data Lab 为中小企业打造软件、数据看板和 AI 助手。',
      proyectos: '点开任意一个项目，我来总结问题、方案和结果。',
      ficha: '项目摘要。',
      jugar: ['你阅读的时候，我在检查数据。', '系统检查：一切正常。', '我还在这儿。需要摘要的话告诉我。', '正在检查每个应用是否正常响应。'],
      dormir: '节能模式。动一下鼠标，我就回来。',
      despertar: '我回来了。有什么可以帮你？',
      cinta: '自动化就是这样工作的：手工数据进去，完整的报表出来，全程无需人手。',
      trayectoria: '咨询、银行和制造业：用真实数据、赶真实工期的经验。',
      tecnologias: '经过生产环境检验的工具，按需选择。',
      preguntas: '开始项目前大家最常问的问题，简短回答。',
      contacto: '想聊聊你的情况？发邮件到 info@arcedatalab.com，Henry 会回复你。',
      pulsar: ['我在这儿。双击我，我帮你给 Henry 留言。', '想看某个项目的摘要？点开任意一个就行。', '小建议：先把最花时间的工作自动化。', '数据对不上时，几乎总能找到可以解决的原因。', '1 个字节是 8 位。好的流程，0 次重复工作。'],
      mensaje: {
        titulo: '给 Henry 留言',
        sub: 'Byte 帮你写好草稿，然后打开你的邮箱或 WhatsApp，内容都已填好。这个网站不会保存任何内容。',
        nombre: '你的名字', empresa: '公司（可选）', texto: '他能帮你做什么？',
        ejemplo: '例如：每周一我们要把 ERP 里的销售数据复制到 Excel，要花 3 个小时。',
        correo: '通过邮件发送', whatsapp: '通过 WhatsApp 发送', cerrar: '关闭',
        vacio: '请至少写一句话，让 Henry 知道你需要什么。',
        abriendo: '正在打开你的应用……',
        listo: '好了：请在打开的窗口里点击发送。Henry 通常当天回复。',
        fallo: '什么都没打开？复制这条消息，发送到 ',
        copiar: '复制消息', copiado: '已复制',
        asunto: '来自 arcedatalab.com 的留言', hola: '你好 Henry，我是'
      },
      ocultar: '隐藏 Byte',
      mostrar: '显示 Byte',
      canal: '观看 Club Byte'
    }
  },

  AREAS: [
    { titulo: '自动化', texto: '消除手工工作的流程和集成' },
    { titulo: 'AI 应用', texto: '基于业务数据的助手和智能体' },
    { titulo: '数据与 BI', texto: '真正被使用、能衡量效果的报表' },
    { titulo: '企业系统', texto: '深入了解 ERP、CRM 和电商' }
  ],

  PROYECTOS: {
    ada: {
      corto: 'Ada，营销', titulo: 'Ada：用 n8n 和 AI 做我的渠道营销', etiqueta: '自有产品 · 运行中 · 2026',
      resumen: '为五个渠道准备、审核并发布视频和帖子。每周一个周期，每晚一次检查，队列里的内容不经审核绝不发出。',
      probar: '当一周的 Ada：故事、用完的额度、晚上 8 点的审核和发布。',
      caso: [
        ['问题', '每天为 YouTube、Instagram、TikTok 和 LinkedIn 制作视频、封面和文案，会占满整个晚上；一旦哪里出错，当天就什么都发不出去。'],
        ['我做了什么', 'Ada，一个在 n8n 中按两个周期运行的系统。每周它请 ChatGPT 写故事，并准备剧集、短视频、帖子和推广活动；每晚它回顾当天，如果值得，就准备一条新闻视频。ChatGPT 负责写故事和生成图片，Google AI Studio 负责配音，剪辑、片段和封面来自我自己的视频引擎。所有内容进入一个队列：发布前一天晚上 8 点，它检查封面、文案、时间、每个渠道每天最多三条、14 天内不重复话题，并发一封邮件，每条内容都有一个“停止”按钮。'],
        ['结果', '审核通过的内容通过 Buffer 和 YouTube API 发布，视频自动归档。有错误和告警日志：如果图片或配音额度用完，它会记录时间，等有额度时再继续；如果某个渠道失败，会提示手动上传。审核和告警已上线；自动发布正在测试中。']
      ],
      tec: ['n8n', 'OpenAI API', 'Google AI Studio', 'Buffer', 'YouTube API', 'rclone']
    },
    clubbyte: {
      corto: 'Club Byte', titulo: 'Club Byte：讲给 8 到 12 岁孩子听的科技', etiqueta: '个人项目 · 3D 动画 · 2026',
      caso: [
        ['问题', '用西班牙语、通过故事和角色向孩子讲解计算机原理，而且背后不推销课程的内容，几乎没有。'],
        ['我做了什么', '一个 YouTube 频道和一个博客，有两个主角 Lía 和 Teo，还有用 Blender 做的机器人 Bit。每一集讲一个概念（传感器、条件判断、二进制、算法），最后有一个不用屏幕的挑战，可以在家里或课堂上完成。'],
        ['结果', '一段 3D 动画片头、剧本、配音和第一集，以及一个面向家长和老师、带活动练习单的博客。没有 Cookie，也没有追踪，儿童网站理应如此。']
      ],
      tec: ['Blender', 'Python', '教育剧本', '面向家长和老师的 SEO']
    },
    plataforma: {
      corto: 'DEV/PRO 平台', titulo: '把应用部署到 DEV 和 PRO 的自建平台', etiqueta: '开源 · Arce Data Lab · 2026',
      caso: [
        ['问题', '每个应用都在服务器上手工部署，域名、登录和备份各用一套做法。'],
        ['我做了什么', '一个在同一台服务器上为每个应用提供测试环境和正式环境的系统。应用通过一个清单文件接入，系统自动创建它的路径、Keycloak 用户组、带证书的域名，并从 GitHub 镜像部署。'],
        ['结果', '大约十个应用运行在一台服务器上，有“部署”“发布到 PRO”和“回滚”按钮，服务器部署的应用能自动回滚，还有一个在测试通过后自我更新的代理程序。']
      ]
    },
    sindri: {
      corto: 'Sindri ERP', titulo: 'Sindri：面向小型制造企业的 ERP', etiqueta: '自有产品 · 开源 · 2026',
      resumen: '面向小工厂的 ERP：订单、按批次管理的仓库、符合 VERI*FACTU 的发票，并通过 Efesto 连接车间。',
      probar: '从销售到车间：商机、订单、工艺路线、带批次的托盘和送货单。',
      texto: '面向小工厂的 ERP：客户、报价、订单、工艺路线、送货单、符合西班牙 VERI*FACTU 规定的发票，以及按批次管理的仓库。它有桌面版，通过 Efesto 连接车间，通过 CRM Brokkr 连接销售。它从 Odin 接收可计费的技术支持工时，并用 Report Server 生成 PDF。',
      tec: ['PostgreSQL (PGlite)', 'Electron', 'OPC UA', 'REST API', 'Docker']
    },
    gestor: {
      corto: 'Odin，工单', titulo: 'Odin：工单、文档和技术支持工时', etiqueta: '自有产品 · 开源 · 2026',
      caso: [
        ['问题', '工单靠手工记录，工时记在电子表格里，发票又在别的地方。彼此之间完全没有连接。'],
        ['我做了什么', '我自己的 Web 应用，每张工单都有跟进记录、文档和计时的工作时段。它最初基于 MantisBT，现在已经有了自己的数据表，历史数据也已迁移。'],
        ['结果', '通过 Keycloak 单点登录，每张未关闭的工单都会在任务管理器中生成任务，待结算工时自动流转到 Sindri 开票。通过 Mail 服务发送品牌邮件。']
      ]
    },
    servicios: {
      corto: 'Mail 和 Report Server', titulo: 'Mail 和 Report Server：为所有应用提供邮件和 PDF', etiqueta: '开源 · 共享服务 · 2026',
      texto: '我所有应用共用的两个服务。<strong>Mail</strong> 通过 Resend 从 <code>soporte@arcedatalab.com</code> 发送 Arce Data Lab 品牌邮件，支持模块（标题、按钮、表格、图片）、附件、按应用分配的密钥和发送记录。<strong>Report Server</strong> 用 pdfme 在浏览器中设计 PDF 模板，以只读方式连接 MariaDB，并通过 API 生成发票、订单和送货单。'
    },
    gateway: {
      corto: '数据网关', titulo: '实时数据网关', etiqueta: '为 Grupo SPSIL 开发 · 2026',
      caso: [
        ['问题', '仓库需要在网页上查看实时库存，但数据库在内网，不能开放任何入站端口。'],
        ['我做了什么', '一个类似 Power BI 网关的方案：内网中的代理程序向网站建立 WebSocket 隧道，按需查询 MariaDB 和 SQL Server，并通过同一条隧道返回数据。'],
        ['结果', '车间触摸屏上显示分钟级更新的库存，按部门分配权限，界面支持西班牙语、中文和英语，并可导出到 Excel。']
      ]
    },
    crm: {
      corto: 'Forja，预约', titulo: 'Forja：离线可用的平板预约应用', etiqueta: '自有产品 · 开发中',
      caso: [
        ['问题', '一家在医院管理患者预约的企业，一直用一个基于电子表格的应用，已经不够用了，而且医院里不一定有信号。'],
        ['我做了什么', '我把它重写成一个有自己数据库的 Web 应用，外加一个离线可用的平板应用：数据先存在本地，把修改排队，网络恢复后以带版本的事件同步。'],
        ['结果', '日程、患者、服务、付款、文档和提醒集中在一处，还有一个冲突处理界面，用来决定两台设备修改同一内容时以哪个为准。部署在我自己的服务器上。']
      ]
    },
    asistente: {
      corto: 'Lin-AI，助手', titulo: 'Lin-AI：基于 ERP 的 AI 助手', etiqueta: '为 Grupo SPSIL 开发 · 2026',
      resumen: '用自然语言向 ERP 提业务问题，采用封闭式查询，不会编造数据。',
      probar: '向 ERP 提问，看它选择了哪个查询，并下载答案。',
      texto: '一个以只读方式查询 ERP 来回答业务问题的助手。每类查询都是一个封闭的函数；模型只决定用哪个、用什么参数，所以不会编造数据。它依靠可编辑的业务说明来理解每个数字是怎么计算的，可以用文字或 Excel 回答。',
      tec: ['Python', '智能体', '知识库', 'SQL Server']
    },
    reporting: {
      corto: 'BI 报表', titulo: '销售、回款和库存报表', etiqueta: '为 Grupo SPSIL 开发 · 2025–2026',
      resumen: 'Power BI 中的销售、回款和库存报表，已迁移到 Microsoft Fabric，并做了前后核对。',
      probar: '筛选、切换页面，并一步步刷新模型。',
      texto: '基于 ERP 为管理层、销售和采购制作的 Power BI 报表。一次网络调整切断了数据源之后，我把处理流程迁移到了 Microsoft Fabric 的 Dataflows 和 Lakehouse。每次修改视图都附带备份、回滚脚本和前后核对。'
    },
    nutricion: {
      corto: '营养应用', titulo: '营养与训练应用', etiqueta: '自有产品 · Web 应用',
      texto: '一个帮助科学减重的个人应用：根据热量目标，从 500 多种食物的目录中生成每周计划，根据所选内容生成购物清单，并从你标记为“喜欢”的内容中学习。每个设计决定都记录在更新日志里。'
    },
    escritorio: {
      corto: '桌面报表', titulo: '无需 Power BI 的运营报表', etiqueta: '为 Grupo SPSIL 开发 · 桌面应用',
      texto: '一个桌面应用，直接从 SQL Server 或 Lakehouse 生成按客户和产品系列统计的报价报表。计算在数据库中完成，不占用电脑资源，支持筛选、导出 Excel，并有自动化测试。'
    },
    tienda: {
      corto: '网店', titulo: '带自有管理后台的网店', etiqueta: '为零售商开发 · 开发中',
      texto: '为一家丝网印刷店做的网店：商品目录、购物车和结账，还有一个定制的后台，用来管理商品和订单。借助 Docker，一条命令就能全部启动。'
    },
    helpdesk: {
      corto: '内部服务台', titulo: '内部服务台、考勤和 IT 成本', etiqueta: '在 ES Group · 2026',
      texto: '为两座生产工厂开发的内部工具：自建的技术支持服务台、考勤、IT 成本监控，以及集团各工厂之间的发票集成。'
    },
    plantillas: {
      corto: '网站模板', titulo: '面向本地商家的网站模板', etiqueta: '自有产品 · 2026',
      texto: '28 个虚构商家的示例网站：餐饮、美容、运动、健康、宠物、零售和服务。每个网站都有自己的主要操作（订座、预约、下单或询价），可以完整试用而不会真正发送任何内容。移动优先，使用自托管字体而非 Google Fonts，没有内联样式或脚本，能通过严格的安全策略。包含法律声明，并明确说明商家是虚构的。目录可按行业筛选，与我为客户制作私人演示所用的是同一个生成器。模板内容为西班牙语。',
      tec: ['HTML 和 CSS', '无依赖 JavaScript', '严格 CSP', '自研生成器']
    },
    whatsapp: {
      corto: 'WhatsApp AI', titulo: 'WhatsApp AI 助手', etiqueta: '自有产品 · 开发中',
      texto: '一个在 WhatsApp 上接待商家客户的助手：回答常见问题，提供营业时间和服务信息，帮助预约或下单，必要时把对话转给真人。只使用官方 WhatsApp Business API。开发中。',
      tec: ['官方 WhatsApp Business API', 'AI 应用']
    },
    efesto: {
      corto: 'Efesto，车间', titulo: 'Efesto：让 Sindri 读懂工厂', etiqueta: '自有产品 · Sindri 的一部分 · 2026',
      caso: [
        ['问题', '设备状态、良品和不良品数量、报警信息都留在各自的 PLC 或 SCADA 里，离 ERP 很远，而要连接它们通常意味着要在工厂里开放端口。'],
        ['我做了什么', '一个只读的车间代理程序，带 16 种连接器：OPC UA、Modbus、Siemens S7、Rockwell、Beckhoff、Omron、MQTT、MTConnect、BACnet、历史数据库 SQL、文件和电子秤等。连接从工厂向外发起，断网时先存储再补发，工厂的地址和密码绝不外传。'],
        ['结果', '用 22 台模拟设备测试：106 个数据点全部送达 Sindri。一台设备掉线，其他设备照常工作。尚未连接真实工厂。']
      ]
    },
    brokkr: {
      corto: 'Brokkr CRM', titulo: 'Brokkr：为小型制造企业销售人员打造的 CRM', etiqueta: '自有产品 · 进行中',
      texto: '自研 CRM，正在开发。它是 Sindri 的一个模块，共用同样的客户、报价、订单和发票，不会产生重复数据。目标是：在手机或手持终端上 30 秒内记录一次拜访，即使没有信号；订单确认后商机自动标记为赢单；每个客户一条时间线，包含电话、报价、发票、付款和 Odin 工单。销售漏斗、活动和报价已经在 Sindri 中可用；在继续开发之前，我分析了 15 个开源 CRM。',
      tec: ['Sindri 模块', 'Fastify', 'PostgreSQL', 'React', 'Keycloak']
    },
    tareas: {
      corto: 'Aris，任务', titulo: 'Aris：团队任务与项目管理', etiqueta: '开源 · Web 应用',
      resumen: '面向团队的看板、Scrum、知识库和日历，并提供为 AI 智能体设计的 API。',
      probar: '一张来自 Odin 的工单变成卡片，由你把它拖到“完成”。',
      texto: '一个组织团队工作的 Web 应用：看板和 Scrum 面板、日历和日程、知识库、笔记、白板、SLA、人与人之间的便条、动态墙，以及为 AI 智能体设计的 API。这是一个不含任何企业数据的基础版本：品牌、登录（本地或 Keycloak）和可选模块在一个文件里配置，用 Docker 安装并附带演示数据。'
    },
    themelab: {
      etiqueta: '开源 · 网页工具',
      texto: '一个在浏览器中使用的 Power BI 主题生成器：选择你的品牌色，在实时看板上查看配色、检查对比度，并导出 <code>theme.json</code>。'
    },
    calculate: {
      corto: 'CALCULATE 实时演示', titulo: 'CALCULATE 实时演示', etiqueta: '开源 · 网页工具',
      texto: '一个交互式页面，帮你理解 DAX 中最强大也最让人困惑的函数：修改筛选上下文，逐行查看度量值统计了什么，以及 <code>CALCULATE</code> 改变了什么。'
    },
    grafo: {
      corto: '关系图', titulo: '你的 Power BI 项目关系图', etiqueta: '开源 · 方法',
      texto: '四个步骤和四个提示词，让 AI 读取你的模型并画出依赖关系图：哪些度量值是支柱，哪些没人用，以及哪些关联一眼看不出来。'
    },
    gobernanza: {
      corto: 'AI 治理', titulo: 'AI 治理框架', etiqueta: '开源 · 模板',
      texto: '一个模板，帮助团队规定在审查或开发项目时如何使用 AI：一组任何人都不能跳过的规则，以及两个从每个真实案例中学习的改进循环。'
    },
    modelo: {
      corto: '交互模型', titulo: 'AI 交互模型', etiqueta: '开源 · 指南',
      texto: '一种把 AI 当作合作者而不是搜索引擎的工作方式：明确问题、反复迭代、收尾总结，并附带为 DAX、Power Query 和文档设计的模板。'
    },
    outlook: {
      corto: 'Outlook 接入你的程序',
      texto: '用一个链接和一个无依赖的脚本，把你的 Outlook 日历接入你自己的程序。不用微软 API，不用注册应用，也不用令牌。'
    },
    reader: {
      corto: 'Power BI 审查工具',
      texto: '两个脚本，用你自己的账号审查 Power BI 租户：你实际能访问多少报表，以及哪些数据集刷新失败。'
    },
    comercial: {
      corto: '销售优先级', titulo: '不过度打扰的销售优先级', etiqueta: '开源 · Power BI',
      texto: '一个使用示例数据的 Power BI 报表，帮助决定销售团队应该把时间花在哪些客户和区域上，并附带一个重新生成数据的 Python 脚本。'
    },
    nifi: {
      titulo: 'Apache NiFi：你的第一个数据流', etiqueta: '开源 · 手册',
      texto: '一本西班牙语的分步手册，教你在 Windows 上安装 NiFi，并在二十分钟内搭建第一个数据管道，面向从 Power BI 和 Power Query 转过来的分析师。'
    }
  },

  // /sobre-mi/ (关于我)：简历式的职业页面。顺序与 construir.js 中的 CARRERA 相同。
  CARRERA: {
    descripcion: 'Henry Arce（Luis Henry Arce Inga），西班牙阿利坎特的数据分析师与开发者：工作经历、技能、教育背景和项目。',
    puesto: '数据分析师与开发者',
    lema: '自动化、AI 应用与 Power BI',
    lugar: '西班牙阿利坎特 · 现场或远程',
    fotoAlt: 'Henry Arce',
    resumen: '我从 2019 年开始做数据工作：先在咨询公司（NTT DATA 和 Inforges），然后参与一家制造企业的数字化转型，现在负责一个拥有两座工厂的工业集团的 ERP 系统。我在数据、代码和业务之间穿梭：找出团队中的手工工作，把它们变成报表、自动化流程和 AI 助手，并衡量带来的收益。',
    botones: { correo: '给我发邮件', linkedin: 'LinkedIn', github: 'GitHub', pdf: '保存为 PDF' },
    datos: [
      ['2019', '开始做数据工作'],
      ['4', '家公司，从咨询到制造业'],
      ['2', '座生产工厂的 ERP 由我负责'],
      ['SPSIL', '负责集团基于 Microsoft Fabric 的数据系统']
    ],
    experiencia: '工作经历',
    experienciaSub: '从咨询公司到工厂车间',
    logros: [
      ['负责集团两座生产工厂的 ERP 系统（Clavei 和 Cybermax）。', '统一两座工厂之间的开票。', '与 SAP 集成，并与客户和供应商进行 EDI 对接。', '车间设备数据采集。', '自建服务台、考勤和 IT 成本控制。', '支持向 Azure 迁移。'],
      ['负责集团的数据系统：用 Microsoft Fabric 集中并治理数据。', '为管理层和销售团队制作 Power BI 看板。', '为物流和采购开发 Python 桌面应用。', '把部门之间的重复工作自动化。'],
      ['ETL 流程和数据仓库。', 'Power BI 和 Excel 报表。', '供应商指标：SLA、可用率、MTBF 和 MTTR。', '每次交付都附带功能和技术文档。'],
      ['为银行业制作财务和运营 KPI 看板。', '从 Azure Databricks、AWS、SharePoint 和 Oracle 进行 ETL 和数据集成。'],
      ['2022 年学业优秀奖。', 'CV Skills 2021 技能大赛电子类获奖。'],
      ['销售、库存和生产看板。', '用 Python 和 Excel 宏实现报表自动化。']
    ],
    formacion: '教育与奖项',
    formacionSub: '高等职业文凭和技能竞赛',
    habilidades: '我会做什么',
    habilidadesSub: '技能和我每天使用的工具',
    competencias: [
      ['数据与 BI', '数据模型、DAX，以及管理层真正会用的看板。'],
      ['自动化', '用流程、脚本和系统集成消除手工工作。'],
      ['AI 应用', '处理业务数据的助手和智能体，由人来掌控。'],
      ['ERP 与集成', '运维 ERP 系统，并对接 SAP、EDI 和车间设备。'],
      ['开发', 'Web 和桌面应用，从数据库到界面。'],
      ['基础设施', '我自己的服务器：Docker、单点登录、DEV/PRO 和持续部署。']
    ],
    herramientas: '工具',
    propios: '自有项目',
    propiosSub: '我以 Arce Data Lab 名义独立打造的东西',
    propiosTexto: '在本职工作之外，我经营着 <strong>Arce Data Lab</strong>，我的实验室：在这里打造和测试自己的应用，也承接自由职业项目。',
    proyectos: [
      ['ada', 'Ada', '基于 n8n 和 AI 的自动化：为五个渠道准备、审核并发布视频和帖子，未经审核的内容绝不发出。'],
      ['sindri', 'Sindri', '面向小工厂的 ERP：订单、按批次管理的库存、符合 VERI*FACTU 的发票，并连接车间。'],
      ['plataforma', '我的平台', '带 Docker、Keycloak、DEV/PRO、备份和 GitHub Actions 部署的服务器。'],
      ['github', '开源', 'Power BI 审查工具、把 Outlook 日历接入自己的程序、Apache NiFi 手册等，都在 GitHub 上。']
    ],
    verProyectos: '查看全部项目',
    contacto: '聊聊吧',
    contactoTexto: '如果你想为某个职位、合作或项目了解我，给我发邮件，我会回复你。'
  },

  TRAYECTORIA: [
    ['2026 年 4 月至今', '企业应用管理员', 'F&amp;D Shower Tray（ES Group）', '负责集团两座生产工厂的 ERP 系统。与 SAP 集成、设备数据采集、EDI、自建服务台、考勤和 IT 成本，并支持向 Azure 迁移。'],
    ['2025 年 1 月 – 2026 年 3 月', '数据分析师 · 数字化转型', 'Grupo SPSIL', '为一家制造企业做数据分析、自动化和开发：用 Microsoft Fabric 集中并治理数据，为管理层和销售制作 Power BI，为物流和采购开发 Python 桌面应用。'],
    ['2023 年 11 月 – 2024 年 7 月', '分析程序员', 'Inforges', '创新与数字化转型部门：ETL 和数据仓库、Power BI 和 Excel 报表，以及供应商指标（SLA、可用率、MTBF、MTTR）及其功能和技术文档。'],
    ['2022 年 2 月 – 2023 年 11 月', '商业智能开发者', 'NTT DATA', '为银行业提供 BI 解决方案：财务和运营指标看板、ETL 流程，以及从 Azure Databricks、AWS、SharePoint 和 Oracle 进行数据集成。'],
    ['2020 – 2022', '电信与 IT 系统高等职业文凭', 'IES El Palmeral', '2022 年学业优秀奖，CV Skills 2021 技能大赛电子类获奖。'],
    ['2019 年 9 月 – 2020 年 2 月', '数据分析师', '自由职业', '最初的独立项目：销售、库存和生产看板，以及用 Python 和 Excel 宏实现报表自动化。']
  ],

  TECNOLOGIAS: [
    ['自动化', 'Python、Power Automate、Apps Script、VBA、PowerShell、Shell Script'],
    ['AI 应用', 'Claude、Claude Code、Copilot、智能体和助手、提示词设计、知识库'],
    ['数据与 BI', 'Power BI、DAX、Power Query、SQL Server、MariaDB、PostgreSQL、Microsoft Fabric、Databricks'],
    ['集成', 'REST API、Webhook、WebSocket、EDI、事务邮件'],
    ['企业系统', 'Clavei、Cybermax、SAP、A3 ERP、SharePoint'],
    ['开发', 'Node.js、Next.js、TypeScript、React Native、Django、Docker、Linux、Git']
  ]
};
