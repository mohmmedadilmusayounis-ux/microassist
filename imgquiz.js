// imgquiz.js: Image quiz built from the digital atlas photographs. Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Image quiz ---------- */
// Questions are generated from ATLAS slides: "what does this show?" (answer = slide title before " — ") and, for
// special stains, IHC and microbiology, "which stain?". Labelled or annotated images are left out (they show the answer).
const IQ_STAIN_CATS=['special','ihc','micro'];
const iqLabel=a=>a.title.split(' — ')[0];
const iqPool=()=>ATLAS.filter(a=>!/annotated|Poikilocytes/i.test(a.src||'')&&!/reference panel/i.test(a.title));
const iqScopes=()=>{const p=iqPool();return ['all',...ATLAS_CATS.filter(c=>p.filter(a=>a.cat===c).length>=4)]};
let IQ=null,iqBest=load('lg-iquiz',{});
// 3 wrong options taken in the given order (callers shuffle within groups: same section first, then the rest of
// the pool), so distractors are plausible; all labels distinct from the answer and from each other
function iqOptions(right,cands){
  const out=[right];for(const c of cands){if(out.length===4)break;if(c&&!out.includes(c))out.push(c)}
  return out.length===4?shuffle(out):null;
}
function iqMake(a,pool){
  const same=pool.filter(b=>b.cat===a.cat),other=pool.filter(b=>b.cat!==a.cat);
  if(IQ_STAIN_CATS.includes(a.cat)&&!/^unstained/i.test(a.stain)&&Math.random()<0.4){
    const o=iqOptions(a.stain,[...shuffle(same),...shuffle(other)].map(b=>b.stain).filter(t=>!/^unstained/i.test(t)));
    if(o)return{a,kind:'stain',o,ans:o.indexOf(a.stain)};
  }
  const o=iqOptions(iqLabel(a),[...shuffle(same),...shuffle(other)].map(iqLabel));
  return{a,kind:'dx',o,ans:o.indexOf(iqLabel(a))};
}
function iqStart(scope){
  const pool=iqPool(),use=scope==='all'?pool:pool.filter(a=>a.cat===scope);
  IQ={scope,items:shuffle(use).slice(0,10).map(a=>iqMake(a,pool)),i:0,pick:[],done:false};
}
function viewIQuizzes(){
  const s=S(),Q=s.iquiz,A=s.atlas,p=iqPool();
  return `<a class="back" href="#/learn">${ico('back')}${esc(s.learn.h)}</a><div class="pagehead"><span class="picon">${ico('image')}</span><div><h2>${esc(Q.h)}</h2><p>${esc(Q.p)}</p></div></div>
<div class="rows">${iqScopes().map(c=>{const n=c==='all'?p.length:p.filter(a=>a.cat===c).length,b=iqBest[c];return `<a class="trow card" href="#/iquiz/${c}"><span class="bi">${ico(c==='all'?'image':c==='haem'?'drop':c==='micro'?'bact':'scope')}</span><span class="tt"><b>${esc(c==='all'?Q.all:A.cats[c])}</b><small>${esc(Q.n(n))}${b!=null?` · ${esc(Q.best)}: ${b}%`:''}</small></span><span class="go">${ico('next')}</span></a>`}).join('')}</div>`;
}
function viewIQuiz(scope){
  const s=S(),Q=s.iquiz,A=s.atlas;if(!IQ||IQ.scope!==scope)iqStart(scope);
  const title=Q.h+' · '+(scope==='all'?Q.all:A.cats[scope]),n=IQ.items.length,back=`<a class="back" href="#/iquiz">${ico('back')}${esc(Q.h)}</a>`;
  if(IQ.done){
    const sc=IQ.items.filter((q,k)=>IQ.pick[k]===q.ans).length,pc=Math.round(sc/n*100);
    return `${back}<div class="card qbox" style="text-align:center"><div class="note">${esc(title)}</div><div class="score">${sc} / ${n}</div><div class="donutw" style="justify-content:center">${donut([{v:sc,c:'var(--ok)'},{v:n-sc,c:'var(--bad)'}],110,pc+'%')}</div><div class="btns" style="justify-content:center;margin-top:12px"><button class="btn pri" id="iqAgain">${esc(s.again)}</button><a class="btn" href="#/iquiz">${esc(Q.h)}</a></div></div>
<h3 class="grp">${esc(s.review)}</h3><div class="iqrev">${IQ.items.map((q,k)=>`<a class="card iqr ${IQ.pick[k]===q.ans?'ok':'no'}" href="#/atlas/${q.a.id}"><img src="${esc(q.a.f)}" alt="" loading="lazy"><span dir="ltr" lang="en"><b>${esc(q.o[q.ans])}</b>${IQ.pick[k]!==q.ans?`<small>${esc(Q.yours)}: ${esc(q.o[IQ.pick[k]])}</small>`:''}</span></a>`).join('')}</div>`;
  }
  const q=IQ.items[IQ.i],p=IQ.pick[IQ.i],chk=p!=null,a=q.a;
  return `${back}<div class="card qbox"><div class="qmeta"><span>${esc(title)}</span><span>${esc(s.question(IQ.i+1,n))}</span></div><div class="prog"><i style="width:${IQ.i/n*100}%"></i></div>
<figure class="iqfig"><button type="button" class="iqimg" id="iqImg" aria-label="${esc(Q.zoom)}"><img src="${esc(a.f)}" alt="${esc(Q.alt(IQ.i+1))}"></button><figcaption class="note">${esc(Q.zoom)}${q.kind==='stain'?'':` · ${esc(a.stain)}`}</figcaption></figure>
<p class="qtext">${esc(q.kind==='stain'?Q.qStain:Q.qDx)}</p>
<div class="opts" dir="ltr" lang="en">${q.o.map((o,j)=>`<button type="button" class="opt ${chk?(j===q.ans?'right':p===j?'wrong':''):''}" data-iq="${j}" ${chk?'disabled':''}><span class="k">${'ABCD'[j]}</span><span>${esc(o)}</span></button>`).join('')}</div>
${chk?`<div class="expl" aria-live="polite"><b>${esc(p===q.ans?s.correct:s.wrong)}.</b> <span dir="ltr" lang="en">${esc(iqLabel(a))} · ${esc(a.stain)} · ${esc(a.organ)}</span><p dir="ltr" lang="en" style="margin:6px 0">${esc(a.view)}</p><a href="#/atlas/${a.id}">${ico('image')}${esc(Q.open)}</a><small>${esc(a.by)} · ${esc(a.lic)}</small></div>`:''}
<div class="btns" style="margin-top:14px;justify-content:flex-end">${chk?(IQ.i<n-1?`<button class="btn pri" id="iqNext">${esc(s.nextQ)}</button>`:`<button class="btn pri" id="iqFin">${esc(s.finish)}</button>`):''}</div></div>`;
}
function bindIQuiz(scope){
  const ag=$('iqAgain');if(ag){ag.onclick=()=>{iqStart(scope);render()};return}
  const q=IQ.items[IQ.i];
  $('iqImg').onclick=()=>openLb({f:q.a.f,cap:S().iquiz.alt(IQ.i+1),by:q.a.by,lic:q.a.lic});
  document.querySelectorAll('[data-iq]').forEach(b=>b.onclick=()=>{IQ.pick[IQ.i]=+b.dataset.iq;render();const nx=$('iqNext')||$('iqFin');if(nx)nx.focus()});
  const nx=$('iqNext');if(nx)nx.onclick=()=>{IQ.i++;render();scrollTo({top:0})};
  const fin=$('iqFin');if(fin)fin.onclick=()=>{IQ.done=true;const sc=IQ.items.filter((x,k)=>IQ.pick[k]===x.ans).length,pc=Math.round(sc/IQ.items.length*100);
    if(iqBest[scope]==null||pc>iqBest[scope]){iqBest[scope]=pc;store('lg-iquiz',iqBest)}render();scrollTo({top:0})};
}
