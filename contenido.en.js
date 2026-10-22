// Textos de la versión en inglés. construir.js los combina con los datos en
// español: lo que no aparezca aquí (iconos, colores, enlaces) se toma de allí.
// PROYECTOS va por id; AREAS, TRAYECTORIA y TECNOLOGIAS, en el mismo orden.

module.exports = {
  UI: {
    lang: 'en',
    titulo: 'Henry Arce · Automation, applied AI and Power BI | Arce Data Lab',
    descripcion: 'Henry Arce, founder of Arce Data Lab (Alicante, Spain): automation, applied AI, Power BI and custom apps for SMEs and industry. Real projects and open source.',
    ogDescripcion: 'Automation, applied AI and data for SMEs and industry. Real projects, open source and Club Byte.',
    locale: 'en_GB',
    idiomaNombre: 'English',
    linkedinTitulo: 'Posts on LinkedIn',
    linkedinDescripcion: 'Henry Arce’s LinkedIn posts on BI, data and applied AI.',
    linkedinSub: 'What I write about BI, data and applied AI, in Spanish',
    linkedinMarco: 'LinkedIn post',
    linkedinVer: 'Open on LinkedIn',
    linkedinPerfil: 'See them all on my LinkedIn profile',
    verPublicaciones: 'Read the posts here',
    saltar: 'Skip to content',
    lema: 'automation · AI · data',
    secciones: 'Sections',
    menu: { servicios: 'Services', arce: 'Arce Data Lab', proyectos: 'Projects', trayectoria: 'Career', tecnologias: 'Technologies', preguntas: 'FAQ', contacto: 'Contact' },
    otroIdioma: 'Español',
    otroIdiomaAria: 'Versión en español',
    h1: 'I automate processes and put AI to work on business data.',
    intro: 'I’m Henry Arce, a data analyst and developer based in Alicante, Spain, and the founder of <a href="#arcedatalab">Arce Data Lab</a>. I find the manual tasks in a team, turn them into workflows, assistants and reports, and measure what is gained. Since 2019, first in consulting firms and now inside industry.',
    fotoAlt: 'Henry Arce at the City of Arts and Sciences in Valencia',
    areasAria: 'Areas of work',
    verProyectos: 'See projects',
    franja: 'Open to projects and new conversations',
    proyectos: 'Projects',
    proyectosSub: 'Click any of them to see the problem it solved and how I did it',
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
    contacto: 'Contact',
    contactoSub: 'If your team has tasks that keep repeating or data that doesn’t add up, tell me about it',
    verPublicacion: 'View the post',
    telefono: 'WhatsApp works too',
    pie: 'Alicante, Spain',
    cerrar: 'Close',
    verFicha: 'Full project page',
    volver: 'Back to all projects',
    migas: 'Home',
    otrosProyectos: 'Other projects',
    servicios: 'Services',
    serviciosSub: 'What I can do for your company, through Arce Data Lab',
    serviciosLista: [
      ['flujo', 'Process automation', 'I remove repetitive manual work: reports that build themselves, data that moves between programs on its own, automatic alerts and emails.', 'Python, Power Automate, Apps Script, APIs'],
      ['grafico', 'Dashboards and BI', 'Power BI and Microsoft Fabric on top of your ERP or spreadsheets: sales, collections, stock and production, with figures reconciled and documented.', 'Power BI, DAX, Fabric, SQL'],
      ['bot', 'AI assistants on your data', 'An assistant that answers business questions by querying your data in read-only mode, without making figures up, in text or Excel.', 'Agents, Claude, OpenAI, SQL'],
      ['escritorio', 'Custom applications', 'ERP, CRM, appointments, tickets or an online shop: web apps with sign-in, backups and deployment on my own infrastructure.', 'Node.js, Python, Next.js, Docker']
    ],
    serviciosCta: 'Tell me which task is eating your time',
    infra: 'My infrastructure',
    infraSub: 'What I run and maintain myself, where my apps and my clients’ apps live',
    infraTexto: 'I don’t depend on closed platforms: I run my own server with everything needed to launch an application securely, test it and promote it to production.',
    infraLista: [
      ['Own server', 'Linux with Docker on Hetzner (Germany, EU). Each app in its own container, behind a single HTTPS proxy.'],
      ['DEV and PRO environments', 'Every app is tested before it reaches production, with automatic rollback if a version fails.'],
      ['Single sign-on', 'Keycloak for every application, with groups per app and per environment.'],
      ['Domains and certificates', 'Nginx Proxy Manager with Let’s Encrypt HTTPS and DNS on Cloudflare.'],
      ['Branded email', 'A Mail service on top of Resend: apps send from soporte@arcedatalab.com, with SPF, DKIM and DMARC.'],
      ['PDF documents', 'Report Server for invoices, orders and delivery notes from templates.'],
      ['Continuous deployment', 'GitHub Actions builds every version and publishes it to GitHub Container Registry.'],
      ['Backups and alerts', 'Nightly database backups and continuous checks that every app responds.']
    ],
    infraEnlace: 'See the platform on GitHub',
    arce: 'Arce Data Lab',
    arceSub: 'My brand: data, automation and AI for SMEs, plus a channel that gets kids into technology',
    arceTexto: '<strong>Arce Data Lab</strong> is the lab where I build apps, dashboards and AI assistants for SMEs and industry, with its own deployment platform, email and document services. Every project marked as an own product lives there.',
    arceEnlacesTextos: ['Client demos', 'TikTok @arcedatalab'],
    clubbyteTitulo: 'Club Byte',
    clubbyteTexto: '<strong>Club Byte</strong> is Arce Data Lab’s educational channel, in Spanish: it explains to children aged 8 to 12 how computing works, with Lía, Teo and Bit, the robot keeping you company on this page. Every episode ends with an unplugged challenge for home or the classroom.',
    clubbyteEnlacesTextos: ['YouTube @clubbyte_es', 'Blog for families and teachers'],
    bitAlt: 'Bit, the Club Byte robot',
    preguntas: 'Frequently asked questions',
    preguntasSub: 'What people ask me most, one sentence each',
    faq: [
      ['Who is Henry Arce?', 'Luis Henry Arce Inga, known as Henry Arce, is a data analyst and developer based in Alicante, Spain, specialised in process automation, applied AI and Power BI, and the founder of Arce Data Lab.'],
      ['What is Arce Data Lab?', 'Arce Data Lab is Henry Arce’s brand for building custom apps, dashboards and AI integrations for SMEs and industry; its website is arcedatalab.com.'],
      ['What services does Arce Data Lab offer?', 'Process automation, Power BI and Microsoft Fabric dashboards, AI assistants on business data and custom applications (ERP, CRM, appointments), deployed on its own infrastructure in the EU.'],
      ['What kind of projects does he do?', 'He automates repetitive tasks, connects ERP, CRM and databases, builds Power BI and Microsoft Fabric reports, and puts AI assistants to answer questions on business data in read-only mode.'],
      ['Does he work with SMEs?', 'Yes: with SMEs and factories that have manual tasks or data that does not add up, remotely or from Alicante.'],
      ['What is Club Byte?', 'Club Byte is Arce Data Lab’s YouTube channel (@clubbyte_es) and blog that explains computing and technology to children aged 8 to 12, in Spanish, with unplugged challenges for families and teachers.'],
      ['Where does he publish content?', 'On LinkedIn about BI, data and applied AI, on TikTok (@arcedatalab) with quick automation and data tips, and on YouTube with Club Byte for kids.'],
      ['How can I get in touch?', 'By email at info@arcedatalab.com, by WhatsApp at +34 633 42 42 23 or on LinkedIn; for support with the apps, soporte@arcedatalab.com.']
    ],
    soporte: 'App support',
    bit: {
      nombre: 'Bit, the Club Byte robot',
      hola: 'Hi! I’m Bit, the Club Byte robot. I’ll keep you company on Henry’s site.',
      servicios: 'If something in your company is done by hand every week, Henry can automate it.',
      infraestructura: 'I live here too: in containers, with backups every night.',
      arcedatalab: 'This is Arce Data Lab. I come from Club Byte, its channel for kids.',
      proyectos: 'Click a project and I’ll tell you what problem it solved.',
      trayectoria: 'From consulting to the factory floor. So much data!',
      tecnologias: 'Python, Power BI, Docker… I was built in Blender.',
      preguntas: 'Short answers, just how I like them.',
      contacto: 'Shall we talk? Write to info@arcedatalab.com',
      pulsar: ['Beep boop! That tickles.', 'If I were a byte, I’d be 8 bits of joy.', 'On Club Byte I explain how computers think.', 'An algorithm is a recipe. Like a sandwich!'],
      ocultar: 'Hide Bit',
      mostrar: 'Show Bit',
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
    clubbyte: {
      corto: 'Club Byte', titulo: 'Club Byte: technology explained to children aged 8 to 12', etiqueta: 'Arce Data Lab · educational channel · 2026',
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
        ['Result', 'About ten applications living on one server, “Deploy”, “Promote to PRO” and “Roll back” buttons, automatic rollback if a version does not respond, and an agent that updates itself when the tests are green.']
      ]
    },
    sindri: {
      corto: 'Sindri ERP + CRM', titulo: 'Sindri: ERP and CRM for small manufacturers', etiqueta: 'Own product · open source · 2026',
      texto: 'ERP and CRM for small factories: customers, opportunities, quotes, orders, routings, delivery notes, invoices ready for Spain’s VERI*FACTU and a warehouse with batches. It has a desktop version and a shop-floor agent that reads the machines over OPC UA. It receives the billable support hours from Odin and builds its PDFs with Report Server.',
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
      corto: 'Offline CRM', titulo: 'Appointment CRM with an offline tablet app', etiqueta: 'Own product · in development',
      caso: [
        ['Problem', 'A business that manages patient appointments in hospitals was working with a spreadsheet-based application that had fallen short, and hospitals do not always have coverage.'],
        ['What I did', 'I rewrote it as a web application with its own database and a tablet app that works offline: it saves locally, queues the changes and syncs them as versioned events when the network comes back.'],
        ['Result', 'Schedule, patients, services, payments, documents and alerts in one place, with a conflict screen to decide when two devices change the same thing. Deployed on my own server.']
      ]
    },
    asistente: {
      corto: 'AI assistant', titulo: 'AI assistant on top of the ERP', etiqueta: 'For Grupo SPSIL · in development',
      texto: 'An assistant that answers business questions by querying the ERP in read-only mode. Each type of query is a closed function; the model chooses which one to use and with which parameters, so it does not make data up. It relies on editable business notes that explain how each figure is calculated, and it answers in text or in Excel.',
      tec: ['Python', 'Agents', 'Knowledge base', 'SQL Server']
    },
    reporting: {
      corto: 'BI reporting', titulo: 'Sales, collections and stock reporting', etiqueta: 'For Grupo SPSIL · 2025–2026',
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
      corto: 'Online shop', titulo: 'Online shop with its own admin panel', etiqueta: 'For a retailer · online shop',
      texto: 'A shop for a screen-printing business: catalogue, cart and checkout, with a custom admin panel to manage products and orders. Everything starts with a single command thanks to Docker.'
    },
    helpdesk: {
      corto: 'Internal helpdesk', titulo: 'Internal helpdesk, time tracking and IT costs', etiqueta: 'At ES Group · 2026',
      texto: 'Internal tools for two production plants: an in-house helpdesk system for support, time tracking, IT cost monitoring and integration of invoicing between the group’s plants.'
    },
    tareas: {
      corto: 'Task manager', titulo: 'Task and project manager for teams', etiqueta: 'Open source · web app',
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
