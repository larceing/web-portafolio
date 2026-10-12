# Web portafolio · Henry Arce

Página personal de una sola pantalla: presentación, qué hago, proyectos, trayectoria, tecnologías,
divulgación y contacto. HTML, CSS y JavaScript sin dependencias ni compilación.

## Verla

Abrir `index.html` en el navegador.

## Estructura

```
index.html        todo el contenido
css/estilos.css   diseño; los colores están al principio, en :root
js/app.js         menú móvil, filtro de proyectos, animaciones y constelación del fondo
img/              portadas de proyectos (WebP) y monograma
```

## Cambiar cosas

- **Colores:** variables de `:root` en `css/estilos.css`. La paleta es azul marino profundo, azul
  eléctrico y cian luminoso, con blanco y un acento dorado.
- **Proyectos:** cada uno es un `<article class="proyecto">` en `index.html`. El atributo
  `data-tipo` (`empresa`, `producto` o `abierto`) decide en qué filtro aparece. Los dos primeros
  llevan `proyecto-grande` y el formato problema / qué hice / resultado.
- **Trayectoria:** lista `<ol class="linea-tiempo">`.
- **Cifras de la portada y de divulgación:** están escritas a mano en `index.html`; revisarlas
  cuando cambien.

## Criterios de contenido

- En los proyectos para empresa no aparecen datos, cifras ni capturas del cliente.
- Las portadas de `img/` salen de `MARCA_PERSONAL`, redimensionadas a 720 px.

## Pendiente antes de publicar

- La dirección de contacto es `hola@luiscontacto03.com`: hay que crear esa regla en Cloudflare
  Email Routing (igual que `soporte@`) o cambiarla por otra que exista.
- Decidir dónde se publica: GitHub Pages, o el servidor propio tras Nginx Proxy Manager.
- Opcional: foto propia en la portada y versión en inglés.
