// compare-view.js: Normal vs abnormal comparison pages (data in atlas-compare.js). Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Normal vs abnormal ---------- */
const CMPS={};   // selected abnormal item per comparison set, kept while the app is open
const cmpSlide=id=>ATLAS.find(a=>a.id===id);
const cmpName=c=>lang==='ar'?c.ar:c.t;
const cmpItemName=it=>{const a=it.slide&&cmpSlide(it.slide);return a?iqLabel(a):(lang==='ar'?it.ar:it.t)};
let cmpArea='haem';   // Haematology | Histology switch on the guide page
// panel: kicker ("Standard / Normal"), title with ✓ / ⚠, the slide photo, its name, then the two labelled bullets
function cmpPanel(kind,a,bullets,fallback,alt){
  const C=S().cmp,norm=kind==='norm',labels=norm?[C.shape,C.stain]:[C.shift,C.signif];
  const img=a?`<a class="ph cmpph" href="#/atlas/${a.id}" aria-label="${esc(a.title)}"><img src="${esc(a.f)}" alt="${esc(alt||a.view)}" loading="lazy"></a>`
    :`<div class="ph cmpph cmpnone"><span>${ico('image')}<small>${esc(C.noPhoto)}</small><small dir="ltr" lang="en">${esc(fallback.desc)}</small></span></div>`;
  return `<figure class="cmpfig ${kind}"><figcaption class="cmphead"><span class="cmpkick">${esc(norm?C.stdN:C.stdA)}</span><span class="cmptag">${ico(norm?'check':'warn')}${esc(norm?C.morphN:C.morphA)}</span></figcaption>${img}
<p class="cmpt" dir="ltr" lang="en"><b>${esc(a?iqLabel(a):fallback.t)}</b></p>
<ul class="cmpbul">${bullets.map((b,i)=>`<li><b>${esc(labels[i])}:</b> <span dir="ltr" lang="en">${esc(b)}</span></li>`).join('')}</ul>${a?`<small class="note cmpcred">${esc(a.by)} · ${esc(a.lic)}</small>`:''}</figure>`;
}
function viewCompares(){
  const s=S(),C=s.cmp;
  const row=c=>`<a class="trow card" href="#/compare/${c.id}"><span class="bi">${ico(c.area==='histo'?'scope':'drop')}</span><span class="tt"><b>${esc(cmpName(c))}</b><small>${esc(C.items(c.items.length))}</small></span><span class="go">${ico('next')}</span></a>`;
  return `<a class="back" href="#/atlas">${ico('back')}${esc(s.atlas.h)}</a><div class="pagehead"><span class="picon">${ico('scope')}</span><div><h2>${esc(C.h)}</h2><p>${esc(C.p)}</p></div></div>
<div class="seg cmpseg" role="group" aria-label="${esc(C.h)}"><button type="button" data-carea="haem" aria-pressed="${cmpArea==='haem'}">${esc(C.haem)}</button><button type="button" data-carea="histo" aria-pressed="${cmpArea==='histo'}">${esc(C.histo)}</button></div>
<div class="rows">${COMPARE.filter(c=>c.area===cmpArea).map(row).join('')}</div>`;
}
function bindCompares(){document.querySelectorAll('[data-carea]').forEach(b=>b.onclick=()=>{cmpArea=b.dataset.carea;render()})}
function viewCompare(c){
  const s=S(),C=s.cmp,k=Math.min(CMPS[c.id]||0,c.items.length-1),it=c.items[k],nA=cmpSlide(c.normal),bA=it.slide?cmpSlide(it.slide):null;
  const chips=c.items.length>1?`<div class="chips cmpchips" role="tablist">${c.items.map((x,i)=>`<button type="button" class="chip" role="tab" aria-selected="${i===k}" aria-pressed="${i===k}" data-cmp="${i}">${esc(cmpItemName(x))}</button>`).join('')}</div>`:'';
  const rows=it.rows.map(([fe,fa,n,b])=>`<div class="cmprow"><div class="cmpf"><b>${esc(lang==='ar'?fa:fe)}</b><small ${lang==='ar'?'dir="ltr" lang="en"':'dir="rtl" lang="ar"'}>${esc(lang==='ar'?fe:fa)}</small></div><div class="cmpv norm" dir="ltr" lang="en"><span class="cmpk">${esc(C.normal)}</span>${esc(n)}</div><div class="cmpv abn" dir="ltr" lang="en"><span class="cmpk">${esc(C.abnormal)}</span>${esc(b)}</div></div>`).join('');
  return `<nav class="crumbs"><a href="#/atlas">${esc(s.atlas.h)}</a><span>›</span><a href="#/compare">${esc(C.h)}</a></nav>
<div class="card thead"><div class="t1"><span class="picon">${ico('image')}</span><div><h2>${esc(cmpName(c))}</h2><div class="ar" ${lang==='ar'?'dir="ltr" lang="en"':'dir="rtl" lang="ar"'}>${esc(lang==='ar'?c.t:c.ar)}</div></div></div>${chips}</div>
<div class="cmpgrid">${cmpPanel('norm',nA,c.nb,null,c.normalNote)}${cmpPanel('abn',bA,it.ab,{t:it.t,desc:it.desc})}</div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('search')}${esc(C.diff)}</h3></div><div class="cb cmprows">${rows}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('star')}${esc(C.key)}</h3></div><div class="cb" dir="ltr" lang="en">${keyBox(c.key)}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(s.refs)}</h3></div><div class="cb">${refList(c.ref)}</div></div>`;
}
// "Compare with normal" on an abnormal slide opens its set with that slide selected
document.addEventListener('click',e=>{const a=e.target.closest('[data-cmpgo]');if(!a)return;const id=a.dataset.cmpgo;
  for(const c of COMPARE){const i=c.items.findIndex(x=>x.slide===id);if(i>=0){CMPS[c.id]=i;break}}},true);
function bindCompare(c){
  document.querySelectorAll('[data-cmp]').forEach(b=>b.onclick=()=>{CMPS[c.id]=+b.dataset.cmp;render()});
}
