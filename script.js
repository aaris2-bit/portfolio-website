// ===== CUSTOM CURSOR =====
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .skill-hex-card, .service-tilt-card, .project-neon-card, .about-3d-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '60px'; ring.style.height = '60px';
    ring.style.borderColor = 'rgba(168,85,247,0.8)';
    dot.style.background = '#a855f7';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '36px'; ring.style.height = '36px';
    ring.style.borderColor = 'rgba(168,85,247,0.6)';
    dot.style.background = '#a855f7';
  });
});

// ===== PARTICLES CANVAS =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.3 + 0.05;
    const colors = ['124,58,237', '8,145,178', '234,88,12', '219,39,119'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.shadowBlur = 6; ctx.shadowColor = `rgba(${this.color},0.5)`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(168,85,247,${0.08 * (1 - dist/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50 ? 'rgba(5,5,16,0.95)' : 'rgba(5,5,16,0.7)';
  document.getElementById('backToTop').classList.toggle('show', window.scrollY > 500);
  highlightNav();
});

// ===== ACTIVE NAV =====
function highlightNav() {
  const sections = document.querySelectorAll('section');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--p1)' : '';
  });
}

// ===== TYPED TEXT =====
const roles = ['Web Developer 💻', 'UI Designer 🎨', 'Problem Solver 🔧', 'Creative Coder ✨'];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');
function type() {
  const word = roles[ri];
  typedEl.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
  if (!deleting && ci === word.length + 1) setTimeout(() => deleting = true, 1800);
  else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  setTimeout(type, deleting ? 50 : 100);
}
type();

// ===== INTERSECTION OBSERVER =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Skill ring animation
      const rings = entry.target.querySelectorAll ? entry.target.querySelectorAll('.ring-fill') : [];
      rings.forEach(ring => {
        const pct = entry.target.querySelector('.skill-ring')?.dataset.pct || 0;
        ring.style.strokeDasharray = `${pct}, 100`;
      });
      // Counter animation
      const nums = entry.target.querySelectorAll ? entry.target.querySelectorAll('.stat-num') : [];
      nums.forEach(num => {
        const target = parseInt(num.dataset.count);
        let count = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          count += step;
          if (count >= target) { count = target; clearInterval(timer); }
          num.textContent = Math.floor(count);
        }, 25);
      });
    }
  });
}, { threshold: 0.15 });

// Animate skill rings individually
document.querySelectorAll('.skill-hex-card').forEach(card => {
  const ringPath = card.querySelector('.ring-fill');
  const pct = card.querySelector('.skill-ring')?.dataset.pct || 0;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => { ringPath.style.strokeDasharray = `${pct}, 100`; }, 200);
      obs.disconnect();
    }
  }, { threshold: 0.4 });
  obs.observe(card);
});

// Scroll reveal for all cards/sections
document.querySelectorAll('.skill-hex-card, .service-tilt-card, .project-neon-card, .about-container, .contact-container, .stats-row').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = `opacity 0.7s ease ${i * 0.08}s, transform 0.7s ease ${i * 0.08}s`;
  observer.observe(el);
});

document.querySelectorAll('.stat-num').forEach(num => {
  const statObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const target = parseInt(num.dataset.count);
      let count = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        count += step;
        if (count >= target) { count = target; clearInterval(timer); }
        num.textContent = Math.floor(count);
      }, 25);
      statObs.disconnect();
    }
  }, { threshold: 0.5 });
  statObs.observe(num);
});

// Add visible class trigger
const visObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-hex-card, .service-tilt-card, .project-neon-card, .about-container, .contact-container, .stats-row').forEach(el => visObs.observe(el));

// ===== TILT EFFECT =====
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rotX = -(y - cy) / 15;
    const rotY = (x - cx) / 15;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    const glow = card.querySelector('.service-glow');
    if (glow) {
      glow.style.left = x + 'px'; glow.style.top = y + 'px';
      glow.style.opacity = '0.3';
      const idx = [...document.querySelectorAll('[data-tilt]')].indexOf(card);
      const colors = ['rgba(168,85,247,1)', 'rgba(6,182,212,1)', 'rgba(249,115,22,1)', 'rgba(236,72,153,1)'];
      glow.style.background = colors[idx % 4];
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    const glow = card.querySelector('.service-glow');
    if (glow) glow.style.opacity = '0';
  });
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.querySelector('.btn-send');
  btn.querySelector('span').textContent = '✅ Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
  setTimeout(() => {
    btn.querySelector('span').textContent = 'Send Message';
    btn.style.background = '';
    document.getElementById('contactForm').reset();
  }, 3000);
});
