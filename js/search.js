// search.js: Clinical search engine and search results page. Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Clinical search engine ---------- */
// normalise case, accents and Arabic diacritics / letter variants so "أنيميا" and "انيميا" match
const norm=s=>String(s).toLowerCase().normalize('NFKD').replace(/[̀-ًͯ-ٰٟ]/g,'').replace(/ة/g,'ه').replace(/ى/g,'ي')
  .replace(/[^\p{L}\p{N}\s-]/gu,' ').replace(/\s+/g,' ').trim();
// short tokens (≤ 3 characters: pt, tb, ihc) match whole words only; longer ones match inside words
const hit=(text,t)=>t.length<=3?(' '+text+' ').replace(/-/g,' ').includes(' '+t+' '):text.includes(t);
const expand=w=>{const out=new Set([w]);for(const[k,l]of Object.entries(SYN)){const all=[k,...l].map(norm);if(all.some(x=>hit(w,x)))all.forEach(x=>out.add(x))}return[...out]};
let SIDX=null;
const searchIndex=()=>SIDX||(SIDX=ALL.map(x=>{const[n,ar,smp,st,rg]=x.t,E=EDU[n]||{},E2=EDU2[n]||{};
  return{x,name:norm(n),ar:norm(ar),body:norm([x.b.en,x.b.ar,smp,st.join(' '),rg.map(r=>r[0]).join(' '),E.p,(E.r||[]).join(' '),(E.q||[]).join(' '),(E.i||[]).join(' '),E2.d,(E2.t||[]).join(' ')].join(' '))}}));
