# Web portafolio · Henry Arce

Página personal de una sola pantalla, publicada en https://luiscontacto03.com. HTML, CSS y
JavaScript sin dependencias.

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
