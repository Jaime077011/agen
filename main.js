const bg = document.getElementById('bg');
const glow = document.getElementById('glow');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');

function openMenu() { mobileMenu.classList.add('open'); }
function closeMenu() { mobileMenu.classList.remove('open'); }

hamburger.addEventListener('click', openMenu);
mobileMenuClose.addEventListener('click', closeMenu);

// Trigger entrance animations
setTimeout(() => document.body.classList.add('loaded'), 80);

// Target position (cursor)
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;

// Current position (lerped)
let currentX = targetX;
let currentY = targetY;

window.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;

  // Background parallax
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const nx = (e.clientX - cx) / cx;
  const ny = (e.clientY - cy) / cy;
  bg.style.transform = `translate(${nx * -18}px, ${ny * -12}px) scale(1.04)`;
  bg.style.transition = 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
});

// Smooth glow follow via lerp
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
