// instruments-view.js: Laboratory instruments pages (photo and 3D tabs). Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Laboratory instruments ---------- */
const instrRow=x=>`<a class="trow card" href="#/lab3d/${x.id}"><span class="bi">${ico(x.ic)}</span><span class="tt"><b dir="ltr" lang="en">${esc(x.name)}</b><small dir="rtl">${esc(x.ar)}</small></span><span class="go">${ico('next')}</span></a>`;
let instDept='all';   // department filter on the equipment page, kept while the app is open
function viewLab3d(){
  const s=S(),L=s.lab3d,shown=DEPTS.filter(d=>instDept==='all'||d.id===instDept);
  const chips=`<div class="chips deptchips" role="group" aria-label="${esc(L.dept)}">${[{id:'all',ic:'grid'},...DEPTS].map(d=>`<button type="button" class="chip" data-idept="${d.id}" aria-pressed="${instDept===d.id}">${ico(d.ic)}<span>${esc(d.id==='all'?L.all:lang==='ar'?d.ar:d.en)}</span>${d.id==='all'?'':`<small>${INSTR.filter(x=>x.dept===d.id).length}</small>`}</button>`).join('')}</div>`;
  return `<div class="pagehead"><span class="picon">${ico('scope')}</span><div><h2>${esc(L.h)}</h2><p>${esc(L.p)}</p></div></div>${chips}
${shown.map(d=>{const xs=INSTR.filter(x=>x.dept===d.id);return `<h3 class="grp">${ico(d.ic)} ${esc(lang==='ar'?d.ar:d.en)} · ${d.ready?esc(L.ready(xs.length)):esc(L.soon)}</h3>
${d.ready?`<div class="grid g2 v3grid">${xs.map(x=>`<a class="card v3tile" href="#/lab3d/${x.id}"><span class="bi">${ico(x.ic)}</span><span class="tt"><b dir="ltr" lang="en">${esc(x.name)}</b><small dir="rtl">${esc(x.ar)}</small><span class="note" dir="ltr" lang="en">${esc(x.short)}</span></span><span class="badge b-pri">${esc(L.open)}</span></a>`).join('')}</div>`
:`<div class="card"><div class="cb"><ul class="ilist soonl" dir="ltr" lang="en">${(d.next||[]).map(n=>`<li>${esc(n)}</li>`).join('')}</ul></div></div>`}`}).join('')}`;
}
function bindLab3d(){document.querySelectorAll('[data-idept]').forEach(b=>b.onclick=()=>{instDept=b.dataset.idept;render()})}
function viewInstr(x){
  const s=S(),L=s.lab3d,d=DEPTS.find(y=>y.id===x.dept);
  const head=`<nav class="crumbs"><a href="#/lab3d">${esc(L.h)}</a><span>›</span><span>${esc(lang==='ar'?d.ar:d.en)}</span></nav>
<div class="card thead"><div class="t1"><span class="picon">${ico(x.ic)}</span><div><h2 dir="ltr" lang="en">${esc(x.name)}</h2><div class="ar" dir="rtl">${esc(x.ar)}</div></div></div>
<div class="seg vtabs" role="group"><button type="button" data-vt="photo" aria-pressed="${VT==='photo'}">${ico('image')}${esc(L.photo)}</button><button type="button" data-vt="3d" aria-pressed="${VT==='3d'}">${ico('cube')}${esc(L.model)}</button></div></div>
<div id="vtPhoto" ${VT==='3d'?'hidden':''}>${devFigure(x)}</div>
<div class="card v3card" id="vt3d" ${VT==='3d'?'':'hidden'}><div class="v3" id="v3"><div class="v3load">${ico('cube')}<span>${esc(L.loading)}</span></div></div>
<div class="v3bar"><button type="button" class="btn" id="v3play" disabled>${esc(L.pause)}</button><label class="v3ex"><span>${esc(L.explode)}</span><input type="range" id="v3ex" min="0" max="1" step="0.01" value="0" disabled></label><label class="v3chk"><input type="checkbox" id="v3lab" disabled><span>${esc(L.labels)}</span></label><button type="button" class="btn" id="v3reset" disabled>${esc(L.reset)}</button></div>
<p class="v3status" id="v3s" dir="ltr" lang="en" aria-live="polite"></p><div class="v3info" id="v3i"><p class="note" style="margin:0">${esc(L.pick)}</p></div>
<p class="note v3hint">${esc(L.hint)} ${esc(L.schem)}</p></div>`;
  const sections=[
    {id:'purpose',ic:'info',h:L.purpose,html:`<p>${esc(x.purpose)}</p>`},
    {id:'principle',ic:'flask',h:L.principle,html:`<p>${esc(x.principle)}</p>`},
    {id:'parts',ic:'grid',h:L.parts,html:`<div class="v3parts">${x.parts.map(p=>`<button type="button" class="v3part" data-part="${p.id}"><b>${esc(p.n)}</b><small dir="rtl" lang="ar">${esc(p.ar)}</small><span>${esc(p.d)}</span></button>`).join('')}</div>`},
    {id:'use',ic:'check',h:L.use,html:stepList(x.use)},
    {id:'settings',ic:'therm',h:L.settings,html:eduBadge()+rangeTable(x.settings)},
    {id:'qc',ic:'shield',h:L.qc,html:ulist(x.qc)},
    {id:'safety',ic:'warn',h:L.safety,html:ulist(x.safety,'warn')},
    {id:'trouble',ic:'warn',h:L.trouble,html:ulist(x.trouble,'warn')},
    {id:'tests',ic:'doc',h:L.tests,html:`<div class="rows">${x.tests.map(byName).filter(Boolean).map(trow).join('')}</div>`},
    {id:'cite',ic:'quote',h:s.sec.cite,html:refList(x.ref)}];
  const aside=quickFacts([[L.dept,esc(lang==='ar'?d.ar:d.en)],[L.parts,String(x.parts.length)],[L.tests,String(x.tests.length)]]);
  return topicPage(head,sections,aside);
}
// device photograph from images/devices/; the neutral placeholder shows until the photo has loaded (or if it is missing)
function devFigure(x){
  const L=S().lab3d,p=x.photo||{};
  return `<figure class="card v3card devcard"><div class="devbox"><img class="devimg" src="${esc(x.img)}.webp" alt="${esc(x.alt)}" width="${p.w||800}" height="${p.h||600}" loading="lazy">
<div class="devph" aria-hidden="true">${ico('image')}<b dir="ltr" lang="en">${esc(x.name)}</b><span dir="rtl" lang="ar">${esc(x.ar)}</span><small>${esc(L.pending)}</small></div></div>
<figcaption class="note devcap"><span dir="ltr" lang="en">${esc(x.name)}</span> · <span dir="rtl" lang="ar">${esc(x.ar)}</span>${p.cap?`<span class="devnote" dir="ltr" lang="en">${esc(p.cap)}</span>`:''}${p.by?`<small class="devcredit">${credit(p)}</small>`:''}</figcaption></figure>`;
}
// "Photo | 3D model" tabs; the 3D engine (lab3d.js + Three.js) is fetched only when the 3D tab is first opened
let VT='photo',V3=null;
function bindInstr(x){
  bindToc();
  const s=S(),L=s.lab3d,info=$('v3i'),names=Object.fromEntries(x.parts.map(p=>[p.id,lang==='ar'?p.ar:p.n]));
  const showPart=id=>{const p=x.parts.find(q=>q.id===id);
    document.querySelectorAll('.v3part').forEach(b=>b.classList.toggle('on',b.dataset.part===id));
    info.innerHTML=p?`<b>${esc(lang==='ar'?p.ar:p.n)}</b>${lang==='ar'?` <small dir="ltr">${esc(p.n)}</small>`:''}<p dir="ltr" lang="en">${esc(p.d)}</p>`:`<p class="note" style="margin:0">${esc(L.pick)}</p>`};
  const mount3d=()=>{
    const el=$('v3');if(V3||!el)return;
    // dynamic import resolves against this file (site/js/), so the module is one folder up
    import('./lab3d.js').then(m=>{
      if(!document.body.contains(el)||VT!=='3d'||V3)return;
      if(!m.webglOK()){el.innerHTML=`<div class="v3load done">${ico('info')}<span>${esc(L.nowebgl)}</span></div>`;return}
      el.innerHTML='';
      const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
      V3=m.mountViewer(el,x,{names,reduceMotion:reduce,onSelect:showPart,onStatus:t=>{$('v3s').textContent=t}});
      const play=$('v3play');play.textContent=reduce?L.play:L.pause;
      ['v3play','v3ex','v3lab','v3reset'].forEach(id=>$(id).disabled=false);
      play.onclick=()=>{V3.setPlay(!V3.isPlaying());play.textContent=V3.isPlaying()?L.pause:L.play};
      $('v3ex').oninput=e=>V3.setExplode(+e.target.value);
      $('v3lab').onchange=e=>V3.setLabels(e.target.checked);
      $('v3reset').onclick=()=>{V3.reset();$('v3ex').value=0};
    }).catch(()=>{
      // e.g. offline before the 3D files were ever cached: offer a retry instead of a dead end
      el.innerHTML=`<div class="v3load done">${ico('warn')}<span>${esc(L.fail)}</span><button type="button" class="btn" id="v3retry">${esc(S().fault.retry)}</button></div>`;
      $('v3retry').onclick=()=>{el.innerHTML=`<div class="v3load">${ico('cube')}<span>${esc(L.loading)}</span></div>`;mount3d()};
    });
  };
  const setTab=v=>{VT=v;document.querySelectorAll('[data-vt]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.vt===v)));
    $('vtPhoto').hidden=v!=='photo';$('vt3d').hidden=v!=='3d';
    if(v==='3d')mount3d();else if(V3){V3.dispose();V3=null;$('v3').innerHTML=`<div class="v3load">${ico('cube')}<span>${esc(L.loading)}</span></div>`;['v3play','v3ex','v3lab','v3reset'].forEach(id=>$(id).disabled=true);$('v3ex').value=0;$('v3lab').checked=false}};
  document.querySelectorAll('[data-vt]').forEach(b=>b.onclick=()=>setTab(b.dataset.vt));
  // tapping a part card switches to the 3D model and highlights that part
  document.querySelectorAll('.v3part').forEach(b=>b.onclick=()=>{const id=b.dataset.part;showPart(id);if(VT!=='3d')setTab('3d');
    const go=()=>{if(V3){V3.select(id);$('vt3d').scrollIntoView({behavior:'smooth',block:'center'})}else setTimeout(go,150)};go()});
  if(VT==='3d')mount3d();
}
// img load/error events do not bubble (and load never reaches window), so listen once on document in the capture phase
document.addEventListener('load',e=>{const t=e.target;if(t&&t.classList&&t.classList.contains('devimg'))t.closest('.devbox').classList.add('ok')},true);
document.addEventListener('error',e=>{const t=e.target;if(t&&t.classList&&t.classList.contains('devimg'))t.closest('.devbox').classList.add('missing')},true);

