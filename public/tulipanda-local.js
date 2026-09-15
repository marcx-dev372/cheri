(() => {
  const slides = [
    ['/flores-amarillas/FA_1.png', 'Arreglos de flores amarillas para regalar - Tulipanda'],
    ['/flores-amarillas/FA_3.png', 'Ramo de girasoles amarillos - Tulipanda'],
    ['/flores-amarillas/FA_5.png', 'Ramo de rosas amarillas - Tulipanda'],
    ['/flores-amarillas/FA_6.png', 'Ramo de girasoles para un detalle especial - Tulipanda'],
    ['/flores-amarillas/FA_8.png', 'Tulipanes amarillos para regalar - Tulipanda'],
    ['/flores-amarillas/FA_9.png', 'Ramo de tulipanes amarillos - Tulipanda']
  ];

  const icon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.7 3.2c.7 1.1 1.6 1.8 3 2v3.1c-1.2 0-2.3-.3-3.3-.9v6.4a5.1 5.1 0 1 1-4.4-5v3.1a2 2 0 1 0 1.3 1.9V3.2h3.4Z"/></svg>';
  const productDescriptions = {
    'arreglo-pandy-queen': 'Un arreglo alegre y abundante con rosas frescas, follaje y un detalle de CHERY_DETALLES para sorprender a esa persona especial.',
    'caja-de-6-rosas': 'Seis rosas frescas seleccionadas y presentadas en una caja elegante, listas para regalar.',
    'caja-de-6-tulipanes': 'Seis tulipanes frescos en una presentación delicada para celebrar un momento especial.',
    'caja-de-8-tulipanes': 'Ocho tulipanes frescos en caja, una composición colorida y elegante para regalar.',
    'caja-de-10-tulipanes': 'Diez tulipanes frescos seleccionados para llenar de color y emoción cualquier ocasión.',
    'caja-de-12-tulipanes': 'Doce tulipanes frescos en una presentación especial de CHERY_DETALLES.',
  };

  function setupSocialLinks() {
    const header = document.querySelector('[data-header-nav] .flex.items-center.justify-end');
    if (!header) return;
    const cart = header.querySelector('[data-testid="nav-cart-link"]');
    const originalInstagram = [...header.querySelectorAll('button')].find((button) => button.querySelector('svg path[d^="M12 2.163"]'));
    if (originalInstagram && !document.querySelector('.cheri-instagram-link')) {
      const instagram = document.createElement('a');
      instagram.className = 'cheri-instagram-link';
      instagram.href = 'https://www.instagram.com/cheri_detalles?stkn=MWI1ODMzY3hnd2FkbQ%3D%3D';
      instagram.target = '_blank';
      instagram.rel = 'noreferrer';
      instagram.setAttribute('aria-label', 'Instagram');
      instagram.innerHTML = `${originalInstagram.querySelector('svg').outerHTML}<span class="cheri-instagram-handle">@cheri_detalles</span>`;
      originalInstagram.replaceWith(instagram);
    }
    document.querySelectorAll('.tulipanda-tiktok-link').forEach((link) => {
      if (link.classList.contains('cheri-instagram-link')) link.remove();
    });
    if (!document.querySelector('.tulipanda-tiktok-link')) {
      const tiktok = document.createElement('a');
      tiktok.className = 'tulipanda-tiktok-link';
      tiktok.href = 'https://www.tiktok.com/@cheri_detalles';
      tiktok.target = '_blank';
      tiktok.rel = 'noreferrer';
      tiktok.setAttribute('aria-label', 'TikTok');
      tiktok.innerHTML = `${icon}<span>TikTok</span>`;
      const socialContainer = cart?.parentElement || header;
      socialContainer.insertBefore(tiktok, cart && cart.parentElement === socialContainer ? cart : null);
    }
  }

  function keepCollectionsOnly() {
    document.querySelectorAll('nav li').forEach((item) => {
      const collectionLink = item.querySelector('a[href^="/coleccion/"]');
      if (!collectionLink) item.remove();
    });
  }

  function replaceBrandText() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      node.nodeValue = node.nodeValue
        .replace(/Tulipanda|tulipanda|pandas/gi, 'CHERY_DETALLES')
        .replace(/Â¿QuÃ© estÃ¡s buscando\?/g, '¿Qué estás buscando?')
        .replace(/Â¿QuÃ© estÃ¡s buscando\?/g, '¿Qué estás buscando?');
    });
    document.querySelectorAll('img[alt], title, meta[content]').forEach((element) => {
      if (element.alt) element.alt = element.alt.replace(/Tulipanda|tulipanda|pandas/gi, 'CHERY_DETALLES');
      if (element.title) element.title = element.title.replace(/Tulipanda|tulipanda|pandas/gi, 'CHERY_DETALLES');
      if (element.content) element.content = element.content.replace(/Tulipanda|tulipanda|pandas/gi, 'CHERY_DETALLES');
    });
  }

  function setupDrawer() {
    const menuButton = document.querySelector('[data-testid="nav-menu-button"]');
    const drawer = document.querySelector('.small\\:hidden.fixed');
    if (!menuButton || !drawer || drawer.dataset.drawerReady) return;
    drawer.dataset.drawerReady = 'true';
    drawer.dataset.cheryDrawer = 'true';
    const overlay = document.createElement('button');
    overlay.className = 'chery-drawer-overlay';
    overlay.type = 'button';
    overlay.setAttribute('aria-label', 'Cerrar menu');
    document.body.appendChild(overlay);
    const closeButton = drawer.querySelector('[aria-label*="Cerrar"]');
    const setOpen = (open) => {
      drawer.classList.toggle('is-open', open);
      overlay.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('drawer-open', open);
    };
    menuButton.addEventListener('click', () => setOpen(true));
    closeButton?.addEventListener('click', () => setOpen(false));
    overlay.addEventListener('click', () => setOpen(false));
    drawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    setOpen(false);
  }

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem('chery-cart') || '[]');
    } catch (error) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem('chery-cart', JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('chery-cart-updated'));
  }

  function updateCartBadge() {
    const count = readCart().reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('[data-testid="nav-cart-link"] span').forEach((badge) => {
      if (/^\d+/.test(badge.textContent.trim())) badge.textContent = String(count);
    });
  }

  function setupCartPreview() {
    const cartLink = document.querySelector('[data-header-nav] [data-testid="nav-cart-link"]');
    if (!cartLink || cartLink.dataset.cartReady) return;
    cartLink.dataset.cartReady = 'true';
    cartLink.href = '/cart';
    const wrapper = cartLink.parentElement;
    wrapper.classList.add('chery-cart-wrapper');
    wrapper.style.position = 'relative';
    const preview = document.createElement('div');
    preview.className = 'cheri-cart-preview';
    preview.setAttribute('aria-live', 'polite');
    wrapper.appendChild(preview);
    const render = () => {
      const items = readCart();
      preview.innerHTML = items.length
        ? `<div class="cheri-cart-preview__title">Carrito de compras</div>${items.map((item) => `<div class="cheri-cart-preview__item"><img src="${item.image}" alt="${item.title}"><div><strong>${item.title}</strong><div>${item.price} · Cantidad: ${item.quantity}</div></div></div>`).join('')}<a class="cheri-cart-preview__link" href="/cart">Ver carrito</a>`
        : '<div class="cheri-cart-preview__empty">Tu carrito está vacío.</div>';
      updateCartBadge();
    };
    let closeTimer;
    const show = () => {
      render();
      if (readCart().length) preview.classList.add('is-visible');
    };
    const hide = () => {
      closeTimer = window.setTimeout(() => preview.classList.remove('is-visible'), 120);
    };
    wrapper.addEventListener('mouseenter', () => {
      window.clearTimeout(closeTimer);
      show();
    });
    wrapper.addEventListener('mouseleave', hide);
    cartLink.addEventListener('click', (event) => {
      if (readCart().length) event.preventDefault();
    });
    document.addEventListener('chery-cart-updated', render);
    render();

    document.querySelectorAll('a[href="/cart"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        window.top.location.href = '/cart';
      });
    });
  }

  function renderCartPage() {
    const main = document.querySelector('main');
    if (!main) return;
    let page = document.querySelector('.cheri-cart-page');
    if (!page) {
      page = document.createElement('section');
      page.className = 'cheri-cart-page';
      document.body.appendChild(page);
    }
    const items = readCart();
    const total = items.reduce((sum, item) => sum + (Number.parseFloat(item.price.replace(/[^\d.]/g, '')) || 0) * item.quantity, 0);
    const tax = total * 0.18;
    page.innerHTML = `<div class="cheri-cart-page__header"><button type="button" data-cart-back>← Volver</button><strong>CHERY_DETALLES</strong></div><div class="cheri-cart-layout"><section><h1>Productos</h1>${items.length ? items.map((item) => `<article class="cheri-cart-page__item"><img src="${item.image}" alt="${item.title}"><div class="cheri-cart-page__item-info"><h2>${item.title}</h2><p>Variante: ${item.variant || item.title}</p><label><input type="checkbox" checked> Agregar dedicatoria</label><textarea placeholder="Agregar un mensaje personal..."></textarea><div class="cheri-cart-page__controls"><button type="button">Eliminar</button><select aria-label="Cantidad"><option>${item.quantity}</option></select></div></div><strong>${item.price}</strong></article>`).join('') : '<p>Tu carrito está vacío.</p>'}</section><aside><h2>Resumen</h2><button class="cheri-cart-page__promo" type="button">Agregar código de promoción</button><dl><div><dt>Subtotal (excl. delivery & IGV.)</dt><dd>S/ ${(total - tax).toFixed(2)}</dd></div><div><dt>Impuesto</dt><dd>S/ ${tax.toFixed(2)}</dd></div><div class="cheri-cart-page__total"><dt>Total</dt><dd>S/ ${total.toFixed(2)}</dd></div></dl><button class="cheri-cart-page__checkout" type="button">Continuar compra</button></aside></div>`;
    page.hidden = false;
    main.hidden = true;
    history.pushState({}, '', '/cart');
    page.querySelector('[data-cart-back]').addEventListener('click', () => {
      page.hidden = true;
      main.hidden = false;
      history.pushState({}, '', '/');
    });
  }

  function setupProductDetails() {
    const productLinks = [...document.querySelectorAll('a[href^="/p/"]')];
    if (!productLinks.length || document.body.dataset.productDetailsReady) return;
    document.body.dataset.productDetailsReady = 'true';
    const main = document.querySelector('main');
    const detail = document.createElement('section');
    detail.className = 'chery-product-detail';
    detail.hidden = true;
    document.body.appendChild(detail);

    const closeDetail = () => {
      detail.hidden = true;
      main.hidden = false;
      document.body.classList.remove('product-detail-open');
      if (location.pathname.startsWith('/p/')) history.pushState({}, '', '/');
    };

    const showDetail = (link) => {
      const slug = link.getAttribute('href').replace('/p/', '');
      const card = link.querySelector('[data-testid="product-wrapper"]');
      const title = card?.querySelector('[data-testid="product-title"]')?.textContent.trim() || slug.replaceAll('-', ' ');
      const price = card?.querySelector('[data-testid="price"]')?.textContent.trim() || 'Consultar';
      const image = card?.querySelector('img')?.src || '/product-1.png';
      const description = productDescriptions[slug] || `Un detalle floral preparado por CHERY_DETALLES para hacer especial cualquier momento. Elige tu presentación y agrégalo al carrito.`;
      detail.innerHTML = `<div class="chery-product-detail__topbar"><button type="button" data-detail-close aria-label="Volver">&#8592;</button><strong>CHERY_DETALLES</strong><a href="/cart">&#128722; <span>0</span></a></div><div class="chery-product-detail__content"><div class="chery-product-detail__image"><img src="${image}" alt="${title}"><span>Toca para zoom</span></div><div class="chery-product-detail__info"><p class="chery-product-detail__eyebrow">DETALLE ESPECIAL</p><h1>${title}</h1><p class="chery-product-detail__price">${price}</p><p class="chery-product-detail__description">${description}</p><label for="product-variant">Presentación</label><select id="product-variant"><option>Rosas</option><option>Tulipanes</option><option>Flores variadas</option></select><button class="chery-product-detail__cart" type="button">Agregar al carrito</button><p class="chery-product-detail__delivery">Entrega disponible en Piura, Piura.</p></div></div>`;
      detail.hidden = false;
      main.hidden = true;
      document.body.classList.add('product-detail-open');
      history.pushState({}, '', `/p/${slug}`);
      detail.querySelector('[data-detail-close]').addEventListener('click', closeDetail);
      detail.querySelector('.chery-product-detail__topbar a[href="/cart"]').addEventListener('click', (event) => {
        event.preventDefault();
        window.top.location.href = '/cart';
      });
      detail.querySelector('.chery-product-detail__cart').addEventListener('click', (event) => {
        const items = readCart();
        const existing = items.find((item) => item.slug === slug);
        if (existing) existing.quantity += 1;
        else items.push({ slug, title, price, image, quantity: 1 });
        writeCart(items);
        event.currentTarget.textContent = 'Agregado al carrito';
        event.currentTarget.classList.add('is-added');
      });
    };

    productLinks.forEach((link) => link.addEventListener('click', (event) => {
      event.preventDefault();
      showDetail(link);
    }));
    window.addEventListener('popstate', closeDetail);
    const route = new URLSearchParams(location.search).get('route');
    if (route?.startsWith('p/')) {
      const initialLink = productLinks.find((link) => link.getAttribute('href') === `/${route}`);
      if (initialLink) showDetail(initialLink);
    } else if (route === 'cart') {
      renderCartPage();
    }
  }

  function updateDeliveryLocation() {
    const shipping = document.querySelector('[data-shipping-info-bar]');
    if (!shipping) return;
    const address = shipping.querySelector('span.font-medium');
    if (address) address.textContent = 'Dirección de envío: Piura, Piura';
    shipping.closest('[data-shipping-bar]')?.style.setProperty('display', 'none', 'important');
  }

  function updateContactLinks() {
    document.querySelectorAll('a[href*="instagram.com"]').forEach((link) => {
      link.href = 'https://www.instagram.com/cheri_detalles?stkn=MWI1ODMzY3hnd2FkbQ%3D%3D';
    });
    document.querySelectorAll('a[href*="wa.me"], a[href^="tel:"]').forEach((link) => {
      link.href = link.href.startsWith('tel:') ? 'tel:+51951615287' : 'https://wa.me/51951615287';
    });
    document.querySelectorAll('a[href="/tiendas-en-trujillo"]').forEach((link) => link.closest('div, li')?.remove());
    document.querySelectorAll('a[href="/tiendas-en-piura"]').forEach((link) => {
      link.textContent = 'Tienda en Piura';
    });
  }

  function fixSearchLabels() {
    document.querySelectorAll('button, span').forEach((element) => {
      if (element.textContent.includes('QuÃ© estÃ¡s buscando') || element.textContent.includes('Â¿QuÃ© estÃ¡s buscando')) {
        element.textContent = '¿Qué estás buscando?';
      }
    });
  }

  function repairProductImages() {
    const fallbackImages = ['/product-1.png', '/product-2.png', '/product-3.png', '/product-4.png', '/product-5.png', '/product-6.png'];
    let productIndex = 0;
    document.querySelectorAll('img[src*="/_next/image"], img[srcset*="/_next/image"]').forEach((image) => {
      if (image.closest('[data-tulipanda-hero]')) return;
      try {
        image.removeAttribute('srcset');
        image.src = fallbackImages[productIndex % fallbackImages.length];
        productIndex += 1;
      } catch (error) {
        image.src = fallbackImages[productIndex % fallbackImages.length];
        productIndex += 1;
      }
    });
  }

  function setupCarousel() {
    const hero = document.querySelector('[data-tulipanda-hero]');
    if (!hero) return;
    const imageLayers = [...hero.querySelectorAll(':scope > div.absolute.inset-0')].filter((layer) => layer.querySelector('img'));
    const dots = [...hero.querySelectorAll('button[aria-label^="Ir a slide"]')];
    const counter = hero.querySelector('.absolute.top-5.right-6');
    let current = 0;

    imageLayers.slice(0, slides.length).forEach((layer, index) => {
      const image = layer.querySelector('img');
      image.src = slides[index][0];
      image.removeAttribute('srcset');
      image.alt = slides[index][1];
      layer.dataset.tulipandaSlide = '';
      layer.classList.toggle('is-active', index === 0);
    });

    const show = (index) => {
      current = (index + slides.length) % slides.length;
      imageLayers.slice(0, slides.length).forEach((layer, layerIndex) => layer.classList.toggle('is-active', layerIndex === current));
      dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === current));
      if (counter) counter.textContent = `${String(current + 1).padStart(2, '0')} / 06`;
    };

    hero.querySelector('[aria-label="Anterior"]')?.addEventListener('click', () => show(current - 1));
    hero.querySelector('[aria-label="Siguiente"]')?.addEventListener('click', () => show(current + 1));
    dots.forEach((dot, index) => {
      dot.dataset.tulipandaDot = '';
      dot.addEventListener('click', () => show(index));
    });
    show(0);
    window.setInterval(() => show(current + 1), 5000);
  }

  function setup() {
    setupSocialLinks();
    keepCollectionsOnly();
    replaceBrandText();
    setupDrawer();
    setupCarousel();
    repairProductImages();
    setupProductDetails();
    setupCartPreview();
    updateDeliveryLocation();
    updateContactLinks();
    fixSearchLabels();
    document.querySelectorAll('a[href="/account"]').forEach((link) => link.remove());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
