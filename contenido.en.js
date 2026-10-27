// Textos de la versión en inglés. construir.js los combina con los datos en
// español: lo que no aparezca aquí (iconos, colores, enlaces) se toma de allí.
// PROYECTOS va por id; AREAS, TRAYECTORIA y TECNOLOGIAS, en el mismo orden.

module.exports = {
  PORQUE: {
    titulo: 'Why work with me?',
    sub: 'What changes compared with hiring an agency or off-the-shelf software',
    lista: [
      ['You talk to the person who builds it', 'Whoever listens to you in the review is who designs, codes and delivers the work. No sales reps, no middlemen.'],
      ['I know how a company works day to day', 'I have worked with data since 2019, first in consulting and now inside industry, with ERPs such as A3, SAP or Clavei.'],
      ['A fixed price, in writing', 'Before we start you know what gets built, how many rounds of changes there are and what it costs. No surprises at the end.'],
      ['Your data, looked after', 'I work read-only whenever possible and the applications live on EU servers with nightly backups.'],
      ['No lock-in', 'I hand the work over documented, and much of what I do is open source: you can see how I work before you call me.'],
      ['I measure what you gain', 'I note how long the task takes today and how long afterwards, so you know whether it was worth it.']
    ]
  },
  SERV: {
    incluye: 'What’s included',
    como: 'How we work',
    relacionados: 'Related projects',
    otros: 'Other services',
    calcular: 'Work out the price',
    relacionado: 'Related service',
    probar: 'Try it in the lab',
    antesAhora: 'Before and after',
    antesAhoraSub: 'Same content, redesigned: the landing page of my client demos. Drag the line to compare.',
    antes: 'Before', ahora: 'After',
    antesAlt: 'Demos landing page before the redesign',
    ahoraAlt: 'Demos landing page after the redesign',
    deslizar: 'Compare before and after',
    plantillas: 'See example templates',
    verPlantillas: 'See the templates',
    plantillasSub: '28 example websites for made-up businesses, so you can look at styles before we start.',
    pasos: [
      ['Free review', '45 minutes on a video call to look at your data, your tasks and what really takes up your time.'],
      ['Written proposal', 'What gets built, how many rounds of changes, the fixed price and the deadline, set once I have seen the data.'],
      ['Build', 'I show you progress along the way. You pay 50% to start and 50% on delivery, always with an invoice.'],
      ['Delivery and training', 'I leave it working, documented and explained to your team. If you like, I carry on with monthly maintenance.']
    ]
  },
  PORTADA: {
    menu: { hacemos: 'What we do', lab: 'Lab', proyectos: 'Projects', sobre: 'About' },
    cta: 'Ask for a quote',
    ctaHref: 'https://wa.me/34633424223?text=' + encodeURIComponent('Hi Henry, I’d like a quote for my company. Here is what I need: '),
    carruselAria: 'What Arce Data Lab does',
    anterior: 'Previous message',
    siguiente: 'Next message',
    pausar: 'Pause the slideshow',
    seguir: 'Resume the slideshow',
    diapo: 'Message {n} of {t}',
    carrusel: [
      { ante: 'Data analyst and developer · Alicante, Spain', titulo: 'I automate processes and put AI to work on business data.', texto: 'I’m Henry Arce, founder of Arce Data Lab. I find the manual tasks in a team, turn them into workflows, assistants and reports, and measure what is gained.', boton: 'Ask for a quote', href: 'cta', img: 'img/ada/cabecera.svg', alt: 'Ada at the centre, connected to the Sindri ERP on a PC, Aris tasks on a tablet, an Efesto handheld, the campaigns on a phone, and a report, the schedule and an Odin ticket floating above' },
      { ante: 'Sindri · Brokkr · Efesto', titulo: 'ERP, CRM and plant, talking to each other.', texto: 'What sales closes reaches the ERP, and the factory makes it and records it without copying anything.', boton: 'Try it in the lab', href: 'lab/#efesto', img: 'img/ada/efesto.webp', alt: 'Efesto: plant machines connected to Sindri' },
      { ante: 'Data and reporting', titulo: 'Your numbers, up to date every morning.', texto: 'A dashboard with figures that add up, refreshing itself, without copying Excel files.', boton: 'See a sample report', href: 'lab/#reporting', img: 'img/ada/informe.webp', alt: 'Sample sales report with monthly sales and top customers' }
    ],
    lab: {
      titulo: 'Try it in the lab',
      sub: 'Ada and the products I work with, with made-up data. Nothing is stored.',
      pestanas: [
        ['Ada', 'ada', 'pedidos', 'Each department has its desks (reception, handling, supervision and records) and they pass the work along to the ERP. You only check what isn’t clear.', 'sindri'],
        ['Sindri · ERP', 'sindri', 'sindri', 'Orders, stock with batches, manufacturing and invoices ready for VERI*FACTU.', 'sindri'],
        ['Brokkr · CRM', 'brokkr', 'brokkr', 'Sales reps work on a tablet and what they close reaches the ERP on its own.', 'brokkr'],
        ['Efesto · plant', 'efesto', 'efesto', 'Reads the factory machines and sends production to the ERP, even if the network drops.', 'efesto'],
        ['Aris · tasks', 'aris', 'aris', 'Kanban, sprints and a wiki for your team. Odin tickets come in as tasks.', 'tareas'],
        ['Reporting', 'reporting', 'informe', 'Sales, collections and stock in Power BI, up to date every morning.', 'reporting']
      ],
      alt: '{o} in the lab',
      boton: 'Try it in the lab',
      todos: 'See all projects'
    },
    hacemos: {
      titulo: 'What we do',
      lista: [
        ['escritorio', 'Business software', 'ERP, CRM, tasks and ticketing built around your company, or connected to what you already use.', 'servicios/webs/'],
        ['grafico', 'Data and reporting', 'Power BI and Fabric on top of your ERP or your Excel files, with figures that add up.', 'servicios/power-bi/'],
        ['flujo', 'Automation', 'Emails, orders, alerts and reports that move on their own between your programs.', 'servicios/automatizacion-n8n/']
      ],
      ver: 'Learn more'
    },
    pasos: {
      titulo: 'How we start',
      lista: [
        ['You tell me about your case', 'On WhatsApp or in a free 45-minute video call.'],
        ['I send you a quote', 'In writing: what gets done, what it costs and when.'],
        ['I leave it working', 'Documented and explained to your team.']
      ]
    },
    faq: [
      ['How much does it cost?', 'It depends on what needs building. Tell me about your case and I’ll send you a fixed quote in writing, with no obligation.'],
      ['Do you work with SMEs?', 'Yes: with SMEs and factories that have manual tasks or figures that don’t add up, remotely or from Alicante.'],
      ['Is my data safe?', 'I work read-only whenever possible and the applications live on EU servers with nightly backups.'],
      ['What is Arce Data Lab?', 'It’s my brand: the lab where I build automations, dashboards, AI assistants and custom applications for SMEs and industry.']
    ],
    final: {
      titulo: 'Tell me about your case',
      texto: 'If your team has tasks that keep repeating or figures that don’t add up, message me and I’ll send you a quote, with no obligation.',
      cliente: 'Already a client?',
      clienteTexto: 'For questions or issues with your application, email support and I’ll reply the same day.',
      clienteBoton: 'Email support'
    },
    sobre: {
      titulo: 'About me',
      descripcion: 'Henry Arce, data analyst and developer in Alicante, Spain: career, technologies, own infrastructure and what I write on LinkedIn.',
      sub: 'I’m Henry Arce, a data analyst and developer in Alicante, Spain, and the founder of Arce Data Lab. I’ve worked with data since 2019, first in consulting firms and now inside industry.'
    },
    todosTitulo: 'All projects',
    todosDescripcion: 'Projects by Henry Arce and Arce Data Lab: ERP, CRM, AI assistants, automations and dashboards, with the problem they solved and the result.'
  },
  SERVICIOS: {
    'power-bi': {
      titulo: 'Power BI consultant for SMEs | Arce Data Lab',
      corto: 'Power BI',
      h1: 'Power BI consultant for SMEs',
      descripcion: 'Power BI dashboards on top of your ERP, Excel or SQL, with figures that add up and refreshed every morning. Ask for a quote with no obligation.',
      intro: 'If your company’s numbers live in several Excel files and someone spends hours every month pulling them together, a Power BI dashboard does it on its own. I connect it to your ERP, your spreadsheets or your database, reconcile the figures with accounting and hand it over documented.',
      incluye: [
        ['Tidy data', 'Cleaning and a data model with Power Query: one version of every figure, even when it comes from several places.'],
        ['DAX measures', 'Sales, margins, collections, stock or production, compared with last year and with your targets.'],
        ['Clear design', 'Pages built for decisions: the important things first, simple filters and a mobile layout.'],
        ['Automatic refresh', 'The report refreshes every morning through the gateway, with nobody copying anything.'],
        ['Documentation', 'What each figure measures and where it comes from, so your team trusts it and can maintain it.']
      ],
      lotesTitulo: 'Analysis packs',
      lotesIntro: 'Reports already designed for each area, adapted to your ERP and your own names. Start with the pack that hurts most and add the others whenever you like. Try them with made-up data in the lab (the demos are in Spanish).',
      lotesBoton: 'Try the example',
      lotes: [
        ['bi-comercial', 'Sales', 'For management and sales teams', 'Are we selling more than last year, who owes us money and what needs reordering?',
          ['Sales by month, customer and product family against last year', 'Receivables by age and average collection days', 'Stock below minimum and turnover']],
        ['bi-fabricacion', 'Manufacturing and OEE', 'For the plant manager', 'Where do the machines lose time, and why?',
          ['OEE with availability, performance and quality, by machine and line', 'Minor and major stoppages by day, cause and machine, with mean time between stoppages', 'Hours lost by product']],
        ['bi-pedidos', 'Orders and deliveries', 'For logistics and customer service', 'How many orders arrive on time, and why are the others late?',
          ['On-time % by week, warehouse and carrier', 'Delays by reason and by customer', 'Open orders with their status']],
        ['bi-calidad', 'Quality and scrap', 'For quality and production', 'How many parts do we scrap, what does it cost and why?',
          ['Scrap % by month and work centre', 'Rejected parts by defect and cost of scrap', 'Actual against expected by part number, and the orders with most scrap']]
      ],
      faq: [
        ['How much does a Power BI dashboard cost?', 'It depends on the data sources, the number of pages and the calculations. Tell me about your case and I’ll send you a fixed quote in writing, with no obligation.'],
        ['What is an analysis pack?', 'A set of Power BI pages designed for one area (sales, plant, logistics or quality) with its indicators already defined. I connect it to your data and adjust it to the way you work, so you don’t start from scratch. Tell me which packs interest you and I’ll send you a fixed quote.'],
        ['Do I need a Power BI licence?', 'To build and view the report on your computer, Power BI Desktop is enough and it is free. To share it online with your team you need Power BI Pro, which is paid to Microsoft per user.'],
        ['Does it work with my ERP?', 'I have worked with A3 ERP, SAP, Clavei, Cybermax and SQL Server. If your ERP stores its data in a database or exports it to Excel, it can be connected.'],
        ['Can I change it myself later?', 'Yes. I hand it over documented and explain how it is built. If you would rather not touch it, there is monthly maintenance.']
      ]
    },
    'automatizacion-n8n': {
      titulo: 'Business process automation with n8n | Arce Data Lab',
      corto: 'Automation with n8n',
      h1: 'Process automation with n8n',
      descripcion: 'I use n8n to automate the tasks your team repeats every week: emails, alerts, orders and reports moving on their own between your programs.',
      intro: 'Copying orders from email into the ERP, sending the same reminder every Monday or moving data from one sheet to another adds nothing and often goes wrong. With n8n I turn it into a flow that does it on its own, with alerts if something fails, and I host it on a server in the EU.',
      incluye: [
        ['Task map', 'We look together at what is done by hand, how often and how long it takes, to start with what pays off most.'],
        ['The n8n flow', 'Connected to your programs: email, Excel or Google Sheets, ERP, CRM, forms, WhatsApp or any API.'],
        ['Tests with real data', 'Before it goes live, including your odd cases.'],
        ['Alerts when something fails', 'If a step goes wrong you get an alert saying what happened, instead of a silent error.'],
        ['One hour of training', 'So your team knows what the flow does and how to stop or change it.']
      ],
      faq: [
        ['What is n8n?', 'n8n is an automation tool that connects programs with visual flows. It can be installed on your own server, so your data stays in the EU.'],
        ['Which tasks can be automated?', 'The ones that repeat and always follow the same steps: copying data between programs, sending alerts or emails, generating reports or PDFs, checking forms and sorting messages.'],
        ['How much does an automation cost?', 'It depends on how many applications are connected and on the special cases. Tell me about your case and I’ll send you a fixed quote in writing.'],
        ['What if a program changes?', 'The flow warns you when something stops working and gets adjusted. With monthly maintenance, I do it.']
      ]
    },
    webs: {
      titulo: 'Custom websites and web apps for SMEs | Arce Data Lab',
      corto: 'Websites and apps',
      h1: 'Custom websites and web apps for SMEs',
      descripcion: 'Fast websites and custom apps for SMEs: bookings, online shop, CRM or ticketing, with your brand and hosted on EU servers.',
      intro: 'A website that loads fast, shows up on Google and lets customers book or buy without calling you. Or an application built around how your company works, instead of you adapting to generic software. I build it, publish it on my own infrastructure and maintain it.',
      incluye: [
        ['Design with your brand', 'Mobile-friendly, accessible and without heavy templates.'],
        ['SEO from day one', 'Titles, structured data, sitemap and speed, so Google understands it.'],
        ['Whatever you need inside', 'Bookings and appointments, a shop, forms, a client area, a CRM or a management panel.'],
        ['EU server', 'HTTPS, nightly backups and separate test and production environments.'],
        ['Legal pages', 'Legal notice, privacy and cookies, adapted to what your site does.']
      ],
      faq: [
        ['How much does a website cost?', 'It depends on the pages and on what it has to do: a brochure site is not the same as one with bookings or a shop. Tell me what you need and I’ll send you a fixed quote in writing.'],
        ['Do you use WordPress?', 'Not by default: I build custom sites, which are faster and need less security maintenance. If you already have WordPress and it works for you, we can look at it.'],
        ['Where is it hosted?', 'On my server in Germany (EU), with HTTPS, nightly backups and continuous checks that it responds. I can also put it on your own hosting.'],
        ['Can I change the text myself?', 'If you need to, the site comes with a simple panel to change text and photos; if not, ask me and I change it as part of monthly maintenance.']
      ]
    }
  },
  UI: {
    lang: 'en',
    titulo: 'Henry Arce · Automation, applied AI and Power BI | Arce Data Lab',
    descripcion: 'Henry Arce, founder of Arce Data Lab (Alicante, Spain): automation, applied AI, Power BI and custom apps for SMEs and industry. Real projects and open source.',
    ogDescripcion: 'Automation, applied AI and data for SMEs and industry. Real projects, dashboards and open source.',
    locale: 'en_GB',
    idiomaNombre: 'English',
    linkedinTitulo: 'Posts on LinkedIn',
    linkedinDescripcion: 'Henry Arce’s LinkedIn posts on BI, data and applied AI.',
    linkedinSub: 'What I write about BI, data and applied AI, in Spanish',
    linkedinMarco: 'LinkedIn post',
    linkedinVer: 'Open on LinkedIn',
    linkedinFallo: 'LinkedIn didn’t load this post (some browsers block it). You can read it on LinkedIn with the link below.',
    sinProyectos: 'No projects of this type yet. If you have one in mind, tell me about it.',
    linkedinPerfil: 'See them all on my LinkedIn profile',
    verPublicaciones: 'Read the posts here',
    saltar: 'Skip to content',
    lema: 'automation · AI · data',
    secciones: 'Sections',
    menu: { servicios: 'Services', arce: 'Arce Data Lab', proyectos: 'Projects', trayectoria: 'Career', tecnologias: 'Technologies', preguntas: 'FAQ', contacto: 'Contact' },
    otroIdioma: 'Español',
    otroIdiomaAria: 'Versión en español',
    antetitulo: 'Data analyst and developer · Alicante, Spain',
    lema2: 'MEASURE IS BEST',
    h1: 'I automate processes and put AI to work <em>on business data.</em>',
    intro: 'I’m Henry Arce, a data analyst and developer based in Alicante, Spain, and the founder of <a href="#arcedatalab">Arce Data Lab</a>. I find the manual tasks in a team, turn them into workflows, assistants and reports, and measure what is gained. Since 2019, first in consulting firms and now inside industry.',
    fotoAlt: 'Henry Arce at the City of Arts and Sciences in Valencia',
    areasAria: 'Areas of work',
    verProyectos: 'See projects',
    franja: 'Do your numbers live in Excel? I’ll look at them for free in 45 minutes.',
    inicioBotones: ['See projects', 'Let’s talk'],
    datosClave: [
      ['2019', 'working with data, from consulting to the factory floor'],
      ['', 'documented projects, with problem and result'],
      ['139,760', 'impressions on my most-read LinkedIn post'],
      ['EU', 'own servers, backed up every night']
    ],
    queHago: 'What your company can gain',
    queHagoSub: 'From the simplest to the most complete. We start with whatever takes up most of your time.',
    nivelesNombres: ['To start', 'Next step', 'Complete'],
    niveles: [
      ['flujo', 'Task automation', ['Alerts and emails that send themselves', 'Forms and sheets filled in without copying by hand', 'Whole processes across ERP, CRM and email']],
      ['bot', 'AI assistants', ['Answers to the usual questions', 'An assistant that searches your documents', 'AI that queries your ERP without making up figures']],
      ['grafico', 'Data and Power BI', ['Your Excel tidy, with figures that add up', 'A dashboard with what matters', 'Reports that refresh themselves every morning']],
      ['escritorio', 'Custom applications', ['A website with bookings or appointments', 'A CRM or a ticket manager', 'ERP and CRM connected, with your brand']]
    ],
    verServicios: 'See services',
    verTodos: 'See all {n} projects',
    verProyectosHechos: 'See finished projects',
    serviciosTitulo: 'Services',
    serviciosDescripcion: 'Process automation with n8n, Power BI dashboards, AI assistants and custom websites for SMEs. Ask for a quote with no obligation.',
    whatsappDiagnostico: 'https://wa.me/34633424223?text=' + encodeURIComponent('Hi Henry, I’d like a quote for my company. Here is what I need: '),
    proyectos: 'Projects',
    proyectosSub: 'You can try the main ones in the lab, with made-up data. The rest are below, in short.',
    principales: 'Main projects',
    masProyectos: 'More projects',
    masSub: 'Click any of them to see the problem it solved and how I did it',
    enLab: 'In the lab',
    verCaso: 'See the case',
    tambien: 'Also in the lab',
    filtrosAria: 'Filter projects',
    todos: 'All',
    tipos: { producto: 'Own product', empresa: 'For a company', abierto: 'Open source' },
    enlaces: { 'Probar la demo': 'Try the demo', 'Código': 'Code', 'Ver en GitHub': 'View on GitHub', 'Ver el canal': 'Watch the channel', 'Leer el blog': 'Read the blog', 'Mail en GitHub': 'Mail on GitHub', 'Report Server en GitHub': 'Report Server on GitHub' },
    trayectoria: 'Career',
    trayectoriaSub: 'From consulting to the factory floor',
    tecnologias: 'Technologies',
    tecnologiasSub: 'What I work with',
    divulgacion: 'Writing',
    divulgacionSub: 'I write on LinkedIn, in Spanish, about BI and applied AI',
    cifras: [
      ['139,760', 'impressions · Windows CMD command cheat sheet'],
      ['51,431', 'impressions · 10 terms every data professional should master'],
      ['29,131', 'impressions · VBA, the wise grandfather of Excel']
    ],
    contacto: 'Let’s talk',
    contactoSub: 'If your team has tasks that keep repeating or data that doesn’t add up, tell me about it',
    verPublicacion: 'View the post',
    telefono: 'WhatsApp works too',
    pie: 'Alicante, Spain',
    pieFrase: 'Data, Power BI and custom development for companies that want to decide with numbers.',
    pieNav: 'Site',
    pieRedes: 'Social',
    escribemeWhatsapp: 'Message me on WhatsApp',
    cerrar: 'Close',
    verFicha: 'Full project page',
    volver: 'Back to all projects',
    migas: 'Home',
    otrosProyectos: 'Other projects',
    servicios: 'Services',
    serviciosSub: 'What I can do for your company, through Arce Data Lab',
    serviciosLista: [
      ['flujo', 'Process automation', 'I remove repetitive manual work: reports that build themselves, data that moves between programs on its own, automatic alerts and emails.', 'n8n, Python, Power Automate, APIs', 'automatizacion-n8n'],
      ['grafico', 'Dashboards and BI', 'Power BI and Microsoft Fabric on top of your ERP or spreadsheets: sales, collections, stock and production, with figures reconciled and documented.', 'Power BI, DAX, Fabric, SQL', 'power-bi'],
      ['bot', 'AI assistants on your data', 'An assistant that answers business questions by querying your data in read-only mode, without making figures up, in text or Excel.', 'Agents, Claude, OpenAI, SQL', ''],
      ['escritorio', 'Custom websites and applications', 'ERP, CRM, appointments, tickets or an online shop: websites and web apps with sign-in, backups and deployment on my own infrastructure.', 'Node.js, Python, Next.js, Docker', 'webs']
    ],
    verServicio: 'See the service',
    serviciosNota: 'Every project is different, so I don’t publish rates: tell me what you need and I’ll send you a fixed quote in writing, with no obligation. If you need a website, have a look at the <a href="https://pro.luiscontacto03.com/demos/catalogo/" data-dev="https://dev.luiscontacto03.com/demos/catalogo/" target="_blank" rel="noopener">example templates</a>.',
    serviciosCta: 'Ask for a quote',
    serviciosPago: 'You pay 50% to start and 50% on delivery, by bank transfer or card, always with an invoice.',
    cinta: 'Automation at work',
    cintaSub: 'What an automated flow does, in miniature',
    cintaPasos: [
      ['Manual work goes in', 'Spreadsheets, emails and PDFs that someone copies by hand today.'],
      ['The flow processes it', 'It reads, checks and matches the data with nobody touching it.'],
      ['The result comes out', 'Reports, alerts and up-to-date data, every morning.']
    ],
    infra: 'My infrastructure',
    infraLeyenda: ['HTTPS proxy', 'Server', 'Apps in containers', 'Nightly backup'],
    infraSub: 'What I run and maintain myself, where my apps and my clients’ apps live',
    infraTexto: 'I don’t depend on closed platforms: I run my own server with everything needed to launch an application securely, test it and promote it to production.',
    infraLista: [
      ['Own server', 'Linux with Docker on Hetzner (Germany, EU). Each app in its own container, behind a single HTTPS proxy.'],
      ['DEV and PRO environments', 'Every app is tested before it reaches production, with one-click “Roll back” and automatic rollback for the apps the server deploys itself.'],
      ['Single sign-on', 'Keycloak for every application, with groups per app and per environment.'],
      ['Domains and certificates', 'Nginx Proxy Manager with Let’s Encrypt HTTPS and, for domains on Cloudflare, DNS records created automatically.'],
      ['Branded email', 'A Mail service on top of Resend: apps send from soporte@arcedatalab.com, with SPF, DKIM and DMARC.'],
      ['PDF documents', 'Report Server for invoices, orders and delivery notes from templates.'],
      ['Continuous deployment', 'GitHub Actions builds every version and publishes it to GitHub Container Registry.'],
      ['Backups and alerts', 'Nightly backups of the main apps’ databases and continuous checks that every app responds.']
    ],
    infraEnlace: 'See the platform on GitHub',
    arce: 'Arce Data Lab',
    arceSub: 'My brand: data, automation and AI for SMEs',
    clubbyteLinea: 'I also make <strong>Club Byte</strong>, a Spanish-language channel that gets kids aged 8 to 12 into technology:',
    arceTexto: '<strong>Arce Data Lab</strong> is the lab where I build apps, dashboards and AI assistants for SMEs and industry, with its own deployment platform, email and document services. Every project marked as an own product lives there.',
    arceEnlacesTextos: ['Client demos', 'TikTok @arcedatalab'],
    clubbyteTitulo: 'Club Byte',
    clubbyteTexto: '<strong>Club Byte</strong> is a personal 3D animation project, separate from Arce Data Lab, in Spanish: it explains to children aged 8 to 12 how computing works, with Lía, Teo and Bit the robot. His big brother, Byte, is the Arce Data Lab assistant keeping you company on this page. Every episode ends with an unplugged challenge for home or the classroom.',
    clubbyteEnlacesTextos: ['YouTube @clubbyte_es', 'Blog for families and teachers'],
    bitAlt: 'Byte, the Arce Data Lab assistant',
    preguntas: 'Frequently asked questions',
    preguntasSub: 'What people ask me most, one sentence each',
    faq: [
      ['Who is Henry Arce?', 'Luis Henry Arce Inga, known as Henry Arce, is a data analyst and developer based in Alicante, Spain, specialised in process automation, applied AI and Power BI, and the founder of Arce Data Lab.'],
      ['What is Arce Data Lab?', 'Arce Data Lab is Henry Arce’s brand for building custom apps, dashboards and AI integrations for SMEs and industry; its website is arcedatalab.com.'],
      ['What services does Arce Data Lab offer?', 'Process automation, Power BI and Microsoft Fabric dashboards, AI assistants on business data and custom applications (ERP, CRM, appointments), deployed on its own infrastructure in the EU.'],
      ['What kind of projects does he do?', 'He automates repetitive tasks, connects ERP, CRM and databases, builds Power BI and Microsoft Fabric reports, and puts AI assistants to answer questions on business data in read-only mode.'],
      ['Does he work with SMEs?', 'Yes: with SMEs and factories that have manual tasks or data that does not add up, remotely or from Alicante.'],
      ['Is my data safe?', 'Yes: read-only access is used whenever possible, and the apps run on EU servers with nightly backups.'],
      ['Where does he publish content?', 'On LinkedIn about BI, data and applied AI, on TikTok (@arcedatalab) with quick automation and data tips, and on Instagram (@henry_arce_dev). Soon on YouTube too, on the Imagina en IT channel.'],
      ['How can I get in touch?', 'By email at info@arcedatalab.com, by WhatsApp at +34 633 42 42 23 or on LinkedIn; for support with the apps, soporte@arcedatalab.com.']
    ],
    faqServicios: [
      ['How much does a project cost?', 'It depends on how many data sources there are, what state they are in and what needs to be built. Tell me about your case and I’ll send you a fixed quote in writing, with no obligation.'],
      ['How long does it take?', 'It depends a lot on each case: how many data sources there are, what state they are in and what needs to be built. That is why the deadline is agreed in writing after the free review, once I have seen your data, and then kept.'],
      ['How do we start?', 'You message me on WhatsApp or by email, we look at your case (in a free 45-minute video call if needed) and I send you the quote in writing.']
    ],
    soporte: 'App support',
    bit: {
      nombre: 'Byte, the Arce Data Lab assistant',
      hola: 'Hi, I’m Byte, the Arce Data Lab assistant. I’ll guide you through the site and sum up each project.',
      servicios: 'If a task in your company repeats every week, it can probably be automated.',
      infraestructura: 'This site and the client apps run here: containers, HTTPS and nightly backups.',
      arcedatalab: 'Arce Data Lab builds software, dashboards and AI assistants for SMEs.',
      proyectos: 'Open any project and I’ll sum up the problem, the solution and the result.',
      ficha: 'Project summary.',
      jugar: ['While you read, I’m checking the data.', 'Systems check: all good.', 'Still here. Let me know if you want a summary.', 'Checking that every app responds.'],
      dormir: 'Power-saving mode. Move the mouse and I’ll be back.',
      despertar: 'Back again. How can I help?',
      cinta: 'This is how automation works: manual data goes in, a finished report comes out, with no hands involved.',
      trayectoria: 'Consulting, banking and industry: experience with real data and real deadlines.',
      tecnologias: 'Production-proven tools, chosen for each case.',
      preguntas: 'Short answers to what people ask most before starting a project.',
      contacto: 'Want to talk about your case? Write to info@arcedatalab.com and Henry will reply.',
      pulsar: ['Here I am. Double-click me and I’ll leave Henry a message.', 'Want a summary of a project? Open any of them.', 'Tip: start by automating the task that takes you the most time.', 'When data does not add up, there is almost always a cause that can be fixed.', 'A byte is 8 bits. A good process, zero repeated tasks.'],
      mensaje: {
        titulo: 'Leave Henry a message',
        sub: 'Byte drafts it and your email or WhatsApp opens with everything written. Nothing is stored on this site.',
        nombre: 'Your name', empresa: 'Company (optional)', texto: 'How can he help?',
        ejemplo: 'E.g. every Monday we copy sales from the ERP into Excel and it takes 3 hours.',
        correo: 'Send by email', whatsapp: 'Send on WhatsApp', cerrar: 'Close',
        vacio: 'Write at least one sentence so Henry knows what you need.',
        abriendo: 'Opening your app…',
        listo: 'Done: check the window that opened and press send there. Henry usually replies the same day.',
        fallo: 'Nothing opened? Copy the message and send it to ',
        copiar: 'Copy message', copiado: 'Copied',
        asunto: 'Message from arcedatalab.com', hola: 'Hi Henry, I am'
      },
      ocultar: 'Hide Byte',
      mostrar: 'Show Byte',
      canal: 'Watch Club Byte'
    }
  },

  AREAS: [
    { titulo: 'Automation', texto: 'Workflows and integrations that remove manual work' },
    { titulo: 'Applied AI', texto: 'Assistants and agents on business data' },
    { titulo: 'Data &amp; BI', texto: 'Reports that get used and measure impact' },
    { titulo: 'Business systems', texto: 'ERP, CRM and ecommerce from the inside' }
  ],

  PROYECTOS: {
    ada: {
      corto: 'Ada, marketing', titulo: 'Ada: marketing for my channels with n8n and AI', etiqueta: 'Own product · running · 2026',
      resumen: 'Prepares, reviews and publishes the videos and posts of five channels. A weekly cycle, a nightly check and a queue where nothing goes out without review.',
      probar: 'Be Ada for a week: stories, a used-up quota, the 8 pm review and publishing.',
      caso: [
        ['Problem', 'Running YouTube, Instagram, TikTok and LinkedIn with videos, covers and copy every day eats up the evenings, and the day something breaks, nothing gets published.'],
        ['What I did', 'Ada, a system in n8n that works in two cycles. Every week it asks ChatGPT for the stories and prepares episodes, reels, posts and campaigns; every night it looks back at the day and, if it is worth it, prepares a news video. ChatGPT writes the stories and makes the images, Google AI Studio does the voices, and editing, clips and covers come from my own video engine. Everything goes into a queue: the evening before, at 8 pm, it checks cover, copy, time, a maximum of three posts a day per network and no repeated topic within 14 days, and sends an email with a “Stop” button for each post.'],
        ['Result', 'Approved posts go out through Buffer and the YouTube API, and the video is archived on its own. An error and alert log: if the image or voice quota runs out, it records the time and picks the work up again when there is quota; if a network fails, it asks for a manual upload. Review and alerts are live; automatic publishing is in testing.']
      ],
      tec: ['n8n', 'OpenAI API', 'Google AI Studio', 'Buffer', 'YouTube API', 'rclone']
    },
    clubbyte: {
      corto: 'Club Byte', titulo: 'Club Byte: technology explained to children aged 8 to 12', etiqueta: 'Personal project · 3D animation · 2026',
      caso: [
        ['Problem', 'There is hardly any content in Spanish that explains to children how computing works through stories and characters, without selling a course behind it.'],
        ['What I did', 'A YouTube channel and a blog with two main characters, Lía and Teo, and Bit, a robot made in Blender. Each episode explains one idea (sensors, conditionals, binary, algorithms) and ends with an unplugged challenge for home or class.'],
        ['Result', 'A 3D animated intro, scripts, voices and the first episode, plus a blog for families and teachers with activity sheets. No cookies or tracking, as a children’s site should be.']
      ],
      tec: ['Blender', 'Python', 'Educational scripts', 'SEO for families and teachers']
    },
    plataforma: {
      corto: 'DEV/PRO platform', titulo: 'In-house platform to deploy apps to DEV and PRO', etiqueta: 'Open source · Arce Data Lab · 2026',
      caso: [
        ['Problem', 'Every application was deployed by hand on the server, each with its domain, login and backups done a different way.'],
        ['What I did', 'A system that gives each app a test environment and a production one on the same server. An app plugs in with a manifest file and the system creates its route, its Keycloak user group, its domain with a certificate and its deployment from the GitHub image.'],
        ['Result', 'About ten applications living on one server, “Deploy”, “Promote to PRO” and “Roll back” buttons, automatic rollback for the apps the server deploys, and an agent that updates itself when the tests are green.']
      ]
    },
    sindri: {
      corto: 'Sindri ERP', titulo: 'Sindri: ERP for small manufacturers', etiqueta: 'Own product · open source · 2026',
      resumen: 'ERP for small factories: orders, a warehouse with batches, invoices ready for VERI*FACTU and the shop floor connected through Efesto.',
      probar: 'From sales to the shop floor: opportunity, order, routing, a pallet with its batch and the delivery note.',
      texto: 'ERP for small factories: customers, quotes, orders, routings, delivery notes, invoices ready for Spain’s VERI*FACTU and a warehouse with batches. It has a desktop version, connects to the shop floor through Efesto and to sales through Brokkr, the CRM. It receives the billable support hours from Odin and builds its PDFs with Report Server.',
      tec: ['PostgreSQL (PGlite)', 'Electron', 'OPC UA', 'REST API', 'Docker']
    },
    gestor: {
      corto: 'Odin, tickets', titulo: 'Odin: tickets, documentation and support hours', etiqueta: 'Own product · open source · 2026',
      caso: [
        ['Problem', 'Tickets were noted down by hand, hours lived in a spreadsheet and invoices somewhere else. Nothing was connected.'],
        ['What I did', 'My own web application where each ticket carries its follow-up, its documentation and its timed work sessions. It started on top of MantisBT and now has its own tables, with the history migrated.'],
        ['Result', 'Single sign-on with Keycloak, every open ticket creates its task in the task manager, and pending hours flow to Sindri on their own to be invoiced. Branded email through the Mail service.']
      ]
    },
    servicios: {
      corto: 'Mail and Report Server', titulo: 'Mail and Report Server: email and PDF for every app', etiqueta: 'Open source · shared services · 2026',
      texto: 'Two services shared by all my applications. <strong>Mail</strong> sends Arce Data Lab branded email through Resend, from <code>soporte@arcedatalab.com</code>, with blocks (title, button, table, image), attachments, per-app keys and a sent log. <strong>Report Server</strong> designs PDF templates in the browser with pdfme, connects to MariaDB in read-only mode and generates invoices, orders and delivery notes through an API.'
    },
    gateway: {
      corto: 'Data gateway', titulo: 'Real-time data gateway', etiqueta: 'For Grupo SPSIL · 2026',
      caso: [
        ['Problem', 'The warehouse needed to see live stock from a website, but the databases sit on the internal network and no inbound ports could be opened.'],
        ['What I did', 'A gateway in the style of the Power BI one: an agent inside the network opens a WebSocket tunnel to the website, queries MariaDB and SQL Server on demand and returns the data through that same tunnel.'],
        ['Result', 'Up-to-the-minute stock on touch screens on the shop floor, permissions by department, an interface in Spanish, Chinese and English, and export to Excel.']
      ]
    },
    crm: {
      corto: 'Forja, appointments', titulo: 'Forja: appointments with an offline tablet app', etiqueta: 'Own product · in development',
      caso: [
        ['Problem', 'A business that manages patient appointments in hospitals was working with a spreadsheet-based application that had fallen short, and hospitals do not always have coverage.'],
        ['What I did', 'I rewrote it as a web application with its own database and a tablet app that works offline: it saves locally, queues the changes and syncs them as versioned events when the network comes back.'],
        ['Result', 'Schedule, patients, services, payments, documents and alerts in one place, with a conflict screen to decide when two devices change the same thing. Deployed on my own server.']
      ]
    },
    asistente: {
      corto: 'Lin-AI, assistant', titulo: 'Lin-AI: AI assistant on top of the ERP', etiqueta: 'For Grupo SPSIL · 2026',
      resumen: 'Business questions to the ERP in plain language, with closed queries so it does not make data up.',
      probar: 'Ask the ERP, see which query it picks and download the answer.',
      texto: 'An assistant that answers business questions by querying the ERP in read-only mode. Each type of query is a closed function; the model chooses which one to use and with which parameters, so it does not make data up. It relies on editable business notes that explain how each figure is calculated, and it answers in text or in Excel.',
      tec: ['Python', 'Agents', 'Knowledge base', 'SQL Server']
    },
    reporting: {
      corto: 'BI reporting', titulo: 'Sales, collections and stock reporting', etiqueta: 'For Grupo SPSIL · 2025–2026',
      resumen: 'Sales, collections and stock in Power BI, migrated to Microsoft Fabric and checked before and after.',
      probar: 'Filter, switch pages and refresh the model step by step.',
      texto: 'Power BI reports on top of the ERP for management, sales and purchasing. After a network change cut off the data sources, I migrated the processes to Dataflows and a Lakehouse in Microsoft Fabric. Every change to a view ships with its backup, its rollback script and a before-and-after check.'
    },
    nutricion: {
      corto: 'Nutrition app', titulo: 'Nutrition and training app', etiqueta: 'Own product · web app',
      texto: 'A personal application for losing weight sensibly: it generates the weekly plan from a catalogue of more than 500 foods adjusted to the calorie target, builds the shopping list from what was chosen and learns from what you mark as “liked it”. Every design decision is kept in a changelog.'
    },
    escritorio: {
      corto: 'Desktop report', titulo: 'Operational report without Power BI', etiqueta: 'For Grupo SPSIL · desktop',
      texto: 'A desktop application that generates a report of quotes by customer and product family straight from SQL Server or the Lakehouse. The calculation runs in the database so the computer is not loaded, with filters, export to Excel and automated tests.'
    },
    tienda: {
      corto: 'Online shop', titulo: 'Online shop with its own admin panel', etiqueta: 'For a retailer · in development',
      texto: 'A shop for a screen-printing business: catalogue, cart and checkout, with a custom admin panel to manage products and orders. Everything starts with a single command thanks to Docker.'
    },
    helpdesk: {
      corto: 'Internal helpdesk', titulo: 'Internal helpdesk, time tracking and IT costs', etiqueta: 'At ES Group · 2026',
      texto: 'Internal tools for two production plants: an in-house helpdesk system for support, time tracking, IT cost monitoring and integration of invoicing between the group’s plants.'
    },
    plantillas: {
      corto: 'Website templates', titulo: 'Website templates for local businesses', etiqueta: 'Own product · 2026',
      texto: '28 example websites for made-up businesses: hospitality, beauty, sport, health, pets, retail and services. Each one has its main action (book a table, make an appointment, place an order or ask for a quote) and you can try it end to end without sending anything. Mobile first, with self-hosted fonts instead of Google Fonts and no inline styles or scripts, so they pass a strict security policy. They include a legal notice and say clearly that the business is made up. The catalogue filters by sector and comes from the same generator I use for private client demos.',
      tec: ['HTML and CSS', 'Dependency-free JavaScript', 'Strict CSP', 'Own generator']
    },
    whatsapp: {
      corto: 'AI for WhatsApp', titulo: 'AI assistant for WhatsApp', etiqueta: 'Own product · in development',
      texto: 'An assistant that looks after a business’s customers on WhatsApp: it answers the usual questions, gives opening hours and services, helps book an appointment or place an order and hands the chat to a person when needed. Official WhatsApp Business API only. In development.',
      tec: ['Official WhatsApp Business API', 'Applied AI']
    },
    efesto: {
      corto: 'Efesto, shop floor', titulo: 'Efesto: Sindri reads the factory', etiqueta: 'Own product · part of Sindri · 2026',
      caso: [
        ['Problem', 'Machine status, good and bad parts and alarms stay inside each PLC or SCADA, far from the ERP, and connecting them usually means opening ports into the factory.'],
        ['What I did', 'A read-only shop-floor agent with 16 connectors: OPC UA, Modbus, Siemens S7, Rockwell, Beckhoff, Omron, MQTT, MTConnect, BACnet, historian SQL, files and scales, among others. The connection goes out from the factory, stores and resends if the network drops, and no plant addresses or passwords ever leave it.'],
        ['Result', 'Tested with 22 simulated machines: 106 out of 106 data points reach Sindri. If one machine goes down, the rest carry on. Not yet connected to a real factory.']
      ]
    },
    brokkr: {
      corto: 'Brokkr CRM', titulo: 'Brokkr: the CRM for a small manufacturer’s sales rep', etiqueta: 'Own product · in progress',
      texto: 'The in-house CRM, in progress. It is a Sindri module sharing the same customers, quotes, orders and invoices, so nothing is duplicated. The goal: log a visit in under 30 seconds from a phone or handheld, even without coverage; opportunities that win themselves when the order is confirmed; and one timeline per customer with calls, quotes, invoices, payments and Odin tickets. The pipeline, activities and quotes already work inside Sindri; before going further I analysed 15 open-source CRMs.',
      tec: ['Sindri module', 'Fastify', 'PostgreSQL', 'React', 'Keycloak']
    },
    tareas: {
      corto: 'Aris, tasks', titulo: 'Aris: tasks and projects for teams', etiqueta: 'Open source · web app',
      resumen: 'Kanban, Scrum, wiki and calendar for teams, with an API designed for AI agents.',
      probar: 'A ticket from Odin arrives as a card and you take it to “Done”.',
      texto: 'A web app to organise a team’s work: Kanban and Scrum boards, calendar and agenda, wiki, notes, whiteboard, SLA, person-to-person notes, activity walls and an API designed for AI agents. It is a base version with no company data: branding, login (local or Keycloak) and optional modules are set in one file, and it installs with Docker and demo data.'
    },
    themelab: {
      etiqueta: 'Open source · web tool',
      texto: 'A theme generator for Power BI in the browser: you pick your brand colour, see the palette on a live dashboard, check the contrast and export the <code>theme.json</code>.'
    },
    calculate: {
      corto: 'CALCULATE live', titulo: 'CALCULATE live', etiqueta: 'Open source · web tool',
      texto: 'An interactive page for understanding the most powerful and most confusing function in DAX: you change the filter context and see, row by row, what the measure counts and what <code>CALCULATE</code> modifies.'
    },
    grafo: {
      corto: 'Graph map', titulo: 'Graph map of your Power BI project', etiqueta: 'Open source · method',
      texto: 'Four steps and four prompts for an AI to read your model and draw its dependency graph: which measures hold it up, which ones nobody uses and which connections cannot be seen at a glance.'
    },
    gobernanza: {
      corto: 'AI governance', titulo: 'AI governance framework', etiqueta: 'Open source · template',
      texto: 'A template for a team to define how AI is used when reviewing or building projects: a set of rules nobody can skip and two improvement loops that learn from each real case.'
    },
    modelo: {
      corto: 'Interaction model', titulo: 'AI interaction model', etiqueta: 'Open source · guide',
      texto: 'A way of working with AI as a collaborator rather than a search engine: framing, iteration and wrap-up, with templates designed for DAX, Power Query and documentation.'
    },
    outlook: {
      corto: 'Outlook to your programs',
      texto: 'Connects your Outlook calendar to your own programs with a link and a dependency-free script. No Microsoft API, no app registration and no tokens.'
    },
    reader: {
      corto: 'Power BI auditor',
      texto: 'Two scripts to audit a Power BI tenant with your own sign-in: how many reports you really have access to and which datasets are failing to refresh.'
    },
    comercial: {
      corto: 'Sales priorities', titulo: 'Sales priorities without overload',
      texto: 'A Power BI report with sample data to decide which customers and areas the sales team should spend its time on, with a Python script that regenerates the data.'
    },
    nifi: {
      titulo: 'Apache NiFi: your first flow', etiqueta: 'Open source · manual',
      texto: 'A step-by-step manual, in Spanish, for installing NiFi on Windows and building a first pipeline in twenty minutes, aimed at analysts coming from Power BI and Power Query.'
    }
  },

  // /sobre-mi/ (About): the career page, CV style. Same order as CARRERA in construir.js.
  CARRERA: {
    descripcion: 'Henry Arce (Luis Henry Arce Inga), data analyst and developer in Alicante, Spain: experience, skills, education and projects.',
    puesto: 'Data analyst and developer',
    lema: 'Automation, applied AI and Power BI',
    lugar: 'Alicante, Spain · on site or remote',
    fotoAlt: 'Henry Arce',
    resumen: 'I’ve worked with data since 2019: first in consulting firms (NTT DATA and Inforges), then on the digital transformation of a manufacturer, and today in charge of the ERP systems of an industrial group with two plants. I move between data, code and the business: I find a team’s manual tasks, turn them into reports, workflows and AI assistants, and measure what is gained.',
    botones: { correo: 'Email me', linkedin: 'LinkedIn', github: 'GitHub', pdf: 'Save as PDF' },
    datos: [
      ['2019', 'working with data'],
      ['4', 'companies, from consulting to industry'],
      ['2', 'production plants with their ERP in my care'],
      ['8.8', 'average grade and Academic Excellence Award']
    ],
    experiencia: 'Experience',
    experienciaSub: 'From consulting to the factory floor',
    logros: [
      ['In charge of the group’s ERP systems (Clavei and Cybermax) across two production plants.', 'Unified invoicing between both plants.', 'Integrations with SAP and EDI with customers and suppliers.', 'Machine data collection on the shop floor.', 'In-house helpdesk, time tracking and IT cost control.', 'Support for the migration to Azure.'],
      ['Microsoft Fabric to centralise and govern the company’s data.', 'Power BI dashboards for management and the sales team.', 'Python desktop applications for logistics and procurement.', 'Automation of repetitive tasks between departments.'],
      ['ETL processes and data warehouses.', 'Reports in Power BI and Excel.', 'Supplier indicators: SLA, availability, MTBF and MTTR.', 'Functional and technical documentation for every delivery.'],
      ['Financial and operational KPI dashboards for banking.', 'ETL processes and data integration from Azure Databricks, AWS, SharePoint and Oracle.'],
      ['Average grade 8.8 out of 10.', 'Academic Excellence Award 2022.', 'Prize winner at the CV Skills 2021 championship, Electronics category.'],
      ['Sales, inventory and production dashboards.', 'Report automation with Python and Excel macros.']
    ],
    formacion: 'Education and awards',
    formacionSub: 'Higher vocational diploma and competitions',
    habilidades: 'What I do',
    habilidadesSub: 'Skills and the tools I use every day',
    competencias: [
      ['Data &amp; BI', 'Data models, DAX and dashboards that management actually uses.'],
      ['Automation', 'Removing manual tasks with workflows, scripts and integrations between systems.'],
      ['Applied AI', 'Assistants and agents that work with business data, with a human in control.'],
      ['ERP &amp; integration', 'Running ERP systems and connecting SAP, EDI and shop-floor machines.'],
      ['Development', 'Web and desktop applications, from the database to the screen.'],
      ['Infrastructure', 'My own server with Docker, single sign-on, DEV/PRO and continuous deployment.']
    ],
    herramientas: 'Tools',
    propios: 'Own projects',
    propiosSub: 'What I build on my own with Arce Data Lab',
    propiosTexto: 'Alongside my job I run <strong>Arce Data Lab</strong>, my lab: it’s where I build and test my own applications and take on freelance projects.',
    proyectos: [
      ['ada', 'Ada', 'Automation with n8n and AI: prepares, reviews and publishes the videos and posts of five channels, and nothing goes out unreviewed.'],
      ['sindri', 'Sindri', 'ERP for small factories: orders, stock with batches, invoices ready for VERI*FACTU and the shop floor connected.'],
      ['plataforma', 'My platform', 'Server with Docker, Keycloak, DEV/PRO, backups and deployment with GitHub Actions.'],
      ['github', 'Open source', 'Power BI auditor, Outlook calendar for your own programs, an Apache NiFi manual and more, on GitHub.']
    ],
    verProyectos: 'See all projects',
    contacto: 'Let’s talk',
    contactoTexto: 'If you’d like to get to know me for a role, a collaboration or a project, email me and I’ll get back to you.'
  },

  TRAYECTORIA: [
    ['Apr 2026 – present', 'Business Applications Administrator', 'F&amp;D Shower Tray (ES Group)', 'In charge of the group’s ERP systems for two production plants. Integrations with SAP, machine data collection, EDI, an in-house helpdesk, time tracking and IT costs, and support for the migration to Azure.'],
    ['Jan 2025 – Mar 2026', 'Data Analyst · Digital transformation', 'Grupo SPSIL', 'Data analysis, automation and development for a manufacturer: Microsoft Fabric to centralise and govern the data, Power BI for management and sales, and Python desktop applications for logistics and procurement.'],
    ['Nov 2023 – Jul 2024', 'Analyst programmer', 'Inforges', 'Innovation and digital transformation area: ETL and data warehouses, reports in Power BI and Excel, and supplier indicators (SLA, availability, MTBF, MTTR) with their functional and technical documentation.'],
    ['Feb 2022 – Nov 2023', 'Business Intelligence Developer', 'NTT DATA', 'BI solutions for the banking sector: dashboards of financial and operational indicators, ETL processes and data integration from Azure Databricks, AWS, SharePoint and Oracle.'],
    ['2020 – 2022', 'Vocational diploma in Telecommunications and IT Systems', 'IES El Palmeral', 'Average grade 8.8 out of 10. Academic Excellence Award 2022 and prize winner at the CV Skills 2021 championship, Electronics category.'],
    ['Sep 2019 – Feb 2020', 'Data analyst', 'Freelance', 'First projects on my own: sales, inventory and production dashboards, and report automation with Python and Excel macros.']
  ],

  TECNOLOGIAS: [
    ['Automation', 'Python, Power Automate, Apps Script, VBA, PowerShell, Shell Script'],
    ['Applied AI', 'Claude, Claude Code, Copilot, agents and assistants, prompt design, knowledge bases'],
    ['Data &amp; BI', 'Power BI, DAX, Power Query, SQL Server, MariaDB, PostgreSQL, Microsoft Fabric, Databricks'],
    ['Integrations', 'REST API, webhooks, WebSocket, EDI, transactional email'],
    ['Business systems', 'Clavei, Cybermax, SAP, A3 ERP, SharePoint'],
    ['Development', 'Node.js, Next.js, TypeScript, React Native, Django, Docker, Linux, Git']
  ]
};
