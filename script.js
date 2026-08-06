(function(){
  'use strict';
  window.addEventListener('load',()=>{
    gsap.registerPlugin(ScrollTrigger);

    // Fade ups
    document.querySelectorAll('.svc-card,.team-card,.why-item,.value-card,.sf-card,.ci-item').forEach(el=>{
      gsap.from(el,{opacity:0,y:30,duration:.6,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%'}});
    });

    // Section titles
    document.querySelectorAll('.section-title,.page-hero-title,.hero-title,.cta-inner h2,.footer-title').forEach(el=>{
      gsap.from(el,{opacity:0,y:24,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}});
    });

    // Hero elements
    gsap.from('.hero-badge',{opacity:0,y:16,duration:.6,delay:.1,ease:'power2.out'});
    gsap.from('.hero-title',{y:40,duration:.9,delay:.2,ease:'power3.out'});
    gsap.from('.hero-sub',{opacity:0,y:20,duration:.7,delay:.4,ease:'power2.out'});
    gsap.from('.hero-actions',{opacity:0,y:16,duration:.6,delay:.55,ease:'power2.out'});
    gsap.from('.hero-img',{opacity:0,x:40,duration:1,delay:.3,ease:'power3.out'});

    // Stats count up
    document.querySelectorAll('.stat-num').forEach(el=>{
      const text=el.textContent.trim();
      const numMatch=text.match(/(\d+)/);
      if(!numMatch)return;
      const target=parseInt(numMatch[1]);
      const suffix=text.replace(numMatch[1],'');
      el.textContent='0'+suffix;
      ScrollTrigger.create({trigger:el,start:'top 85%',once:true,onEnter:()=>{
        const dur=1200,st=performance.now();
        function tick(now){const p=Math.min((now-st)/dur,1);el.textContent=Math.round((1-Math.pow(1-p,3))*target)+suffix;if(p<1)requestAnimationFrame(tick)}
        requestAnimationFrame(tick);
      }});
    });

    // Contact form
    const form=document.getElementById('contactForm');
    if(form){form.addEventListener('submit',e=>{
      e.preventDefault();const btn=form.querySelector('.btn');btn.textContent='Sending...';btn.disabled=true;
      setTimeout(()=>{btn.innerHTML='Sent ✓';setTimeout(()=>{btn.innerHTML='Send Enquiry <span>↗</span>';btn.disabled=false;form.reset()},2000)},800);
    })}

    // Nav toggle
    const toggle=document.getElementById('navToggle');
    const links=document.querySelector('.nav-links');
    if(toggle&&links){toggle.addEventListener('click',()=>{links.classList.toggle('is-open');toggle.classList.toggle('is-open')})}
  });


  // ==========================================
  // EXIT INTENT POPUP
  // ==========================================
  const exitPopup = document.getElementById('exitPopup');
  const exitClose = document.getElementById('exitClose');
  let exitShown = false;

  if (exitPopup) {
    document.addEventListener('mouseout', (e) => {
      if (exitShown) return;
      if (e.clientY < 5 && e.relatedTarget === null) {
        exitPopup.classList.add('is-visible');
        exitShown = true;
      }
    });

    if (exitClose) exitClose.addEventListener('click', () => exitPopup.classList.remove('is-visible'));
    exitPopup.addEventListener('click', (e) => { if (e.target === exitPopup) exitPopup.classList.remove('is-visible'); });

    const exitForm = document.getElementById('exitForm');
    if (exitForm) {
      exitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = exitForm.querySelector('.btn');
        btn.textContent = 'Booked ✓';
        btn.disabled = true;
        setTimeout(() => exitPopup.classList.remove('is-visible'), 1500);
      });
    }
  }

  // ==========================================
  // SLIDE-IN CTA — appears after 30s
  // ==========================================
  const slideCta = document.getElementById('slideCta');
  const slideClose = document.getElementById('slideCtaClose');

  if (slideCta) {
    setTimeout(() => {
      slideCta.classList.add('is-visible');
    }, 30000);

    if (slideClose) slideClose.addEventListener('click', () => slideCta.classList.remove('is-visible'));
  }

  // ==========================================
  // SOCIAL PROOF TOASTS — rotating
  // ==========================================
  const proofToast = document.getElementById('proofToast');
  if (proofToast) {
    const proofs = [
      { text: 'Tax clearance completed for a Queenstown retail business', time: '2 hours ago' },
      { text: 'New BEE certification processed for a construction firm', time: '5 hours ago' },
      { text: 'Annual financial statements submitted for 3 clients', time: 'Yesterday' },
      { text: 'VAT registration completed for a new startup', time: '1 day ago' },
    ];

    let proofIndex = 0;

    function showProof() {
      const p = proofs[proofIndex % proofs.length];
      proofToast.innerHTML = p.text + '<strong>' + p.time + '</strong>';
      proofToast.classList.add('is-visible');

      setTimeout(() => {
        proofToast.classList.remove('is-visible');
        proofIndex++;
      }, 4000);
    }

    // First toast after 15s, then every 45s
    setTimeout(showProof, 15000);
    setInterval(showProof, 45000);
  }

  // ==========================================
  // GA4 CONVERSION EVENTS
  // ==========================================
  // Track WhatsApp clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') gtag('event', 'whatsapp_click', { event_category: 'conversion' });
    });
  });

  // Track phone clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') gtag('event', 'phone_click', { event_category: 'conversion' });
    });
  });

  // Track form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      if (typeof gtag !== 'undefined') gtag('event', 'form_submit', { event_category: 'conversion', event_label: form.id || 'unknown' });
    });
  });
})();
