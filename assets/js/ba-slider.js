// Before/after slider — hero. Drag the divider to reveal clean vs grained.
// A click (no drag) opens the slider full-size in a lightbox, still draggable.
(function () {
  var CLICK_TOLERANCE = 6; // px of pointer travel before a press counts as a drag

  // Wire up slider behaviour on a .ba element.
  // onClick (optional) fires when the press was a click, not a drag.
  function initBA(ba, onClick) {
    var beforeWrap = ba.querySelector('.ba-before-wrap');
    var divider = ba.querySelector('.ba-divider');
    var dragging = false;
    var moved = false;
    var downX = 0, downY = 0;
    var pos = 50;

    function setPos(pct) {
      pos = Math.max(2, Math.min(98, pct));
      beforeWrap.style.clipPath = 'inset(0 ' + (100 - pos) + '% 0 0)';
      divider.style.left = pos + '%';
      ba.setAttribute('aria-valuenow', Math.round(pos));
    }

    function pctFromEvent(e) {
      var r = ba.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    }

    ba.addEventListener('pointerdown', function (e) {
      dragging = true;
      moved = false;
      downX = e.clientX; downY = e.clientY;
      ba.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    ba.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      if (!moved && Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > CLICK_TOLERANCE) {
        moved = true;
        ba.classList.add('dragging');
        setPos(pctFromEvent(e));
      } else if (moved) {
        setPos(pctFromEvent(e));
      }
    });

    function stop(e) {
      if (!dragging) return;
      dragging = false;
      ba.classList.remove('dragging');
      if (!moved && e.type === 'pointerup' && onClick) onClick();
    }
    ba.addEventListener('pointerup', stop);
    ba.addEventListener('pointercancel', stop);

    // Don't let clicks bubble (hero gallery has its own lightbox handler)
    ba.addEventListener('click', function (e) { e.stopPropagation(); });

    // Keyboard access
    ba.setAttribute('tabindex', '0');
    ba.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { setPos(pos - 4); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPos(pos + 4); e.preventDefault(); }
    });

    setPos(50);
  }

  var sliders = Array.prototype.slice.call(document.querySelectorAll('.ba'));
  if (!sliders.length) return;

  // — Lightbox: full-size clone of the clicked slider —
  var lightbox = null;

  function openLightbox(source) {
    var clone = source.cloneNode(true);
    clone.id = '';
    clone.classList.remove('dragging');

    lightbox = document.createElement('div');
    lightbox.className = 'lightbox ba-lightbox';
    lightbox.innerHTML = '<button class="lightbox-close">ESC</button><div class="ba-lightbox-stage"></div>';
    lightbox.querySelector('.ba-lightbox-stage').appendChild(clone);
    document.body.appendChild(lightbox);
    requestAnimationFrame(function () { lightbox.classList.add('active'); });

    initBA(clone); // no onClick — clicking the big slider does nothing but slide
    if (window.initBALoupes) window.initBALoupes(clone);
    clone.focus();

    lightbox.addEventListener('click', function (e) {
      // Backdrop or ESC button closes; the slider itself swallows its clicks
      closeLightbox();
    });
    document.addEventListener('keydown', onEscape);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    var lb = lightbox;
    lightbox = null;
    setTimeout(function () {
      if (lb.parentNode) lb.parentNode.removeChild(lb);
    }, 200);
    document.removeEventListener('keydown', onEscape);
  }

  function onEscape(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  sliders.forEach(function (ba) {
    initBA(ba, function () { openLightbox(ba); });
  });
})();
