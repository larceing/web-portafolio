# Web portafolio · Henry Arce

Página personal de Henry Arce (Arce Data Lab), publicada en https://arcedatalab.com
(antes en luiscontacto03.com, que redirige aquí). HTML, CSS y JavaScript sin dependencias,
más Byte, el hermano mayor de Bit (el robot de Club Byte), en 3D (ver `bit/README.md`).

## Cómo está hecha

- **Franja de áreas:** cuatro paneles inclinados (automatización, IA aplicada, datos y BI,
  sistemas de negocio).
- **Proyectos:** cuadrícula de teselas de color con un pictograma y el título. Al pulsar una se
  abre su ficha con el problema, lo que se hizo y el resultado.
- **Trayectoria, tecnologías, divulgación y contacto:** listas sencillas a dos columnas.

## Cambiar el contenido

Todo el texto en español está en `construir.js`: la lista `PROYECTOS`, `AREAS`, `TRAYECTORIA` y
`TECNOLOGIAS`, y el correo y los enlaces al principio. Después de editar:

```
node construir.js
```

Eso regenera `index.html` (español) y `en/index.html` (inglés). Los textos en inglés están en
`contenido.en.js`: al añadir un proyecto hay que poner allí su traducción con el mismo `id`, o
`construir.js` avisa de que falta. Cada página enlaza a la otra desde el menú.

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

## Cabeceras de seguridad

`cabeceras.conf` reúne las cabeceras (CSP incluida) y se incluye en `nginx.conf` en el `server` y
en cada `location` con su propio `add_header`, porque nginx no las hereda en ese caso. La CSP solo
abre las fuentes de Google y los marcos de `https://www.linkedin.com`.

## Publicar

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

- La foto de la presentación es `img/foto.webp` (640 px). Para cambiarla, sustituir ese fichero.
