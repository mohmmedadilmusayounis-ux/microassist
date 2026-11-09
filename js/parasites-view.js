// parasites-view.js: Parasitology atlas pages (data in parasites.js). Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Parasitology atlas ---------- */
const PARA_TABS=['trem','cest','ova','quiz'];
const paraT=(o,k)=>lang==='ar'&&o[k+'Ar']?o[k+'Ar']:o[k];      // English field or its Arabic twin
const paraSci=p=>`<i dir="ltr" lang="la">${esc(p.n)}</i>`;
const paraLocal=p=>lang==='ar'?p.ar:p.common;
const paraEgg=p=>p.ph.find(x=>x.kind==='egg')||p.ph[0];
const PARA_PH={}; // selected photo per parasite, kept while the app is open
// microscope window: the photo inside a round-cornered stage with the lens vignette (.fig .ph styling)
function paraScope(ph,alt,cls=''){
  return `<figure class="fig parafig ${cls}"><div class="ph paraph"><img src="${esc(ph.f)}" alt="${esc(alt)}"${cls==='main'?' fetchpriority="high"':' loading="lazy"'}></div>
<figcaption class="note"><span dir="ltr" lang="en">${esc(ph.cap)}</span> <small class="paracred">${esc(ph.by)} · ${esc(ph.lic)}</small></figcaption></figure>`;
}
function paraCard(p){
  const ph=paraEgg(p),P=S().para;
  return `<a class="card paracard" href="#/para/${p.id}"><div class="ph paraph sm"><img src="${esc(ph.f)}" alt="${esc(p.n)} – ${esc(ph.kind)}" loading="lazy"><span class="parakind">${esc(P.kind[ph.kind])}</span></div>
<span class="tt"><b>${paraSci(p)}</b><small>${esc(paraLocal(p))}</small><span class="parakey">${esc(paraT(p.egg,'key'))}</span></span></a>`;
}
function paraTable(ps){
  const P=S().para;
  return `<div class="paratbl" role="table" aria-label="${esc(P.table)}"><div class="paratr parath" role="row"><span role="columnheader">${esc(P.parasite)}</span><span role="columnheader">${esc(P.size)}</span><span role="columnheader">${esc(P.key)}</span><span role="columnheader">${esc(P.specimen)}</span></div>
${ps.map(p=>`<a class="paratr" role="row" href="#/para/${p.id}"><span role="cell" data-h="${esc(P.parasite)}">${paraSci(p)}<small>${esc(paraLocal(p))}</small></span><span role="cell" data-h="${esc(P.size)}" dir="ltr">${esc(p.egg.size)}</span><span role="cell" data-h="${esc(P.key)}">${esc(paraT(p.egg,'key'))}</span><span role="cell" data-h="${esc(P.specimen)}">${esc(paraT(p,'specimen'))}</span></a>`).join('')}</div>`;
}
function viewPara(tab){
  const s=S(),P=s.para;
  const tabs=`<div class="seg biotabs paratabs" role="group" aria-label="${esc(P.h)}">${PARA_TABS.map(t=>`<a href="#/para/${t}" aria-current="${t===tab?'page':'false'}">${esc(P.tabs[t])}</a>`).join('')}</div>`;
  let body;
  if(tab==='ova')body=`<p class="note">${esc(P.ovaP)}</p><div class="paragrid">${PARASITES.map(paraCard).join('')}</div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('search')}${esc(P.table)}</h3></div><div class="cb">${paraTable(PARASITES)}</div></div>`;
  else if(tab==='quiz')body=paraQuizView();
  else{const g=PARA_GROUPS.find(x=>x.id===tab),ps=PARASITES.filter(p=>p.grp===tab);
    body=`<h3 class="grp">${ico(g.ic)}${esc(lang==='ar'?g.ar:g.en)} · ${ps.length}</h3><div class="paragrid">${ps.map(paraCard).join('')}</div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('search')}${esc(P.compare)}</h3></div><div class="cb">${paraCompare(ps,tab)}</div></div>`}
  return `<div class="pagehead"><span class="picon">${ico('worm')}</span><div><h2>${esc(P.h)}</h2><p>${esc(P.p)}</p></div></div>${tabs}${body}
<p class="note bioedu">${ico('info')}<span>${esc(P.edu)}</span></p>`;
}
// group comparison: habitat, intermediate host, infective stage and diagnostic specimen side by side
function paraCompare(ps){
  const P=S().para,rows=[[P.habitat,p=>paraT(p,'habitat')],[P.inter,p=>paraT(p.hosts,'inter')],[P.inf,p=>paraT(p.hosts,'inf')],[P.egg,p=>`${p.egg.size} · ${paraT(p.egg,'key')}`]];
  return `<div class="paracmp">${ps.map(p=>`<div class="paracmpc"><a href="#/para/${p.id}"><b>${paraSci(p)}</b></a>${rows.map(([h,f])=>`<div><span class="cmpk">${esc(h)}</span>${esc(f(p))}</div>`).join('')}</div>`).join('')}</div>`;
}
function bindPara(tab){if(tab==='quiz')bindParaQuiz()}

