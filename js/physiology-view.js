// physiology-view.js: Physiology & pathophysiology, histology reading guide and radiology guide (data in physiology.js). Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Physiology and image interpretation ---------- */
const PHYS_TABS=['sys','histo','rad'];
const phT=(o,k)=>lang==='ar'&&o[k+'Ar']?o[k+'Ar']:o[k];
const phName=o=>lang==='ar'?o.ar:(o.en||o.t);
const phOther=o=>lang==='ar'?`<small dir="ltr" lang="en">${esc(o.en||o.t)}</small>`:`<small dir="rtl" lang="ar">${esc(o.ar)}</small>`;
const radCase=id=>RAD.cases.find(c=>c.id===id);
let RADM='all';   // modality filter for the radiology image cases
function phTabs(tab){const P=S().phys;return `<div class="seg biotabs" role="group" aria-label="${esc(P.h)}">${PHYS_TABS.map(t=>`<a href="#/phys/${t}" aria-current="${t===tab?'page':'false'}">${esc(P.tabs[t])}</a>`).join('')}</div>`}
function phHead(){const P=S().phys;return `<div class="pagehead"><span class="picon">${ico('pulse')}</span><div><h2>${esc(P.h)}</h2><p>${esc(P.p)}</p></div></div>`}
// radiology image in a dark viewing window with the lens vignette
function radFig(c,cls=''){
  return `<figure class="fig radfig ${cls}"><div class="ph paraph radph"><img src="${esc(c.f)}" alt="${esc(c.t)}" loading="lazy"><span class="parakind">${esc(S().phys.mod[c.mod])}</span></div>
<figcaption><b>${esc(phName(c))}</b>${phOther(c)}<small class="paracred">${esc(c.by)} · ${esc(c.lic)}</small></figcaption></figure>`;
}
function viewPhys(tab){
  const P=S().phys;
  let body;
  if(tab==='histo')body=phHistoView();
  else if(tab==='rad')body=phRadView();
  else body=`<div class="grid g2 physgrid">${PHYS_SYS.map(y=>`<a class="card physcard" href="#/phys/${y.id}"><span class="bi">${ico(y.ic)}</span><span class="tt"><b>${esc(phName(y))}</b>${phOther(y)}<span class="note">${esc(phT(y,'intro'))}</span><span class="physcount">${esc(P.nCorr(y.corr.length))}</span></span><span class="go">${ico('next')}</span></a>`).join('')}</div>`;
  return `${phHead()}${phTabs(tab)}${body}<p class="note bioedu">${ico('info')}<span>${esc(P.edu)}</span></p>`;
}
function bindPhys(tab){if(tab==='rad')document.querySelectorAll('[data-radm]').forEach(b=>b.onclick=()=>{RADM=b.dataset.radm;render()})}

function viewPhysOne(y){
  const s=S(),P=s.phys;
  const anat=y.anat.map(id=>ANAT.find(d=>d.id===id)).filter(Boolean).map(d=>`<a class="btn" href="#/anat/${d.id}">${ico('body')}<span>${esc(lang==='ar'?d.ar:d.title)}</span></a>`).join('');
  const core=`<div class="physcore">${y.core.map(c=>`<div class="physc"><b>${esc(phT(c,'h'))}</b>${lang==='ar'?`<small dir="ltr" lang="en">${esc(c.h)}</small>`:''}<p dir="ltr" lang="en">${esc(c.d)}</p></div>`).join('')}</div>`;
  const corr=y.corr.map(c=>{const tests=c.tests.map(byName).filter(Boolean),calcs=c.calc.map(id=>CALC_DEF.find(x=>x.id===id)).filter(Boolean),img=c.img&&radCase(c.img);
    return `<article class="card physcorr" id="pc-${c.id}"><div class="ch"><h3>${ico('pulse')}<span>${esc(phName(c))}</span></h3></div><div class="cb">${phOther(c)}
<h4>${esc(P.mech)}</h4><p dir="ltr" lang="en">${esc(c.mech)}</p>
<h4>${esc(P.labs)}</h4><div dir="ltr" lang="en">${keyBox(c.labs)}</div>
${tests.length?`<h4>${esc(P.tests)}</h4><div class="rows">${tests.map(trow).join('')}</div>`:''}
${calcs.length?`<h4>${esc(P.calcs)}</h4><div class="btns">${calcs.map(x=>`<a class="btn" href="#/calc/${x.id}">${ico('calc')}<span>${esc(lang==='ar'?x.ar:x.t)}</span></a>`).join('')}</div>`:''}
${img?`<h4>${esc(P.imaging)}</h4>${radFig(img,'inline')}<div class="btns"><a class="btn" href="#/phys/rad">${ico('image')}<span>${esc(P.tabs.rad)}</span></a></div>`:''}</div></article>`}).join('');
  return `<nav class="crumbs"><a href="#/phys/sys">${esc(P.h)}</a><span>›</span><span>${esc(P.tabs.sys)}</span></nav>
<div class="card thead"><div class="t1"><span class="picon">${ico(y.ic)}</span><div><h2>${esc(phName(y))}</h2><div class="ar" ${lang==='ar'?'dir="ltr" lang="en"':'dir="rtl" lang="ar"'}>${esc(lang==='ar'?y.en:y.ar)}</div></div></div><p class="physintro">${esc(phT(y,'intro'))}</p>${anat?`<div class="btns">${anat}</div>`:''}</div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('heart')}${esc(P.core)}</h3></div><div class="cb">${core}</div></div>
<h3 class="grp">${ico('pulse')}${esc(P.corr)} · ${y.corr.length}</h3>${corr}
<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(s.refs)}</h3></div><div class="cb">${refList(y.ref)}</div></div>`;
}

