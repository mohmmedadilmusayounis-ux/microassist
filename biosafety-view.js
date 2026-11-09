// biosafety-view.js: Medical waste management and laboratory biosafety pages (data in biosafety.js). Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Biosafety and waste ---------- */
const bioT=(o,k)=>lang==='ar'?o[k+'Ar']:o[k];          // English field or its Arabic twin
const bioName=o=>lang==='ar'?o.ar:(o.n||o.t);
const bioOther=o=>lang==='ar'?`<small dir="ltr" lang="en">${esc(o.n||o.t)}</small>`:`<small dir="rtl" lang="ar">${esc(o.ar)}</small>`;
const bioStream=id=>BIO_STREAMS.find(s=>s.id===id);
const BIO_TABS=['waste','sort','check'];
// "Which bin?" practice and ticked protocol steps, kept while the app is open
let BS={i:0,score:0,pick:null};
const BSTEP={};
// daily checklist: ticks are kept for the current day only
const bioToday=()=>new Date().toISOString().slice(0,10);
function bioChecks(){const c=load('lg-biocheck',null);return c&&c.d===bioToday()&&Array.isArray(c.done)?c.done:[]}
function bioSwatch(s){return `<span class="biosw${s.id==='radioactive'?' lead':''}" style="--sw:${s.sw}" aria-hidden="true">${s.id==='radioactive'?'☢':''}</span>`}

