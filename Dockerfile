FROM nginx:1.27-alpine

# Versión de la imagen (sha-xxxxxxx o vX.Y.Z); la pone el workflow y se lee en /version/.
ARG APP_VERSION=dev

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY cabeceras.conf /etc/nginx/cabeceras.conf
# Archivo de verificación de Google Search Console (no borrar).
COPY index.html 404.html robots.txt sitemap.xml llms.txt googleb6a158ff17d4d746.html /usr/share/nginx/html/
COPY fuentes /usr/share/nginx/html/fuentes
COPY en /usr/share/nginx/html/en
COPY zh /usr/share/nginx/html/zh
COPY linkedin /usr/share/nginx/html/linkedin
COPY servicios /usr/share/nginx/html/servicios
COPY privacidad /usr/share/nginx/html/privacidad
COPY condiciones /usr/share/nginx/html/condiciones
COPY aviso-legal /usr/share/nginx/html/aviso-legal
COPY cookies /usr/share/nginx/html/cookies
COPY proyectos /usr/share/nginx/html/proyectos
COPY sobre-mi /usr/share/nginx/html/sobre-mi
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY img /usr/share/nginx/html/img
COPY lab /usr/share/nginx/html/lab
COPY plantillas /usr/share/nginx/html/plantillas
RUN mkdir -p /usr/share/nginx/html/version \
 && echo "{\"version\": \"$APP_VERSION\"}" > /usr/share/nginx/html/version/index.json

HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1/version/ >/dev/null || exit 1
