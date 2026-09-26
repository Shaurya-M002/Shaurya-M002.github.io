const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const nav = document.querySelector('header.nav');
const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const id = '#' + e.target.id;
    navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach((s) => sectionObserver.observe(s));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
  });
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Clips only download and play while on screen; with reduced motion they wait for a tap.
const clipObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.src) v.src = v.dataset.src;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  });
}, { threshold: 0.35 });
document.querySelectorAll('video[data-loop-from]').forEach((v) => {
  const from = parseFloat(v.dataset.loopFrom), to = parseFloat(v.dataset.loopTo);
  v.addEventListener('loadedmetadata', () => { if (v.currentTime < from) v.currentTime = from; });
  v.addEventListener('timeupdate', () => { if (v.currentTime >= to || v.currentTime < from - 0.5) v.currentTime = from; });
  v.addEventListener('ended', () => { v.currentTime = from; v.play().catch(() => {}); });
  if (!reduceMotion) clipObserver.observe(v);
});
document.querySelectorAll('.media video').forEach((v) => {
  if (reduceMotion) {
    v.addEventListener('click', () => { if (!v.src) v.src = v.dataset.src; v.paused ? v.play() : v.pause(); });
  } else {
    clipObserver.observe(v);
  }
});

const dialog = document.getElementById('reel');
if (dialog) {
  const video = dialog.querySelector('video');
  document.querySelectorAll('[data-reel]').forEach((b) => b.addEventListener('click', () => {
    dialog.showModal();
    video.currentTime = 0;
    video.play().catch(() => {});
  }));
  const close = () => { video.pause(); dialog.close(); };
  dialog.querySelector('.close').addEventListener('click', close);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener('close', () => video.pause());
}