function viewParaOne(p){
  const s=S(),P=s.para,g=PARA_GROUPS.find(x=>x.id===p.grp),k=Math.min(PARA_PH[p.id]||0,p.ph.length-1),ph=p.ph[k];
  const thumbs=p.ph.length>1?`<div class="chips" role="group">${p.ph.map((x,i)=>`<button type="button" class="chip" data-pph="${i}" aria-pressed="${i===k}">${esc(P.kind[x.kind])}</button>`).join('')}</div>`:'';
  const cycle=`<ol class="paracycle">${p.cycle.map((c,i)=>`<li><span class="bnum" aria-hidden="true">${i+1}</span><span dir="ltr" lang="en">${esc(c)}</span></li>`).join('')}</ol>`;
  const hosts=`<div class="parahosts">${[[P.def,'def','body'],[P.inter,'inter','worm'],[P.inf,'inf','warn']].map(([h,key,ic])=>`<div><span class="bi">${ico(ic)}</span><span class="cmpk">${esc(h)}</span><b>${esc(paraT(p.hosts,key))}</b></div>`).join('')}</div>`;
  const egg=`<dl class="biodl paraegg"><dt>${esc(P.size)}</dt><dd dir="ltr">${esc(p.egg.size)}</dd><dt>${esc(P.shape)}</dt><dd dir="ltr" lang="en">${esc(p.egg.shape)}</dd><dt>${esc(P.key)}</dt><dd><b>${esc(paraT(p.egg,'key'))}</b></dd></dl>`;
  return `<nav class="crumbs"><a href="#/para/${p.grp}">${esc(P.h)}</a><span>›</span><span>${esc(lang==='ar'?g.ar:g.en)}</span></nav>
<div class="card thead"><div class="t1"><span class="picon">${ico('worm')}</span><div><h2 class="parah">${paraSci(p)}</h2><div class="ar">${esc(paraLocal(p))} · ${esc(paraT(p,'disease'))}</div></div></div>${thumbs}</div>
${paraScope(ph,`${p.n} – ${ph.kind}`,'main')}
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('scope')}${esc(P.dxStage)}</h3></div><div class="cb">${egg}<p class="note"><b>${esc(P.specimen)}:</b> ${esc(paraT(p,'specimen'))}</p><p class="note"><b>${esc(P.habitat)}:</b> ${esc(paraT(p,'habitat'))}</p></div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('cells')}${esc(P.adult)}</h3></div><div class="cb" dir="ltr" lang="en">${ulist(p.adult)}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('mix')}${esc(P.hosts)}</h3></div><div class="cb">${hosts}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('mix')}${esc(P.cycle)}</h3></div><div class="cb">${cycle}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('pulse')}${esc(P.clinical)}</h3></div><div class="cb" dir="ltr" lang="en">${ulist(p.clinical)}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('flask')}${esc(P.lab)}</h3></div><div class="cb" dir="ltr" lang="en">${keyBox(p.lab)}</div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('swap')}${esc(P.ddx)}</h3></div><div class="cb" dir="ltr" lang="en">${ulist(p.ddx)}</div></div>
${p.atlas?`<div class="btns" style="margin-top:12px"><a class="btn" href="#/atlas/${p.atlas}">${ico('image')}<span>${esc(P.atlasLink)}</span></a></div>`:''}
<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(s.refs)}</h3></div><div class="cb">${refList(p.ref)}</div></div>`;
}
function bindParaOne(p){document.querySelectorAll('[data-pph]').forEach(b=>b.onclick=()=>{PARA_PH[p.id]=+b.dataset.pph;render()})}

