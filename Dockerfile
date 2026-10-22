FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY cabeceras.conf /etc/nginx/cabeceras.conf
COPY index.html robots.txt sitemap.xml llms.txt /usr/share/nginx/html/
COPY en /usr/share/nginx/html/en
COPY linkedin /usr/share/nginx/html/linkedin
COPY proyectos /usr/share/nginx/html/proyectos
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY img /usr/share/nginx/html/img
