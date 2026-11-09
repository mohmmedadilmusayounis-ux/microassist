// anatomy-view.js: Anatomy atlas and pin quiz (data in anatomy.js). Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Anatomy atlas ---------- */
// pins are stored in image pixels and drawn at x/y percentages, so they stay on their structure at every screen width
const AN={};   // per diagram: mode (study | test), selected pin, pins revealed in test mode
const anState=d=>AN[d.id]||(AN[d.id]={mode:'study',sel:null,shown:[]});
const anName=p=>lang==='ar'?p.ar:p.n,anAlt=p=>lang==='ar'?p.n:p.ar;
const anSys=id=>ANAT_SYS.find(s=>s.id===id);
const anSysName=s=>lang==='ar'?s.ar:s.en;
function anPins(d,opt={}){
  // opt.only: indexes to draw; opt.letters: draw A–D instead of numbers; opt.hi: highlighted index
  return d.pins.map((p,k)=>{if(opt.only&&!opt.only.includes(k))return '';const lab=opt.letters?'ABCD'[opt.only.indexOf(k)]:k+1;
    return `<button type="button" class="apin${opt.hi===k?' on':''}" style="left:${(p.x/d.w*100).toFixed(2)}%;top:${(p.y/d.h*100).toFixed(2)}%" data-pin="${k}" aria-label="${esc(opt.letters?lab:(opt.names?anName(p):String(lab)))}"><span>${lab}</span></button>`}).join('');
}
const anFig=(d,pins)=>`<div class="afig" style="aspect-ratio:${d.w}/${d.h}"><img src="${esc(d.f)}" alt="${esc(lang==='ar'?d.ar:d.title)}" width="${d.w}" height="${d.h}">${pins}</div>`;
function viewAnat(){
  const s=S(),A=s.anat;
  return `<div class="pagehead"><span class="picon">${ico('body')}</span><div><h2>${esc(A.h)}</h2><p>${esc(A.p)}</p></div><a class="btn pri" href="#/aquiz" style="margin-inline-start:auto">${ico('quiz')}<span>${esc(A.quiz)}</span></a></div>
${ANAT_SYS.filter(y=>ANAT.some(d=>d.sys===y.id)).map(y=>`<h3 class="grp">${ico(y.ic)}${esc(anSysName(y))} · ${ANAT.filter(d=>d.sys===y.id).length}</h3><div class="figs atl">${ANAT.filter(d=>d.sys===y.id).map(d=>`<a class="card fig" href="#/anat/${d.id}" style="padding:10px;text-decoration:none"><div class="ph aph"><img src="${esc(d.f)}" alt="" loading="lazy"></div><figcaption><b style="color:var(--text);display:block">${esc(lang==='ar'?d.ar:d.title)}</b><span class="note">${esc(A.structures(d.pins.length))}</span></figcaption></a>`).join('')}</div>`).join('')}
<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(s.refs)}</h3></div><div class="cb">${refList(['grays','openstax_ap'])}</div></div>`;
}
function viewAnatOne(d){
  const s=S(),A=s.anat,st=anState(d),y=anSys(d.sys),k=ANAT.indexOf(d),pv=ANAT[k-1],nx=ANAT[k+1],test=st.mode==='test';
  const sel=st.sel!=null?d.pins[st.sel]:null,revealed=i=>!test||st.shown.includes(i);
  const list=`<ol class="akey">${d.pins.map((p,i)=>`<li class="${st.sel===i?'on':''}"><button type="button" data-key="${i}"><span class="n">${i+1}</span>${revealed(i)?`<span><b>${esc(anName(p))}</b><small>${esc(anAlt(p))}</small></span>`:`<span class="hid">${esc(A.hidden)}</span>`}</button></li>`).join('')}</ol>`;
  return `<nav class="crumbs"><a href="#/anat">${esc(A.h)}</a><span>›</span><span>${esc(anSysName(y))}</span></nav>
<div class="card thead"><div class="t1"><span class="picon">${ico(y.ic)}</span><div><h2>${esc(lang==='ar'?d.ar:d.title)}</h2><div class="ar" ${lang==='ar'?'dir="ltr" lang="en"':'dir="rtl" lang="ar"'}>${esc(lang==='ar'?d.title:d.ar)}</div></div></div>
<div class="btns"><div class="seg" role="group" aria-label="${esc(A.h)}"><button type="button" data-am="study" aria-pressed="${!test}">${esc(A.study)}</button><button type="button" data-am="test" aria-pressed="${test}">${esc(A.test)}</button></div><a class="btn" href="#/aquiz/${d.sys}">${ico('quiz')}<span>${esc(A.quiz)}</span></a></div></div>
<div class="agrid"><div class="card"><div class="cb">${anFig(d,anPins(d,{hi:st.sel}))}<p class="note" style="margin:8px 0 0">${esc(test?A.testHint:A.tap)}</p><p class="cap" dir="ltr">${credit(d)}</p></div></div>
<div><div class="card asel" aria-live="polite"><div class="cb">${sel&&revealed(st.sel)?`<p class="simstep"><span class="apin static"><span>${st.sel+1}</span></span></p><h3>${esc(anName(sel))}</h3><p class="note" style="margin-top:0">${esc(anAlt(sel))}</p><p dir="ltr" lang="en">${esc(sel.d)}</p>`:`<p class="note" style="margin:0">${esc(test?A.testHint:A.tap)}</p>`}</div></div>
<div class="card" style="margin-top:12px"><div class="ch"><h3>${esc(A.key)}</h3></div><div class="cb">${list}</div></div></div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(s.refs)}</h3></div><div class="cb"><p dir="ltr" lang="en" style="margin-top:0">${esc(d.view)}</p>${refList(d.ref)}</div></div>
<div class="pn">${pv?`<a class="card" href="#/anat/${pv.id}"><small>${esc(s.prev)}</small><span>${esc(lang==='ar'?pv.ar:pv.title)}</span></a>`:'<span></span>'}${nx?`<a class="card nx" href="#/anat/${nx.id}"><small>${esc(s.next)}</small><span>${esc(lang==='ar'?nx.ar:nx.title)}</span></a>`:''}</div>`;
}
function bindAnatOne(d){
  const st=anState(d),pick=i=>{st.sel=i;if(st.mode==='test'&&!st.shown.includes(i))st.shown.push(i);render()};
  document.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>pick(+b.dataset.pin));
  document.querySelectorAll('[data-key]').forEach(b=>b.onclick=()=>pick(+b.dataset.key));
  document.querySelectorAll('[data-am]').forEach(b=>b.onclick=()=>{st.mode=b.dataset.am;st.sel=null;st.shown=[];render()});
}

