/* MAIGIA · mejora del formulario de contacto de /maigiaapps/ y /maigiaav/
 * (las páginas embebidas; la portada y /avatares usan ContactModal.tsx).
 *
 * - Solo muestra "enviado" si Netlify responde 2xx. Ante error o sin red
 *   conserva lo escrito y ofrece el correo alternativo.
 * - Diálogo accesible: role=dialog, labels asociadas, foco inicial, Tab
 *   confinado, Escape cierra y el foco vuelve a quien lo abrió.
 * - Funciona aunque la página recree el modal (AV lo genera por JS).
 */
(function () {
  'use strict';
  var EMAIL = 'info@girasomnis.com';
  var T = {
    es: {
      close: 'Cerrar formulario de contacto', sending: 'Enviando…',
      err: 'No hemos podido enviar tu mensaje.',
      errText: 'Lo que has escrito sigue aquí. Vuelve a intentarlo o escríbenos a',
      privacy: 'Usaremos tus datos para responder a tu consulta. Más información en la',
      privacyLink: 'política de privacidad',
    },
    en: {
      close: 'Close contact form', sending: 'Sending…',
      err: "We couldn't send your message.",
      errText: 'Your message is still here. Please try again or email us at',
      privacy: 'We will use your data to reply to your enquiry. More information in our',
      privacyLink: 'privacy policy',
    },
  };
  function lang() {
    try { return localStorage.getItem('maigia-lang') === 'en' ? 'en' : 'es'; } catch (e) { return 'es'; }
  }

  var opener = null;
  var uid = 0;

  function focusables(root) {
    return Array.prototype.filter.call(
      root.querySelectorAll('a[href],button:not([disabled]),input:not([type=hidden]):not([disabled]),select:not([disabled]),textarea:not([disabled])'),
      function (el) { return el.offsetParent !== null; }
    );
  }

  function enhance(overlay) {
    if (overlay.__mgEnhanced) return;
    overlay.__mgEnhanced = true;
    var n = ++uid;
    var modal = overlay.querySelector('.mg-modal');
    var form = overlay.querySelector('#mg-contact-form');
    var formView = overlay.querySelector('.mg-form-view');
    var sentView = overlay.querySelector('.mg-sent');
    if (!modal || !form) return;

    var title = formView.querySelector('h2');
    if (title) title.id = 'mg-title-' + n;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    if (title) modal.setAttribute('aria-labelledby', title.id);
    modal.setAttribute('tabindex', '-1');
    var closeBtn = modal.querySelector('.mg-close');
    if (closeBtn) closeBtn.setAttribute('aria-label', T[lang()].close);

    // labels ↔ campos
    Array.prototype.forEach.call(form.querySelectorAll('label'), function (lab) {
      var field = lab.parentElement.querySelector('input,select,textarea');
      if (!field) return;
      field.id = field.id || ('mg-' + field.name + '-' + n);
      lab.setAttribute('for', field.id);
    });
    var nameF = form.querySelector('[name=nombre]'), mailF = form.querySelector('[name=email]');
    if (nameF) nameF.setAttribute('autocomplete', 'name');
    if (mailF) { mailF.setAttribute('autocomplete', 'email'); mailF.setAttribute('inputmode', 'email'); }

    // zona de error + aviso de privacidad
    var live = document.createElement('div');
    live.setAttribute('aria-live', 'assertive');
    live.className = 'mg-live';
    var submit = form.querySelector('button[type=submit]');
    form.insertBefore(live, submit);
    var priv = document.createElement('p');
    priv.className = 'mg-privacy';
    form.appendChild(priv);
    function paintPrivacy() {
      var t = T[lang()];
      priv.innerHTML = '';
      priv.appendChild(document.createTextNode(t.privacy + ' '));
      var a = document.createElement('a');
      a.href = '/politica-privacidad'; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = t.privacyLink;
      priv.appendChild(a);
      priv.appendChild(document.createTextNode('.'));
    }
    paintPrivacy();

    var submitLabel = submit ? submit.textContent : '';
    var busy = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (busy) return;
      busy = true;
      live.innerHTML = '';
      if (submit) { submitLabel = submit.textContent; submit.disabled = true; submit.textContent = T[lang()].sending; }
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
        signal: ctrl ? ctrl.signal : undefined,
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        formView.style.display = 'none';
        sentView.style.display = '';
        sentView.setAttribute('role', 'status');
        var btn = sentView.querySelector('button'); if (btn) btn.focus();
      }).catch(function () {
        var t = T[lang()];
        var box = document.createElement('div');
        box.className = 'mg-error';
        var strong = document.createElement('strong'); strong.textContent = t.err;
        var a = document.createElement('a'); a.href = 'mailto:' + EMAIL; a.textContent = EMAIL;
        box.appendChild(strong);
        box.appendChild(document.createTextNode(' ' + t.errText + ' '));
        box.appendChild(a);
        box.appendChild(document.createTextNode('.'));
        live.appendChild(box);
      }).then(function () {
        clearTimeout(timer);
        busy = false;
        if (submit) { submit.disabled = false; submit.textContent = submitLabel; }
      });
    }, true);

    // apertura / cierre: foco, scroll del fondo, estado limpio
    var wasOpen = false, prevOverflow = '';
    new MutationObserver(function () {
      var open = overlay.classList.contains('mg-open');
      if (open === wasOpen) return;
      wasOpen = open;
      if (open) {
        // F15: preseleccionar el servicio de la página si el usuario no ha elegido otro
        var sel = form.querySelector('select[name=tipo]');
        // (se compara por palabra clave porque el texto de la opción se traduce en EN)
        var def = /^\/maigiaapps/.test(location.pathname) ? /interactiv/i
                : /^\/maigiaav/.test(location.pathname) ? /audiovisual/i : null;
        if (sel && def && !sel.value) {
          for (var k = 0; k < sel.options.length; k++) if (def.test(sel.options[k].text)) { sel.selectedIndex = k; break; }
        }
        opener = document.activeElement;
        prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        live.innerHTML = '';
        if (closeBtn) closeBtn.setAttribute('aria-label', T[lang()].close);
        paintPrivacy();
        setTimeout(function () { (nameF || modal).focus(); }, 0);
      } else {
        document.body.style.overflow = prevOverflow;
        if (opener && opener.focus) opener.focus();
      }
    }).observe(overlay, { attributes: true, attributeFilter: ['class'] });
  }

  document.addEventListener('keydown', function (e) {
    var overlay = document.getElementById('mg-contact-overlay');
    if (!overlay || !overlay.classList.contains('mg-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); overlay.classList.remove('mg-open'); return; }
    if (e.key !== 'Tab') return;
    var modal = overlay.querySelector('.mg-modal');
    var items = focusables(modal);
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1], act = document.activeElement;
    if (e.shiftKey && (act === first || !modal.contains(act))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (act === last || !modal.contains(act))) { e.preventDefault(); first.focus(); }
  });

  // El modal puede crearse tarde o recrearse: lo buscamos de forma continua.
  function scan() {
    var o = document.getElementById('mg-contact-overlay');
    if (o) enhance(o);
  }
  scan();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
