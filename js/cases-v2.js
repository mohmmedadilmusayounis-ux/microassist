// cases-v2.js: Case studies, v2 layout. Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Case studies, v2 layout: history, labs, images, step-by-step workflow ---------- */
function caseMedia(m){
  if(m.placeholder)return m;
  const a=ATLAS.find(x=>x.id===m.atlas);if(!a)return null;
  const l=[{f:a.f,cap:a.title,by:a.by,lic:a.lic,src:a.src},...(a.more||[])],im=l[m.i||0];
  return im&&{...im,cap:m.cap||im.cap||a.title,slide:a.id};
}
function viewCaseV2(c){
  const s=S(),V=s.cv2,h=c.hx||{},media=(c.media||[]).map(caseMedia).filter(Boolean);
  const hx=[[V.age,h.age],[V.sex,h.sex],[V.pc,h.pc],[V.pmh,(h.pmh||[]).join('; ')],[V.meds,(h.meds||[]).join('; ')]].filter(r=>r[1]);
  let open=true,shown=0;
  const steps=c.steps.map((st,i)=>{
    if(!open)return '';shown++;const q=st.q,a=CS.ans[i];
    const out=`<div class="card qbox cstep"><div class="qmeta"><span>${esc(V.step)} ${i+1} / ${c.steps.length}</span></div><h3>${esc(st.h)}</h3>${st.body?`<p>${esc(st.body)}</p>`:''}${st.calc?`<p><a class="btn" href="#/calc/${st.calc}">${ico('calc')}${esc(V.calc)}</a></p>`:''}
${q?`<p class="qtext">${esc(q.q)}</p><div class="opts">${q.o.map((o,j)=>`<button type="button" class="opt ${a!=null?(j===q.a?'right':a===j?'wrong':''):''}" data-q="${i}" data-o="${j}" ${a!=null?'disabled':''}><span class="k">${'ABCD'[j]}</span><span>${esc(o)}</span></button>`).join('')}</div>${a!=null?`<div class="expl"><b>${esc(a===q.a?s.correct:s.wrong)}.</b> ${esc(q.e)}</div>`:''}`:''}</div>`;
    if(q&&a==null)open=false;return out}).join('');
  const lock=shown<c.steps.length?`<div class="card empty" style="margin-top:12px">${ico('info')}<span>${esc(V.locked)}</span></div>`:'';
  return `<a class="back" href="#/cases">${ico('back')}${esc(s.learn.cases)}</a>
<div class="card qbox" dir="ltr" lang="en"><div class="qmeta"><span>${esc(bName(BR(c.b)))}</span></div><h2 style="margin:0 0 8px;font-size:1.2rem">${esc(c.t)}</h2><p style="margin:0">${esc(c.s)}</p></div>
<div class="grid g2" style="margin-top:12px"><div class="card"><div class="ch"><h3>${ico('case')}${esc(V.hx)}</h3></div><div class="cb" dir="ltr" lang="en"><table class="tbl rng"><tbody>${hx.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div></div>
<div class="card"><div class="ch"><h3>${ico('flask')}${esc(V.labs)}</h3></div><div class="cb scroll-x" dir="ltr" lang="en"><table class="tbl labt"><thead><tr><th>${esc(V.param)}</th><th>${esc(V.value)}</th><th>${esc(V.ref)}</th></tr></thead><tbody>${(c.labs||[]).map(l=>{const x=byName(l.test);return `<tr><td>${x?`<a href="${href(x)}">${esc(l.p)}</a>`:esc(l.p)}</td><td><b>${esc(l.v)}</b> ${esc(l.u||'')} ${l.flag?`<span class="badge ${l.flag==='N'?'b-ok':'b-warn'}">${esc(l.flag)}</span>`:''}</td><td class="note">${esc(l.ref||'—')}</td></tr>`}).join('')}</tbody></table>${eduBadge()}</div></div></div>
${media.length?`<div class="card" style="margin-top:12px"><div class="ch"><h3>${ico('image')}${esc(V.media)}</h3></div><div class="cb"><div class="figs">${media.map((m,j)=>m.placeholder?`<figure class="fig"><div class="ph phold">${ico('scope')}<span>${esc(V.pending)}</span></div><figcaption dir="ltr">${esc(m.placeholder)}</figcaption></figure>`:`<figure class="fig"><div class="ph" data-cm="${j}"><img src="${esc(m.f)}" alt="${esc(m.cap)}" loading="lazy"></div><figcaption dir="ltr">${esc(m.cap)}${m.slide?` · <a href="#/atlas/${m.slide}">${esc(s.atlas.h)}</a>`:''}<small>${credit(m)}</small></figcaption></figure>`).join('')}</div></div></div>`:''}
<h3 class="grp">${esc(V.work)}</h3><div dir="ltr" lang="en">${steps}</div>${lock}
${open?`<div class="card" style="margin-top:12px" dir="ltr" lang="en"><div class="ch"><h3>${ico('check')}${esc(V.dx)}</h3></div><div class="cb"><p style="margin-top:0"><b>${esc(c.dx)}</b></p><h4 class="subh">${esc(V.teach)}</h4>${ulist(c.teach)}</div></div>`:''}
<div class="card" style="margin-top:12px"><div class="ch"><h3>${esc(s.refs)}</h3></div><div class="cb">${refList(c.ref)}</div></div>`;
}

