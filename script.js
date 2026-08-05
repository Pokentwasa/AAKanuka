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
    gsap.from('.hero-title',{opacity:0,y:30,duration:.9,delay:.2,ease:'power3.out'});
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
})();
