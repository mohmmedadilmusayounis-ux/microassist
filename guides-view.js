// guides-view.js: Decision guides (data in guides.js). Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Decision guides ---------- */
// per guide: the path of node ids answered so far and the view mode (steps | chart), kept while the app is open
const GS={};
const guideLink=n=>GUIDES.find(g=>g.tests.includes(n));
const gState=g=>GS[g.id]||(GS[g.id]={path:[g.start],mode:'steps'});
function viewGuides(){
  const s=S(),G=s.guide;
  return `<div class="pagehead"><span class="picon">${ico('case')}</span><div><h2>${esc(G.h)}</h2><p>${esc(G.p)}</p></div></div>
<div class="rows">${GUIDES.map(g=>`<a class="trow card" href="#/guide/${g.id}"><span class="bi">${ico(g.ic)}</span><span class="tt"><b dir="ltr" lang="en">${esc(g.t)}</b><small dir="rtl">${esc(g.ar)}</small><small>${esc(G.results(Object.values(g.nodes).filter(n=>n.res).length))}</small></span><span class="go">${ico('next')}</span></a>`).join('')}</div>`;
}
// result card: identification or decision, confirmation steps, notes and linked tests
function guideResult(n){
  const G=S().guide,tl=(n.tests||[]).map(byName).filter(Boolean);
  return `<div class="gres"><b dir="ltr" lang="en">${esc(n.res)}</b><p dir="ltr" lang="en">${esc(n.sum)}</p>${n.confirm&&n.confirm.length?`<div class="pl"><b>${esc(G.confirm)}</b><div dir="ltr" lang="en">${ulist(n.confirm)}</div></div>`:''}${n.note?`<p class="gnote" dir="ltr" lang="en">${ico('warn')}${esc(n.note)}</p>`:''}${tl.length?`<div class="tchips">${tl.map(x=>`<a class="tchip" href="${href(x)}" dir="ltr" lang="en">${esc(x.t[0])}</a>`).join('')}</div>`:''}</div>`;
}
// whole tree as nested lists: every question with each answer leading to its sub-tree or result
function guideChart(g,id,seen=new Set()){
  const n=g.nodes[id];if(!n||seen.has(id))return '';seen.add(id);
  if(n.res)return guideResult(n);
  return `<div class="gq"><p dir="ltr" lang="en"><b>${esc(n.q)}</b></p><ul class="gtree">${n.opts.map(([a,nx])=>`<li><details><summary dir="ltr" lang="en">${esc(a)}</summary>${guideChart(g,nx,seen)}</details></li>`).join('')}</ul></div>`;
}
function viewGuide(g){
  const s=S(),G=s.guide,st=gState(g),cur=g.nodes[st.path[st.path.length-1]];
  const tests=g.tests.map(byName).filter(Boolean);
  const head=`<a class="back" href="#/guide">${ico('back')}${esc(G.h)}</a>
<div class="card thead"><div class="t1"><span class="picon">${ico(g.ic)}</span><div><h2 dir="ltr" lang="en">${esc(g.t)}</h2><div class="ar" dir="rtl">${esc(g.ar)}</div></div></div>
<div class="btns"><div class="seg" role="group" aria-label="${esc(G.h)}"><button type="button" data-gm="steps" aria-pressed="${st.mode==='steps'}">${esc(G.steps)}</button><button type="button" data-gm="chart" aria-pressed="${st.mode==='chart'}">${esc(G.chart)}</button></div><button class="btn" id="printBtn">${ico('print')}${esc(s.print)}</button></div></div>
<p class="note" dir="ltr" lang="en">${esc(g.p)}</p>`;
  let body;
  if(st.mode==='chart'){
    body=`<div class="card"><div class="cb gchart">${guideChart(g,g.start)}</div></div><p class="note">${esc(G.chartHint)}</p>`;
  }else{
    // answers so far, each one a button that returns to that question
    const trail=st.path.slice(0,-1).map((id,k)=>{const n=g.nodes[id],nx=st.path[k+1],a=n.opts.find(o=>o[1]===nx);return `<li><button type="button" class="gback" data-gk="${k}" dir="ltr" lang="en"><span>${esc(n.q)}</span><b>${esc(a?a[0]:'')}</b></button></li>`}).join('');
    body=`${trail?`<ol class="gtrail">${trail}</ol>`:''}<div class="card gcur" aria-live="polite"><div class="cb">${cur.res?`<p class="simstep">${ico('check')}<b>${esc(G.result)}</b></p>${guideResult(cur)}<div class="btns" style="margin-top:12px"><button type="button" class="btn pri" id="gRestart">${esc(G.restart)}</button>${st.path.length>1?`<button type="button" class="btn" id="gUndo">${esc(G.back)}</button>`:''}</div>`
      :`<p class="simstep">${esc(G.q(st.path.length))}</p><h3 dir="ltr" lang="en">${esc(cur.q)}</h3><div class="simopts" dir="ltr" lang="en">${cur.opts.map(([a,nx],k)=>`<button type="button" class="simopt" data-go="${k}">${esc(a)}</button>`).join('')}</div>${cur.tip?`<p class="simfact" dir="ltr" lang="en">${ico('info')}${esc(cur.tip)}</p>`:''}${st.path.length>1?`<div class="btns" style="margin-top:12px"><button type="button" class="btn" id="gUndo">${esc(G.back)}</button><button type="button" class="btn" id="gRestart">${esc(G.restart)}</button></div>`:''}`}</div></div>`;
  }
  return `${head}${body}<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(s.refs)}</h3></div><div class="cb">${tests.length?`<div class="tchips" style="margin-bottom:10px">${tests.map(x=>`<a class="tchip" href="${href(x)}" dir="ltr" lang="en">${esc(x.t[0])}</a>`).join('')}</div>`:''}${eduBadge()}${refList(g.ref)}</div></div>`;
}
function bindGuide(g){
  const st=gState(g),focusQ=()=>{const h=document.querySelector('.gcur h3,.gcur .gres b');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}};
  document.querySelectorAll('[data-gm]').forEach(b=>b.onclick=()=>{st.mode=b.dataset.gm;render()});
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const n=g.nodes[st.path[st.path.length-1]];st.path.push(n.opts[+b.dataset.go][1]);render();focusQ()});
  document.querySelectorAll('[data-gk]').forEach(b=>b.onclick=()=>{st.path=st.path.slice(0,+b.dataset.gk+1);render();focusQ()});
  const u=$('gUndo');if(u)u.onclick=()=>{st.path.pop();render();focusQ()};
  const r=$('gRestart');if(r)r.onclick=()=>{st.path=[g.start];render();focusQ()};
  $('printBtn').onclick=()=>{st.mode='chart';render();document.querySelectorAll('.gchart details').forEach(d=>d.open=true);print()};
}
