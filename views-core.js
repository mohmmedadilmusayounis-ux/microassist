// views-core.js: Home, tests, topic pages, digital atlas, learning centre (quiz, flashcards, cases, notes, refs, saved, about). Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Views ---------- */
let slideI=0;
function viewHome(){
  const s=S(),mx=Math.max(...LAB.map(b=>b.t.length)),v=viewed.filter(n=>byName(n)).length,img=ATLAS[slideI%ATLAS.length];
  const kp=[['grid',LAB.length,s.kpi.b,'#/tests'],['flask',TOTAL,s.kpi.t,'#/tests'],['quiz',MCQ.length,s.kpi.m,'#/learn'],['case',CASES.length,s.kpi.c,'#/cases'],['image',ATLAS.length,s.kpi.i,'#/atlas']];
  const quickNames=['Complete blood count','Blood glucose','Urine general examination','Malaria thick and thin','Haematoxylin and eosin','Papanicolaou','Gram stain','Real-time PCR'];
  const quick=quickNames.map(n=>ALL.find(x=>x.t[0].startsWith(n))).filter(Boolean);
  const qv=qhist.slice(-10).map(h=>Math.round(h.s/h.n*100));
  return `<div class="grid g4" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr))">${kp.map(([k,n,l,h])=>`<a class="card kpi" href="${h}" style="text-decoration:none"><span class="ic">${ico(k)}</span><span><b>${n}</b><span>${esc(l)}</span></span></a>`).join('')}</div>
<div class="grid dash" style="margin-top:16px">
 <div class="card"><div class="ch"><h2>${esc(s.quick)}</h2><a class="more" href="#/tests">${esc(s.all)}</a></div><div class="cb scroll-x"><table class="tbl"><thead><tr><th>${esc(s.test)}</th><th>${esc(s.branch)}</th></tr></thead><tbody>${quick.map(x=>`<tr><td><a href="${href(x)}">${esc(x.t[0].replace(/\s*\(.*\)$/,''))}</a></td><td class="note">${esc(bName(x.b))}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="card"><div class="ch"><h2>${esc(s.slide)}</h2><a class="more" href="#/atlas">${esc(s.atlas.all)}</a></div><div class="cb"><div class="slide" id="dslide"><img src="${esc(img.f)}" alt="${esc(img.title)}"><span class="tag">${esc(img.stain)} · ${esc(img.organ)}</span><div class="nav2"><button type="button" id="sPrev" aria-label="${esc(s.prev)}">${ico('prev')}</button><button type="button" id="sNext" aria-label="${esc(s.next)}">${ico('next')}</button></div></div><p class="cap"><a href="#/atlas/${img.id}" style="font-weight:700;color:var(--pri);text-decoration:none" dir="ltr">${esc(img.title)}</a><small>${esc(img.by)} · ${esc(img.lic)}</small></p></div></div>
</div>
<div class="grid g3" style="margin-top:16px">
 <div class="card"><div class="ch"><h2>${esc(s.quizTrend)}</h2><a class="more" href="#/learn">${esc(s.learn.quiz)}</a></div><div class="cb chart">${qv.length?lineChart(qv.length===1?[qv[0],qv[0]]:qv):`<div class="empty">${ico('quiz')}<span>${esc(s.noQuiz)}</span></div>`}</div></div>
 <div class="card"><div class="ch"><h2>${esc(s.progress)}</h2></div><div class="cb"><div class="donutw">${donut([{v,c:'var(--pri)'},{v:TOTAL-v,c:'var(--pri-bg)'}],120,Math.round(v/TOTAL*100)+'%')}<div class="legend"><span><i style="background:var(--pri)"></i>${esc(s.viewed)} · ${v}</span><span><i style="background:var(--pri-bg)"></i>${esc(s.notYet)} · ${TOTAL-v}</span><span><i style="background:var(--ok)"></i>${esc(s.stSaved)} · ${saved.length}</span></div></div></div></div>
 <div class="card"><div class="ch"><h2>${esc(s.byBranch)}</h2></div><div class="cb bars">${LAB.map(b=>`<a class="bar" href="#/b/${b.id}"><span>${esc(bName(b))}</span><span class="tr"><span class="fl" style="width:${b.t.length/mx*100}%"></span></span><b>${b.t.length}</b></a>`).join('')}</div></div>
</div>`;
}
function bindHome(){
  const go=d=>{slideI=(slideI+d+ATLAS.length)%ATLAS.length;render()};
  $('sPrev').onclick=e=>{e.stopPropagation();go(-1)};$('sNext').onclick=e=>{e.stopPropagation();go(1)};
  $('dslide').onclick=()=>{location.hash='#/atlas/'+ATLAS[slideI%ATLAS.length].id};
}
function viewTests(){
  const s=S();
  return `<div class="pagehead"><span class="picon">${ico('grid')}</span><div><h2>${esc(s.nav.tests)}</h2><p>${esc(s.kpi.b)}: ${LAB.length} · ${esc(s.kpi.t)}: ${TOTAL}</p></div></div>
<div class="grid g3">${LAB.map(b=>`<a class="card bcard" href="#/b/${b.id}"><span class="bi">${ico(BRANCH_IC[b.id])}</span><span><strong>${esc(bName(b))}</strong><small>${esc(bAlt(b))}</small></span><span class="n">${b.t.length}</span></a>`).join('')}</div>`;
}
function viewBranch(b){
  const s=S(),nt=NOTES[b.id];
  return `<a class="back" href="#/tests">${ico('back')}${esc(s.nav.tests)}</a><div class="pagehead"><span class="picon">${ico(BRANCH_IC[b.id])}</span><div><h2>${esc(bName(b))}</h2><p>${esc(bAlt(b))} · ${esc(s.tests(b.t.length))}</p></div><div class="btns" style="margin-inline-start:auto"><a class="btn" href="#/notes/${b.id}">${ico('notes')}${esc(s.learn.notes)}</a><a class="btn pri" href="#/quiz/${b.id}">${ico('quiz')}${esc(s.quizB)}</a></div></div>
<div class="card"><div class="cb scroll-x"><table class="tbl"><thead><tr><th style="width:42%">${esc(s.test)}</th><th>${esc(s.sec.spec)}</th></tr></thead><tbody>${b.t.map((t,i)=>{const x={b,i,t};return `<tr><td><a href="${href(x)}">${esc(t[0])}</a><span class="sub" dir="rtl">${esc(t[1])}</span></td><td class="note" style="min-width:180px">${esc(t[2].length>110?t[2].slice(0,108)+'…':t[2])}</td></tr>`}).join('')}</tbody></table></div></div>
${nt?`<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(s.notesH)}</h3></div><div class="cb"><ul class="ilist">${nt.pts.map(p=>`<li dir="ltr" lang="en">${esc(p)}</li>`).join('')}</ul></div></div>`:''}`;
}
function refList(ids){return `<ol class="refs" dir="ltr" lang="en">${ids.filter(id=>REFS[id]).map(id=>`<li>${esc(REFS[id].c)}${REFS[id].u?` <a href="${esc(REFS[id].u)}" target="_blank" rel="noopener noreferrer">${esc(REFS[id].u)}</a>`:''}</li>`).join('')}</ol>`}
/* ---------- Modular topic page (shared by protocols and atlas slides) ---------- */
// sections render in a fixed order with numbers; empty sections are skipped so numbering stays continuous
function topicPage(head,sections,aside){
  const s=S(),secs=sections.filter(x=>x.html);
  return `${head}
<div class="topic"><div class="tmain">${secs.map((x,i)=>`<section class="card tsec" id="s-${x.id}"><h3><span class="num">${i+1}</span>${ico(x.ic)}${esc(x.h)}</h3><div dir="ltr" lang="en">${x.html}</div></section>`).join('')}</div>
<aside class="taside"><nav class="card toc" aria-label="${esc(s.onPage)}"><div class="toch">${esc(s.onPage)}</div>${secs.map((x,i)=>`<button type="button" class="tocl" data-go="${x.id}"><span>${i+1}</span>${esc(x.h)}</button>`).join('')}</nav>${aside||''}</aside></div>`;
}
function bindToc(){document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const el=$('s-'+b.dataset.go);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})})}
const ulist=(a,cls='')=>a&&a.length?`<ul class="ilist ${cls}">${a.map(y=>`<li>${esc(y)}</li>`).join('')}</ul>`:'';
const keyBox=a=>a&&a.length?`<div class="keybox">${ulist(a)}</div>`:'';
const stepList=st=>`<ol class="steps">${st.map(y=>{const c=stepIcon(y);return `<li><span class="pic">${ico(c)}</span><span class="txt"><span class="tag">${esc(STEP_TAG[lang][c])}</span>${esc(y)}</span></li>`}).join('')}</ol>`;
const rangeTable=rg=>`<table class="tbl rng"><tbody>${rg.map(([p,r,u])=>`<tr><th>${esc(p)}</th><td>${esc(r)}${u?` <span class="u">${esc(u)}</span>`:''}</td></tr>`).join('')}</tbody></table>`;
const eduBadge=()=>`<div class="edubadge">${ico('info')}<span ${lang==='ar'?'dir="rtl" lang="ar"':''}>${esc(S().eduBadge)}</span></div>`;
// Human Protein Atlas–style marker table: marker · expected result · pattern / localisation · use
function markerTable(rows){const m=S().mk;return `<div class="scroll-x"><table class="tbl mkt"><thead><tr><th>${esc(m.m)}</th><th>${esc(m.r)}</th><th>${esc(m.p)}</th><th>${esc(m.u)}</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>`}
const credit=m=>{const s=S();return `${esc(s.photo)}: ${esc(m.by)} · ${esc(s.licence)}: ${esc(m.lic)} · <a href="${esc(m.src)}" target="_blank" rel="noopener noreferrer">${esc(s.source)}</a>`};
const quickFacts=rows=>`<div class="card qf"><div class="toch">${esc(S().quickF)}</div><dl>${rows.filter(r=>r[1]).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl></div>`;

function viewTest(x){
  const s=S(),{b,t}=x,[n,na,smp,st,rg,nt]=t,E=EDU[n]||{},E2=EDU2[n]||{},tb=tubesFor(smp),isS=saved.includes(n),k=ALL.indexOf(x),pv=ALL[k-1],nx=ALL[k+1],imgs=IMG[n]||[],sch=SCHEM[n],al=ATLAS.filter(a=>a.proto===n),res=RESULT_BRANCHES.includes(b.id),cl=CALC_DEF.filter(c=>c.test===n);
  const head=`<nav class="crumbs"><a href="#/tests">${esc(s.nav.tests)}</a><span>›</span><a href="#/b/${b.id}">${esc(bName(b))}</a></nav>
<div class="card thead"><div class="t1"><span class="picon">${ico(BRANCH_IC[b.id])}</span><div><h2 dir="ltr" lang="en">${esc(n)}</h2><div class="ar" dir="rtl">${esc(na)}</div></div></div>
<div class="btns"><button class="btn" id="saveBtn" aria-pressed="${isS}">${ico('star')}<span>${esc(isS?s.savedB:s.save)}</span></button><button class="btn" id="shareBtn">${ico('share')}${esc(s.share)}</button><button class="btn" id="printBtn">${ico('print')}${esc(s.print)}</button>${simLink(n)?`<a class="btn pri" href="#/sim/${simLink(n).id}">${ico('flask')}<span>${esc(s.sim.practise)}</span></a>`:''}${guideLink(n)?`<a class="btn" href="#/guide/${guideLink(n).id}">${ico('case')}<span>${esc(s.guide.open)}</span></a>`:''}</div></div>`;
  const figs=imgs.length||sch||al.length?`${imgs.length||sch?`<div class="figs">${imgs.map((m,j)=>`<figure class="fig"><div class="ph" data-img="${j}"><img src="${esc(m.f)}" alt="${esc(m.cap)}" loading="lazy"></div><figcaption>${esc(m.cap)}<small>${credit(m)}</small></figcaption></figure>`).join('')}${sch?`<figure class="fig">${schematic(sch)}<figcaption>${esc(sch.lab.join(' · '))}<small>${esc(s.schem)}</small></figcaption></figure>`:''}</div>`:''}${al.length?`<h4 class="subh">${esc(s.atlas.inAtlas)}</h4><div class="rows">${al.map(a=>`<a class="trow card" href="#/atlas/${a.id}" style="box-shadow:none"><span class="bi">${ico('scope')}</span><span class="tt"><b>${esc(a.title)}</b><small>${esc(a.organ)}</small></span><span class="go">${ico('next')}</span></a>`).join('')}</div>`:''}`:'';
  const sections=[
    {id:'def',ic:'info',h:s.sec.def,html:E2.d?`<p>${esc(E2.d)}</p>`:''},
    {id:'prin',ic:'flask',h:s.sec.prin,html:E.p?`<p>${esc(E.p)}</p>`:''},
    {id:'spec',ic:'tube',h:s.sec.spec,html:`<div class="sample">${tb.length?`<div class="tubes">${tb.map(([c,l])=>`<span class="tube">${tubeSvg(c)}${esc(l)}</span>`).join('')}</div>`:''}<p>${esc(smp)}</p></div><p style="margin:10px 0 0"><a class="btn" href="#/pre/${b.id}/${x.i}">${ico('tube')}<span ${lang==='ar'?'dir="rtl" lang="ar"':''}>${esc(s.pre.guide)}</span></a></p>`},
    {id:'reag',ic:'flask',h:s.sec.reag,html:ulist(E.r)},
    {id:'proc',ic:'check',h:s.sec.proc,html:stepList(st)},
    {id:'qc',ic:'shield',h:s.sec.qc,html:ulist(E.q)},
    {id:'ref',ic:'grid',h:res?s.sec.res:s.sec.ref,html:eduBadge()+rangeTable(rg)},
    {id:'interp',ic:'doc',h:s.sec.interp,html:ulist(E.i)},
    {id:'trouble',ic:'warn',h:s.sec.trouble,html:ulist(E2.t,'warn')},
    {id:'img',ic:'image',h:s.sec.img,html:figs},
    {id:'notes',ic:'notes',h:s.sec.notes,html:nt?`<p>${esc(nt)}</p>`:''},
    {id:'calc',ic:'calc',h:s.calc.related,html:cl.length?`<div class="rows">${cl.map(calcRow).join('')}</div>`:''},
    {id:'inst',ic:'scope',h:s.lab3d.inTest,html:INSTR.some(i=>i.tests.includes(n))?`<div class="rows">${INSTR.filter(i=>i.tests.includes(n)).map(instrRow).join('')}</div>`:''},
    {id:'cite',ic:'quote',h:s.sec.cite,html:E.ref?refList(E.ref):''}];
  const aside=quickFacts([[s.branch,esc(bName(b))],[s.sec.spec,tb.map(t=>esc(t[1])).join(', ')||'—'],[s.sec.proc,esc(s.steps(st.length))],[s.atlas.h,al.length?String(al.length):''],[s.sec.cite,String((E.ref||[]).length)]]);
  return topicPage(head,sections,aside)+aiPanel(n)+`<div class="pn">${pv?`<a class="card" href="${href(pv)}"><small>${esc(s.prev)}</small><span>${esc(pv.t[0])}</span></a>`:'<span></span>'}${nx?`<a class="card nx" href="${href(nx)}"><small>${esc(s.next)}</small><span>${esc(nx.t[0])}</span></a>`:''}</div>`;
}
function bindTest(x){
  const s=S(),n=x.t[0];
  $('saveBtn').onclick=()=>{saved=saved.includes(n)?saved.filter(y=>y!==n):[n,...saved];store('lg-saved',saved);const on=saved.includes(n);$('saveBtn').setAttribute('aria-pressed',String(on));$('saveBtn').lastChild.textContent=on?s.savedB:s.save};
  $('shareBtn').onclick=async()=>{const data={title:n+' – '+s.short,text:n,url:location.href};try{if(navigator.share){await navigator.share(data);return}await navigator.clipboard.writeText(location.href);toast(s.copied)}catch(e){}};
  $('printBtn').onclick=()=>print();
  bindToc();bindAi();
  document.querySelectorAll('.fig .ph[data-img]').forEach(p=>p.onclick=()=>openLb((IMG[n]||[])[+p.dataset.img]));
}

/* ---------- Digital slide atlas ---------- */
let atlasCat='all';
function viewAtlas(){
  const s=S(),A=s.atlas,cats=ATLAS_CATS.filter(c=>ATLAS.some(a=>a.cat===c)&&(atlasCat==='all'||c===atlasCat));
  const card=a=>`<a class="card fig" href="#/atlas/${a.id}" style="padding:10px;text-decoration:none"><div class="ph"><img src="${esc(a.f)}" alt="${esc(a.title)}" loading="lazy"></div><figcaption><b style="color:var(--text);display:block" dir="ltr">${esc(a.title)}</b><span class="badge b-pri" style="margin-top:6px">${esc(a.stain)}</span> <span class="note">${esc(a.organ)}</span>${a.more&&a.more.length?` <span class="badge b-ok">${a.more.length+1} ${esc(A.imgs)}</span>`:''}</figcaption></a>`;
  return `<div class="pagehead"><span class="picon">${ico('image')}</span><div><h2>${esc(A.h)}</h2><p>${esc(A.p)}</p></div><div class="btns" style="margin-inline-start:auto"><a class="btn" href="#/compare">${ico('image')}<span>${esc(s.cmp.btn)}</span></a><a class="btn pri" href="#/iquiz">${ico('quiz')}<span>${esc(s.iquiz.h)}</span></a></div></div>
<div class="secnav" style="margin-bottom:6px">${['all',...ATLAS_CATS].filter(c=>c==='all'||ATLAS.some(a=>a.cat===c)).map(c=>`<a href="#/atlas" data-cat="${c}" ${c===atlasCat?'style="background:var(--pri);color:var(--on-pri);border-color:var(--pri)"':''}>${esc(A.cats[c])} · ${c==='all'?ATLAS.length:ATLAS.filter(a=>a.cat===c).length}</a>`).join('')}</div>
${cats.map(c=>{const sl=ATLAS.filter(a=>a.cat===c),subs=[...new Set(sl.map(a=>a.sub).filter(Boolean))];
  // slides with a sub-group (haematology: red cells, white cells, platelets, marrow) are listed under small headings
  const grid=l=>`<div class="figs atl">${l.map(card).join('')}</div>`;
  return `<h3 class="grp">${esc(A.cats[c])} · ${sl.length}</h3>${subs.length?[...subs.map(u=>`<h4 class="subh">${esc(A.subs[u])} · ${sl.filter(a=>a.sub===u).length}</h4>${grid(sl.filter(a=>a.sub===u))}`),sl.some(a=>!a.sub)?grid(sl.filter(a=>!a.sub)):''].join(''):grid(sl)}`}).join('')}`;
}
function viewSlide(a){
  const s=S(),A=s.atlas,k=ATLAS.indexOf(a),pv=ATLAS[k-1],nx=ATLAS[k+1],px=byName(a.proto),imgs=[{f:a.f,by:a.by,lic:a.lic,src:a.src},...(a.more||[])];
  const head=`<nav class="crumbs"><a href="#/atlas">${esc(A.h)}</a><span>›</span><a href="#/atlas" data-cat="${a.cat}">${esc(A.cats[a.cat])}</a></nav>
<div class="card thead"><div class="t1"><span class="picon">${ico('image')}</span><div><h2 dir="ltr" lang="en">${esc(a.title)}</h2><div class="ar" dir="rtl">${esc(a.ar)}</div></div></div>
<div class="btns"><span class="badge b-pri">${esc(a.stain)}</span><span class="badge b-ok">${esc(a.organ)}</span><span class="badge b-warn">${esc(A.cats[a.cat])}</span>${(c=>c?`<a class="btn" href="#/compare/${c.id}" data-cmpgo="${esc(a.id)}">${ico('image')}<span>${esc(s.cmp.open)}</span></a>`:'')(COMPARE.find(c=>c.normal===a.id||c.items.some(i=>i.slide===a.id)))}</div></div>
<div class="card viewerc"><div class="viewer" id="vw"><img id="vwImg" src="${esc(imgs[0].f)}" alt="${esc(a.title)}" draggable="false"><div class="vtools"><button type="button" id="vIn" aria-label="${esc(A.zin)}">+</button><button type="button" id="vOut" aria-label="${esc(A.zout)}">−</button><button type="button" id="vReset" aria-label="${esc(A.reset)}">1:1</button><button type="button" id="vFull" aria-label="${esc(A.full)}">⤢</button></div><span class="vzoom" id="vZ">100%</span></div>
${imgs.length>1?`<div class="thumbs">${imgs.map((m,j)=>`<button type="button" class="thumb${j?'':' on'}" data-im="${j}" aria-label="${j+1}"><img src="${esc(m.f)}" alt=""></button>`).join('')}</div>`:''}
<p class="note" style="margin:8px 0 0">${esc(A.hint)}</p><p class="cap" id="vCap" dir="ltr">${imgs[0].cap?esc(imgs[0].cap)+'<br>':''}${credit(imgs[0])}</p></div>`;
  const sections=[
    {id:'key',ic:'star',h:A.key,html:keyBox(a.key)},
    {id:'feat',ic:'search',h:A.feat,html:`<p class="lead">${esc(a.view)}</p>${ulist(a.feat)}`},
    {id:'crit',ic:'check',h:A.crit,html:ulist(a.crit)},
    {id:'method',ic:'stain',h:A.method,html:px?methodBlock(px):''},
    {id:'rep',ic:'doc',h:A.rep,html:ulist(a.rep)},
    {id:'ddx',ic:'warn',h:A.ddx,html:ulist(a.ddx,'warn')},
    {id:'mark',ic:'flask',h:A.mark,html:a.mk&&a.mk.length?markerTable(a.mk):ulist(a.mark)},
    {id:'pit',ic:'warn',h:A.pit,html:ulist(a.pit,'warn')},
    {id:'teach',ic:'cap',h:A.teach,html:ulist(a.teach)},
    {id:'cite',ic:'quote',h:s.sec.cite,html:refList(a.ref)}];
  const aside=quickFacts([[A.organ,esc(a.organ)],[A.stain,esc(a.stain)],[A.cat,esc(A.cats[a.cat])],[A.imgs,String(imgs.length)],[A.method,px?`<a href="${href(px)}">${esc(px.t[0])}</a>`:'']]);
  return topicPage(head,sections,aside)+`<div class="pn">${pv?`<a class="card" href="#/atlas/${pv.id}"><small>${esc(s.prev)}</small><span>${esc(pv.title)}</span></a>`:'<span></span>'}${nx?`<a class="card nx" href="#/atlas/${nx.id}"><small>${esc(s.next)}</small><span>${esc(nx.title)}</span></a>`:''}</div>`;
}
// staining method drawn from the linked protocol: principle, numbered steps and expected results
function methodBlock(x){
  const s=S(),[n,,,st,rg]=x.t,E=EDU[n]||{};
  return `${E.p?`<p><b>${esc(s.sec.prin)}:</b> ${esc(E.p)}</p>`:''}${stepList(st)}<h4 class="subh">${esc(RESULT_BRANCHES.includes(x.b.id)?s.sec.res:s.sec.ref)}</h4>${rangeTable(rg)}<p style="margin:12px 0 0"><a class="btn" href="${href(x)}">${ico('doc')}${esc(s.atlas.fullProto)}</a></p>`;
}
// zoom-and-pan viewer: wheel or buttons to zoom, drag to pan, pinch with two fingers, double-click to toggle
function bindViewer(a){
  const box=$('vw'),img=$('vwImg');if(!box)return;
  let z=1,x=0,y=0;const pts=new Map();let last=null,pinch=0;
  const clamp=()=>{const w=box.clientWidth,h=box.clientHeight;x=Math.min(0,Math.max(w-w*z,x));y=Math.min(0,Math.max(h-h*z,y))};
  const apply=()=>{clamp();img.style.transform=`translate(${x}px,${y}px) scale(${z})`;$('vZ').textContent=Math.round(z*100)+'%';box.style.cursor=z>1?'grab':'zoom-in'};
  const zoomAt=(nz,cx,cy)=>{nz=Math.min(6,Math.max(1,nz));x=cx-(cx-x)*nz/z;y=cy-(cy-y)*nz/z;z=nz;apply()};
  const centre=()=>[box.clientWidth/2,box.clientHeight/2];
  $('vIn').onclick=()=>zoomAt(z*1.5,...centre());$('vOut').onclick=()=>zoomAt(z/1.5,...centre());$('vReset').onclick=()=>{z=1;x=0;y=0;apply()};
  const imgs=[{f:a.f,by:a.by,lic:a.lic,src:a.src},...(a.more||[])];let cur=0;
  $('vFull').onclick=()=>{const m=imgs[cur];openLb({f:m.f,cap:m.cap||a.title,by:m.by,lic:m.lic})};
  // thumbnails switch the image shown in the viewer and reset the zoom
  document.querySelectorAll('.thumb[data-im]').forEach(t=>t.onclick=()=>{cur=+t.dataset.im;const m=imgs[cur];img.src=m.f;z=1;x=0;y=0;apply();
    document.querySelectorAll('.thumb').forEach(o=>o.classList.toggle('on',o===t));$('vCap').innerHTML=(m.cap?esc(m.cap)+'<br>':'')+credit(m)});
  box.addEventListener('wheel',e=>{e.preventDefault();const r=box.getBoundingClientRect();zoomAt(z*(e.deltaY<0?1.2:1/1.2),e.clientX-r.left,e.clientY-r.top)},{passive:false});
  box.addEventListener('dblclick',e=>{const r=box.getBoundingClientRect();zoomAt(z>1?1:2.5,e.clientX-r.left,e.clientY-r.top)});
  box.addEventListener('pointerdown',e=>{if(e.target.closest('.vtools'))return;try{box.setPointerCapture(e.pointerId)}catch(err){}pts.set(e.pointerId,[e.clientX,e.clientY]);last=[e.clientX,e.clientY];if(pts.size===2){const[p,q]=[...pts.values()];pinch=Math.hypot(p[0]-q[0],p[1]-q[1])}});
  box.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===2){const[p,q]=[...pts.values()],d=Math.hypot(p[0]-q[0],p[1]-q[1]),r=box.getBoundingClientRect();if(pinch)zoomAt(z*d/pinch,(p[0]+q[0])/2-r.left,(p[1]+q[1])/2-r.top);pinch=d}
    else if(last&&z>1){x+=e.clientX-last[0];y+=e.clientY-last[1];last=[e.clientX,e.clientY];apply()}});
  const up=e=>{pts.delete(e.pointerId);pinch=0;last=pts.size?[...pts.values()][0]:null};
  box.addEventListener('pointerup',up);box.addEventListener('pointercancel',up);
  apply();
}
function viewLearn(){
  const s=S(),L=s.learn,c=(h,ic,col,t,d)=>`<a class="card lcard" href="${h}"><span class="bi" style="background:${col}">${ico(ic)}</span><strong>${esc(t)}</strong><span>${esc(d)}</span></a>`;
  return `<div class="pagehead"><span class="picon">${ico('cap')}</span><div><h2>${esc(L.h)}</h2><p>${esc(L.p)}</p></div></div>
<div class="grid g3">${c('#/quiz/all','quiz','#1f63c6',L.quiz,L.quizD)}${c('#/iquiz','image','#0e7c86',s.iquiz.h,s.iquiz.d)}${c('#/aquiz','body','#a2406a',s.anat.quiz,s.anat.quizP)}${c('#/exam','timer','#d23f57',L.exam,L.examD(30))}${c('#/flash/all','cards','#22966a',L.flash,L.flashD)}${c('#/cases','case','#c98512',L.cases,L.casesD)}${c('#/notes/gen','notes','#7a5bd6',L.notes,L.notesD)}${c('#/tests','book','#0e8aa8',L.manual,L.manualD)}${c('#/calc','calc','#16489a',s.calc.h,s.calc.p)}${c('#/interp','pulse','#b8324a',s.interp.h,s.interp.p)}${c('#/pre','tube','#2f7d6b',s.pre.h,s.pre.p)}${c('#/lab3d','scope','#5b4bc4',s.lab3d.h,s.lab3d.p)}</div>
<h3 class="grp" style="margin-top:22px">${esc(s.chooseB)}</h3><div class="grid g3">${LAB.map(b=>{const n=MCQ.filter(q=>q.b===b.id).length;return `<div class="card bcard"><span class="bi">${ico(BRANCH_IC[b.id])}</span><span><strong>${esc(bName(b))}</strong><small>${n} MCQ</small></span><span class="btns" style="margin-inline-start:auto"><a class="btn" href="#/flash/${b.id}" title="${esc(L.flash)}">${ico('cards')}</a>${n?`<a class="btn pri" href="#/quiz/${b.id}" title="${esc(L.quiz)}">${ico('quiz')}</a>`:''}</span></div>`}).join('')}</div>`;
}
/* quiz and exam engine */
let QZ=null,examTimer=0;
const shuffle=a=>{const r=a.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r};
function startQuiz(scope,exam){
  const pool=MCQ.filter(q=>scope==='all'||q.b===scope);
  QZ={exam,scope,items:shuffle(pool).slice(0,exam?30:10),i:0,ans:[],done:false,checked:false,end:exam?Date.now()+30*60000:0};
  clearInterval(examTimer);if(exam)examTimer=setInterval(()=>{const el=$('qtime');if(!QZ||!QZ.exam||QZ.done){clearInterval(examTimer);return}const ms=QZ.end-Date.now();if(ms<=0){finishQuiz();return}if(el)el.textContent=fmtMs(ms)},1000);
}
const fmtMs=ms=>{const m=Math.floor(ms/60000),sec=Math.floor(ms%60000/1000);return `${m}:${String(sec).padStart(2,'0')}`};
function finishQuiz(){QZ.done=true;clearInterval(examTimer);const sc=QZ.items.filter((q,i)=>QZ.ans[i]===q.a).length;qhist.push({s:sc,n:QZ.items.length,b:QZ.scope,e:QZ.exam?1:0,at:Date.now()});qhist=qhist.slice(-50);store('lg-quiz',qhist);render()}
function viewQuiz(){
  const s=S(),Q=QZ,L=s.learn;
  if(!Q.items.length)return `<div class="card empty">${ico('quiz')}<span>${esc(s.none)}</span></div>`;
  const title=Q.exam?L.exam:L.quiz+' · '+(Q.scope==='all'?s.allB:bName(BR(Q.scope)));
  if(Q.done){const sc=Q.items.filter((q,i)=>Q.ans[i]===q.a).length,pc=Math.round(sc/Q.items.length*100);
    return `<a class="back" href="#/learn">${ico('back')}${esc(L.h)}</a><div class="card qbox" style="text-align:center"><div class="note">${esc(title)}</div><div class="score">${sc} / ${Q.items.length}</div><div class="donutw" style="justify-content:center">${donut([{v:sc,c:'var(--ok)'},{v:Q.items.length-sc,c:'var(--bad)'}],110,pc+'%')}</div><div class="btns" style="justify-content:center;margin-top:12px"><button class="btn pri" id="againBtn">${esc(s.again)}</button><a class="btn" href="#/learn">${esc(L.h)}</a></div></div>
<h3 class="grp">${esc(s.review)}</h3><div class="rows">${Q.items.map((q,i)=>`<div class="card qbox" dir="ltr" lang="en"><p class="qtext" style="font-size:.95rem">${i+1}. ${esc(q.q)}</p><div class="opts">${q.o.map((o,j)=>`<div class="opt ${j===q.a?'right':Q.ans[i]===j?'wrong':''}"><span class="k">${'ABCD'[j]}</span><span>${esc(o)}</span></div>`).join('')}</div><div class="expl">${esc(q.e)}<small>${q.ref.map(r=>REFS[r]?esc(REFS[r].c.split('.')[0]):'').join(' · ')}</small></div></div>`).join('')}</div>`}
  const q=Q.items[Q.i],a=Q.ans[Q.i],chk=Q.checked&&!Q.exam;
  return `<a class="back" href="#/learn">${ico('back')}${esc(L.h)}</a><div class="card qbox"><div class="qmeta"><span>${esc(title)}</span><span>${Q.exam?`${esc(s.timeLeft)}: <span class="timer" id="qtime">${fmtMs(Q.end-Date.now())}</span> · `:''}${esc(s.question(Q.i+1,Q.items.length))}</span></div><div class="prog"><i style="width:${(Q.i)/Q.items.length*100}%"></i></div>
<div dir="ltr" lang="en"><p class="qtext">${esc(q.q)}</p><div class="opts">${q.o.map((o,j)=>`<button type="button" class="opt ${chk?(j===q.a?'right':a===j?'wrong':''):a===j?'sel':''}" data-o="${j}" ${chk?'disabled':''}><span class="k">${'ABCD'[j]}</span><span>${esc(o)}</span></button>`).join('')}</div>
${chk?`<div class="expl"><b>${esc(a===q.a?s.correct:s.wrong)}.</b> ${esc(q.e)}<small>${esc(s.refs)}: ${q.ref.map(r=>REFS[r]?esc(REFS[r].c.split('.')[0]):'').join(' · ')}</small></div>`:''}</div>
<div class="btns" style="margin-top:14px;justify-content:flex-end">${Q.exam?`${Q.i>0?`<button class="btn" id="qPrev">${esc(s.prev)}</button>`:''}${Q.i<Q.items.length-1?`<button class="btn pri" id="qNext">${esc(s.nextQ)}</button>`:`<button class="btn pri" id="qFin">${esc(s.submit)}</button>`}`:chk?(Q.i<Q.items.length-1?`<button class="btn pri" id="qNext">${esc(s.nextQ)}</button>`:`<button class="btn pri" id="qFin">${esc(s.finish)}</button>`):`<button class="btn pri" id="qChk" ${a==null?'disabled':''}>${esc(s.check)}</button>`}</div></div>`;
}
function bindQuiz(){
  const Q=QZ;if(!Q)return;
  if(Q.done){const b=$('againBtn');if(b)b.onclick=()=>{startQuiz(Q.scope,Q.exam);render()};return}
  document.querySelectorAll('.opt[data-o]').forEach(b=>b.onclick=()=>{Q.ans[Q.i]=+b.dataset.o;render()});
  const on=(id,f)=>{const e=$(id);if(e)e.onclick=f};
  on('qChk',()=>{Q.checked=true;render()});
  on('qNext',()=>{Q.i++;Q.checked=false;render();scrollTo({top:0})});
  on('qPrev',()=>{Q.i--;render()});
  on('qFin',finishQuiz);
}
/* flashcards */
let FC=null;
function deck(scope){
  const auto=ALL.filter(x=>EDU[x.t[0]]&&EDU[x.t[0]].p&&(scope==='all'||x.b.id===scope)).map(x=>({b:x.b.id,f:'Principle: '+x.t[0],k:EDU[x.t[0]].p}));
  return FLASH.filter(c=>scope==='all'||c.b===scope).concat(auto);
}
function viewFlash(){
  const s=S(),F=FC,c=F.cards[F.i];
  if(!c)return `<div class="card empty">${ico('cards')}<span>${esc(s.none)}</span></div>`;
  return `<a class="back" href="#/learn">${ico('back')}${esc(s.learn.h)}</a><div class="pagehead"><span class="picon" style="background:#22966a">${ico('cards')}</span><div><h2>${esc(s.learn.flash)}</h2><p>${esc(F.scope==='all'?s.allB:bName(BR(F.scope)))} · ${esc(s.card(F.i+1,F.cards.length))}</p></div></div>
<div class="flash ${F.flip?'flip':''}" id="fcard" dir="ltr" lang="en"><div class="in"><div class="fc"><div><small>${esc(s.front)}</small>${esc(c.f)}</div></div><div class="fc b"><div><small>${esc(s.backS)}</small>${esc(c.k)}</div></div></div></div>
<p class="note" style="text-align:center">${esc(s.flip)}</p><div class="btns" style="justify-content:center"><button class="btn" id="fPrev">${ico('prev')}${esc(s.prev)}</button><button class="btn" id="fShuf">${esc(s.shuffle)}</button><button class="btn pri" id="fNext">${esc(s.next)}${ico('next')}</button></div>`;
}
function bindFlash(){
  const F=FC;if(!F||!F.cards.length)return;
  $('fcard').onclick=()=>{F.flip=!F.flip;$('fcard').classList.toggle('flip',F.flip)};
  $('fPrev').onclick=()=>{F.i=(F.i-1+F.cards.length)%F.cards.length;F.flip=false;render()};
  $('fNext').onclick=()=>{F.i=(F.i+1)%F.cards.length;F.flip=false;render()};
  $('fShuf').onclick=()=>{F.cards=shuffle(F.cards);F.i=0;F.flip=false;render()};
}
/* cases */
let CS=null;
function viewCases(){
  const s=S();
  return `<a class="back" href="#/learn">${ico('back')}${esc(s.learn.h)}</a><div class="pagehead"><span class="picon" style="background:#c98512">${ico('case')}</span><div><h2>${esc(s.learn.cases)}</h2><p>${esc(s.learn.casesD)}</p></div></div><div class="rows">${CASES.map(c=>`<a class="trow card" href="#/case/${c.id}"><span class="bi">${ico(BRANCH_IC[c.b])}</span><span class="tt"><b dir="ltr" lang="en">${esc(c.t)}</b><small>${esc(bName(BR(c.b)))} · ${c.steps?`${esc(s.cv2.work)} · ${c.steps.length}`:`${c.qs.length} MCQ`}</small></span><span class="go">${ico('next')}</span></a>`).join('')}</div>`;
}
function viewCase(c){
  const s=S();if(!CS||CS.id!==c.id)CS={id:c.id,ans:[]};
  if(c.steps)return viewCaseV2(c);
  return `<a class="back" href="#/cases">${ico('back')}${esc(s.learn.cases)}</a><div class="card qbox" dir="ltr" lang="en"><div class="qmeta"><span>${esc(bName(BR(c.b)))}</span></div><h2 style="margin:0 0 8px;font-size:1.2rem">${esc(c.t)}</h2><p>${esc(c.s)}</p>
<h4 style="margin:14px 0 6px">${esc(s.caseData)}</h4><table class="tbl" style="max-width:520px"><tbody>${c.data.map(([k,v])=>`<tr><th style="text-transform:none;font-size:.86rem;color:var(--muted)">${esc(k)}</th><td><b>${esc(v)}</b></td></tr>`).join('')}</tbody></table></div>
${c.qs.map((q,i)=>{const a=CS.ans[i];return `<div class="card qbox" style="margin-top:12px" dir="ltr" lang="en"><p class="qtext">${i+1}. ${esc(q.q)}</p><div class="opts">${q.o.map((o,j)=>`<button type="button" class="opt ${a!=null?(j===q.a?'right':a===j?'wrong':''):''}" data-q="${i}" data-o="${j}" ${a!=null?'disabled':''}><span class="k">${'ABCD'[j]}</span><span>${esc(o)}</span></button>`).join('')}</div>${a!=null?`<div class="expl"><b>${esc(a===q.a?s.correct:s.wrong)}.</b> ${esc(q.e)}</div>`:''}</div>`}).join('')}
<div class="card" style="margin-top:12px"><div class="ch"><h3>${esc(s.refs)}</h3></div><div class="cb">${refList(c.ref)}</div></div>`;
}
function bindCase(c){
  document.querySelectorAll('.opt[data-q]').forEach(b=>b.onclick=()=>{CS.ans[+b.dataset.q]=+b.dataset.o;const y=scrollY;render();scrollTo({top:y})});
  const media=(c.media||[]).map(caseMedia);
  document.querySelectorAll('[data-cm]').forEach(p=>p.onclick=()=>openLb(media[+p.dataset.cm]));
}
function viewNotes(b){
  const s=S(),n=NOTES[b.id];
  return `<a class="back" href="#/learn">${ico('back')}${esc(s.learn.h)}</a><div class="pagehead"><span class="picon" style="background:#7a5bd6">${ico('notes')}</span><div><h2>${esc(s.learn.notes)} · ${esc(bName(b))}</h2><p>${esc(bAlt(b))}</p></div></div>
<div class="secnav" style="margin-bottom:14px">${LAB.map(x=>`<a href="#/notes/${x.id}" ${x.id===b.id?'style="background:var(--pri);color:#fff;border-color:var(--pri)"':''}>${esc(bName(x))}</a>`).join('')}</div>
<div class="grid g2"><div class="card"><div class="ch"><h3>${esc(s.notesH)}</h3></div><div class="cb" dir="ltr" lang="en">${n?`<ul class="ilist">${n.pts.map(p=>`<li>${esc(p)}</li>`).join('')}</ul><div style="margin-top:14px">${refList(n.ref)}</div>`:''}</div></div>
<div class="card"><div class="ch"><h3>${esc(s.manualH)}</h3><a class="more" href="#/quiz/${b.id}">${esc(s.quizB)}</a></div><div class="cb rows">${b.t.map((t,i)=>trow({b,i,t})).join('')}</div></div></div>`;
}
function viewRefs(){
  const s=S(),q=($('refq')&&$('refq').value||'').toLowerCase();
  const cite={};for(const[n,e]of Object.entries(EDU))(e.ref||[]).forEach(r=>cite[r]=(cite[r]||0)+1);MCQ.forEach(m=>m.ref.forEach(r=>cite[r]=(cite[r]||0)+1));
  const ids=Object.keys(REFS).sort((a,b)=>REFS[a].c.localeCompare(REFS[b].c));
  return `<div class="pagehead"><span class="picon">${ico('quote')}</span><div><h2>${esc(s.refsH)}</h2><p>${esc(s.refsP)}</p></div></div><div class="card"><div class="cb"><ol class="refs" dir="ltr" lang="en">${ids.map(id=>`<li>${esc(REFS[id].c)}${REFS[id].u?` <a href="${esc(REFS[id].u)}" target="_blank" rel="noopener noreferrer">${esc(REFS[id].u)}</a>`:''} <span class="badge b-pri" style="margin-inline-start:4px">${esc(s.citedBy(cite[id]||0))}</span></li>`).join('')}</ol></div></div>`;
}
function viewSaved(){
  const s=S(),l=saved.map(byName).filter(Boolean);
  return `<div class="pagehead"><span class="picon">${ico('star')}</span><div><h2>${esc(s.savedH)}</h2><p>${esc(s.res(l.length))}</p></div></div>`+(l.length?`<div class="rows">${l.map(trow).join('')}</div>`:`<div class="card empty">${ico('star')}<span>${esc(s.emptySaved)}</span></div>`);
}
function viewAbout(){
  const s=S(),c=(h,p)=>`<div class="card" style="margin-top:14px"><div class="ch"><h3>${esc(h)}</h3></div><div class="cb"><p style="margin:0">${esc(p)}</p></div></div>`;
  return `<div class="card about"><span class="mono">MA</span><div><h2>${esc(s.name)}</h2><p>${esc(s.cred)}</p></div></div>${c(s.aboutH,s.aboutP)}${c(s.disclaimerH,s.disclaimer)}${c(s.imgH,s.imgP)}${c(s.installH,s.install)}
<div class="grid g3" style="margin-top:14px"><a class="card bcard" href="#/calc"><span class="bi">${ico('calc')}</span><strong>${esc(s.calc.h)}</strong></a><a class="card bcard" href="#/interp"><span class="bi">${ico('pulse')}</span><strong>${esc(s.interp.h)}</strong></a><a class="card bcard" href="#/pre"><span class="bi">${ico('tube')}</span><strong>${esc(s.pre.h)}</strong></a><a class="card bcard" href="#/lab3d"><span class="bi">${ico('scope')}</span><strong>${esc(s.lab3d.h)}</strong></a><a class="card bcard" href="#/sim"><span class="bi">${ico('flask')}</span><strong>${esc(s.sim.h)}</strong></a><a class="card bcard" href="#/guide"><span class="bi">${ico('case')}</span><strong>${esc(s.guide.h)}</strong></a><a class="card bcard" href="#/anat"><span class="bi">${ico('body')}</span><strong>${esc(s.anat.h)}</strong></a><a class="card bcard" href="#/phys"><span class="bi">${ico('pulse')}</span><strong>${esc(s.phys.h)}</strong></a><a class="card bcard" href="#/para"><span class="bi">${ico('worm')}</span><strong>${esc(s.para.h)}</strong></a><a class="card bcard" href="#/bio"><span class="bi">${ico('shield')}</span><strong>${esc(s.bio.h)}</strong></a><a class="card bcard" href="#/refs"><span class="bi">${ico('quote')}</span><strong>${esc(s.nav.refs)}</strong></a><a class="card bcard" href="#/atlas"><span class="bi">${ico('image')}</span><strong>${esc(s.atlas.h)}</strong></a><a class="card bcard" href="#/saved"><span class="bi">${ico('star')}</span><strong>${esc(s.nav.saved)}</strong></a></div>`;
}
