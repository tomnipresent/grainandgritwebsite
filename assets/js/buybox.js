// Sticky mini buy box — shows once the hero (with its own buy button)
// scrolls out of view, hides again while the pricing section is on screen.
(function () {
  var box = document.getElementById('buyBox');
  var hero = document.querySelector('.hero');
  if (!box || !hero || !('IntersectionObserver' in window)) return;

  var heroVisible = true;
  var pricingVisible = false;

  function update() {
    box.classList.toggle('show', !heroVisible && !pricingVisible);
  }

  new IntersectionObserver(function (entries) {
    heroVisible = entries[0].isIntersecting;
    update();
  }).observe(hero);

  var pricing = document.getElementById('waitlist'); // pricing section id
  if (pricing) {
    new IntersectionObserver(function (entries) {
      pricingVisible = entries[0].isIntersecting;
      update();
    }).observe(pricing);
  }
})();
