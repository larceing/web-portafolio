// Vídeo de YouTube con carga ligera: hasta que se pulsa solo hay una imagen local.
document.querySelectorAll('.video-yt-boton').forEach(function (b) {
  b.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(b.dataset.yt) + '?autoplay=1&rel=0&playsinline=1';
    f.title = b.getAttribute('aria-label');
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.width = 540; f.height = 960;
    b.replaceWith(f);
  });
});
