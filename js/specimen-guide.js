// specimen-guide.js: Pre-analytical specimen collection guide page. Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Pre-analytical phase & specimen collection guide ---------- */
const PS={q:'',cat:'all',test:''};
function viewPre(){
  const s=S(),P=s.pre;
  return `<div class="pagehead"><span class="picon">${ico('tube')}</span><div><h2>${esc(P.h)}</h2><p>${esc(P.p)}</p></div></div>
<div class="card pretools"><div class="cb"><div class="prerow"><label class="cfld prq"><span>${esc(P.filter)}</span><input type="search" id="preQ" value="${esc(PS.q)}" placeholder="${esc(P.q)}" autocomplete="off"></label>
<label class="cfld"><span>${esc(P.lookup)}</span><select id="preT"><option value="">${esc(P.choose)}</option>${LAB.map(b=>`<optgroup label="${esc(bName(b))}">${b.t.map(t=>`<option value="${esc(t[0])}" ${PS.test===t[0]?'selected':''}>${esc(t[0])}</option>`).join('')}</optgroup>`).join('')}</select></label></div>
<div class="chips" role="group">${Object.entries(P.cats).map(([k,l])=>`<button type="button" class="chip" data-pcat="${k}" aria-pressed="${PS.cat===k}">${esc(l)}</button>`).join('')}</div></div></div>
<div id="preRes"></div>`;
}
const tubeCap=t=>`<span class="tcap" style="--cap:${t.cap}${t.cap2?`;--cap2:${t.cap2}`:''}" aria-hidden="true"></span>`;
function preDraw(){
  // every word must match, either as typed or through its synonyms / spelling variants (SYN)
  const s=S(),P=s.pre,words=norm(PS.q).split(' ').filter(Boolean).map(expand),has=txt=>{const l=norm(txt);return words.every(alts=>alts.some(w=>l.includes(w)))};
  const tlink=n=>{const x=byName(n);return x?`<a class="tchip" href="${href(x)}">${esc(n)}</a>`:''};
  const showT=PS.cat==='all'||PS.cat==='tubes';
  const tubes=showT?PRE_TUBES.filter(t=>has([t.name,t.ar,t.capName,t.additive,t.mix,...t.use,...t.notes,...t.tests].join(' '))):[];
  const items=PRE_ITEMS.filter(i=>(PS.cat==='all'||PS.cat===i.c)&&has([i.t,i.ar,P.cats[i.c],...i.pts,...i.tests].join(' ')));
  let look='';
  if(PS.test){const x=byName(PS.test);if(x){const tb=PRE_TUBES.filter(t=>t.tests.includes(PS.test)),rel=PRE_ITEMS.filter(i=>i.tests.includes(PS.test));
    look=`<div class="card prelook"><div class="ch"><h3>${ico('search')}<a href="${href(x)}" dir="ltr">${esc(x.t[0])}</a></h3><button type="button" class="more" id="preTx">×</button></div><div class="cb"><div class="sample">${tubesFor(x.t[2]).length?`<div class="tubes">${tubesFor(x.t[2]).map(([c,l])=>`<span class="tube">${tubeSvg(c)}${esc(l)}</span>`).join('')}</div>`:''}<p dir="ltr" lang="en"><b>${esc(P.spec)}:</b> ${esc(x.t[2])}</p></div>
${tb.length?`<p class="note" dir="ltr" lang="en">${tb.map(t=>`${tubeCap(t)} ${esc(P.step)} ${t.n}: ${esc(t.name)} · ${esc(t.mix)}`).join('<br>')}</p>`:''}
${rel.length?`<h4 class="subh">${esc(P.related)}</h4><ul class="ilist" dir="ltr" lang="en">${rel.map(i=>`<li><b>${esc(i.t)}</b> <span class="badge b-pri">${esc(P.cats[i.c])}</span></li>`).join('')}</ul>`:''}</div></div>`}}
  const strip=showT&&!words.length?`<div class="card"><div class="ch"><h3>${ico('check')}${esc(P.order)}</h3></div><div class="cb"><ol class="odraw" dir="ltr">${PRE_TUBES.map(t=>`<li><a href="#pt-${t.id}" data-pjump="${t.id}">${tubeCap(t)}<b>${t.n}</b><span>${esc(t.name.replace(/ \(.*\)$/,''))}</span><small>${esc(t.capName.split(';')[0])}</small></a></li>`).join('')}</ol><p class="note" style="margin-bottom:0">${esc(P.capNote)}</p></div></div>`:'';
  const tcard=t=>`<div class="card tubec" id="pt-${t.id}" dir="ltr" lang="en"><div class="ch"><h3>${tubeCap(t)}<span class="onum">${t.n}</span>${esc(t.name)}</h3></div><div class="cb"><div class="ar" dir="rtl" lang="ar">${esc(t.ar)}</div><dl class="ipder"><dt>${esc(P.cap)}</dt><dd>${esc(t.capName)}</dd><dt>${esc(P.additive)}</dt><dd>${esc(t.additive)}</dd><dt>${esc(P.mix)}</dt><dd>${esc(t.mix)}</dd><dt>${esc(P.use)}</dt><dd>${esc(t.use.join(', '))}</dd></dl>${ulist(t.notes)}<div class="tchips">${t.tests.map(tlink).join('')}</div><p class="pmeta"><span>${refShort(t.ref)}</span></p></div></div>`;
  const icard=i=>`<div class="card preitem ${i.c}" dir="ltr" lang="en"><div class="cb"><span class="badge ${i.c==='reject'?'b-bad':i.c==='prep'?'b-ok':'b-pri'}">${esc(P.cats[i.c])}</span><h4>${esc(i.t)}</h4><div class="ar" dir="rtl" lang="ar">${esc(i.ar)}</div>${ulist(i.pts,i.c==='reject'?'warn':'')}<div class="tchips">${i.tests.map(tlink).join('')}</div><p class="pmeta"><span>${refShort(i.ref)}</span></p></div></div>`;
  const n=tubes.length+items.length;
  $('preRes').innerHTML=look+strip+`<p class="note precount">${esc(P.n(n))}</p>`+(n?`${tubes.length?`<div class="grid g2 pregrid">${tubes.map(tcard).join('')}</div>`:''}${items.length?`<div class="grid g2 pregrid">${items.map(icard).join('')}</div>`:''}`:`<div class="card empty">${ico('search')}<span>${esc(P.none)}</span></div>`);
  const tx=$('preTx');if(tx)tx.onclick=()=>{PS.test='';$('preT').value='';preDraw()};
  document.querySelectorAll('[data-pjump]').forEach(a=>a.onclick=e=>{e.preventDefault();const el=$('pt-'+a.dataset.pjump);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})});
}
function bindPre(){
  $('preQ').oninput=e=>{PS.q=e.target.value;preDraw()};
  $('preT').onchange=e=>{PS.test=e.target.value;preDraw();if(PS.test)$('preRes').scrollIntoView({block:'start'})};
  document.querySelectorAll('[data-pcat]').forEach(b=>b.onclick=()=>{PS.cat=b.dataset.pcat;document.querySelectorAll('[data-pcat]').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));preDraw()});
  preDraw();
}

