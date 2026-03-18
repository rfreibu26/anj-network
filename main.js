'use strict';

/* ── Sticky header ── */
(function(){
  const hd = document.querySelector('.site-hd');
  if(!hd) return;
  window.addEventListener('scroll', ()=>{
    hd.classList.toggle('scrolled', window.scrollY > 10);
  }, {passive:true});
})();

/* ── Mobile nav ── */
(function(){
  const tog = document.querySelector('.nav-tog');
  const nav = document.querySelector('.mob-nav');
  if(!tog||!nav) return;
  let open = false;
  function close(){
    open=false; nav.classList.remove('open');
    tog.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
    const ls=tog.querySelectorAll('.hb-line');
    ls[0].style.transform=ls[2].style.transform=''; ls[1].style.opacity='';
  }
  tog.addEventListener('click', ()=>{
    if(open){close();return;}
    open=true; nav.classList.add('open');
    tog.setAttribute('aria-expanded','true');
    document.body.style.overflow='hidden';
    const ls=tog.querySelectorAll('.hb-line');
    ls[0].style.transform='translateY(7px) rotate(45deg)';
    ls[1].style.opacity='0';
    ls[2].style.transform='translateY(-7px) rotate(-45deg)';
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'&&open) close(); });
  document.addEventListener('click', e=>{ if(open&&!nav.contains(e.target)&&!tog.contains(e.target)) close(); });
})();

/* ── Mobile services accordion ── */
(function(){
  document.querySelectorAll('.mob-has-sub').forEach(btn=>{
    const sub = btn.nextElementSibling;
    if(!sub) return;
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded', String(!expanded));
      sub.classList.toggle('open', !expanded);
    });
  });
})();

/* ── FAQ accordion ── */
(function(){
  document.querySelectorAll('.faq-item').forEach(item=>{
    const btn=item.querySelector('.faq-q');
    const ans=item.querySelector('.faq-a');
    if(!btn||!ans) return;
    btn.addEventListener('click',()=>{
      const exp = btn.getAttribute('aria-expanded')==='true';
      document.querySelectorAll('.faq-q').forEach(b=>{ b.setAttribute('aria-expanded','false'); });
      document.querySelectorAll('.faq-a').forEach(a=>{ a.hidden=true; });
      btn.setAttribute('aria-expanded', String(!exp));
      ans.hidden = exp;
    });
  });
})();

/* ── Smooth scroll ── */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(!el) return;
      e.preventDefault();
      const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'))||72;
      window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - hh - 16, behavior:'smooth'});
      history.pushState(null,'','#'+id);
    });
  });
})();

/* ── Scroll reveal ── */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }});
  },{threshold:0.1, rootMargin:'0px 0px -32px 0px'});
  document.querySelectorAll('.reveal').forEach((el,i)=>{
    const parent = el.parentElement;
    if(parent){
      const siblings = Array.from(parent.children).filter(c=>c.classList.contains('reveal'));
      const idx = siblings.indexOf(el);
      if(idx>0) el.style.transitionDelay = `${idx*80}ms`;
    }
    obs.observe(el);
  });
})();

/* ── Active nav ── */
(function(){
  const path = window.location.pathname.replace(/\/$/,'');
  document.querySelectorAll('.nav-lk').forEach(a=>{
    const href = (a.getAttribute('href')||'').replace(/\/$/,'');
    const match = href===path || (href&&href!=='/'&&href!=='index.html'&&path.includes(href.replace('.html','')));
    a.classList.toggle('active', match);
    if(match) a.setAttribute('aria-current','page');
  });
})();

/* ── Form validation ── */
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.textContent='Sending…';
    btn.disabled=true;
    setTimeout(()=>{
      form.innerHTML='<div style="text-align:center;padding:3rem 0"><div style="font-size:3rem;margin-bottom:1rem">✅</div><h3 style="font-family:var(--font-h);color:var(--navy);font-size:1.5rem;margin-bottom:.75rem">Message Sent!</h3><p style="color:var(--slate)">Thanks for reaching out. We\'ll be in touch within one business day.</p></div>';
    }, 1000);
  });
})();

/* ── Schema injection utility ── */
window.injectSchema = function(obj){
  const s=document.createElement('script');
  s.type='application/ld+json';
  s.textContent=JSON.stringify(obj,null,2);
  document.head.appendChild(s);
};