function phHistoView(){
  const P=S().phys,G=HISTO_GUIDE;
  const steps=`<ol class="paracycle">${G.steps.map((x,i)=>`<li><span class="bnum" aria-hidden="true">${i+1}</span><span class="tt"><b>${esc(lang==='ar'?x.ar:x.t)}</b><span class="biod" dir="ltr" lang="en">${esc(x.d)}</span></span></li>`).join('')}</ol>`;
  const sets=G.sets.map(st=>{const sl=st.slides.map(id=>ATLAS.find(a=>a.id===id)).filter(Boolean);
    return `<h4 class="physseth">${esc(lang==='ar'?st.ar:st.t)}</h4><div class="physslides">${sl.map(a=>`<a class="physslide" href="#/atlas/${a.id}"><span class="ph paraph sm"><img src="${esc(a.f)}" alt="${esc(a.title)}" loading="lazy"></span><b dir="ltr" lang="en">${esc(a.title)}</b><small>${esc(a.stain)}</small></a>`).join('')}</div>`}).join('');
  return `<div class="card"><div class="ch"><h3>${ico('scope')}${esc(P.histoSteps)}</h3></div><div class="cb">${steps}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('warn')}${esc(P.malig)}</h3></div><div class="cb" dir="ltr" lang="en">${keyBox(G.malig)}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('image')}${esc(P.practise)}</h3></div><div class="cb">${sets}<div class="btns" style="margin-top:12px"><a class="btn pri" href="#/compare">${ico('swap')}<span>${esc(S().cmp.h)}</span></a><a class="btn" href="#/atlas">${ico('image')}<span>${esc(S().atlas.h)}</span></a></div></div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(S().refs)}</h3></div><div class="cb">${refList(G.ref)}</div></div>`;
}

function phRadView(){
  const P=S().phys,R=RAD;
  const mods=`<div class="physcore">${R.mods.map(m=>`<div class="physc"><b>${ico(m.ic)} ${esc(lang==='ar'?m.ar:m.t)}</b><p dir="ltr" lang="en">${esc(m.how)}</p><div dir="ltr" lang="en">${ulist(m.pts)}</div></div>`).join('')}</div>`;
  const dens=`<div class="raddens" role="img" aria-label="${esc(P.densAria)}">${P.dens.map((d,i)=>`<span style="--d:${i}"><i></i>${esc(d)}</span>`).join('')}</div>`;
  const hu=`<div class="radhu">${R.hu.map(([e,a,v],i)=>`<div class="radhur" style="--i:${i}"><span class="radsw" aria-hidden="true"></span><b>${esc(lang==='ar'?a:e)}</b><span dir="ltr">${esc(v)}</span></div>`).join('')}</div>`;
  const mri=`<div class="paratbl"><div class="paratr parath radmri"><span>${esc(P.tissue)}</span><span>T1</span><span>T2</span></div>${R.mri.map(([e,a,t1,t2])=>`<div class="paratr radmri"><span data-h="${esc(P.tissue)}">${esc(lang==='ar'?a:e)}</span><span data-h="T1" dir="ltr" lang="en">${esc(t1)}</span><span data-h="T2" dir="ltr" lang="en">${esc(t2)}</span></div>`).join('')}</div>`;
  const letters=xs=>`<ol class="radabc">${xs.map(x=>`<li><span class="radk" dir="ltr">${esc(x.k)}</span><span class="tt"><b>${esc(lang==='ar'?x.ar:x.t)}</b><span class="biod" dir="ltr" lang="en">${esc(x.d)}</span></span></li>`).join('')}</ol>`;
  const shown=R.cases.filter(c=>RADM==='all'||c.mod===RADM);
  const chips=`<div class="chips" role="group" aria-label="${esc(P.casesH)}">${['all',...new Set(R.cases.map(c=>c.mod))].map(m=>`<button type="button" class="chip" data-radm="${m}" aria-pressed="${RADM===m}">${esc(m==='all'?P.all:P.mod[m])}</button>`).join('')}</div>`;
  const cases=`<div class="radcases">${shown.map(c=>{const sys=c.link&&PHYS_SYS.find(y=>y.id===c.link);
    return `<div class="card radcase" id="${c.id}">${radFig(c)}<div class="cb"><h4>${esc(P.find)}</h4><div dir="ltr" lang="en">${ulist(c.find)}</div>${sys?`<a class="btn" href="#/phys/${sys.id}">${ico(sys.ic)}<span>${esc(phName(sys))}</span></a>`:''}</div></div>`}).join('')}</div>`;
  return `<div class="card"><div class="ch"><h3>${ico('image')}${esc(P.modsH)}</h3></div><div class="cb">${mods}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('contrast')}${esc(P.densH)}</h3></div><div class="cb">${dens}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('spin')}${esc(P.huH)}</h3></div><div class="cb">${eduBadge()}${hu}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('gland')}${esc(P.mriH)}</h3></div><div class="cb">${mri}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('check')}${esc(P.cxrH)}</h3></div><div class="cb"><h4>${esc(P.ripe)}</h4>${letters(R.cxr.ripe)}<h4>${esc(P.abcde)}</h4>${letters(R.cxr.abcde)}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('check')}${esc(P.ctH)}</h3></div><div class="cb">${letters(R.cthead)}</div></div>
<h3 class="grp">${ico('image')}${esc(P.casesH)} · ${shown.length}</h3>${chips}${cases}
<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(S().refs)}</h3></div><div class="cb">${refList(R.ref)}</div></div>`;
}
