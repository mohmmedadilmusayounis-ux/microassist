// interpreter.js: Lab results interpreter page. Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Lab results interpreter ---------- */
const IPS={c:{sex:'',age:'',fasting:false},v:{}};   // entered values stay in memory only
const flagBadge=f=>{const L=S().interp.fl;return `<span class="badge ${f==='N'?'b-ok':f.length===2?'b-bad':'b-warn'}">${esc(L[f])}</span>`};
// with sex unknown, use the widest interval across sexes so nothing is flagged on a guessed sex
const ipRIc=(f,c)=>{if(f.k==='glu'&&!c.fasting)return[3.9,11.1];if(Array.isArray(f.ri)||c.sex)return ipRI(f,c.sex);const a=f.ri.M,b=f.ri.F;return[a[0]==null||b[0]==null?null:Math.min(a[0],b[0]),a[1]==null||b[1]==null?null:Math.max(a[1],b[1])]};
const riText=(f,c)=>{const[lo,hi]=ipRIc(f,c);return lo==null?`< ${hi}`:hi==null?`> ${lo}`:`${lo}–${hi}`};
function viewInterp(){
  const s=S(),I=s.interp,c=IPS.c,fld=f=>`<label class="cfld"><span>${esc(f.l)} <em>(${esc(f.u)})</em></span><input type="number" inputmode="decimal" step="any" data-ip="${f.k}" value="${esc(IPS.v[f.k]||'')}"><small class="iphint" dir="ltr">${esc(riText(f,ipC()))}${f.k==='glu'?(c.fasting?' · fasting':' · random'):''}</small></label>`;
  const grp=(g,h,ic)=>`<div class="card"><div class="ch"><h3>${ico(ic)}${esc(h)}</h3></div><div class="cb"><div class="cform ipf" dir="ltr" lang="en">${IP_FIELDS.filter(f=>f.g===g).map(fld).join('')}</div></div></div>`;
  return `<div class="pagehead"><span class="picon">${ico('pulse')}</span><div><h2>${esc(I.h)}</h2><p>${esc(I.p)}</p></div></div>
<div class="iptop"><span class="note">${ico('shield')}${esc(I.privacy)}</span><div class="chips"><span class="note">${esc(I.ex)}:</span>${IP_EX.map(e=>`<button type="button" class="chip" data-ex="${e.id}">${esc(e.l)}</button>`).join('')}<button type="button" class="chip ghost" id="ipClear">${esc(I.clear)}</button></div></div>
<div class="ipgrid"><div class="ipform">
<div class="card"><div class="ch"><h3>${ico('case')}${esc(I.patient)}</h3></div><div class="cb"><div class="cform ipf"><label class="cfld"><span>${esc(I.sex)}</span><select id="ipSex"><option value="">—</option><option value="F" ${c.sex==='F'?'selected':''}>${esc(I.female)}</option><option value="M" ${c.sex==='M'?'selected':''}>${esc(I.male)}</option></select></label><label class="cfld"><span>${esc(I.age)}</span><input type="number" inputmode="numeric" id="ipAge" min="0" max="120" value="${esc(c.age)}"></label><label class="ipchk"><input type="checkbox" id="ipFast" ${c.fasting?'checked':''}><span>${esc(I.fasting)}</span></label></div></div></div>
${grp('cbc',I.cbc,'drop')}${grp('chem',I.chem,'flask')}</div>
<div class="ipres" id="ipRes" aria-live="polite"></div></div>`;
}
const ipC=()=>({sex:IPS.c.sex,age:IPS.c.age===''?null:+IPS.c.age,fasting:IPS.c.fasting});
const refShort=ids=>ids.filter(r=>REFS[r]).map(r=>esc(REFS[r].c.split('.')[0])).join(' · ');
function ipDraw(){
  const s=S(),I=s.interp,c=ipC(),v={},F={},bad=[];
  for(const f of IP_FIELDS){
    const el=document.querySelector(`[data-ip="${f.k}"]`),raw=(IPS.v[f.k]||'').trim();if(el){el.removeAttribute('aria-invalid');el.className=''}
    if(!raw)continue;const n=parseFloat(raw);
    if(isNaN(n)||n<f.rg[0]||n>f.rg[1]){bad.push(`${f.l}: ${s.calc.range(f.rg[0],f.rg[1])}`);if(el)el.setAttribute('aria-invalid','true');continue}
    v[f.k]=n;F[f.k]=ipFlag({...f,ri:ipRIc(f,c)},n,c);if(el&&F[f.k]!=='N')el.className='ipfl-'+F[f.k];
  }
  const keys=Object.keys(v),R=$('ipRes');
  if(!keys.length&&!bad.length){R.innerHTML=`<div class="card empty">${ico('pulse')}<span>${esc(I.none)}</span></div>`;return}
  const crit=IP_FIELDS.filter(f=>F[f.k]==='LL'||F[f.k]==='HH');
  const der=IP_DERIVED.map(d=>({d,o:d.run(v,c)})).filter(x=>x.o&&!x.o.err);
  const order={bad:0,warn:1,info:2},pats=IP_RULES.map(r=>r(v,F,c)).filter(Boolean).sort((a,b)=>order[a.lvl]-order[b.lvl]);
  const tlink=n=>{const x=byName(n);return x?`<a href="${href(x)}">${esc(n)}</a>`:esc(n)};
  R.innerHTML=`${bad.length?`<div class="card ipbad"><div class="cb">${ico('warn')}<span dir="ltr" lang="en">${esc(bad.join(' '))}</span></div></div>`:''}
${crit.length?`<div class="card critbox"><div class="cb"><b>${ico('warn')}${esc(I.crit)}</b><ul dir="ltr" lang="en">${crit.map(f=>`<li><b>${esc(f.l)}: ${esc(v[f.k])} ${esc(f.u)}</b> (${esc(I.fl[F[f.k]])}: ${F[f.k]==='LL'?'&lt;':'&gt;'} ${esc(f.crit[F[f.k]==='LL'?0:1])})</li>`).join('')}</ul></div></div>`:''}
<div class="card"><div class="ch"><h3>${ico('grid')}${esc(I.flags)}</h3></div><div class="cb scroll-x"><table class="tbl iptbl" dir="ltr" lang="en"><thead><tr><th>${esc(I.param)}</th><th>${esc(I.value)} · ${esc(I.flag)}</th><th>${esc(I.ri)}</th></tr></thead><tbody>${IP_FIELDS.filter(f=>f.k in v).map(f=>`<tr class="${F[f.k]==='N'?'':'flagged'}"><td>${tlink(f.test).replace(esc(f.test),esc(f.l))}</td><td><b>${esc(v[f.k])}</b> <span class="u">${esc(f.u)}</span><br>${flagBadge(F[f.k])}</td><td class="note">${esc(riText(f,c))}</td></tr>`).join('')}</tbody></table>${eduBadge()}</div></div>
${der.length?`<div class="card"><div class="ch"><h3>${ico('calc')}${esc(I.derived)}</h3></div><div class="cb"><dl class="ipder" dir="ltr" lang="en">${der.map(({d,o})=>`<dt>${d.calc?`<a href="#/calc/${d.calc}">${esc(d.l)}</a>`:esc(d.l)}</dt><dd><b>${esc(o.v)}</b> ${esc(o.u||'')}${o.interp?`<small>${esc(o.interp)}</small>`:''}</dd>`).join('')}</dl></div></div>`:''}
<h3 class="grp">${esc(I.pat)} · ${pats.length}</h3>
${pats.length?pats.map(p=>`<div class="card pcard ${p.lvl}" dir="ltr" lang="en"><div class="cb"><h4>${esc(p.h)}</h4><p>${esc(p.p)}</p>${p.ddx.length?`<div class="pl"><b>${esc(I.ddx)}</b>${ulist(p.ddx)}</div>`:''}${p.next.length?`<div class="pl"><b>${esc(I.next)}</b><div class="tchips">${p.next.map(n=>`<span class="tchip">${tlink(n)}</span>`).join('')}</div></div>`:''}<p class="pmeta">${p.calc?`<a href="#/calc/${p.calc}">${ico('calc')}${esc(CALC_DEF.find(x=>x.id===p.calc).t)}</a>`:''}${p.cs?`<a href="#/case/${p.cs}">${ico('case')}${esc(I.openCase)}</a>`:''}<span>${refShort(p.ref)}</span></p></div></div>`).join(''):`<div class="card empty">${ico('check')}<span>${esc(I.nopat)}</span></div>`}
<details class="card ipcl"><summary>${esc(I.critList)}</summary><div class="cb"><p class="note">${esc(I.critNote)}</p><table class="tbl" dir="ltr" lang="en"><tbody>${IP_FIELDS.filter(f=>f.crit).map(f=>`<tr><th>${esc(f.l)}</th><td>${f.crit[0]!=null?'&lt; '+esc(f.crit[0]):''}${f.crit[0]!=null&&f.crit[1]!=null?' · ':''}${f.crit[1]!=null?'&gt; '+esc(f.crit[1]):''} ${esc(f.u)}</td><td class="note">${f.cs==='platform'?esc(I.platformSrc):refShort([f.cs])}</td></tr>`).join('')}</tbody></table></div></details>
<p class="note ipdisc">${ico('info')}<span>${esc(I.disc)}</span></p>`;
}
function bindInterp(){
  document.querySelectorAll('[data-ip]').forEach(el=>el.oninput=()=>{IPS.v[el.dataset.ip]=el.value;ipDraw()});
  $('ipSex').onchange=e=>{IPS.c.sex=e.target.value;render()};      // intervals in the hints change with sex
  $('ipAge').oninput=e=>{IPS.c.age=e.target.value;ipDraw()};
  $('ipFast').onchange=e=>{IPS.c.fasting=e.target.checked;render()};
  document.querySelectorAll('[data-ex]').forEach(b=>b.onclick=()=>{const e=IP_EX.find(x=>x.id===b.dataset.ex);IPS.c={sex:e.c.sex,age:String(e.c.age),fasting:!!e.c.fasting};IPS.v=Object.fromEntries(Object.entries(e.v).map(([k,x])=>[k,String(x)]));render()});
  $('ipClear').onclick=()=>{IPS.c={sex:'',age:'',fasting:false};IPS.v={};render()};
  ipDraw();
}

