// Publicaciones de LinkedIn que se muestran en /linkedin/ (y en /en/linkedin/),
// de arriba abajo en este orden.
//
// Para añadir una: en LinkedIn abre los tres puntos de la publicación, elige
// «Insertar esta publicación» y copia el código. Pégalo aquí entre comillas
// invertidas (`...`), seguido de una coma, y ejecuta `node construir.js`.
//
// También vale pegar solo el enlace de la publicación (el de «Copiar enlace»).
// El código que da LinkedIn es más fiable: si una publicación no se ve con su
// enlace, cámbialo por el código.
//
// construir.js no copia el código tal cual: saca de él la referencia de la
// publicación (urn:li:...) y la altura, y escribe su propio <iframe>. Así nada
// de lo que se pegue aquí puede meter otro HTML en la página.

module.exports = [
  // Ejemplo con el código oficial de «Insertar esta publicación»:
  // `<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:1234567890123456789" height="670" width="504" frameborder="0" allowfullscreen="" title="Publicación integrada"></iframe>`,

  'https://www.linkedin.com/posts/luis-henry-programador_windows-cmd-networking-activity-7371120247170502656-_654',
  'https://www.linkedin.com/posts/luis-henry-programador_10-t%C3%A9rminos-que-todo-profesional-de-datos-activity-7372599959688462336-17HF',
  'https://www.linkedin.com/posts/luis-henry-programador_el-abuelo-sabio-del-excel-vba-hoy-activity-7368190955071504385-PzAT'
];
