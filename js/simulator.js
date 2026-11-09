// simulator.js: Staining and processing simulator (data in sim.js). Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Staining simulator ---------- */
// one run at a time, kept while the app is open; best scores per simulation in localStorage
let SM=null;
let simBest=load('lg-sim',{});
const simLink=n=>SIMS.find(x=>x.tests.includes(n));
// shuffled option order for a question whose FIRST option is correct
const simOrder=n=>shuffle([...Array(n).keys()]);
function simStart(sm){
  SM={id:sm.id,i:0,ord:simOrder(sm.steps[0].o.length),tried:[],firstOK:0,done:false,phase:'steps',fi:0,ford:simOrder(sm.faults[0].o.length),fpick:null,fOK:0,t0:Date.now(),t1:0};
}
/* picture of the current state: drawn, not a photograph */
const SIM_VIS={
  fresh:{form:'piece',t:'#d96b7d'},fixed:{form:'piece',t:'#c9a49c'},cassette:{form:'cassette',t:'#c9a49c'},block:{form:'block',t:'#d9b8a8'},
  ribbon:{form:'ribbon',t:'#e8d8c8'},slide:{form:'slide',cy:'#f1ece6',nu:'#e2dbd3'},
  wax:{form:'slide',cy:'#f7f3ea',nu:'#f7f3ea',wax:1},clear:{form:'slide',cy:'#f1ece6',nu:'#e2dbd3'},water:{form:'slide',cy:'#eef0f4',nu:'#dcdfe6'},
  haem:{form:'slide',cy:'#9a72b8',nu:'#4a2a7a'},diff:{form:'slide',cy:'#eee0ea',nu:'#8a3a6a'},blue:{form:'slide',cy:'#f1eff7',nu:'#2f3f9a'},
  eosin:{form:'slide',cy:'#f2a7c3',nu:'#3b3a8c'},silver:{form:'slide',cy:'#eef0f4',nu:'#dcdfe6',x:'#151515'},vk:{form:'slide',cy:'#f6d3df',nu:'#c73b55',x:'#151515'}
};
function simVis(v){
  const s=SIM_VIS[v]||SIM_VIS.slide,o=[];let seed=11;const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
  if(s.form==='piece')o.push(`<path d="M70 95 C 60 60, 110 38, 150 48 C 195 56, 205 92, 178 112 C 150 132, 88 128, 70 95 Z" fill="${s.t}" stroke="#00000022"/>`);
  if(s.form==='cassette')o.push(`<rect x="62" y="30" width="136" height="92" rx="8" fill="#e9eef6" stroke="#8a96ab"/>${[0,1,2,3,4,5].map(k=>`<rect x="${74+k*20}" y="40" width="10" height="72" rx="3" fill="#cfd8e6"/>`).join('')}<path d="M95 70 C 92 55, 130 50, 150 60 C 168 70, 160 95, 135 98 C 110 100, 98 88, 95 70 Z" fill="${s.t}"/>`);
  if(s.form==='block')o.push(`<rect x="70" y="34" width="120" height="84" rx="4" fill="#f6efd9" stroke="#c8b98a"/><path d="M98 68 C 96 54, 134 48, 152 58 C 168 68, 160 92, 134 94 C 110 96, 100 84, 98 68 Z" fill="${s.t}" opacity=".85"/>`);
  if(s.form==='ribbon')o.push(`<rect x="0" y="80" width="260" height="70" fill="#cfe3f5"/>${[0,1,2,3].map(k=>`<rect x="${22+k*56}" y="66" width="54" height="30" fill="#f6efd9" stroke="#c8b98a"/><ellipse cx="${49+k*56}" cy="81" rx="16" ry="9" fill="${s.t}"/>`).join('')}`);
  if(s.form==='slide'){
    o.push(`<rect x="14" y="36" width="232" height="80" rx="4" fill="#eef6fb" stroke="#9fb6c8"/><rect x="18" y="40" width="46" height="72" rx="2" fill="#dfe7ef"/>`);
    o.push(`<ellipse cx="160" cy="76" rx="70" ry="32" fill="${s.cy}" stroke="${s.wax?'#d8cfb8':'#00000014'}"/>`);
    for(let k=0;k<22;k++){const a=rnd()*Math.PI*2,r=Math.sqrt(rnd()),x=160+Math.cos(a)*r*60,y=76+Math.sin(a)*r*25;o.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="${s.nu}"/>`)}
    if(s.x)for(let k=0;k<7;k++){const x=118+rnd()*86,y=58+rnd()*36;o.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(3+rnd()*4).toFixed(1)}" fill="${s.x}"/>`)}
  }
  return `<svg class="simvis" viewBox="0 0 260 150" role="img" aria-label="${esc(S().sim.schem)}"><rect width="260" height="150" fill="var(--sunk)"/>${o.join('')}</svg>`;
}
const simRow=sm=>{const b=simBest[sm.id];return `<a class="trow card" href="#/sim/${sm.id}"><span class="bi">${ico(sm.ic)}</span><span class="tt"><b dir="ltr" lang="en">${esc(sm.t)}</b><small dir="rtl">${esc(sm.ar)}</small><small>${esc(S().sim.steps(sm.steps.length))}${b!=null?` · ${esc(S().sim.best)}: ${b}%`:''}</small></span><span class="go">${ico('next')}</span></a>`};
function viewSims(){
  const s=S(),M=s.sim;
  return `<div class="pagehead"><span class="picon">${ico('flask')}</span><div><h2>${esc(M.h)}</h2><p>${esc(M.p)}</p></div></div><div class="rows">${SIMS.map(simRow).join('')}</div>`;
}
function viewSim(sm){
  const s=S(),M=s.sim;if(!SM||SM.id!==sm.id)simStart(sm);
  const n=sm.steps.length,track=`<ol class="simtrack" aria-label="${esc(M.h)}">${sm.steps.map((st,k)=>`<li class="${k<SM.i||SM.phase!=='steps'?'done':k===SM.i?'cur':''}"><span>${k+1}</span><b dir="ltr" lang="en">${esc(st.n)}</b><small dir="rtl" lang="ar">${esc(st.ar)}</small></li>`).join('')}</ol>`;
  const tests=sm.tests.map(byName).filter(Boolean);
  const head=`<a class="back" href="#/sim">${ico('back')}${esc(M.h)}</a>
<div class="card thead"><div class="t1"><span class="picon">${ico(sm.ic)}</span><div><h2 dir="ltr" lang="en">${esc(sm.t)}</h2><div class="ar" dir="rtl">${esc(sm.ar)}</div></div></div>
<div class="btns">${tests.map(x=>`<a class="btn" href="${href(x)}">${ico('doc')}<span dir="ltr" lang="en">${esc(x.t[0])}</span></a>`).join('')}</div></div>`;
  let body;
  if(SM.phase==='steps'){
    const st=sm.steps[SM.i],pct=Math.round(SM.i/n*100);
    body=`<div class="simgrid"><div class="card simpic"><div class="cb">${simVis(st.v)}<p class="note">${esc(M.schem)}</p></div></div>
<div class="card simq"><div class="cb"><div class="simbar" role="progressbar" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${SM.i}"><span style="width:${pct}%"></span></div>
<p class="simstep">${esc(M.step(SM.i+1,n))} · <b dir="ltr" lang="en">${esc(st.n)}</b> <span dir="rtl" lang="ar">${esc(st.ar)}</span></p>
<h3 dir="ltr" lang="en">${esc(st.q)}</h3>
<div class="simopts" dir="ltr" lang="en">${SM.ord.map(k=>`<button type="button" class="simopt${SM.tried.includes(k)?(k===0?' ok':' no'):''}" data-o="${k}" ${SM.tried.includes(k)||SM.done?'disabled':''}>${esc(st.o[k][0])}</button>`).join('')}</div>
<div class="simfb" id="simFb" aria-live="polite">${SM.tried.length?simFb(st):''}</div></div></div></div>`;
  }else if(SM.phase==='faults'){
    const f=sm.faults[SM.fi];
    body=`<div class="card simq"><div class="cb"><p class="simstep">${ico('warn')}<b>${esc(M.faults)}</b> · ${esc(M.fq(SM.fi+1,sm.faults.length))}</p><p class="note">${esc(M.faultsP)}</p>
<h3 dir="ltr" lang="en">${esc(f.q)}</h3>
<div class="simopts" dir="ltr" lang="en">${SM.ford.map(k=>`<button type="button" class="simopt${SM.fpick!=null&&(k===0?' ok':k===SM.fpick?' no':'')||''}" data-f="${k}" ${SM.fpick!=null?'disabled':''}>${esc(f.o[k])}</button>`).join('')}</div>
<div class="simfb" aria-live="polite">${SM.fpick!=null?`<p class="${SM.fpick===0?'fbok':'fbno'}">${ico(SM.fpick===0?'check':'warn')}<b>${esc(SM.fpick===0?M.ok:M.no)}</b></p><p dir="ltr" lang="en">${esc(f.e)}</p><button type="button" class="btn pri" id="simNext">${esc(SM.fi+1<sm.faults.length?M.cont:M.finish)}</button>`:''}</div></div></div>`;
  }else{
    const pct=Math.round((SM.firstOK+SM.fOK)/(n+sm.faults.length)*100),secs=Math.round((SM.t1-SM.t0)/1000);
    body=`<div class="card simdone"><div class="cb">${ico('check')}<h3>${esc(M.done)}</h3><p class="simscore">${pct}%</p>
<ul><li>${esc(M.first(SM.firstOK,n))}</li><li>${esc(M.fscore(SM.fOK,sm.faults.length))}</li><li>${esc(M.time)}: ${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}</li></ul>
<div class="btns"><button type="button" class="btn pri" id="simAgain">${esc(M.restart)}</button><a class="btn" href="#/sim">${esc(M.all)}</a></div></div></div>`;
  }
  return `${head}${track}${body}<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(s.refs)}</h3></div><div class="cb">${refList(sm.ref)}</div></div>`;
}
function simFb(st){
  const M=S().sim,last=SM.tried[SM.tried.length-1],ok=last===0;
  return `<p class="${ok?'fbok':'fbno'}">${ico(ok?'check':'warn')}<b>${esc(ok?M.ok:M.no)}</b> <span dir="ltr" lang="en">${esc(st.o[last][1])}</span></p>${ok?`<p class="simfact" dir="ltr" lang="en">${ico('info')}${esc(st.f)}</p><button type="button" class="btn pri" id="simNext">${esc(M.next)}</button>`:`<p class="note">${esc(M.again)}</p>`}`;
}
function bindSim(sm){
  const again=$('simAgain');if(again)again.onclick=()=>{simStart(sm);render()};
  document.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{
    const k=+b.dataset.o;if(SM.tried.includes(k)||SM.done)return;
    SM.tried.push(k);
    if(k===0){SM.done=true;if(SM.tried.length===1)SM.firstOK++}
    render();const nx=$('simNext');if(nx)nx.focus();
  });
  document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{
    if(SM.fpick!=null)return;SM.fpick=+b.dataset.f;if(SM.fpick===0)SM.fOK++;render();const nx=$('simNext');if(nx)nx.focus();
  });
  const nx=$('simNext');
  if(nx)nx.onclick=()=>{
    if(SM.phase==='steps'){
      SM.i++;SM.tried=[];SM.done=false;
      if(SM.i<sm.steps.length)SM.ord=simOrder(sm.steps[SM.i].o.length);else SM.phase='faults';
    }else{
      SM.fi++;SM.fpick=null;
      if(SM.fi<sm.faults.length)SM.ford=simOrder(sm.faults[SM.fi].o.length);
      else{SM.phase='end';SM.t1=Date.now();
        const pct=Math.round((SM.firstOK+SM.fOK)/(sm.steps.length+sm.faults.length)*100);
        if(simBest[sm.id]==null||pct>simBest[sm.id]){simBest[sm.id]=pct;store('lg-sim',simBest)}
        toast(S().sim.done,null,null,'ok')}
    }
    render();const q=document.querySelector('.simq h3,.simdone h3');if(q){q.setAttribute('tabindex','-1');q.focus({preventScroll:true})}
  };
}
