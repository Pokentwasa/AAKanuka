(function () {
  'use strict';

  const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let mouseX = 0, mouseY = 0;

  // ==========================================
  // GSAP — register plugin first, always
  // ==========================================
  gsap.registerPlugin(ScrollTrigger);

  // ==========================================
  // LENIS SMOOTH SCROLL
  // ==========================================
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true
  });

  // Single RAF loop — Lenis drives itself, tells ScrollTrigger to update
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) { lenis.scrollTo(value, { immediate: true }); }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    }
  });

  lenis.on('scroll', ScrollTrigger.update);

  // ==========================================
  // CUSTOM CURSOR WITH MAGNETIC SNAP
  // ==========================================
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  if (isFine && cursor && ring) {
    document.body.classList.add('has-cursor');
    let rx = 0, ry = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function tickRing() {
      rx += (mouseX - rx) * 0.12;
      ry += (mouseY - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(tickRing);
    }
    tickRing();

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-magnetic'));
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.25;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('is-magnetic');
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { el.style.transition = ''; }, 400);
      });
    });
  }

  // ==========================================
  // ALL ANIMATIONS — wait for full page load
  // so images are rendered and heights are correct
  // ==========================================
  window.addEventListener('load', () => {

    // Refresh ScrollTrigger after load so all heights are recalculated
    ScrollTrigger.refresh();

    // ---------- HERO ----------
    document.querySelectorAll('.hero-title .word').forEach((w, i) => {
      gsap.to(w, { y: '0%', duration: 1.4, delay: 0.3 + i * 0.12, ease: 'power4.out' });
    });

    gsap.from('.hero-label', { opacity: 0, x: -20, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.from('.hero-meta', { opacity: 0, y: 15, duration: 0.8, delay: 1.0, ease: 'power2.out' });

    // Hero image Ken Burns
    gsap.to('.hero-img-wrap img', {
      scale: 1.0, y: -60, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });

    // ---------- TEXT MASK REVEALS ----------
    document.querySelectorAll('section:not(.hero) .word, footer .word').forEach((w) => {
      gsap.to(w, {
        y: '0%', duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: w.closest('.line'), start: 'top 90%' }
      });
    });

    // ---------- FADE-UP ELEMENTS ----------
    document.querySelectorAll('.fade-up').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // ---------- SECTION LABELS ----------
    document.querySelectorAll('.section-label').forEach((label) => {
      gsap.from(label, {
        opacity: 0, y: 10, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: label, start: 'top 90%' }
      });
    });

    // ---------- PARALLAX IMAGES ----------
    document.querySelectorAll('.parallax-img img').forEach((img) => {
      gsap.to(img, {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: img.closest('.parallax-img'), start: 'top bottom', end: 'bottom top', scrub: 2 }
      });
    });

    // ---------- SERVICE CARDS ----------
    if (document.querySelector('.service-card')) {
      gsap.from('.service-card', {
        opacity: 0, y: 40, duration: 0.6, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.services-grid', start: 'top 85%' }
      });
    }

    // ---------- TEAM CARDS ----------
    if (document.querySelector('.team-card')) {
      gsap.from('.team-card', {
        opacity: 0, y: 50, duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.team-grid', start: 'top 85%' }
      });
    }

    // ---------- STAT ITEMS ----------
    if (document.querySelector('.stat-item')) {
      gsap.from('.stat-item', {
        opacity: 0, y: 30, duration: 0.6, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.stats-band', start: 'top 85%' }
      });
    }

    // ---------- COUNT-UP ----------
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count);
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => {
          const dur = 1400, st = performance.now();
          function tick(now) {
            const p = Math.min((now - st) / dur, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    });

    // ---------- FOOTER TITLE MAGNETIC ----------
    const footerTitle = document.querySelector('.footer-title');
    if (isFine && footerTitle) {
      footerTitle.addEventListener('mousemove', (e) => {
        const rect = footerTitle.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.04;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.04;
        footerTitle.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      footerTitle.addEventListener('mouseleave', () => {
        footerTitle.style.transform = 'translate(0,0)';
        footerTitle.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { footerTitle.style.transition = ''; }, 500);
      });
    }

    // ---------- MOBILE NAV ----------
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');
    if (navToggle && nav) {
      navToggle.addEventListener('click', () => nav.classList.toggle('is-open'));
    }

  }); // end window load

})();
