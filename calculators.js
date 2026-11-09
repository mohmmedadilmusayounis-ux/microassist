// calculators.js: Clinical calculators and unit converter. Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Clinical calculators ---------- */
const CV={};   // per-calculator unit system and entered values, kept while the app is open
const calcRow=c=>`<a class="trow card" href="#/calc/${c.id}"><span class="bi">${ico(c.ic||'calc')}</span><span class="tt"><b dir="ltr" lang="en">${esc(c.t)}</b><small dir="rtl">${esc(c.ar)}</small></span><span class="go">${ico('next')}</span></a>`;
function viewCalcs(){
  const s=S(),C=s.calc;
  return `<div class="pagehead"><span class="picon">${ico('calc')}</span><div><h2>${esc(C.h)}</h2><p>${esc(C.p)}</p></div></div>
<div class="rows">${CALC_DEF.map(calcRow).join('')}</div>
<h3 class="grp" style="margin-top:22px">${esc(C.conv)}</h3>
<div class="card"><div class="cb"><p class="note" style="margin-top:0">${esc(C.convP)}</p><div class="cform conv" dir="ltr" lang="en"><label class="cfld cwide"><span>${esc(C.analyte)}</span><select id="cvA">${CONV.map(c=>`<option value="${c.id}">${esc(c.l)}</option>`).join('')}</select></label><label class="cfld"><span id="cvSiL"></span><input type="number" inputmode="decimal" step="any" id="cvSi"></label><span class="cvsw" aria-hidden="true">${ico('swap')}</span><label class="cfld"><span id="cvCvL"></span><input type="number" inputmode="decimal" step="any" id="cvCv"></label></div><p class="note" id="cvF" dir="ltr"></p>${refList(['tietz','ngsp'])}</div></div>`;
}
function bindConv(){
  const a=$('cvA');if(!a)return;
  const cur=()=>CONV.find(c=>c.id===a.value);
  // fixed decimals where the analyte has a reporting convention (HbA1c), otherwise 4 significant figures
  const fmt=(x,side)=>{const c=cur();return !Number.isFinite(x)?'':c.dp?x.toFixed(c.dp[side]):String(+x.toPrecision(4))};
  const toCv=(c,x)=>c.to?c.to(x):x*c.f,toSi=(c,y)=>c.from?c.from(y):y/c.f;
  const lab=()=>{const c=cur();$('cvSiL').textContent=c.si;$('cvCvL').textContent=c.cv;$('cvF').textContent=c.to?'NGSP (%) = IFCC (mmol/mol) ÷ 10.929 + 2.15':`${c.cv} = ${c.si} × ${+c.f.toPrecision(5)}`};
  $('cvSi').oninput=()=>{const v=parseFloat($('cvSi').value);$('cvCv').value=isNaN(v)?'':fmt(toCv(cur(),v),'cv')};
  $('cvCv').oninput=()=>{const v=parseFloat($('cvCv').value);$('cvSi').value=isNaN(v)?'':fmt(toSi(cur(),v),'si')};
  a.onchange=()=>{lab();$('cvSi').oninput()};lab();
}
function viewCalc(c){
  const s=S(),C=s.calc,st=CV[c.id]||(CV[c.id]={sys:'si',v:{}}),x=byName(c.test),unit=f=>typeof f.u==='object'?f.u[st.sys]:f.u;
  const fields=c.in.map(f=>f.opt?`<label class="cfld"><span>${esc(f.l)}</span><select data-k="${f.k}">${f.opt.map(([v,l])=>`<option value="${v}" ${st.v[f.k]===v?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`
    :`<label class="cfld"><span>${esc(f.l)}${unit(f)?` <em>(${esc(unit(f))})</em>`:''}</span><input type="number" inputmode="decimal" step="${f.step||'any'}" data-k="${f.k}" value="${esc(st.v[f.k]||'')}"></label>`).join('');
  return `<a class="back" href="#/calc">${ico('back')}${esc(C.h)}</a>
<div class="card thead"><div class="t1"><span class="picon">${ico(c.ic||'calc')}</span><div><h2 dir="ltr" lang="en">${esc(c.t)}</h2><div class="ar" dir="rtl">${esc(c.ar)}</div></div></div><div class="btns"><button class="btn" id="printBtn">${ico('print')}${esc(s.print)}</button></div></div>
<div class="grid g2 calcg"><div class="card"><div class="cb">${c.sys?`<div class="seg" role="group" aria-label="${esc(C.units)}"><button type="button" data-sys="si" aria-pressed="${st.sys==='si'}">${esc(C.si)}</button><button type="button" data-sys="cv" aria-pressed="${st.sys==='cv'}">${esc(C.cv)}</button></div>`:''}<div class="cform" dir="ltr" lang="en">${fields}</div></div></div>
<div class="card cres" id="cRes" aria-live="polite"></div></div>
<div class="grid g2" style="margin-top:16px"><div class="card"><div class="ch"><h3>${esc(C.formula)}</h3></div><div class="cb" dir="ltr" lang="en"><p class="formula">${esc(c.f)}</p></div></div>
<div class="card"><div class="ch"><h3>${esc(C.lim)}</h3></div><div class="cb" dir="ltr" lang="en">${ulist(c.lim,'warn')}</div></div></div>
<div class="card" style="margin-top:16px"><div class="ch"><h3>${esc(s.refs)}</h3>${x?`<a class="more" href="${href(x)}">${esc(C.test)}: ${esc(x.t[0])}</a>`:''}</div><div class="cb">${eduBadge()}${refList(c.ref)}</div></div>`;
}
function bindCalc(c){
  const s=S(),C=s.calc,st=CV[c.id],R=$('cRes');
  const run=()=>{
    const v={},msgs=[];let empty=false;
    for(const f of c.in){
      const el=document.querySelector(`.cform [data-k="${f.k}"]`);st.v[f.k]=el.value;
      if(f.opt){v[f.k]=el.value;continue}
      const n=parseFloat(el.value),[lo,hi]=Array.isArray(f.rg)?f.rg:f.rg[st.sys];
      el.removeAttribute('aria-invalid');
      if(el.value.trim()===''||isNaN(n)){empty=true;continue}
      if(n<lo||n>hi){msgs.push(`${f.l}: ${C.range(lo,hi)}`);el.setAttribute('aria-invalid','true');continue}
      v[f.k]=n;
    }
    const o=msgs.length?{err:msgs.join(' ')}:empty?null:c.run(v,st.sys);
    R.className='card cres'+(o?' '+(o.err?'bad':o.cls||'ok'):'');
    R.innerHTML=`<div class="cb"><div class="rlab">${esc(C.result)}</div>${!o?`<p class="note">${esc(C.fill)}</p>`:o.err?`<p class="rerr" dir="ltr" lang="en">${ico('warn')}${esc(o.err)}</p>`
      :`<div class="rval" dir="ltr"><b>${esc(o.v)}</b> <span>${esc(o.u)}</span></div>${o.alt?`<div class="ralt" dir="ltr">= ${esc(o.alt)}</div>`:''}${o.interp?`<p class="rint" dir="ltr" lang="en">${esc(o.interp)}</p>`:''}`}</div>`;
  };
  document.querySelectorAll('.cform [data-k]').forEach(el=>el.oninput=el.onchange=run);
  // switching units clears the unit-dependent numbers rather than silently reinterpreting them
  document.querySelectorAll('[data-sys]').forEach(b=>b.onclick=()=>{if(st.sys===b.dataset.sys)return;st.sys=b.dataset.sys;c.in.forEach(f=>{if(typeof f.u==='object')st.v[f.k]=''});render()});
  $('printBtn').onclick=()=>print();
  run();
}

