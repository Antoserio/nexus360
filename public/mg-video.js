/* MAIGIA · plan B para los vídeos de /maigiaav/ (F21 de la auditoría).
 * Si un vídeo del reproductor no se puede cargar (enlace caducado, red,
 * proveedor caído…), en lugar de dejar el reproductor en negro se muestra un
 * aviso con alternativa. No toca el vídeo cuando funciona.
 */
(function () {
  'use strict';
  function lang() {
    try { return localStorage.getItem('maigia-lang') === 'en' ? 'en' : 'es'; } catch (e) { return 'es'; }
  }
  var T = {
    es: { title: 'No hemos podido cargar este vídeo.', text: 'Puede ser un problema de conexión. Vuelve a intentarlo en un momento o', link: 'pídenos el enlace directo' },
    en: { title: "We couldn't load this video.", text: 'It may be a connection problem. Please try again shortly or', link: 'ask us for a direct link' },
  };
  function showFallback(video) {
    if (!video || video.__mgFallback) return;
    video.__mgFallback = true;
    var t = T[lang()];
    var box = document.createElement('div');
    box.className = 'mg-video-fallback';
    box.setAttribute('role', 'alert');
    box.style.cssText = 'margin:12px 0 0;padding:14px 16px;border:1px solid #FF6B6B;border-radius:12px;'
      + 'background:rgba(255,107,107,.08);color:#F4F7FB;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif';
    var strong = document.createElement('strong');
    strong.style.color = '#FF6B6B';
    strong.textContent = t.title;
    var a = document.createElement('a');
    a.href = 'mailto:info@girasomnis.com';
    a.className = 'contact-link';          // abre el formulario de contacto de la página
    a.style.cssText = 'color:#22D3FF;text-decoration:underline';
    a.textContent = t.link;
    box.appendChild(strong);
    box.appendChild(document.createTextNode(' ' + t.text + ' '));
    box.appendChild(a);
    box.appendChild(document.createTextNode('.'));
    video.insertAdjacentElement('afterend', box);
  }
  // El error de <source> no burbujea: se captura en fase de captura.
  document.addEventListener('error', function (e) {
    var el = e.target;
    if (!el || !el.tagName) return;
    if (el.tagName === 'SOURCE' && el.parentElement && el.parentElement.classList.contains('project-video')) showFallback(el.parentElement);
    else if (el.tagName === 'VIDEO' && el.classList.contains('project-video')) showFallback(el);
  }, true);
})();
