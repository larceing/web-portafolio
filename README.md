# Web portafolio · Henry Arce

Página personal de Henry Arce (Arce Data Lab), publicada en https://arcedatalab.com
(antes en henry.arcedatalab.com y luiscontacto03.com, que redirigen aquí con 301). HTML, CSS
y JavaScript sin dependencias, más Byte, el asistente de Arce Data Lab, y dos escenas en 3D
(ver `bit/README.md` y `bit/BYTE.md`).

## Cómo está hecha

- **Franja de áreas:** cuatro paneles inclinados (automatización, IA aplicada, datos y BI,
  sistemas de negocio).
- **Proyectos:** cuadrícula de teselas de color con un pictograma y el título. Al pulsar una se
  abre su ficha con el problema, lo que se hizo y el resultado.
- **Trayectoria, tecnologías, divulgación y contacto:** listas sencillas a dos columnas.

## Byte y el 3D

Todo el 3D va en un solo fichero, `js/bit.js` (three.js), que se pide cuando la página ya
ha cargado. Sin WebGL o con ahorro de datos no se carga; con «menos movimiento», Byte no
se mueve y las escenas quedan fijas.

- **Byte** (`bit/BYTE.md`): vuela junto al título de cada sección (modo `guia`, puesto en
  `construir.js` con `data-paseo`), mira al ratón, entra a resumir la ficha de un proyecto
  al abrirla y, sin actividad, hace comprobaciones y acaba en «modo de ahorro de energía».
- **Automatización en marcha** (`bit/cinta.js`): cinta con hojas que pasan por el flujo y
  salen como datos hacia un informe.
- **Mi infraestructura** (`bit/infra.js`): proxy, servidor, contenedores y, cada noche, un
  Byte en miniatura llevando la copia a la caja fuerte.
- **Relieve:** las teselas y los servicios se inclinan hacia el ratón (`js/app.js`).

Después de tocar algo de `bit/`: `cd bit && npm install && npm run construir`, y luego
`node construir.js`.

## Cambiar el contenido

Todo el texto en español está en `construir.js`: la lista `PROYECTOS`, `AREAS`, `TRAYECTORIA` y
`TECNOLOGIAS`, y el correo y los enlaces al principio. Después de editar:

```
node construir.js
```

Eso regenera la web en tres idiomas: español (raíz), inglés (`en/`) y chino simplificado (`zh/`).
Los textos en inglés están en `contenido.en.js` y los chinos en `contenido.zh.js`, con la misma
estructura: al añadir un proyecto hay que poner en los dos su traducción con el mismo `id`, o
`construir.js` avisa de que falta. La cabecera lleva el selector **ES · EN · 中文**, que lleva a la
misma página en el otro idioma (las legales solo existen en español y llevan a la portada). En
inglés y chino, los enlaces al laboratorio llevan `?lang=` para abrirlo en el mismo idioma.
Si se añade una carpeta de primer nivel nueva, hay que añadir su `COPY` al `Dockerfile`.

Cada proyecto tiene `tipo` (`producto`, `empresa` o `abierto`, que decide el filtro), `icono`
(uno de los de `ICONOS`) y `color` (uno de los seis de `C`). Con `caso` sale en formato
problema / qué hice / resultado; con `texto`, en un párrafo.

## SEO y GEO (lo genera `construir.js`)

- **Una página por proyecto** en `/proyectos/<id>/` y `/en/proyectos/<id>/`, con su título,
  descripción, migas y datos estructurados. La ficha emergente de la portada enlaza a ella.
  Si quitas un proyecto, borra también su carpeta en `proyectos/` y `en/proyectos/`.
- **Datos estructurados (JSON-LD)**: `Person` (Henry), `Organization` (Arce Data Lab),
  `CreativeWorkSeries` (Club Byte), `ProfilePage`, lista de proyectos y `FAQPage`.
- **Preguntas frecuentes** visibles en la portada (`UI.faq`): respuestas de una frase que
  los asistentes de IA pueden citar tal cual.
- `sitemap.xml` (con las versiones es/en enlazadas), `robots.txt` (abierto también a los
  rastreadores de IA) y `llms.txt` (resumen para asistentes de IA).
