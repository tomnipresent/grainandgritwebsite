// Hero gallery — thumbnail switching (dynamic count) + lightbox
(function () {
  var gallery = document.getElementById('heroGallery');
  if (!gallery) return;
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.hero-gallery-thumb'));
  if (!slides.length) return;

  // — Thumbnail switching —
  var current = 0;
  function show(i) {
    current = i;
    slides.forEach(function (s, j) { s.classList.toggle('active', j === i); });
    thumbs.forEach(function (t, j) { t.classList.toggle('active', j === i); });
  }

  thumbs.forEach(function (thumb, i) {
    thumb.addEventListener('click', function () { show(i); });
  });

  // — Edge prev/next navigation —
  function step(d) {
    show((current + d + slides.length) % slides.length);
  }
  ['.hg-prev', '.hg-next'].forEach(function (sel, idx) {
    var btn = gallery.querySelector(sel);
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); // don't trigger the lightbox
      step(idx === 0 ? -1 : 1);
    });
  });

  // — Lightbox —
  var lightbox = null;

  function openLightbox() {
    var activeSlide = gallery.querySelector('.hero-slide.active');
    if (!activeSlide) return;
    // Before/after slide has its own draggable lightbox (ba-slider.js)
    if (activeSlide.querySelector('.ba')) return;
    var img = activeSlide.querySelector('img');

    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    if (img && img.style.display !== 'none') {
      lightbox.innerHTML =
        '<button class="lightbox-close">ESC</button>' +
        '<img src="' + img.src + '" alt="' + (img.alt || '') + '" class="lightbox-img">';
    } else {
      lightbox.innerHTML =
        '<button class="lightbox-close">ESC</button>' +
        '<div class="lightbox-content">' + activeSlide.innerHTML + '</div>';
    }

    document.body.appendChild(lightbox);
    requestAnimationFrame(function () { lightbox.classList.add('active'); });

    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', onEscape);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    setTimeout(function () {
      if (lightbox && lightbox.parentNode) lightbox.parentNode.removeChild(lightbox);
      lightbox = null;
    }, 200);
    document.removeEventListener('keydown', onEscape);
  }

  function onEscape(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  gallery.addEventListener('click', openLightbox);
})();
