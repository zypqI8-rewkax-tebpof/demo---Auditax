# Auditax - Sitio multipágina (HTML/CSS/JS)

## Páginas
- index.html (Inicio + Swiper + Noticias con Lightbox)
- about.html (Sobre Nosotros)
- services.html (Servicios)
- contact.html (Formulario -> WhatsApp)
- mission-vision.html (Misión y Visión)

## WhatsApp
En `js/main.js` cambiá:

```js
const WHATSAPP_NUMBER = '595000000000';
```

## Noticias
En `index.html` sección **Noticias & Insights**.
- Miniaturas cuadradas (tipo IG) y en el modal se muestran completas con `object-fit: contain`.

Reemplazá en `assets/`:
- `news-1-thumb.*` y `news-1-full.*` (y así con 2 y 3)

## Imágenes
Reemplazá los SVG de `assets/` por tus JPG/PNG corporativos (si cambia extensión, actualizá el `src`).