function viewBio(tab){
  const s=S(),B=s.bio;
  const em=`<h3 class="grp">${ico('warn')}${esc(B.emerg)}</h3><div class="grid g3 bioem">${BIO_PROTO.map(p=>`<a class="card bioemc" href="#/bio/${p.id}"><span class="bi">${ico(p.ic)}</span><span class="tt"><b>${esc(bioName(p))}</b><small>${esc(bioT(p,'urgent'))}</small></span><span class="go">${ico('next')}</span></a>`).join('')}</div>`;
  const tabs=`<div class="seg biotabs" role="group" aria-label="${esc(B.h)}">${BIO_TABS.map(t=>`<a href="#/bio/${t}" aria-current="${t===tab?'page':'false'}">${esc(B.tabs[t])}</a>`).join('')}</div>`;
  const body=tab==='sort'?bioSortView():tab==='check'?bioCheckView():bioWasteView();
  return `<div class="pagehead"><span class="picon">${ico('shield')}</span><div><h2>${esc(B.h)}</h2><p>${esc(B.p)}</p></div></div>${em}${tabs}${body}
<p class="note bioedu">${ico('info')}<span>${esc(B.edu)}</span></p>`;
}
function bioWasteView(){
  const B=S().bio;
  const legend=`<div class="card"><div class="ch"><h3>${ico('shield')}${esc(B.scheme)}</h3></div><div class="cb"><div class="biolegend">${[['#f2c200',B.yellow],['#c62828',B.redLg],['#7a4a1f',B.brown],['#1b1b1b',B.black]].map(([c,t])=>`<span class="biolg"><span class="biosw" style="--sw:${c}" aria-hidden="true"></span>${esc(t)}</span>`).join('')}<span class="biolg"><span class="biosw lead" aria-hidden="true">☢</span>${esc(B.lead)}</span></div>
<ul class="biorules"><li>${esc(B.threeQ)}</li><li>${esc(B.tie)}</li><li>${esc(B.near)}</li></ul><p class="note biored">${ico('info')}<span>${esc(B.red)}</span></p></div></div>`;
  const card=x=>`<details class="card biostream" id="bw-${x.id}"><summary>${bioSwatch(x)}<span class="tt"><b>${esc(bioName(x))}</b>${bioOther(x)}<small class="biocol">${esc(B.colour)}: ${esc(bioT(x,'colour'))}</small></span><span class="go">${ico('next')}</span></summary>
<div class="cb"><dl class="biodl"><dt>${esc(B.label)}</dt><dd>${esc(bioT(x,'label'))}</dd><dt>${esc(B.container)}</dt><dd>${esc(bioT(x,'container'))}</dd><dt>${esc(B.collect)}</dt><dd>${esc(bioT(x,'collect'))}</dd></dl>
<h4>${esc(B.examples)}</h4><ul>${bioT(x,'examples').map(e=>`<li>${esc(e)}</li>`).join('')}</ul><h4>${esc(B.treat)}</h4><ul>${bioT(x,'treat').map(e=>`<li>${esc(e)}</li>`).join('')}</ul></div></details>`;
  return `${legend}<h3 class="grp">${esc(B.streams)} · ${BIO_STREAMS.length}</h3><div class="biostreams">${BIO_STREAMS.map(card).join('')}</div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(S().refs)}</h3></div><div class="cb">${refList(['who_hcw_sum','who_hcw','osha_bbp','who_biosafety'])}</div></div>`;
}
function bioSortView(){
  const B=S().bio,n=BIO_SORT.length;
  if(BS.i>=n){const pc=Math.round(BS.score/n*100);
    return `<div class="card qbox" style="text-align:center"><div class="note">${esc(B.tabs.sort)}</div><div class="score">${BS.score} / ${n}</div><div class="donutw" style="justify-content:center">${donut([{v:BS.score,c:'var(--ok)'},{v:n-BS.score,c:'var(--bad)'}],110,pc+'%')}</div><div class="btns" style="justify-content:center;margin-top:12px"><button type="button" class="btn pri" id="bsAgain">${esc(S().again)}</button><a class="btn" href="#/bio/waste">${esc(B.tabs.waste)}</a></div></div>`}
  const [it,ia,ok,why,whyA]=BIO_SORT[BS.i],done=BS.pick!==null;
  const bins=BIO_STREAMS.map(x=>{const st=done?(x.id===ok?' good':x.id===BS.pick?' bad':''):'';
    return `<button type="button" class="biobin${st}" data-bin="${x.id}" ${done?'disabled':''} aria-pressed="${BS.pick===x.id}">${bioSwatch(x)}<span>${esc(bioName(x))}</span></button>`}).join('');
  const fb=done?`<div class="biofb ${BS.pick===ok?'ok':'no'}" role="status"><b>${ico(BS.pick===ok?'check':'warn')}${esc(BS.pick===ok?B.right:B.wrong(bioName(bioStream(ok))))}</b><p>${esc(lang==='ar'?whyA:why)}</p><button type="button" class="btn pri" id="bsNext">${esc(BS.i+1<n?B.next:B.finish)}</button></div>`:'';
  return `<div class="card qbox biosort"><div class="note">${esc(B.qn(BS.i+1,n))} · ${esc(B.score(BS.score))}</div><p class="bioq">${esc(B.sortQ)}</p><p class="bioitem"><b>${esc(lang==='ar'?ia:it)}</b></p><div class="biobins">${bins}</div>${fb}</div>`;
}
function bioCheckView(){
  const B=S().bio,done=bioChecks(),n=BIO_CHECK.length;
  return `<div class="card"><div class="ch"><h3>${ico('check')}${esc(B.checkH)}</h3><span class="biocount" aria-live="polite">${esc(B.prog(done.length,n))}</span></div><div class="cb"><p class="note" style="margin-top:0">${esc(B.checkP)}</p>
<div class="biobar" aria-hidden="true"><span style="width:${Math.round(done.length/n*100)}%"></span></div>
<ul class="biocheck">${BIO_CHECK.map(([e,a],i)=>`<li><button type="button" class="biotick" data-bchk="${i}" aria-pressed="${done.includes(i)}"><span class="bbox" aria-hidden="true">${done.includes(i)?'✓':''}</span><span>${esc(lang==='ar'?a:e)}</span></button></li>`).join('')}</ul>
<div class="btns"><button type="button" class="btn" id="bcReset">${esc(B.reset)}</button></div></div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(S().refs)}</h3></div><div class="cb">${refList(['who_biosafety','osha_bbp'])}</div></div>`;
}
function bindBio(tab){
  if(tab==='sort'){
    document.querySelectorAll('[data-bin]').forEach(b=>b.onclick=()=>{if(BS.pick!==null)return;BS.pick=b.dataset.bin;if(BS.pick===BIO_SORT[BS.i][2])BS.score++;render()});
    const nx=$('bsNext');if(nx)nx.onclick=()=>{BS.i++;BS.pick=null;render()};
    const ag=$('bsAgain');if(ag)ag.onclick=()=>{BS={i:0,score:0,pick:null};render()};
  }
  if(tab==='check'){
    document.querySelectorAll('[data-bchk]').forEach(b=>b.onclick=()=>{const i=+b.dataset.bchk,d=bioChecks();
      store('lg-biocheck',{d:bioToday(),done:d.includes(i)?d.filter(x=>x!==i):[...d,i]});render()});
    $('bcReset').onclick=()=>{store('lg-biocheck',{d:bioToday(),done:[]});render()};
  }
}

