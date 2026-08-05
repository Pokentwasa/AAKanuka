(function(){
  'use strict';
  const isFine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  let mx=0,my=0;
  const cur=document.getElementById('cursor'),ring=document.getElementById('cursorRing');
  if(isFine&&cur&&ring){
    document.body.classList.add('has-cursor');
    let rx=0,ry=0;
    window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
    (function t(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(t)})();
    document.querySelectorAll('[data-magnetic]').forEach(el=>{
      el.addEventListener('mouseenter',()=>ring.classList.add('is-magnetic'));
      el.addEventListener('mouseleave',()=>ring.classList.remove('is-magnetic'));
    });
  }

  // Lenis
  const lenis=new Lenis({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t))});
  function raf(time){lenis.raf(time);requestAnimationFrame(raf)}requestAnimationFrame(raf);

  window.addEventListener('load',()=>{
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(time=>lenis.raf(time*1000));
    gsap.ticker.lagSmoothing(0);

    // Nav hide/show
    const nav=document.getElementById('nav');
    if(nav){let ly=0;nav.style.transition='transform .4s cubic-bezier(.16,1,.3,1)';
    window.addEventListener('scroll',()=>{const y=window.scrollY;nav.style.transform=y>100&&y>ly?'translateY(-100%)':'translateY(0)';ly=y},{passive:true})}

    // Word reveals
    document.querySelectorAll('.word').forEach(w=>{
      gsap.to(w,{y:'0%',duration:1.2,ease:'power4.out',scrollTrigger:{trigger:w.closest('.line')||w,start:'top 92%'}});
    });

    // Fade ups
    document.querySelectorAll('.fade-up').forEach(el=>{
      gsap.to(el,{opacity:1,y:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%'}});
    });

    // Count up
    document.querySelectorAll('[data-count]').forEach(el=>{
      const target=parseInt(el.dataset.count);
      ScrollTrigger.create({trigger:el,start:'top 85%',once:true,onEnter:()=>{
        const dur=1400,st=performance.now();
        function tick(now){const p=Math.min((now-st)/dur,1);el.textContent=Math.round((1-Math.pow(1-p,3))*target);if(p<1)requestAnimationFrame(tick)}
        requestAnimationFrame(tick);
      }});
    });

    // Service cards stagger
    gsap.from('.svc',{opacity:0,y:30,duration:.6,stagger:.08,ease:'power2.out',scrollTrigger:{trigger:'.services-grid',start:'top 85%'}});

    // Team cards
    gsap.from('.team-card',{opacity:0,y:40,duration:.6,stagger:.1,ease:'power2.out',scrollTrigger:{trigger:'.team-grid',start:'top 85%'}});

    // Steps
    gsap.from('.step',{opacity:0,y:20,duration:.5,stagger:.1,ease:'power2.out',scrollTrigger:{trigger:'.approach-inner',start:'top 85%'}});

    // About cards parallax
    gsap.from('.about-card--top',{y:40,duration:.8,ease:'power2.out',scrollTrigger:{trigger:'.about-visual',start:'top 85%'}});
    gsap.from('.about-card--bottom',{y:60,duration:.8,delay:.15,ease:'power2.out',scrollTrigger:{trigger:'.about-visual',start:'top 85%'}});

    // Contact form
    const form=document.getElementById('contactForm');
    if(form){form.addEventListener('submit',e=>{
      e.preventDefault();
      const btn=form.querySelector('.btn-primary');
      btn.textContent='Sending...';btn.disabled=true;
      setTimeout(()=>{btn.textContent='Sent ✓';setTimeout(()=>{btn.textContent='Send Enquiry →';btn.disabled=false;form.reset()},2000)},800);
    })}
  });
})();
