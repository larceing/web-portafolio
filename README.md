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

Todo el texto está en `construir.js`: la lista `PROYECTOS`, `AREAS`, `TRAYECTORIA` y
`TECNOLOGIAS`, y el correo y los enlaces al principio. Después de editar:

```
node construir.js
```

Eso regenera `index.html`. No hace falta nada más para verlo: abre el fichero en el navegador.

Cada proyecto tiene `tipo` (`producto`, `empresa` o `abierto`, que decide el filtro), `icono`
(uno de los de `ICONOS`) y `color` (uno de los seis de `C`). Con `caso` sale en formato
problema / qué hice / resultado; con `texto`, en un párrafo.

## Cambiar el aspecto

`css/estilos.css`. Los colores y las tipografías están al principio, en `:root`: página blanca,
tinta oscura, un azul de acento, titulares en Barlow Condensed y texto en IBM Plex Sans.

## Publicar

```
tar -czf - --exclude=.git . | ssh servidor "tar -xzf - -C /opt/apps/portafolio"
ssh servidor "cd /opt/apps/portafolio && docker compose -f docker-compose.server.yml up -d --build"
```

## Criterios de contenido

- En los proyectos para empresa no aparecen datos, cifras ni capturas del cliente.
- `img/` conserva las portadas de `MARCA_PERSONAL` por si se quieren volver a usar; el diseño
  actual no las muestra.

## Pendiente

- Versión en inglés, si se quiere.
- La foto de la presentación es `img/foto.webp` (640 px). Para cambiarla, sustituir ese fichero.
