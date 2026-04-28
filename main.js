const bg = document.getElementById('bg');
const glow = document.getElementById('glow');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const langToggle = document.getElementById('langToggle');
const controlPanel = document.getElementById('controlPanel');
const controlToggle = document.getElementById('controlToggle');
const pageContent = document.getElementById('pageContent');
const html = document.documentElement;

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const translations = {
  en: {
    nav1: 'ARCHETYPERS',
    nav2: 'SERVICES',
    nav3: 'PROJECTS',
    nav4: 'CONTACT',
    heroScript: 'Finally',
    heroHeadline: 'built right.',
    heroTagline: 'Strategy, design, and growth — built as one system.',
    heroCta: "LET'S SEE WHAT'S POSSIBLE",
    heroNote: 'Free call. Honest answers. Zero pressure.',
    bottomLeft: 'Rooted in Egypt and built for ambitious businesses, The Archetypers shapes brand strategy, visual identity, and digital experiences that help companies stand out, earn trust, and grow with purpose.',
    bottomRightTitle: 'DESIGNED FOR GROWTH',
    bottomRight: 'Our work goes beyond aesthetics. We build websites, stores, and digital systems that support credibility, conversion, and long-term business growth.',
  },
  ar: {
    nav1: 'أركيتايبرز',
    nav2: 'خدماتنا',
    nav3: 'مشاريعنا',
    nav4: 'تواصل معنا',
    heroScript: 'أخيراً',
    heroHeadline: 'هوية مبنية بشكل صحيح.',
    heroTagline: 'الاستراتيجية والتصميم والنمو — منظومة واحدة متكاملة.',
    heroCta: 'لنرَ ما هو ممكن',
    heroNote: 'مكالمة مجانية. إجابات صريحة. بدون ضغط.',
    bottomLeft: 'متجذرون في مصر وبُنينا لخدمة الأعمال الطموحة. نحن في أركيتايبرز نُشكّل استراتيجية العلامة التجارية والهوية البصرية والتجارب الرقمية التي تساعد الشركات على التميز وكسب الثقة والنمو بهدف.',
    bottomRightTitle: 'مصمم للنمو',
    bottomRight: 'عملنا يتجاوز الجماليات. نبني مواقع ومتاجر وأنظمة رقمية تدعم المصداقية والتحويل والنمو التجاري على المدى الطويل.',
  }
};

let currentLang = 'en';

function applyLanguage(lang) {
  const t = translations[lang];
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  if (lang === 'ar') {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    document.body.classList.add('ar');
    langToggle.textContent = 'EN';
  } else {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    document.body.classList.remove('ar');
    langToggle.textContent = 'AR';
  }
}

function setLanguage(lang) {
  const goingAR = lang === 'ar';
  currentLang = lang;

  // 1. Exit — slide toward the new reading direction
  pageContent.classList.add(goingAR ? 'lang-exit-ltr' : 'lang-exit-rtl');

  setTimeout(() => {
    // 2. Swap content while hidden
    applyLanguage(lang);

    // 3. Enter
    pageContent.classList.remove('lang-exit-ltr', 'lang-exit-rtl');
    pageContent.classList.add('lang-enter');

    pageContent.addEventListener('animationend', () => {
      pageContent.classList.remove('lang-enter');
    }, { once: true });
  }, 280);
}

langToggle.addEventListener('click', () => {
  setLanguage(currentLang === 'en' ? 'ar' : 'en');
});

// ─── FLOATING PANEL — TOGGLE & DRAG ──────────────────────────────────────────
let panelOpen = false;

controlToggle.addEventListener('click', () => {
  if (didDrag) return;
  panelOpen = !panelOpen;
  controlPanel.classList.toggle('open', panelOpen);
});

let isDragging = false;
let didDrag = false;
let dragStartX, dragStartY, panelStartX, panelStartY;

controlToggle.addEventListener('mousedown', startDrag);
controlToggle.addEventListener('touchstart', startDrag, { passive: true });

function startDrag(e) {
  const touch = e.touches ? e.touches[0] : e;
  dragStartX = touch.clientX;
  dragStartY = touch.clientY;
  const rect = controlPanel.getBoundingClientRect();
  panelStartX = rect.left;
  panelStartY = rect.top;
  isDragging = true;
  didDrag = false;
  controlPanel.style.right = 'auto';
  controlPanel.style.bottom = 'auto';
  controlPanel.style.transform = 'none';
  controlPanel.style.left = panelStartX + 'px';
  controlPanel.style.top = panelStartY + 'px';
}

document.addEventListener('mousemove', onDrag);
document.addEventListener('touchmove', onDrag, { passive: true });

function onDrag(e) {
  if (!isDragging) return;
  const touch = e.touches ? e.touches[0] : e;
  const dx = touch.clientX - dragStartX;
  const dy = touch.clientY - dragStartY;
  if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag = true;
  if (!didDrag) return;
  controlPanel.style.left = (panelStartX + dx) + 'px';
  controlPanel.style.top = (panelStartY + dy) + 'px';
}

document.addEventListener('mouseup', () => { isDragging = false; });
document.addEventListener('touchend', () => { isDragging = false; });

// ─── MOBILE MENU ──────────────────────────────────────────────────────────────
function openMenu() { mobileMenu.classList.add('open'); }
function closeMenu() { mobileMenu.classList.remove('open'); }

hamburger.addEventListener('click', openMenu);
mobileMenuClose.addEventListener('click', closeMenu);

// ─── ANIMATIONS ───────────────────────────────────────────────────────────────
setTimeout(() => document.body.classList.add('loaded'), 80);

// ─── CURSOR GLOW ──────────────────────────────────────────────────────────────
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

window.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const nx = (e.clientX - cx) / cx;
  const ny = (e.clientY - cy) / cy;
  bg.style.transform = `translate(${nx * -18}px, ${ny * -12}px) scale(1.04)`;
  bg.style.transition = 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
});

function lerp(a, b, t) { return a + (b - a) * t; }

function animate() {
  currentX = lerp(currentX, targetX, 0.07);
  currentY = lerp(currentY, targetY, 0.07);
  glow.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`;
  glow.style.left = '0';
  glow.style.top = '0';
  requestAnimationFrame(animate);
}

animate();