function searchTests(q){
  const w=norm(q);if(!w)return{hits:[],dx:null};
  const dx=DX.find(d=>d.aka.some(a=>hit(w,norm(a))))||null,phrase=expand(w),words=w.split(' ').length>1?w.split(' ').filter(t=>t.length>1).map(expand):[];
  let r=searchIndex().map(d=>{
    let s=0;for(const t of phrase){if(d.name===t)s+=100;else if(hit(d.name,t))s+=40;if(hit(d.ar,t))s+=40;if(hit(d.body,t))s+=8}
    const strong=s>=40;let all=true;
    for(const alts of words){let m=0;for(const t of alts){if(hit(d.name,t)||hit(d.ar,t))m=Math.max(m,12);else if(hit(d.body,t))m=Math.max(m,3)}if(!m)all=false;s+=m}
    if(words.length&&!all&&!strong)s=0;
    const di=dx?dx.tests.indexOf(d.x.t[0]):-1;if(di>=0)s+=60-di;   // curated disease panel keeps its order
    return{x:d.x,s}}).filter(o=>o.s>0).sort((a,b)=>b.s-a.s);
  const top=r.length?r[0].s:0;r=r.filter(o=>o.s>=top*0.25);         // drop weak body-only matches
  return{hits:r.map(o=>o.x),dx};
}
function dxCard(d){
  const s=S(),tests=d.tests.map(byName).filter(Boolean),cs=d.calc.map(id=>CALC_DEF.find(c=>c.id===id)).filter(Boolean);
  return `<div class="card dxcard"><div class="ch"><h3>${ico('case')}${esc(s.dx.h)}: ${esc(lang==='ar'?d.ar:d.k)}</h3></div><div class="cb"><p class="note" style="margin-top:0">${esc(s.dx.note)}</p><ol class="dxl">${tests.map(x=>`<li><a href="${href(x)}" dir="ltr" lang="en">${esc(x.t[0])}</a><small dir="rtl">${esc(x.t[1])}</small></li>`).join('')}</ol>${cs.length?`<div class="btns" style="margin-top:10px">${cs.map(c=>`<a class="btn" href="#/calc/${c.id}">${ico('calc')}<span dir="ltr" lang="en">${esc(c.t)}</span></a>`).join('')}</div>`:''}</div></div>`;
}
function viewSearch(q){
  const s=S(),words=q.split(/\s+/).filter(Boolean),has=t=>{const l=t.toLowerCase();return words.every(w=>l.includes(w))};
  const found=searchTests(q),tests=found.hits;
  const notes=LAB.filter(b=>NOTES[b.id]&&has(NOTES[b.id].pts.join(' ')+' '+b.en+' '+b.ar));
  const qs=MCQ.filter(m=>has(m.q+' '+m.o.join(' ')+' '+m.e));
  const cs=CASES.filter(c=>has(c.t+' '+c.s+' '+JSON.stringify(c.qs)));
  const rf=Object.entries(REFS).filter(([k,r])=>has(r.c));
  // every list field of a slide is optional (e.g. haematology slides have no marker list)
  const sl=ATLAS.filter(a=>has([a.title,a.ar,a.organ,a.stain,a.view,...['key','feat','crit','ddx','mark','pit','teach'].flatMap(k=>a[k]||[])].join(' ')));
  const cl=CALC_DEF.filter(c=>has(c.t+' '+c.ar+' '+c.test+' '+c.f)||found.dx&&found.dx.calc.includes(c.id));
  const pg=[...PRE_TUBES.filter(t=>has([t.name,t.ar,t.capName,t.additive,...t.use,...t.notes].join(' '))).map(t=>({t:t.name,ar:t.ar})),...PRE_ITEMS.filter(i=>has([i.t,i.ar,...i.pts].join(' ')))];
  const ins=INSTR.filter(i=>has([i.name,i.ar,i.short,i.purpose,...i.parts.map(p=>p.n+' '+p.ar)].join(' ')));
  // anatomy: each matching structure opens its diagram with that structure selected
  const an=ANAT.flatMap(d=>d.pins.map((p,k)=>({d,p,k}))).filter(({d,p})=>has([p.n,p.ar,p.d,d.title,d.ar].join(' ')));
  // biosafety: waste streams open the waste guide, protocols open their page (searched in both languages)
  const bio=[...BIO_STREAMS.filter(x=>has([x.n,x.ar,x.colour,x.colourAr,x.label,x.container,...x.examples,...x.examplesAr,...x.treat].join(' '))).map(x=>({h:`#/bio/waste`,ic:x.ic,o:x})),
    ...BIO_PROTO.filter(p=>has([p.t,p.ar,p.urgent,...p.steps.flatMap(x=>[x.t,x.ar,x.d])].join(' '))).map(p=>({h:`#/bio/${p.id}`,ic:p.ic,o:p}))];
  const pa=PARASITES.filter(p=>has([p.n,p.common,p.ar,p.disease,p.diseaseAr,p.egg.key,p.egg.keyAr,p.hosts.inter,p.hosts.interAr,...p.adult,...p.lab].join(' ')));
  // physiology: each matching clinical correlate opens its system page; radiology cases open the imaging guide
  const ph=[...PHYS_SYS.flatMap(y=>y.corr.map(c=>({y,c}))).filter(({y,c})=>has([c.t,c.ar,c.mech,...c.labs,y.en,y.ar].join(' '))).map(({y,c})=>({h:`#/phys/${y.id}`,ic:y.ic,o:c,sub:phName(y)})),
    ...RAD.cases.filter(c=>has([c.t,c.ar,...c.find].join(' '))).map(c=>({h:'#/phys/rad',ic:'image',o:c,sub:S().phys.tabs.rad}))];
  const n=tests.length+notes.length+qs.length+cs.length+rf.length+sl.length+cl.length+pg.length+ins.length+an.length+bio.length+pa.length+ph.length;
  if(!n)return `<div class="card empty">${ico('search')}<span>${esc(s.none)}</span></div>`;
  return `<div class="pagehead"><span class="picon">${ico('search')}</span><div><h2>${esc(s.search)}</h2><p>${esc(s.res(n))}</p></div></div>
${found.dx?dxCard(found.dx):''}
${cl.length?`<h3 class="grp">${esc(s.calc.h)} · ${cl.length}</h3><div class="rows">${cl.map(calcRow).join('')}</div>`:''}
${an.length?`<h3 class="grp">${esc(s.anat.h)} · ${an.length}</h3><div class="rows">${an.slice(0,12).map(({d,p,k})=>`<a class="trow card" href="#/anat/${d.id}" data-anpin="${d.id}:${k}"><span class="bi">${ico('body')}</span><span class="tt"><b>${esc(anName(p))}</b><small>${esc(lang==='ar'?d.ar:d.title)}</small></span><span class="go">${ico('next')}</span></a>`).join('')}</div>`:''}
${ph.length?`<h3 class="grp">${esc(s.phys.h)} · ${ph.length}</h3><div class="rows">${ph.slice(0,12).map(({h,ic,o,sub})=>`<a class="trow card" href="${h}"><span class="bi">${ico(ic)}</span><span class="tt"><b>${esc(phName(o))}</b><small>${esc(sub)}</small></span><span class="go">${ico('next')}</span></a>`).join('')}</div>`:''}
${pa.length?`<h3 class="grp">${esc(s.para.h)} · ${pa.length}</h3><div class="rows">${pa.map(p=>`<a class="trow card" href="#/para/${p.id}"><span class="bi">${ico('worm')}</span><span class="tt"><b>${paraSci(p)}</b><small>${esc(paraLocal(p))}</small></span><span class="go">${ico('next')}</span></a>`).join('')}</div>`:''}
${bio.length?`<h3 class="grp">${esc(s.bio.h)} · ${bio.length}</h3><div class="rows">${bio.map(({h,ic,o})=>`<a class="trow card" href="${h}"><span class="bi">${ico(ic)}</span><span class="tt"><b>${esc(bioName(o))}</b>${bioOther(o)}</span><span class="go">${ico('next')}</span></a>`).join('')}</div>`:''}
${ins.length?`<h3 class="grp">${esc(s.lab3d.h)} · ${ins.length}</h3><div class="rows">${ins.map(instrRow).join('')}</div>`:''}
${pg.length?`<h3 class="grp">${esc(s.pre.h)} · ${pg.length}</h3><div class="rows">${pg.map(p=>`<a class="trow card" href="#/pre" data-preq="${esc(q)}"><span class="bi">${ico('tube')}</span><span class="tt"><b dir="ltr" lang="en">${esc(p.t)}</b><small dir="rtl">${esc(p.ar)}</small></span><span class="go">${ico('next')}</span></a>`).join('')}</div>`:''}
${tests.length?`<h3 class="grp">${esc(s.sTests)} · ${tests.length}</h3><div class="rows">${tests.map(trow).join('')}</div>`:''}
${sl.length?`<h3 class="grp">${esc(s.atlas.h)} · ${sl.length}</h3><div class="rows">${sl.map(a=>`<a class="trow card" href="#/atlas/${a.id}"><span class="bi">${ico('image')}</span><span class="tt"><b dir="ltr">${esc(a.title)}</b><small>${esc(a.stain)} · ${esc(a.organ)}</small></span><span class="go">${ico('next')}</span></a>`).join('')}</div>`:''}
${notes.length?`<h3 class="grp">${esc(s.sTopics)}</h3><div class="rows">${notes.map(b=>`<a class="trow card" href="#/notes/${b.id}"><span class="bi">${ico('notes')}</span><span class="tt"><b>${esc(bName(b))}</b><small>${esc(s.learn.notes)}</small></span></a>`).join('')}</div>`:''}
${cs.length?`<h3 class="grp">${esc(s.sCases)}</h3><div class="rows">${cs.map(c=>`<a class="trow card" href="#/case/${c.id}"><span class="bi">${ico('case')}</span><span class="tt"><b dir="ltr">${esc(c.t)}</b></span></a>`).join('')}</div>`:''}
${qs.length?`<h3 class="grp">${esc(s.sQs)} · ${qs.length}</h3><div class="rows">${qs.slice(0,12).map(m=>`<div class="card qbox" dir="ltr" lang="en"><b>${esc(m.q)}</b><div class="expl"><b>${esc(s.answer)}:</b> ${esc(m.o[m.a])} — ${esc(m.e)}</div></div>`).join('')}</div>`:''}
${rf.length?`<h3 class="grp">${esc(s.sRefs)}</h3><div class="card"><div class="cb"><ol class="refs" dir="ltr">${rf.map(([k,r])=>`<li>${esc(r.c)}</li>`).join('')}</ol></div></div>`:''}`;
}

