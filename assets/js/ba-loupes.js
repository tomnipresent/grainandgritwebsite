// Fixed magnifier loupes pinned over the AFTER image in a before/after slider.
// Each .ba-loupe (data-x, data-y as frame fractions; data-z zoom) shows a
// magnified crop of the after image centred on its pin point. Loupes sit
// beneath the before layer, so the divider wipes them in and out naturally.
(function () {
  function initLoupes(ba) {
    var loupes = Array.prototype.slice.call(ba.querySelectorAll('.ba-loupe'));
    if (!loupes.length) return;
    var img = ba.querySelector('img'); // first img = the after frame
    if (!img) return;

    function layout() {
      var w = ba.clientWidth, h = ba.clientHeight;
      var nw = img.naturalWidth, nh = img.naturalHeight;
      if (!w || !h || !nw || !nh) return;
      // object-fit: cover geometry
      var s = Math.max(w / nw, h / nh);
      var drawnW = nw * s, drawnH = nh * s;
      var offX = (w - drawnW) / 2, offY = (h - drawnH) / 2;

      loupes.forEach(function (lp) {
        var fx = parseFloat(lp.getAttribute('data-x')) || 0.5;
        var fy = parseFloat(lp.getAttribute('data-y')) || 0.5;
        var z = parseFloat(lp.getAttribute('data-z')) || 3;
        var r = lp.offsetWidth / 2;
        var px = fx * w, py = fy * h;         // pin point in frame coords
        var ix = px - offX, iy = py - offY;   // point in drawn-image coords
        lp.style.left = (px - r) + 'px';
        lp.style.top = (py - r) + 'px';
        lp.style.backgroundImage = 'url("' + img.currentSrc + '")';
        lp.style.backgroundSize = (drawnW * z) + 'px ' + (drawnH * z) + 'px';
        lp.style.backgroundPosition = (-(ix * z - r)) + 'px ' + (-(iy * z - r)) + 'px';
      });
    }

    if (img.complete) layout();
    else img.addEventListener('load', layout);
    window.addEventListener('resize', layout);
    // ResizeObserver catches container size changes (e.g. lightbox open)
    if ('ResizeObserver' in window) new ResizeObserver(layout).observe(ba);
  }

  window.initBALoupes = initLoupes;
  Array.prototype.forEach.call(document.querySelectorAll('.ba'), initLoupes);
})();