- Imagen para redes: `img/og.jpg` (1200 × 630).
- Search Console: la propiedad de dominio `arcedatalab.com` (cuenta henry@arcedatalab.com)
  ya la cubre. Enviar `https://arcedatalab.com/sitemap.xml`.

## Publicaciones de LinkedIn (`/linkedin/`)

La página `/linkedin/` (y `/en/linkedin/`) muestra publicaciones de LinkedIn con su código oficial
de inserción, sin API ni credenciales. La lista está en `publicaciones-linkedin.js`: en LinkedIn,
tres puntos de la publicación → «Insertar esta publicación», copiar el código, pegarlo en la lista
entre comillas invertidas y ejecutar `node construir.js`. También vale el enlace de la publicación.
`construir.js` solo toma de lo pegado la referencia (`urn:li:...`) y la altura, y escribe él el
`<iframe>`. Cada semana `js/linkedin.js` elige al azar `LINKEDIN_A_LA_VEZ` publicaciones de la
lista (4, en `construir.js`) y cambia su orden, sin volver a publicar. Solo se pueden insertar publicaciones públicas, y una publicación borrada deja su
marco vacío: hay que quitarla de la lista.

## Cambiar el aspecto

`css/estilos.css`. Los colores y las tipografías están al principio, en `:root`: página blanca,
tinta oscura, un azul de acento, titulares en Barlow Condensed y texto en IBM Plex Sans.

## Laboratorio (`lab/`)

Lo compila el hilo de demos (fuente en `DESARROLLO\demos\laboratorio\`). Lleva la misma cabecera
que el resto de páginas: el HTML está en `lab/index.html` y su estilo en `lab/cabecera.css` (copia
de las reglas de `css/estilos.css`; el laboratorio no carga esa hoja para no mezclar estilos con las
demos). `lab/cabecera.js` mide la cabecera (`--cab`) para colocar debajo la lista de proyectos. En
pantallas estrechas, la barra «Laboratorio de proyectos · Elegir proyecto» abre la lista. Si cambia
el menú de `construir.js`, cambiarlo también en `lab/index.html`.

## Cabeceras de seguridad

`cabeceras.conf` reúne las cabeceras (CSP incluida) y se incluye en `nginx.conf` en el `server` y
en cada `location` con su propio `add_header`, porque nginx no las hereda en ese caso. La CSP solo
abre las fuentes de Google y los marcos de `https://www.linkedin.com`.

## Publicar

La web va por el sistema DEV/PRO del servidor (app «Web Arce Data Lab», ruta `/web/`, `servidor.json`):
`node construir.js`, commit y push a `main` → GitHub construye `ghcr.io/larceing/web-portafolio:sha-xxxxxxx` →
Ajustes → «Poner» en DEV (`dev.luiscontacto03.com/web/`) → «Pasar a PRO». PRO está en su dominio `arcedatalab.com`
(«Poner en su dominio»; vuelta atrás: «Quitar su dominio», que vuelve al contenedor antiguo `portafolio-web`).

### Forma antigua (reserva)

Desde PowerShell en Windows: `.\publicar.ps1 "mensaje"` regenera, hace commit y sube la web.
El contenedor atiende `arcedatalab.com` y redirige `www.arcedatalab.com`, `henry.arcedatalab.com`, `luiscontacto03.com` y su `www.` a la
dirección nueva con la misma ruta (`nginx.conf`).
A mano, desde Linux o macOS:

```
tar -czf - --exclude=.git . | ssh servidor "tar -xzf - -C /opt/apps/portafolio"
ssh servidor "cd /opt/apps/portafolio && docker compose -f docker-compose.server.yml up -d --build"
```

## Criterios de contenido

- En los proyectos para empresa no aparecen datos, cifras ni capturas del cliente.
- `img/` conserva las portadas de `MARCA_PERSONAL` por si se quieren volver a usar; el diseño
  actual no las muestra.

## Pendiente

- Search Console: enviar `https://arcedatalab.com/sitemap.xml` (propiedad de dominio `arcedatalab.com`).

- La foto de la presentación es `img/foto.webp` (640 px). Para cambiarla, sustituir ese fichero.
