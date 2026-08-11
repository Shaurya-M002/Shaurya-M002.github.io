// scroll progress bar
const progress = document.getElementById('progress');
function onScroll() {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progress.style.width = (scrolled * 100) + '%';
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// count-up stats
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const dur = 1100;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      countUp(e.target);
      statObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat .num[data-count]').forEach((el) => statObserver.observe(el));

// active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => navObserver.observe(s));
