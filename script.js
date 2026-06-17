/**
 * ELITEFIT PERSONAL TRAINER — script.js
 * Funcionalidades: Header dinâmico, Menu mobile, Scroll suave,
 * Contadores, Carrossel, Modal, Animações, WhatsApp, Formulário, Back to top
 */

// ── NÚMERO DO WHATSAPP (editar aqui) ──────────────────────────
const WHATSAPP_NUMBER = '5511999999999'; // Formato: 55 + DDD + número

// ── UTILITÁRIOS ───────────────────────────────────────────────
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ── DOM READY ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initCarousel();
  initBackToTop();
  initFormValidation();
  initActiveNav();
});

// ─────────────────────────────────────────────────────────────
// 1. HEADER DINÂMICO
// ─────────────────────────────────────────────────────────────
function initHeader() {
  const header = $('#header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    // Adiciona classe .scrolled ao rolar
    if (current > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = current;
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// 2. MENU MOBILE HAMBURGER
// ─────────────────────────────────────────────────────────────
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const nav       = $('#nav');

  // Abre/fecha
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Fecha ao clicar num link
  $$('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 3. ANIMAÇÕES AO APARECER NA TELA (Intersection Observer)
// ─────────────────────────────────────────────────────────────
function initScrollAnimations() {
  // Respeita prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('[data-animate]').forEach(el => el.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Delay escalonado para cards em grupo
        const siblings = entry.target.parentElement?.querySelectorAll('[data-animate]');
        let delay = 0;
        if (siblings && siblings.length > 1) {
          siblings.forEach((sib, idx) => {
            if (sib === entry.target) delay = idx * 80;
          });
        }

        setTimeout(() => {
          entry.target.classList.add('animated');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  $$('[data-animate]').forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────────────────────
// 4. CONTADORES ANIMADOS
// ─────────────────────────────────────────────────────────────
function initCounters() {
  const counters = $$('.stat__num[data-target]');
  let triggered = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  // Dispara quando a seção de stats fica visível
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        counters.forEach(counter => animateCounter(counter));
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsEl = $('.hero__stats');
  if (statsEl) statsObserver.observe(statsEl);
}

// ─────────────────────────────────────────────────────────────
// 5. CARROSSEL DE DEPOIMENTOS
// ─────────────────────────────────────────────────────────────
function initCarousel() {
  const track  = $('#carouselTrack');
  const dotsEl = $('#carouselDots');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoInterval;

  // Calcula quantos cards ficam visíveis por vez
  function getVisible() {
    if (window.innerWidth < 640)  return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  const total = cards.length;

  // Cria dots
  function createDots() {
    dotsEl.innerHTML = '';
    const pages = Math.ceil(total / getVisible());
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel__dot');
      dot.setAttribute('aria-label', `Ir para página ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function goTo(index) {
    const visible = getVisible();
    const maxPage = Math.ceil(total / visible) - 1;
    current = Math.max(0, Math.min(index, maxPage));

    // Calcula o offset em %
    const cardWidth = 100 / visible;
    const gap = 24;
    // Move pelo índice de card, não de página
    const cardIndex = current * visible;
    track.style.transform = `translateX(calc(-${cardIndex * (cardWidth)}% - ${cardIndex * gap / visible}px))`;

    // Atualiza dots
    $$('.carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(autoInterval);
    autoInterval = setInterval(() => {
      const pages = Math.ceil(total / getVisible());
      goTo((current + 1) % pages);
    }, 4500);
  }

  prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); startAuto(); });

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    startAuto();
  }, { passive: true });

  // Init
  createDots();
  goTo(0);
  startAuto();

  // Recria ao redimensionar
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      createDots();
      goTo(0);
    }, 250);
  });
}

// ─────────────────────────────────────────────────────────────
// 6. MODAL DA GALERIA
// ─────────────────────────────────────────────────────────────
function openModal(src, caption) {
  const modal   = $('#modal');
  const img     = $('#modalImg');
  const capEl   = $('#modalCaption');

  img.src         = src;
  img.alt         = caption;
  capEl.textContent = caption;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = $('#modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Limpa a src para evitar flash na próxima abertura
  setTimeout(() => { $('#modalImg').src = ''; }, 300);
}

// Fecha com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Expõe globalmente (chamado no HTML via onclick)
window.openModal = openModal;
window.closeModal = closeModal;

// ─────────────────────────────────────────────────────────────
// 7. BOTÃO BACK TO TOP
// ─────────────────────────────────────────────────────────────
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─────────────────────────────────────────────────────────────
// 8. VALIDAÇÃO DO FORMULÁRIO + WHATSAPP
// ─────────────────────────────────────────────────────────────
function initFormValidation() {
  const form = $('#scheduleForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = [
      { id: 'nome',      msg: 'Por favor, informe seu nome.' },
      { id: 'telefone',  msg: 'Por favor, informe seu telefone.' },
      { id: 'email',     msg: 'Por favor, informe um e-mail válido.', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'objetivo',  msg: 'Por favor, selecione seu objetivo.' },
      { id: 'data',      msg: 'Por favor, selecione uma data.' },
    ];

    let valid = true;

    // Limpa erros anteriores
    fields.forEach(f => {
      const errEl = $(`#${f.id}Error`);
      if (errEl) errEl.classList.remove('visible');
      const input = $(`#${f.id}`);
      if (input) input.style.borderColor = '';
    });

    // Valida cada campo
    fields.forEach(f => {
      const input = $(`#${f.id}`);
      const errEl = $(`#${f.id}Error`);
      if (!input) return;

      const val = input.value.trim();
      let fieldValid = val.length > 0;

      if (fieldValid && f.validate) {
        fieldValid = f.validate(val);
      }

      if (!fieldValid) {
        valid = false;
        if (errEl) {
          errEl.textContent = f.msg;
          errEl.classList.add('visible');
        }
        input.style.borderColor = '#ff4d6d';
      }
    });

    if (!valid) return;

    // Monta mensagem do WhatsApp
    const nome      = $('#nome').value.trim();
    const telefone  = $('#telefone').value.trim();
    const email     = $('#email').value.trim();
    const objetivo  = $('#objetivo').value;
    const data      = $('#data').value;

    // Formata a data para pt-BR
    const dataFormatada = data
      ? new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
      : 'A combinar';

    const mensagem = [
      `Olá! Gostaria de agendar uma avaliação física gratuita. 💪`,
      ``,
      `*Nome:* ${nome}`,
      `*Telefone:* ${telefone}`,
      `*E-mail:* ${email}`,
      `*Objetivo:* ${objetivo}`,
      `*Data desejada:* ${dataFormatada}`,
      ``,
      `Aguardo o retorno. Obrigado(a)!`
    ].join('\n');

    const encoded = encodeURIComponent(mensagem);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(url, '_blank');
  });

  // Remove erro ao digitar
  ['nome', 'telefone', 'email', 'objetivo', 'data'].forEach(id => {
    const input = $(`#${id}`);
    if (!input) return;
    input.addEventListener('input', () => {
      const errEl = $(`#${id}Error`);
      if (errEl) errEl.classList.remove('visible');
      input.style.borderColor = '';
    });
  });
}

// ─────────────────────────────────────────────────────────────
// 9. NAVEGAÇÃO ATIVA AO ROLAR (highlight no menu)
// ─────────────────────────────────────────────────────────────
function initActiveNav() {
  const sections = $$('section[id]');
  const links    = $$('.nav__link');

  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.4
  });

  sections.forEach(section => observer.observe(section));
}
