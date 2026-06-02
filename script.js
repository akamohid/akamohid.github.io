// ========================
// PAGE-LOAD NEON BAR
// ========================
(function () {
  const bar = document.createElement('div');
  bar.style.cssText =
    'position:fixed;top:0;left:0;width:0;height:2px;z-index:99999;pointer-events:none;' +
    'background:linear-gradient(90deg,#00FFB3,#A259FF,#00D4FF);' +
    'box-shadow:0 0 10px #00FFB3,0 0 20px rgba(0,255,179,0.5);' +
    'transition:width 0.65s cubic-bezier(0.4,0,0.2,1);';
  document.body.appendChild(bar);
  requestAnimationFrame(() => {
    bar.style.width = '100%';
    setTimeout(() => {
      bar.style.transition = 'opacity 0.4s';
      bar.style.opacity = '0';
      setTimeout(() => bar.remove(), 400);
    }, 750);
  });
})();

// ========================
// CUSTOM CURSOR
// ========================
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  cursorRing.style.left = Math.round(rx) + 'px';
  cursorRing.style.top  = Math.round(ry) + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a,button,.project-card,.pillar-card,.contact-card,.about-card,.chip').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
});

// ========================
// HERO CANVAS PARTICLES
// ========================
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let pts = [];

  function resizeCanvas() {
    heroCanvas.width  = heroCanvas.offsetWidth;
    heroCanvas.height = heroCanvas.offsetHeight;
  }

  const COLORS = ['0,255,179', '162,89,255', '0,212,255'];

  class Pt {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * heroCanvas.width;
      this.y  = Math.random() * heroCanvas.height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 1.6 + 0.4;
      this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.a  = Math.random() * 0.5 + 0.15;
    }
    tick() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > heroCanvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > heroCanvas.height)  this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c},${this.a})`;
      ctx.fill();
    }
  }

  function init() {
    pts = [];
    for (let i = 0; i < 72; i++) pts.push(new Pt());
  }

  function lines() {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 125) {
          const a = (1 - d / 125) * 0.13;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,255,179,${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function anim() {
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    pts.forEach(p => { p.tick(); p.draw(); });
    lines();
    requestAnimationFrame(anim);
  }

  resizeCanvas(); init(); anim();
  window.addEventListener('resize', () => { resizeCanvas(); init(); });
}

// ========================
// NAVBAR SCROLL EFFECT
// ========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ========================
// HAMBURGER MENU
// ========================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

// ========================
// ROTATING TEXT IN HERO
// ========================
const words = [
  'Deep Learning', 'Computer Vision', 'LLM Pipelines',
  'Data Engineering', 'Affective Computing', 'Web Development'
];
let wordIndex = 0;
const rotatingText = document.getElementById('rotatingText');

function rotateWord() {
  rotatingText.style.opacity   = '0';
  rotatingText.style.transform = 'translateY(-10px)';
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    rotatingText.textContent     = words[wordIndex];
    rotatingText.style.opacity   = '1';
    rotatingText.style.transform = 'translateY(0)';
  }, 300);
}

if (rotatingText) {
  rotatingText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  setInterval(rotateWord, 2600);
}

// ========================
// SCROLL REVEAL
// ========================
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.children];
      const i = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${i * 0.08}s`;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ========================
// PROJECT FILTER
// ========================
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-cat') === filter) {
        card.classList.remove('hidden');
        card.style.transitionDelay = '0s';
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ========================
// SMOOTH ACTIVE NAV LINK
// ========================
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color      = '';
    link.style.textShadow = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color      = 'var(--accent)';
      link.style.textShadow = '0 0 8px rgba(0,255,179,0.6)';
    }
  });
});