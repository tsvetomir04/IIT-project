/**
 * Space Art Entertainment - Clean Main JS
 * Optimized production version
 */

// ==========================================
// LUCIDE ICONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initAnimations();
});


// ==========================================
// PARTICLE SYSTEM
// ==========================================
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };

    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    const count = Math.min(
      Math.floor((this.canvas.width * this.canvas.height) / 15000),
      100
    );

    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      color: ['#6C63FF', '#00E5FF', '#F72585', '#FFFFFF'][
        Math.floor(Math.random() * 4)
      ],
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.vx += (dx / dist) * force * 0.03;
          p.vy += (dy / dist) * force * 0.03;
        }
      }

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 2) {
        p.vx = (p.vx / speed) * 2;
        p.vy = (p.vy / speed) * 2;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fill();

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = '#6C63FF';
          this.ctx.globalAlpha = (1 - dist / 120) * 0.15;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

const canvas = document.getElementById('particleCanvas');
if (canvas) new ParticleSystem(canvas);


// ==========================================
// NAVBAR
// ==========================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});


// ==========================================
// MOBILE MENU
// ==========================================
function toggleMobileMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('hidden');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.add('hidden');
}


// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    window.scrollTo({
      top: target.offsetTop - 80,
      behavior: 'smooth',
    });
  });
});


// ==========================================
// MODALS (UNIFIED PATTERN)
// ==========================================
function openModal(id) {
  const modal = document.getElementById(id);
  modal?.classList.remove('hidden');
  modal?.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal?.classList.add('hidden');
  modal?.classList.remove('flex');
  document.body.style.overflow = '';
}


// Specific wrappers
const openLauncherModal = () => openModal('launcherModal');
const closeLauncherModal = () => closeModal('launcherModal');

const openVideoModal = () => openModal('videoModal');
const closeVideoModal = () => closeModal('videoModal');

const closeGalleryModal = () => closeModal('galleryModal');


// ==========================================
// DOWNLOAD SIMULATION
// ==========================================
function simulateDownload() {
  const options = document.getElementById('downloadOptions');
  const success = document.getElementById('downloadSuccess');

  if (!options || !success) return;

  options.style.opacity = '0.5';
  options.style.pointerEvents = 'none';

  setTimeout(() => {
    options.classList.add('hidden');
    success.classList.remove('hidden');

    lucide.createIcons();

    setTimeout(closeLauncherModal, 3000);
  }, 1000);
}


// ==========================================
// GALLERY
// ==========================================
const galleryImages = [
  'assets/images/media1.png',
  'assets/images/media2.png',
  'assets/images/media3.png',
  'assets/images/media4.png',
  'assets/images/media5.png',
  'assets/images/media6.png',
  'assets/images/media7.png',
  'assets/images/media8.png',
];

let currentIndex = 0;

function openGalleryModal(index) {
  currentIndex = index;
  updateGallery();
  openModal('galleryModal');
}

function updateGallery() {
  const img = document.getElementById('galleryImage');
  const counter = document.getElementById('galleryCounter');

  if (!img || !counter) return;

  img.src = galleryImages[currentIndex];
  counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
}

function nextGallery() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  updateGallery();
}

function prevGallery() {
  currentIndex =
    (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  updateGallery();
}


// ==========================================
// SIGN IN FORM
// ==========================================
function handleSignIn(e) {
  e.preventDefault();

  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const success = document.getElementById('signInSuccess');

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  const passwordValid = password.value.length >= 6;

  document.getElementById('emailError')?.classList.toggle('hidden', emailValid);
  document.getElementById('passwordError')?.classList.toggle('hidden', passwordValid);

  if (emailValid && passwordValid) {
    success?.classList.remove('hidden');
    lucide.createIcons();

    setTimeout(() => {
      e.target.reset();
      success?.classList.add('hidden');
    }, 3000);
  }
}


// ==========================================
// PASSWORD TOGGLE
// ==========================================
function togglePassword() {
  const input = document.getElementById('password');
  const icon = document.getElementById('eyeIcon');

  if (!input || !icon) return;

  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';

  icon.setAttribute('data-lucide', isHidden ? 'eye-off' : 'eye');
  lucide.createIcons();
}


// ==========================================
// ACTIVE NAV LINKS
// ==========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      'text-neon-cyan',
      link.getAttribute('href') === `#${current}`
    );
  });
});


// ==========================================
// INIT ANIMATIONS (LIGHTWEIGHT)
// ==========================================
function initAnimations() {
  document.querySelectorAll('.game-card, #news article').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.05}s`;

    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 }).observe(el);
  });

  initCounters();
}


// ==========================================
// COUNTERS
// ==========================================
function initCounters() {
  document.querySelectorAll('.stat-number').forEach((el) => {
    const target = +el.dataset.target;

    new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        let current = 0;
        const step = () => {
          current += target / 60;
          if (current < target) {
            el.textContent = Math.floor(current);
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        };

        step();
        obs.disconnect();
      });
    }, { threshold: 0.5 }).observe(el);
  });

  
function handleSignIn(event) {
  event.preventDefault();

  const success = document.getElementById("signInSuccess");
  success.classList.remove("hidden");

  setTimeout(() => {
    success.classList.add("hidden");
    document.getElementById("signinForm").reset();
    closeModal("signinModal");
    setTimeout(() => {
      const hero = document.getElementById("hero");

      if (hero) {
        hero.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "#hero";
      }
    }, 100);
  }, 800);
}

}

function handleSignIn(event) {
  event.preventDefault();

  const success = document.getElementById("signInSuccess");
  success.classList.remove("hidden");

  setTimeout(() => {
    success.classList.add("hidden");
    document.getElementById("signinForm").reset();
    closeModal("signinModal");
    setTimeout(() => {
      const hero = document.getElementById("hero");

      if (hero) {
        hero.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "#hero";
      }
    }, 100);
  }, 800);
}


