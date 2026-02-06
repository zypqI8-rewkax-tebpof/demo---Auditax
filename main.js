// Auditax - main.js (multipage)
(() => {
  // ============================
  // CONFIG
  // ============================
  // Reemplazá por tu número real en formato internacional SIN +, espacios ni guiones.
  // Ejemplo Paraguay: 595981188037
  const WHATSAPP_NUMBER = '595000000000';

  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

  // Year
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // WhatsApp helper
  const buildWhatsAppLink = (message) => {
    const base = `https://wa.me/${WHATSAPP_NUMBER}`;
    const text = encodeURIComponent(message);
    return `${base}?text=${text}`;
  };

  const genericMsg = `Hola Auditax, quiero más información sobre sus servicios.`;
  const bindWa = (selector, msg = genericMsg) => {
    const el = $(selector);
    if (!el) return;
    el.href = buildWhatsAppLink(msg);
    el.target = '_blank';
    el.rel = 'noopener';
  };

  bindWa('#ctaWhatsApp');
  bindWa('#sidebarWhatsApp');
  bindWa('#contactWhatsApp');
  bindWa('#footerWhatsApp');

  // ============================
  // Sidebar (mobile)
  // ============================
  const sidebar = $('#sidebar');
  const backdrop = $('#backdrop');
  const openBtn = $('#openSidebar');
  const closeBtn = $('#closeSidebar');

  const openSidebar = () => {
    if (!sidebar || !backdrop || !openBtn) return;
    sidebar.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    if (!sidebar || !backdrop || !openBtn) return;
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
    document.body.style.overflow = '';
  };

  openBtn?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  backdrop?.addEventListener('click', closeSidebar);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('open')) closeSidebar();
  });

  $$('.sidebar__link').forEach(a => a.addEventListener('click', closeSidebar));

  // ============================
  // Active link (multipage)
  // ============================
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const setActive = (selector) => {
    $$(selector).forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      a.classList.toggle('active', href === current);
    });
  };
  setActive('.nav__link');
  setActive('.sidebar__link');

  // ============================
  // Swiper (only if present)
  // ============================
  const swiperEl = $('#homeSwiper');
  if (swiperEl && window.Swiper) {
    // eslint-disable-next-line no-undef
    new Swiper('#homeSwiper', {
      loop: true,
      speed: 600,
      autoplay: { delay: 3600, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      a11y: true,
    });
  }

  // ============================
  // Lightbox (Noticias)
  // ============================
  const lb = $('#lightbox');
  const lbImg = $('#lightboxImg');
  const lbCloseBtn = lb?.querySelector('.lightbox__close');

  const openLb = (src, alt = 'Imagen') => {
    if (!lb || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLb = () => {
    if (!lb || !lbImg) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    lbImg.alt = '';
    document.body.style.overflow = '';
  };

  $$('.js-lightbox').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-full') || '';
      const alt = btn.getAttribute('data-alt') || 'Imagen';
      if (src) openLb(src, alt);
    });
  });

  // Cerrar con botón X
  lbCloseBtn?.addEventListener('click', closeLb);

  // Mejor UX en móvil: cerrar tocando la imagen
  lbImg?.addEventListener('click', closeLb);

  // Cerrar al tocar el backdrop
  lb?.addEventListener('click', (e) => {
    const t = e.target;
    if (!t) return;
    const shouldClose = (t.getAttribute && t.getAttribute('data-close') === 'true') || t.classList?.contains('lightbox__backdrop');
    if (shouldClose) closeLb();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb?.classList.contains('open')) closeLb();
  });

  // ============================
  // Contact form -> WhatsApp
  // ============================
  const form = $('#contactForm');
  const toast = $('#toast');

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 3200);
  };

  const setError = (name, msg) => {
    const el = document.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = msg || '';
  };

  const validators = {
    nombre: (v) => v.trim().length >= 3,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    telefono: (v) => v.trim().length >= 6,
    servicio: (v) => v.trim().length > 0,
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    let ok = true;
    if (!validators.nombre(data.nombre || '')) { setError('nombre', 'Ingresá tu nombre y apellido.'); ok = false; } else setError('nombre');
    if (!validators.email(data.email || '')) { setError('email', 'Ingresá un email válido.'); ok = false; } else setError('email');
    if (!validators.telefono(data.telefono || '')) { setError('telefono', 'Ingresá un teléfono válido.'); ok = false; } else setError('telefono');
    if (!validators.servicio(data.servicio || '')) { setError('servicio', 'Seleccioná un servicio.'); ok = false; } else setError('servicio');

    if (!ok) {
      showToast('Revisá los campos marcados.');
      return;
    }

    const msgLines = [
      `Hola Auditax, quiero contactarme:`,
      `\n• Nombre: ${data.nombre}`,
      `• Email: ${data.email}`,
      `• Teléfono: ${data.telefono}`,
      `• Servicio: ${data.servicio}`,
    ];

    if ((data.mensaje || '').trim()) {
      msgLines.push(`\nMensaje: ${data.mensaje.trim()}`);
    }

    msgLines.push(`\nEnviado desde auditax.com.py`);

    const url = buildWhatsAppLink(msgLines.join('\n'));
    window.open(url, '_blank', 'noopener');
    showToast('Abriendo WhatsApp…');
    form.reset();
  });
})();
