// Every scene defines DURATION and draw(t). The renderer calls render(t) once per frame,
// so all motion must be a pure function of t (no timers, no CSS transitions).
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = {
  lin: (t) => t,
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  expo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};
const prog = (t, a, b, e = ease.out) => e(clamp((t - a) / (b - a)));
const $ = (s) => document.querySelector(s);

function show(el, k, dy = 28) {
  el.style.opacity = k;
  el.style.transform = `translateY(${(1 - k) * dy}px)`;
}

function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

window.render = function (t) {
  const d = window.DURATION;
  const f = Math.min(prog(t, 0, 0.45, ease.inOut), 1 - prog(t, d - 0.5, d, ease.inOut));
  $('#stage').style.opacity = f;
  window.draw(t);
};

window.fontsReady = Promise.all(
  ['400 20px "Instrument Serif"', 'italic 400 20px "Instrument Serif"', '400 20px Inter',
   '500 20px Inter', '600 20px Inter', '400 20px "JetBrains Mono"', '500 20px "JetBrains Mono"']
    .map((f) => document.fonts.load(f))
).then(() => document.fonts.ready);