/* ---------- Anatomy pin quiz ---------- */
// "name": one pin highlighted, choose its name from 4; "find": a name is given, tap the right one of 4 lettered pins
let AQ=null,aqBest=load('lg-aquiz',{});
const aqScopes=()=>['all',...ANAT_SYS.filter(y=>ANAT.some(d=>d.sys===y.id)).map(y=>y.id)];
function aqMake(d,k){
  const others=shuffle(d.pins.map((p,i)=>i).filter(i=>i!==k)).slice(0,3),idx=shuffle([k,...others]);
  return Math.random()<0.5?{d,k,kind:'name',o:idx,ans:idx.indexOf(k)}:{d,k,kind:'find',o:idx,ans:idx.indexOf(k)};
}
function aqStart(scope){
  const ds=ANAT.filter(d=>scope==='all'||d.sys===scope),all=shuffle(ds.flatMap(d=>d.pins.map((p,k)=>[d,k])));
  AQ={scope,items:all.slice(0,10).map(([d,k])=>aqMake(d,k)),i:0,pick:[],done:false};
}
function viewAQuizzes(){
  const s=S(),A=s.anat;
  return `<a class="back" href="#/anat">${ico('back')}${esc(A.h)}</a><div class="pagehead"><span class="picon">${ico('quiz')}</span><div><h2>${esc(A.quiz)}</h2><p>${esc(A.quizP)}</p></div></div>
<div class="rows">${aqScopes().map(c=>{const y=anSys(c),n=ANAT.filter(d=>c==='all'||d.sys===c).reduce((t,d)=>t+d.pins.length,0),b=aqBest[c];return `<a class="trow card" href="#/aquiz/${c}"><span class="bi">${ico(y?y.ic:'body')}</span><span class="tt"><b>${esc(y?anSysName(y):A.all)}</b><small>${esc(A.structures(n))}${b!=null?` · ${esc(s.iquiz.best)}: ${b}%`:''}</small></span><span class="go">${ico('next')}</span></a>`}).join('')}</div>`;
}
function viewAQuiz(scope){
  const s=S(),A=s.anat;if(!AQ||AQ.scope!==scope)aqStart(scope);
  const y=anSys(scope),title=A.quiz+' · '+(y?anSysName(y):A.all),n=AQ.items.length,back=`<a class="back" href="#/aquiz">${ico('back')}${esc(A.quiz)}</a>`;
  if(AQ.done){
    const sc=AQ.items.filter((q,k)=>AQ.pick[k]===q.ans).length,pc=Math.round(sc/n*100);
    return `${back}<div class="card qbox" style="text-align:center"><div class="note">${esc(title)}</div><div class="score">${sc} / ${n}</div><div class="donutw" style="justify-content:center">${donut([{v:sc,c:'var(--ok)'},{v:n-sc,c:'var(--bad)'}],110,pc+'%')}</div><div class="btns" style="justify-content:center;margin-top:12px"><button class="btn pri" id="aqAgain">${esc(s.again)}</button><a class="btn" href="#/anat">${esc(A.h)}</a></div></div>
<h3 class="grp">${esc(s.review)}</h3><div class="rows">${AQ.items.map((q,k)=>`<a class="trow card aqr ${AQ.pick[k]===q.ans?'ok':'no'}" href="#/anat/${q.d.id}"><span class="bi">${ico(AQ.pick[k]===q.ans?'check':'warn')}</span><span class="tt"><b>${esc(anName(q.d.pins[q.k]))}</b><small>${esc(lang==='ar'?q.d.ar:q.d.title)}</small></span><span class="go">${ico('next')}</span></a>`).join('')}</div>`;
  }
  const q=AQ.items[AQ.i],p=AQ.pick[AQ.i],chk=p!=null,target=q.d.pins[q.k];
  const fig=q.kind==='name'?anFig(q.d,anPins(q.d,{only:[q.k],hi:q.k})):anFig(q.d,anPins(q.d,{only:q.o,letters:true,hi:chk?q.k:null}));
  const opts=q.kind==='name'?q.o.map((pi,j)=>`<button type="button" class="opt ${chk?(j===q.ans?'right':p===j?'wrong':''):''}" data-aq="${j}" ${chk?'disabled':''}><span class="k">${'ABCD'[j]}</span><span>${esc(anName(q.d.pins[pi]))}</span></button>`).join('')
    :q.o.map((pi,j)=>`<button type="button" class="opt ${chk?(j===q.ans?'right':p===j?'wrong':''):''}" data-aq="${j}" ${chk?'disabled':''}><span class="k">${'ABCD'[j]}</span><span>${esc(A.pinL('ABCD'[j]))}</span></button>`).join('');
  return `${back}<div class="card qbox"><div class="qmeta"><span>${esc(title)}</span><span>${esc(s.question(AQ.i+1,n))}</span></div><div class="prog"><i style="width:${AQ.i/n*100}%"></i></div>
<p class="qtext">${q.kind==='name'?esc(A.qName(q.k+1)):esc(A.qFind(anName(target)))}</p><p class="note" style="margin-top:-6px">${esc(lang==='ar'?q.d.ar:q.d.title)}</p>
<div class="aqfig">${fig}</div>
<div class="opts">${opts}</div>
${chk?`<div class="expl" aria-live="polite"><b>${esc(p===q.ans?s.correct:s.wrong)}.</b> <b>${esc(anName(target))}</b> · ${esc(anAlt(target))}<p dir="ltr" lang="en" style="margin:6px 0">${esc(target.d)}</p><a href="#/anat/${q.d.id}">${ico('body')}${esc(A.open)}</a></div>`:''}
<div class="btns" style="margin-top:14px;justify-content:flex-end">${chk?(AQ.i<n-1?`<button class="btn pri" id="aqNext">${esc(s.nextQ)}</button>`:`<button class="btn pri" id="aqFin">${esc(s.finish)}</button>`):''}</div></div>`;
}
function bindAQuiz(scope){
  const ag=$('aqAgain');if(ag){ag.onclick=()=>{aqStart(scope);render()};return}
  const q=AQ.items[AQ.i],answer=j=>{if(AQ.pick[AQ.i]!=null)return;AQ.pick[AQ.i]=j;render();const nx=$('aqNext')||$('aqFin');if(nx)nx.focus()};
  document.querySelectorAll('[data-aq]').forEach(b=>b.onclick=()=>answer(+b.dataset.aq));
  // in "find" questions the lettered pins on the image are answers too
  if(q.kind==='find')document.querySelectorAll('.aqfig [data-pin]').forEach(b=>b.onclick=()=>answer(q.o.indexOf(+b.dataset.pin)));
  const nx=$('aqNext');if(nx)nx.onclick=()=>{AQ.i++;render();scrollTo({top:0})};
  const fin=$('aqFin');if(fin)fin.onclick=()=>{AQ.done=true;const sc=AQ.items.filter((x,k)=>AQ.pick[k]===x.ans).length,pc=Math.round(sc/AQ.items.length*100);
    if(aqBest[scope]==null||pc>aqBest[scope]){aqBest[scope]=pc;store('lg-aquiz',aqBest)}render();scrollTo({top:0})};
}
