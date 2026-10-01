// Keeps autoplay loop videos actually playing.
// Browsers pause offscreen/competing autoplay videos and don't always resume
// them; this plays each video while in view, pauses it out of view (saves
// decode for the others), and retries play() on re-entry and tab wake.
(function () {
  var vids = Array.prototype.slice.call(document.querySelectorAll('video[autoplay]'));
  if (!vids.length) return;

  function tryPlay(v) {
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* blocked; retried on next entry */ });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) tryPlay(e.target);
        else e.target.pause();
      });
    }, { threshold: 0.1 });
    vids.forEach(function (v) { io.observe(v); });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) return;
    vids.forEach(function (v) {
      var r = v.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) tryPlay(v);
    });
  });
})();