/* ---------- "Which parasite?" photo quiz ---------- */
// one item per distinct photo; the shared Taenia egg is answered "Taenia species"
function paraQuizItems(){
  const seen=new Set(),items=[];
  for(const p of PARASITES)for(const ph of p.ph){if(seen.has(ph.f))continue;seen.add(ph.f);
    const taeniaEgg=/taenia-egg/.test(ph.f);items.push({ph,ans:taeniaEgg?'taenia':p.id,label:taeniaEgg?'Taenia sp.':p.n})}
  return items;
}
const paraAnsLabel=id=>id==='taenia'?'Taenia sp.':PARASITES.find(p=>p.id===id).n;
let PQ=null;
function paraQuizStart(){const it=paraQuizItems().sort(()=>Math.random()-.5),answers=[...new Set(it.map(x=>x.ans))];
  PQ={items:it.map(x=>{const pool=answers.filter(id=>id!==x.ans).sort(()=>Math.random()-.5).slice(0,3);
    return{...x,opts:[x.ans,...pool].sort(()=>Math.random()-.5)}}),i:0,score:0,pick:null}}
function paraQuizView(){
  const P=S().para;if(!PQ)paraQuizStart();
  const n=PQ.items.length;
  if(PQ.i>=n){const pc=Math.round(PQ.score/n*100);
    return `<div class="card qbox" style="text-align:center"><div class="note">${esc(P.tabs.quiz)}</div><div class="score">${PQ.score} / ${n}</div><div class="donutw" style="justify-content:center">${donut([{v:PQ.score,c:'var(--ok)'},{v:n-PQ.score,c:'var(--bad)'}],110,pc+'%')}</div><div class="btns" style="justify-content:center;margin-top:12px"><button type="button" class="btn pri" id="pqAgain">${esc(S().again)}</button><a class="btn" href="#/para/ova">${esc(P.tabs.ova)}</a></div></div>`}
  const it=PQ.items[PQ.i],done=PQ.pick!==null;
  const opts=it.opts.map(id=>{const st=done?(id===it.ans?' good':id===PQ.pick?' bad':''):'';return `<button type="button" class="biobin paraopt${st}" data-pq="${id}" ${done?'disabled':''}><i dir="ltr" lang="la">${esc(paraAnsLabel(id))}</i></button>`}).join('');
  const owner=PARASITES.find(p=>p.ph.includes(it.ph));
  const fb=done?`<div class="biofb ${PQ.pick===it.ans?'ok':'no'}" role="status"><b>${ico(PQ.pick===it.ans?'check':'warn')}${esc(PQ.pick===it.ans?P.right:P.wrong)} <i dir="ltr" lang="la">${esc(it.label)}</i></b><p dir="ltr" lang="en">${esc(it.ph.cap)}</p><div class="btns"><button type="button" class="btn pri" id="pqNext">${esc(PQ.i+1<n?P.next:P.finish)}</button><a class="btn" href="#/para/${owner.id}">${esc(P.open)}</a></div></div>`:'';
  return `<div class="card qbox paraquiz"><div class="note">${esc(P.qn(PQ.i+1,n))} · ${esc(P.score(PQ.score))}</div><p class="bioq">${esc(P.quizQ)}</p>
<div class="ph paraph quizph"><img src="${esc(it.ph.f)}" alt="${esc(P.quizAlt)}"></div><small class="paracred">${esc(it.ph.by)} · ${esc(it.ph.lic)}</small>
<div class="biobins paraopts">${opts}</div>${fb}</div>`;
}
function bindParaQuiz(){
  document.querySelectorAll('[data-pq]').forEach(b=>b.onclick=()=>{if(PQ.pick!==null)return;PQ.pick=b.dataset.pq;if(PQ.pick===PQ.items[PQ.i].ans)PQ.score++;render()});
  const nx=$('pqNext');if(nx)nx.onclick=()=>{PQ.i++;PQ.pick=null;render()};
  const ag=$('pqAgain');if(ag)ag.onclick=()=>{paraQuizStart();render()};
}
