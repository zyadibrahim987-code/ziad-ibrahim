/* Zyad Ibrahim portfolio — renders the site from the CMS content (Supabase) */
(async function(){
const CFG = window.ZI_CONFIG;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = !!window.gsap && !reduce;
document.body.classList.remove('no-js');

/* ---------- load content ---------- */
async function loadContent(){
  try{
    const r = await fetch(`${CFG.url}/rest/v1/site_content?id=eq.1&select=data`, {headers:{apikey:CFG.key, Authorization:'Bearer '+CFG.key}, cache:'no-store'});
    if(r.ok){ const j = await r.json(); if(j[0] && j[0].data) return j[0].data; }
  }catch(e){}
  const r2 = await fetch('content.json', {cache:'no-store'}); return r2.json();
}
const S = await loadContent();
window.SITE = S;
const C = S.settings || {};

/* ---------- tracking (Google Tag Manager) ---------- */
window.dataLayer = window.dataLayer || [];
function track(event, params){ try{ window.dataLayer.push(Object.assign({event}, params||{})); }catch(e){} }
if(C.gtmId && /^GTM-[A-Z0-9]+$/i.test(C.gtmId.trim())){
  const id = C.gtmId.trim().toUpperCase();
  window.dataLayer.push({'gtm.start': Date.now(), event:'gtm.js'});
  const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtm.js?id='+id;
  document.head.appendChild(s);
}

let L = (navigator.language||'').startsWith('ar') ? 'ar' : 'en';
try{ const s=localStorage.getItem('zi-lang'); if(s) L=s; }catch(e){}

const t = o => (o && typeof o==='object') ? (o[L] || o.en || '') : (o ?? '');
const u = k => t(S.ui[k]);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const img = p => esc(p || '');
const waURL = () => 'https://wa.me/' + String(C.whatsapp||'').replace(/\D/g,'');
const words = s => esc(s).split(' ').map(w=>`<span class="w"><span>${w}</span></span>`).join(' ');
const fmt = (n,d) => Number(n||0).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const counter = k => `<span class="num" data-n="${+k.n||0}" data-d="${+k.dec||0}" data-pre="${esc(k.pre||'')}" data-suf="${esc(k.suf||'')}">${esc(k.pre||'')}${fmt(k.n,+k.dec||0)}${esc(k.suf||'')}</span>`;
const waIco = '<svg viewBox="0 0 24 24" fill="currentColor"><use href="#i-wa"/></svg>';
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const head = (k, title, extra='') => `${k?`<div class="kicker">${esc(k)}</div>`:''}${title?`<h2 class="h2 split" ${extra}>${words(title)}</h2>`:''}`;
const mq = (arr,cls='') => arr.length ? `<div class="marquee"><div class="track ${cls}">${[...arr,...arr].map(x=>`<span>${esc(x)}</span>`).join('')}</div></div>` : '';
const visible = id => (S.sections||[]).some(s=>s.id===id && s.visible!==false);
const safeUrl = s => /^(https?:|mailto:|tel:|#)/i.test(String(s||'').trim()) ? esc(String(s).trim()) : '#';

/* ---------- section renderers ---------- */
const R = {};
R.hero = () => {
  const splitName = s => L==='ar' ? `<span class="c">${esc(s)}</span>` : [...s].map(c=>`<span class="c">${esc(c)}</span>`).join('');
  const second = visible('form')
    ? `<a class="btn btn-ghost mag" href="#form" data-go="form" data-ev="cta_form"><span>${esc(u('navForm'))}</span>${arrow}</a>`
    : `<a class="btn btn-ghost mag" href="#work" data-go="work"><span>${esc(u('ctaWork'))}</span>${arrow}</a>`;
  return `<section class="hero" id="top"><div class="wrap">
    <div>
      <div class="avail h-in"><i class="dot"></i>${esc(u('available'))}</div>
      <h1 class="hname"><span class="l1">${splitName(u('heroName1'))}</span><span class="l2">${splitName(u('heroName2'))}</span></h1>
      <p class="hkick h-in">${esc(u('heroKicker')).replace('&amp;','<b>&amp;</b>').replace('·','<b>·</b>')}</p>
      <p class="lead h-in">${esc(u('heroLead'))}</p>
      <div class="hbtns h-in">
        <a class="btn btn-green mag" href="${waURL()}" target="_blank" rel="noopener" data-ev="whatsapp_click" data-loc="hero">${waIco}<span>${esc(u('ctaChat'))}</span></a>
        ${second}
      </div>
    </div>
    <div class="photo" id="photo">
      <div class="glow"></div>
      <svg class="ring" viewBox="0 0 200 200"><circle cx="100" cy="100" r="96" fill="none" stroke="#10A861" stroke-width=".6" stroke-dasharray="2 5"/><circle cx="100" cy="100" r="80" fill="none" stroke="#10A861" stroke-width=".3" stroke-dasharray="1 3"/></svg>
      <img src="${img(C.photo)}" alt="Zyad Ibrahim">
      ${(S.heroChips||[]).slice(0,3).map((c,i)=>`<div class="chip c${i}"><div class="v num">${esc(c.v)}</div><div class="k">${esc(t(c))}</div></div>`).join('')}
    </div>
  </div><div class="scrollcue"><span>${esc(u('scroll'))}</span><i></i></div></section>`;
};
R.platforms = () => mq(String(C.platforms||'').split(',').map(s=>s.trim()).filter(Boolean));
R.level = () => `<section id="level"><div class="wrap">
    ${head(u('levelTitle'), u('statsTitle'))}
    <div class="level rv-group">${(S.levels||[]).map(l=>`<div class="rv"><small>${esc(t(l.k))}</small><p>${esc(t(l.v))}</p></div>`).join('')}</div>
    <div class="stats rv-group">${(S.stats||[]).map(s=>`<div class="stat rv"><div class="n">${counter(s)}</div><p>${esc(t(s))}</p></div>`).join('')}</div>
  </div></section>`;
R.about = () => `<section class="about" id="about"><div class="wrap">
    <div>${head(u('aboutKicker'), u('aboutTitle'))}<p class="lead rv">${esc(u('aboutBody'))}</p></div>
    <ul class="hls rv-group">${(S.highlights||[]).map((h,i)=>`<li class="rv"><i>${String(i+1).padStart(2,'0')}</i><span>${esc(t(h))}</span></li>`).join('')}</ul>
  </div></section>`;
R.cases = () => `<section id="work"><div class="wrap">
    <div class="cases-head">${head(u('workKicker'), u('workTitle'))}</div>
    ${(S.cases||[]).filter(c=>!c.hidden).map((c,i)=>caseHTML(c,i)).join('')}
  </div></section>`;
R.results = () => (S.resultsWall||[]).length ? `<section id="results" style="padding-top:0"><div class="wrap">
    ${head(u('wallKicker'), u('wallTitle'))}
    <div class="wall rv-group">${S.resultsWall.map(r=>`<figure class="rv zoom" data-src="${img(r.image)}"><img src="${img(r.image)}" alt="${esc(t(r))}" loading="lazy"><figcaption>${esc(t(r))}</figcaption></figure>`).join('')}</div>
  </div></section>` : '';
R.clients = () => {
  const F = S.featuredClients||[], CL = S.clients||[], half = Math.ceil(CL.length/2);
  return `<section class="clients" id="clients" style="padding-inline:0"><div class="wrap" style="padding-inline:var(--pad)">
    ${head(u('clientsKicker'), u('clientsTitle'), 'style="margin-bottom:50px"')}
    ${F.length ? `<div class="feat-label">${esc(u('featuredLabel'))}</div><div class="featured rv-group">${F.map(f=>`<div class="fc rv" style="--fbg:${esc(f.bg||'#ffffff')}"><div class="fc-in ${f.round?'round':''} ${f.wide?'wide':''}"><img src="${img(f.image)}" alt="${esc(f.name)}"></div></div>`).join('')}</div>` : ''}
    </div>
    ${logoRow(CL.slice(0,half),'')}${logoRow(CL.slice(half),'rev')}
    ${C.stripImage ? `<div style="padding-inline:var(--pad)"><img class="strip rv" src="${img(C.stripImage)}" alt="" loading="lazy"></div>` : ''}
  </section>`;
};
R.skills = () => `<section id="skills"><div class="wrap">
    ${head(u('skillsKicker'), u('skillsTitle'))}
    <div class="tabs" id="tabs"><span class="tab-pill"></span>
      ${['core','services','ads','ecom','tools'].filter(k=>(S.skills[k]||[]).length).map((k,i)=>`<button class="tab ${i?'':'on'}" data-k="${k}">${esc(u('tab'+k[0].toUpperCase()+k.slice(1)))}</button>`).join('')}
    </div>
    <div class="chips" id="chips"></div>
  </div></section>`;
R.niches = () => { const n=(S.niches||[]).map(x=>t(x)), h=Math.ceil(n.length/2);
  return `<section id="niches" style="padding-inline:0;padding-top:0"><div class="wrap" style="padding-inline:var(--pad)">${head(u('nicheKicker'), u('nicheTitle'))}</div>
    <div class="niches">${mq(n.slice(0,h))}${mq(n.slice(h),'rev out')}</div></section>`; };
R.experience = () => `<section id="experience"><div class="wrap">
    ${head(u('expKicker'), u('expTitle'))}
    <div class="tl" id="tl"><div class="rail"></div><div class="fill"></div>
      ${(S.experience||[]).map(j=>`<div class="job rv ${j.current?'cur':''}"><div class="d">${esc(t(j.date))}${j.current?`<span class="tag">${L==='ar'?'حالياً':'Now'}</span>`:''}</div><h3>${esc(t(j.role))}</h3><div class="co">${esc(j.co)}</div><p>${esc(t(j.body))}</p></div>`).join('')}
    </div></div></section>`;
R.leadership = () => `<section style="padding-top:0"><div class="wrap two rv-group">
    <div class="panel rv"><div class="kicker">${esc(u('leadKicker'))}</div><h3>${esc(u('leadTitle'))}</h3><ul>${(S.leadership||[]).map(x=>`<li>${esc(t(x))}</li>`).join('')}</ul></div>
    <div class="panel rv"><div class="kicker">${esc(u('eduKicker'))}</div><ul style="margin-top:8px">${(S.education||[]).map(x=>`<li>${esc(t(x))}</li>`).join('')}</ul></div>
  </div></section>`;
R.form = () => `<section id="form" class="lead-sec"><div class="wrap lead-grid">
    <div>${head(u('formKicker'), u('formTitle'))}<p class="lead rv">${esc(u('formBody'))}</p>
      <a class="btn btn-ghost mag rv" style="margin-top:26px" href="${waURL()}" target="_blank" rel="noopener" data-ev="whatsapp_click" data-loc="form">${waIco}<span>${esc(u('ctaChat'))}</span></a></div>
    <form class="lform rv" id="leadForm" novalidate>
      <label><span>${esc(u('fName'))} *</span><input name="name" maxlength="120" autocomplete="name" required></label>
      <label><span>${esc(u('fPhone'))} *</span><input name="whatsapp" type="tel" maxlength="40" autocomplete="tel" dir="ltr" placeholder="+966" required><em>${esc(u('fPhoneHint'))}</em></label>
      <div class="fl"><span>${esc(u('fType'))} *</span><div class="seg">
        ${['Store','Service','Other'].map((x,i)=>`<label><input type="radio" name="business_type" value="${x.toLowerCase()}" ${i?'':''}><b>${esc(u('fType'+x))}</b></label>`).join('')}
      </div></div>
      <label><span>${esc(u('fNiche'))} *</span><input name="niche" maxlength="160" placeholder="${esc(u('fNicheHint'))}" required></label>
      <label><span>${esc(u('fSite'))}</span><input name="website" maxlength="300" dir="ltr" placeholder="https://"></label>
      <label><span>${esc(u('fBudget'))}</span><select name="budget"><option value=""></option>${[1,2,3,4,5].map(i=>`<option value="${esc(S.ui['fBudget'+i].en)}">${esc(u('fBudget'+i))}</option>`).join('')}</select></label>
      <label class="full"><span>${esc(u('fMsg'))}</span><textarea name="message" rows="3" maxlength="3000"></textarea></label>
      <input name="company_site" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-green full" type="submit"><span>${esc(u('fSend'))}</span>${arrow}</button>
      <p class="fmsg full" id="fmsg" role="status"></p>
    </form>
  </div></section>`;
R.contact = () => `<section class="contact" id="contact"><div class="wrap">
    ${head(u('contactKicker'), u('contactTitle'))}
    <p class="lead rv">${esc(u('contactBody'))}</p>
    <div class="cbtns rv">
      <a class="btn btn-green mag" href="${waURL()}" target="_blank" rel="noopener" data-ev="whatsapp_click" data-loc="contact">${waIco}<span>${esc(u('ctaChat'))}</span></a>
      ${C.linkedin?`<a class="btn btn-ghost mag" href="${safeUrl(C.linkedin)}" target="_blank" rel="noopener" data-ev="linkedin_click"><span>LinkedIn</span>${arrow}</a>`:''}
    </div>
    <div class="cards rv-group">
      <a class="ccard rv" href="${waURL()}" target="_blank" rel="noopener" data-ev="whatsapp_click" data-loc="card"><small>WhatsApp</small><p class="num">${esc(C.phoneDisplay)}</p></a>
      ${C.email?`<a class="ccard rv" href="mailto:${esc(C.email)}" data-ev="email_click"><small>Email</small><p>${esc(C.email)}</p></a>`:''}
      ${C.linkedin?`<a class="ccard rv" href="${safeUrl(C.linkedin)}" target="_blank" rel="noopener" data-ev="linkedin_click"><small>LinkedIn</small><p>${esc(C.linkedinLabel||'LinkedIn')}</p></a>`:''}
    </div>
  </div><div class="huge">LET'S WORK</div></section>`;

/* ---------- template sections (added from the dashboard) ---------- */
const T = {};
const sid = s => `id="${esc(s.id)}"`;
T.text_image = (s,d) => { const hasImg=!!d.image; return `<section ${sid(s)}><div class="wrap ti ${hasImg?'':'noimg'} ${d.side==='start'?'img-start':''}">
    <div>${head(t(d.kicker), t(d.title))}<p class="lead rv" style="white-space:pre-line">${esc(t(d.body))}</p>
    ${t(d.btnLabel)?`<a class="btn btn-green mag rv" style="margin-top:28px" href="${safeUrl(d.btnUrl||'#form')}" ${String(d.btnUrl||'').startsWith('#')?`data-go="${esc(String(d.btnUrl).slice(1))}"`:'target="_blank" rel="noopener"'} data-ev="cta_click"><span>${esc(t(d.btnLabel))}</span>${arrow}</a>`:''}</div>
    ${hasImg?`<div class="ti-img rv zoom" data-src="${img(d.image)}"><img src="${img(d.image)}" alt="" loading="lazy"></div>`:''}
  </div></section>`; };
T.stats = (s,d) => `<section ${sid(s)}><div class="wrap">${head(t(d.kicker), t(d.title))}
    <div class="stats rv-group">${(d.items||[]).map(x=>`<div class="stat rv"><div class="n">${counter(x)}</div><p>${esc(t(x.label))}</p></div>`).join('')}</div></div></section>`;
T.carousel = (s,d) => `<section ${sid(s)}><div class="wrap">${head(t(d.kicker), t(d.title))}
    <div class="car rv" data-auto="${d.autoplay?1:0}">
      <div class="car-track">${(d.slides||[]).map(x=>`<figure class="car-slide zoom" data-src="${img(x.image)}"><img src="${img(x.image)}" alt="" loading="lazy">${t(x.caption)?`<figcaption>${esc(t(x.caption))}</figcaption>`:''}</figure>`).join('')}</div>
      <div class="car-nav"><button class="car-prev" aria-label="prev">‹</button><div class="car-dots"></div><button class="car-next" aria-label="next">›</button></div>
    </div></div></section>`;
T.gallery = (s,d) => `<section ${sid(s)}><div class="wrap">${head(t(d.kicker), t(d.title))}
    <div class="wall rv-group">${(d.items||[]).map(x=>`<figure class="rv zoom" data-src="${img(x.image)}"><img src="${img(x.image)}" alt="" loading="lazy">${t(x.caption)?`<figcaption>${esc(t(x.caption))}</figcaption>`:''}</figure>`).join('')}</div></div></section>`;
T.testimonials = (s,d) => `<section ${sid(s)}><div class="wrap">${head(t(d.kicker), t(d.title))}
    <div class="tst rv-group">${(d.items||[]).map(x=>`<div class="tcard rv">${x.image?`<div class="tshot zoom" data-src="${img(x.image)}"><img src="${img(x.image)}" alt="" loading="lazy"></div>`:''}${t(x.quote)?`<p class="tq">“${esc(t(x.quote))}”</p>`:''}<div class="tby"><b>${esc(x.name)}</b>${t(x.role)?`<span>${esc(t(x.role))}</span>`:''}</div></div>`).join('')}</div></div></section>`;
T.steps = (s,d) => `<section ${sid(s)}><div class="wrap">${head(t(d.kicker), t(d.title))}
    <div class="steps rv-group">${(d.items||[]).map((x,i)=>`<div class="step rv"><i class="num">${String(i+1).padStart(2,'0')}</i><h3>${esc(t(x.title))}</h3><p>${esc(t(x.body))}</p></div>`).join('')}</div></div></section>`;
T.logos = (s,d) => `<section ${sid(s)}><div class="wrap">${head(t(d.kicker), t(d.title), 'style="margin-bottom:40px"')}
    <div class="featured rv-group">${(d.items||[]).map(f=>`<div class="fc rv" style="--fbg:${esc(f.bg||'#ffffff')}"><div class="fc-in"><img src="${img(f.image)}" alt="${esc(f.name)}"></div></div>`).join('')}</div></div></section>`;
T.cta = (s,d) => `<section ${sid(s)}><div class="wrap"><div class="ctab rv">
    <h2 class="h2 split" style="max-width:none">${words(t(d.title))}</h2>${t(d.body)?`<p class="lead">${esc(t(d.body))}</p>`:''}
    <a class="btn btn-green mag" href="${d.btnUrl?safeUrl(d.btnUrl):waURL()}" ${String(d.btnUrl||'').startsWith('#')?`data-go="${esc(String(d.btnUrl).slice(1))}"`:'target="_blank" rel="noopener"'} data-ev="${d.btnUrl?'cta_click':'whatsapp_click'}" data-loc="cta">${d.btnUrl?'':waIco}<span>${esc(t(d.btnLabel)||u('ctaChat'))}</span>${d.btnUrl?arrow:''}</a>
  </div></div></section>`;

function render(){
  const html = document.documentElement;
  html.lang = L; html.dir = L==='ar' ? 'rtl':'ltr';
  document.querySelectorAll('[data-t]').forEach(el=>el.textContent=u(el.dataset.t));
  document.querySelectorAll('a.wa').forEach(a=>a.href=waURL());
  document.querySelectorAll('[data-go="form"]').forEach(a=>a.style.display=visible('form')?'':'none');
  let h = '';
  for(const s of (S.sections||[])){
    if(s.visible===false) continue;
    try{ h += R[s.type] ? R[s.type]() : (T[s.type] ? T[s.type](s, s.data||{}) : ''); }catch(e){ console.error('section',s.id,e); }
  }
  h += `<footer><span>© ${new Date().getFullYear()} Zyad Ibrahim</span><span>${esc(u('footer'))}</span></footer>`;
  document.getElementById('app').innerHTML = h;
  if(document.getElementById('chips')){ const first=document.querySelector('.tab'); if(first) renderChips(first.dataset.k,false); }
}

function caseHTML(c,i){
  const n = String(i+1).padStart(2,'0');
  const P = c.periods || [];
  const maxC = Math.max(...P.map(p=>parseFloat(p.conv)||0),1), maxA = Math.max(...P.map(p=>parseFloat(p.cpa)||0),1);
  const per = P.length ? `<div class="periods"><div class="phead"><span></span><span>${L==='ar'?'التحويلات':'Conversions'}</span><span>${L==='ar'?'تكلفة التحويل (ريال)':'Cost / conv. (SAR)'}</span></div>${P.map(p=>{
      const w1=((parseFloat(p.conv)||0)/maxC*100).toFixed(1), w2=((parseFloat(p.cpa)||0)/maxA*100).toFixed(1);
      return `<div class="prow"><span class="lbl">${esc(t(p.p))}</span><div class="pbar"><b style="--w:${w1}%"></b><span class="num">${esc(p.conv)}</span></div><div class="pbar cost"><b style="--w:${w2}%"></b><span class="num">${esc(p.cpa)}</span></div></div>`}).join('')}</div>` : '';
  const list = o => (t(o)||[]).filter(Boolean);
  const ims = (c.images||[]).filter(Boolean);
  return `<article class="case" id="case-${esc(c.id)}">
    <div class="case-side">
      <svg class="bignum" viewBox="0 0 230 150"><text x="0" y="140">${n}</text></svg>
      <div class="kicker" style="margin-bottom:10px">${esc(u('caseLabel'))} <span class="num">${n}</span></div>
      <h3 class="split">${words(t(c.title))}</h3>
      <div class="meta">
        <div><small>${esc(u('niche'))}</small><p>${esc(t(c.niche))}</p></div>
        <div><small>${esc(u('market'))}</small><p>${esc(t(c.market))}</p></div>
        <div><small>${esc(u('duration'))}</small><p>${esc(t(c.duration))}</p></div>
        <div class="full"><small>${esc(u('platforms'))}</small><p>${esc(c.platforms)}</p></div>
      </div>
    </div>
    <div>
      <div class="kpis rv-group">${(c.kpis||[]).map(k=>`<div class="kpi rv"><div class="n">${counter(k)}</div><p>${esc(t(k))}</p></div>`).join('')}</div>
      ${per}
      <p class="summary rv">${esc(t(c.summary))}</p>
      ${ims.length?`<div class="proof">${esc(u('proof'))}</div>
      <div class="shots" style="--cols:${Math.min(ims.length,2)}">${ims.map(im=>`<div class="shot rv zoom" data-src="${img(im)}"><img src="${img(im)}" alt="${esc(t(c.title))}" loading="lazy"></div>`).join('')}</div>`:''}
      <button class="toggle" aria-expanded="false" data-case="${esc(c.id)}"><span class="pl">+</span><span class="tl-txt">${esc(u('readMore'))}</span></button>
      <div class="details"><div class="details-inner">
        ${list(c.challenge).length?`<div><h4>${esc(u('challenge'))}</h4><ul>${list(c.challenge).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}
        ${list(c.strategy).length?`<div><h4>${esc(u('strategy'))}</h4><ul>${list(c.strategy).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}
        ${t(c.learning)?`<div><h4>${esc(u('learning'))}</h4><p class="quote">${esc(t(c.learning))}</p></div>`:''}
        ${t(c.role)?`<div><h4>${esc(u('role'))}</h4><p>${esc(t(c.role))}</p></div>`:''}
      </div></div>
    </div>
  </article>`;
}
function logoRow(list,cls){
  if(!list.length) return '';
  const one = list.map(n=>`<div class="lg"><img src="${img(n.image)}" alt="${esc(n.name)}" loading="lazy"></div>`).join('');
  return `<div class="marquee"><div class="logo-track ${cls}">${one}${one}</div></div>`;
}
function renderChips(k, anim=true){
  const box = document.getElementById('chips'); if(!box) return;
  const list = S.skills[k]||[];
  const tiles = list.some(x=>x.icon);
  box.className = tiles ? 'chips tiles' : 'chips';
  box.innerHTML = tiles
    ? list.map(x=>`<div class="tile"><div class="tico">${x.icon?`<img src="${img(x.icon)}" alt="">`:''}</div><span>${esc(t(x))}</span></div>`).join('')
    : list.map(x=>`<span class="sk">${esc(t(x))}</span>`).join('');
  if(hasG && anim) gsap.from(box.children,{y:30,opacity:0,scale:.9,duration:.7,stagger:.035,ease:'back.out(1.5)',clearProps:'transform'});
  movePill();
}
function movePill(){
  const on = document.querySelector('.tab.on'), pill = document.querySelector('.tab-pill');
  if(!on||!pill) return;
  pill.style.width = on.offsetWidth+'px';
  pill.style.left = on.offsetLeft+'px';
}

/* ---------- smooth scroll ---------- */
let lenis = null;
if(window.Lenis && !reduce){
  lenis = new Lenis({duration:1.15, easing:x=>Math.min(1,1.001-Math.pow(2,-10*x)), smoothWheel:true});
  if(hasG){ lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(tm=>lenis.raf(tm*1000)); gsap.ticker.lagSmoothing(0); }
  else { const raf=tm=>{lenis.raf(tm);requestAnimationFrame(raf)}; requestAnimationFrame(raf); }
}
function go(id){
  const el = document.getElementById(id); if(!el) return;
  document.getElementById('mmenu').classList.remove('open');
  if(lenis) lenis.scrollTo(el,{offset:id==='top'?0:-70}); else el.scrollIntoView({behavior:'smooth'});
}

/* ---------- animations ---------- */
function animate(first){
  if(!hasG){ return; }
  ScrollTrigger.getAll().forEach(s=>s.kill());
  gsap.registerPlugin(ScrollTrigger);
  if(document.querySelector('.hero')){
    const tl = gsap.timeline({delay: first ? 0 : 0.05});
    tl.from('.hname .c',{yPercent:110,opacity:0,rotate:L==='ar'?0:8,duration:1,stagger:.035,ease:'expo.out'})
      .from('.h-in',{y:30,opacity:0,duration:.9,stagger:.1,ease:'power3.out'},'-=.7')
      .from('#photo img',{y:80,opacity:0,scale:.96,duration:1.3,ease:'expo.out'},'-=1.1')
      .from('#photo .glow',{opacity:0,scale:.6,duration:1.6,ease:'power2.out'},'<');
    if(document.querySelector('.chip')) tl.from('.chip',{scale:.6,opacity:0,y:20,duration:.8,stagger:.12,ease:'back.out(1.8)'},'-=.9');
    gsap.utils.toArray('.chip').forEach((c,i)=>gsap.to(c,{y:i%2?-12:12,duration:2.6+i*.4,repeat:-1,yoyo:true,ease:'sine.inOut',delay:1.5}));
    gsap.to('#photo',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.hero .wrap>div:first-child',{yPercent:-10,opacity:.2,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  }
  gsap.utils.toArray('.split').forEach(el=>{
    gsap.from(el.querySelectorAll('.w>span'),{yPercent:115,duration:1,stagger:.06,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 85%'}});
  });
  gsap.utils.toArray('.rv-group').forEach(g=>{
    const kids=g.querySelectorAll(':scope > .rv'); if(!kids.length) return;
    gsap.from(kids,{y:50,opacity:0,duration:.9,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:g,start:'top 85%'}});
  });
  gsap.utils.toArray('.rv').forEach(el=>{
    if(el.parentElement.classList.contains('rv-group')) return;
    gsap.from(el,{y:40,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}});
  });
  gsap.utils.toArray('.num[data-n]').forEach(el=>{
    const n=+el.dataset.n,d=+el.dataset.d,pre=el.dataset.pre,suf=el.dataset.suf,o={v:0};
    el.textContent = pre+fmt(0,d)+suf;
    gsap.to(o,{v:n,duration:2.2,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'},onUpdate:()=>el.textContent=pre+fmt(o.v,d)+suf});
  });
  gsap.utils.toArray('.bignum text').forEach(tx=>{
    gsap.fromTo(tx,{strokeDashoffset:400,opacity:0},{strokeDashoffset:0,opacity:1,duration:2,ease:'power2.out',scrollTrigger:{trigger:tx,start:'top 85%'}});
  });
  gsap.utils.toArray('.shot img, .wall img').forEach(im=>{
    gsap.fromTo(im,{scale:1.15},{scale:1,ease:'none',scrollTrigger:{trigger:im,start:'top bottom',end:'bottom top',scrub:true}});
  });
  gsap.utils.toArray('.pbar b').forEach((b,i)=>{
    gsap.from(b,{scaleX:0,transformOrigin:L==='ar'?'right':'left',duration:1.4,ease:'expo.out',delay:(i%2)*.1,scrollTrigger:{trigger:b,start:'top 90%'}});
  });
  if(document.querySelector('#tl')) gsap.to('#tl .fill',{scaleY:1,ease:'none',scrollTrigger:{trigger:'#tl',start:'top 70%',end:'bottom 60%',scrub:true}});
  if(document.querySelector('.contact .huge')) gsap.from('.contact .huge',{yPercent:60,opacity:0,ease:'none',scrollTrigger:{trigger:'.contact',start:'top 80%',end:'bottom bottom',scrub:true}});
  if(document.querySelector('.lg')) gsap.from('.lg',{scale:.6,opacity:0,duration:.8,stagger:.03,ease:'back.out(1.6)',scrollTrigger:{trigger:'.clients',start:'top 75%'}});
  ScrollTrigger.refresh();
}

/* ---------- carousel ---------- */
function initCarousels(){
  document.querySelectorAll('.car').forEach(car=>{
    const track = car.querySelector('.car-track'), slides=[...track.children], dots=car.querySelector('.car-dots');
    if(!slides.length){ car.style.display='none'; return; }
    dots.innerHTML = slides.map((_,i)=>`<i data-i="${i}"></i>`).join('');
    const goTo = i => { const s=slides[(i+slides.length)%slides.length]; track.scrollTo({left: s.offsetLeft - track.offsetLeft, behavior:'smooth'}); };
    const cur = () => { let best=0,d=1e9; slides.forEach((s,i)=>{const x=Math.abs(s.getBoundingClientRect().left-track.getBoundingClientRect().left); if(x<d){d=x;best=i}}); return best; };
    const mark = () => { const c=cur(); [...dots.children].forEach((d,i)=>d.classList.toggle('on',i===c)); };
    track.addEventListener('scroll',()=>{clearTimeout(track._t);track._t=setTimeout(mark,80)},{passive:true});
    const dirSign = () => document.documentElement.dir==='rtl' ? -1 : 1;
    car.querySelector('.car-next').onclick=()=>goTo(cur()+1);
    car.querySelector('.car-prev').onclick=()=>goTo(cur()-1);
    dots.onclick=e=>{const i=e.target.dataset.i; if(i!=null) goTo(+i)};
    mark();
    if(car.dataset.auto==='1'){ let paused=false; car.onmouseenter=()=>paused=true; car.onmouseleave=()=>paused=false;
      clearInterval(car._iv); car._iv=setInterval(()=>{ if(!paused && !document.hidden) goTo(cur()+1); },4500); }
    dirSign();
  });
}

/* ---------- lead form ---------- */
function initForm(){
  const f = document.getElementById('leadForm'); if(!f) return;
  const msg = document.getElementById('fmsg');
  let started=false;
  f.addEventListener('input',()=>{ if(!started){ started=true; track('form_start'); } },{once:false});
  f.addEventListener('submit', async e=>{
    e.preventDefault();
    const fd = new FormData(f), v = k => String(fd.get(k)||'').trim();
    if(v('company_site')) return; // bot trap
    const lead = {name:v('name'), whatsapp:v('whatsapp'), business_type:v('business_type'), niche:v('niche'),
      website:v('website')||null, budget:v('budget')||null, message:v('message')||null, lang:L};
    if(!lead.name || lead.whatsapp.replace(/\D/g,'').length<7 || !lead.business_type || !lead.niche){
      msg.className='fmsg full err'; msg.textContent=u('fRequired'); return; }
    const btn = f.querySelector('button[type=submit] span'); const old=btn.textContent; btn.textContent=u('fSending');
    f.querySelector('button[type=submit]').disabled=true;
    try{
      const r = await fetch(`${CFG.url}/rest/v1/leads`, {method:'POST', headers:{apikey:CFG.key, Authorization:'Bearer '+CFG.key, 'Content-Type':'application/json', Prefer:'return=minimal'}, body:JSON.stringify(lead)});
      if(!r.ok) throw new Error(r.status);
      track('generate_lead', {lead_business_type:lead.business_type, lead_niche:lead.niche, lead_budget:lead.budget||'', form_language:L});
      f.reset(); msg.className='fmsg full ok'; msg.textContent=u('fOk');
    }catch(err){ msg.className='fmsg full err'; msg.textContent=u('fErr'); }
    btn.textContent=old; f.querySelector('button[type=submit]').disabled=false;
  });
}

/* ---------- interactions ---------- */
function bind(){
  const app = document.getElementById('app');
  app.querySelectorAll('.toggle').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const det = btn.nextElementSibling, open = btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded', !open);
      btn.querySelector('.tl-txt').textContent = u(open?'readMore':'readLess');
      if(!open) track('case_study_open',{case_id:btn.dataset.case});
      if(hasG){
        if(open){ gsap.to(det,{height:0,duration:.6,ease:'power3.inOut',onComplete:()=>ScrollTrigger.refresh()}); }
        else { gsap.to(det,{height:'auto',duration:.8,ease:'power3.inOut',onComplete:()=>ScrollTrigger.refresh()});
               gsap.from(det.querySelectorAll('li,p,h4'),{y:16,opacity:0,stagger:.025,duration:.5,delay:.15}); }
      } else det.style.height = open ? '0' : 'auto';
    });
  });
  app.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{
    app.querySelectorAll('.tab').forEach(x=>x.classList.remove('on')); b.classList.add('on'); renderChips(b.dataset.k);
  }));
  app.querySelectorAll('.zoom').forEach(z=>z.addEventListener('click',()=>{
    const lb=document.getElementById('lb'); lb.querySelector('img').src=z.dataset.src; lb.classList.add('open'); lenis&&lenis.stop();
  }));
  app.querySelectorAll('.stat').forEach(s=>s.addEventListener('pointermove',e=>{
    const r=s.getBoundingClientRect(); s.style.setProperty('--mx',(e.clientX-r.left)+'px'); s.style.setProperty('--my',(e.clientY-r.top)+'px');
  }));
  if(matchMedia('(pointer:fine)').matches && hasG){
    document.querySelectorAll('.mag').forEach(m=>{
      m.addEventListener('pointermove',e=>{const r=m.getBoundingClientRect();gsap.to(m,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.35,duration:.4,ease:'power3.out'})});
      m.addEventListener('pointerleave',()=>gsap.to(m,{x:0,y:0,duration:.7,ease:'elastic.out(1,.4)'}));
    });
  }
  initCarousels(); initForm();
  setTimeout(movePill,60);
}
document.addEventListener('click',e=>{
  const ev = e.target.closest('[data-ev]'); if(ev) track(ev.dataset.ev,{click_location:ev.dataset.loc||'', link_url:ev.getAttribute('href')||''});
  const a = e.target.closest('[data-go]'); if(a){ e.preventDefault(); go(a.dataset.go); }
});
const lb=document.getElementById('lb');
const closeLB=()=>{lb.classList.remove('open'); lenis&&lenis.start();};
lb.addEventListener('click',closeLB);
addEventListener('keydown',e=>{if(e.key==='Escape')closeLB()});
document.getElementById('burger').addEventListener('click',()=>document.getElementById('mmenu').classList.toggle('open'));
document.getElementById('lang').addEventListener('click',()=>{
  L = L==='en'?'ar':'en'; try{localStorage.setItem('zi-lang',L)}catch(e){}
  track('language_switch',{language:L});
  const app=document.getElementById('app'); app.classList.add('swap');
  setTimeout(()=>{ render(); bind(); window.scrollTo(0,0); lenis&&lenis.scrollTo(0,{immediate:true}); app.classList.remove('swap'); animate(false); },350);
});
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});
const glow=document.getElementById('glow');
if(matchMedia('(pointer:fine)').matches) addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
addEventListener('resize',movePill);

/* ---------- boot ---------- */
render(); bind();
const loader=document.getElementById('loader');
if(hasG){
  lenis&&lenis.stop();
  const o={v:0};
  gsap.timeline()
    .to(o,{v:100,duration:1.1,ease:'power2.inOut',onUpdate:()=>{document.getElementById('lnum').textContent=Math.round(o.v);document.getElementById('lbar').style.width=o.v+'%'}})
    .to(loader,{yPercent:-100,duration:.9,ease:'expo.inOut'})
    .add(()=>{loader.remove(); lenis&&lenis.start(); animate(true);},'-=.45');
} else { loader.remove(); }
})();
