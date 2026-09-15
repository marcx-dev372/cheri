(() => {
  const update = () => {
    document.querySelectorAll('button').forEach((button) => {
      if (button.textContent.trim() === '12.3k') button.remove();
    });
    document.querySelectorAll('a[href*="instagram.com"]').forEach((link) => {
      link.href = 'https://www.instagram.com/cheri_detalles?stkn=MWI1ODMzY3hnd2FkbQ%3D%3D';
    });
    document.querySelectorAll('a[href*="wa.me"], a[href^="tel:"]').forEach((link) => {
      link.href = link.href.startsWith('tel:') ? 'tel:+51951615287' : 'https://wa.me/51951615287';
    });
    document.querySelectorAll('a[href="/tiendas-en-trujillo"]').forEach((link) => link.closest('div, li')?.remove());
    document.querySelectorAll('a[href="/tiendas-en-piura"]').forEach((link) => { link.textContent = 'Tienda en Piura'; });
    document.querySelectorAll('nav li').forEach((item) => {
      if (!item.querySelector('a[href^="/coleccion/"]')) item.remove();
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      walker.currentNode.nodeValue = walker.currentNode.nodeValue
        .replace(/Tulipanda|tulipanda|pandas/gi, 'CHERY_DETALLES')
        .replace(/Â¿QuÃ© estÃ¡s buscando\?/g, '¿Qué estás buscando?');
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', update);
  else update();
})();