function viewBioProto(p){
  const s=S(),B=s.bio,done=BSTEP[p.id]||[];
  const risk=p.risk?`<div class="card"><div class="ch"><h3>${ico('pulse')}${esc(B.risk)}</h3></div><div class="cb"><div class="biorisk">${p.risk.map(([e,a,v])=>`<div><b dir="ltr">${esc(v)}</b><span>${esc(lang==='ar'?a:e)}</span></div>`).join('')}</div><p class="note">${esc(bioT(p,'riskNote'))}</p></div></div>`:'';
  const steps=p.steps.map((x,i)=>`<li class="biostep${x.crit?' crit':''}"><button type="button" class="biotick" data-bstep="${i}" aria-pressed="${done.includes(i)}"><span class="bnum" aria-hidden="true">${done.includes(i)?'✓':i+1}</span><span class="tt"><b>${esc(lang==='ar'?x.ar:x.t)}</b>${x.crit?`<span class="biocrit">${esc(B.now)}</span>`:''}<span class="biod">${esc(lang==='ar'?x.da:x.d)}</span></span></button></li>`).join('');
  return `<nav class="crumbs"><a href="#/bio">${esc(B.h)}</a><span>›</span><span>${esc(B.emerg)}</span></nav>
<div class="card thead"><div class="t1"><span class="picon">${ico(p.ic)}</span><div><h2>${esc(bioName(p))}</h2><div class="ar" ${lang==='ar'?'dir="ltr" lang="en"':'dir="rtl" lang="ar"'}>${esc(lang==='ar'?p.t:p.ar)}</div></div></div></div>
<div class="bioalert" role="alert">${ico('warn')}<b>${esc(bioT(p,'urgent'))}</b></div>
${risk}
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('check')}${esc(B.steps)}</h3><span class="biocount" aria-live="polite">${esc(B.prog(done.length,p.steps.length))}</span></div><div class="cb"><p class="note" style="margin-top:0">${esc(B.stepsP)}</p><ol class="biosteps">${steps}</ol><div class="btns"><button type="button" class="btn" id="bpReset">${esc(B.reset)}</button></div></div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${ico('doc')}${esc(B.report)}</h3></div><div class="cb"><p class="note" style="margin-top:0">${esc(B.reportP)}</p><ul class="bioreport">${bioT(p,'report').map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div></div>
<p class="note bioedu">${ico('info')}<span>${esc(B.edu)}</span></p>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(s.refs)}</h3></div><div class="cb">${refList(p.ref)}</div></div>`;
}
function bindBioProto(p){
  document.querySelectorAll('[data-bstep]').forEach(b=>b.onclick=()=>{const i=+b.dataset.bstep,d=BSTEP[p.id]||[];BSTEP[p.id]=d.includes(i)?d.filter(x=>x!==i):[...d,i];render()});
  $('bpReset').onclick=()=>{BSTEP[p.id]=[];render()};
}
