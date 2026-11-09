// assistant.js: Lab assistant panel (online version only). Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Lab assistant (answers only from the open test page, via /api/assistant) ---------- */
const AI={test:'',hist:[],busy:false,note:''};
// the assistant needs the Netlify function; on static hosting (e.g. GitHub Pages) the panel is not shown
const HAS_API=/\.netlify\.app$/.test(location.hostname)||['localhost','127.0.0.1'].includes(location.hostname);
function aiPanel(n){
  if(!HAS_API)return '';
  const s=S(),A=s.ai;if(AI.test!==n){AI.test=n;AI.hist=[];AI.note='';AI.busy=false}
  return `<section class="card aibox" id="aiBox"><div class="ch"><h3>${ico('chat')}${esc(A.h)}</h3><button type="button" class="more" id="aiClear">${esc(A.clear)}</button></div><div class="cb"><p class="note" style="margin-top:0">${esc(A.p)}</p><div class="ailog" id="aiLog" aria-live="polite"></div>
<form class="aiform" id="aiForm"><textarea id="aiQ" rows="2" maxlength="1000" placeholder="${esc(A.ph)}" aria-label="${esc(A.ph)}"></textarea><button class="btn pri" type="submit" id="aiSend">${esc(A.send)}</button></form><p class="note aiw">${ico('warn')}<span>${esc(A.note)}</span></p></div></section>`;
}
function aiDraw(){
  const A=S().ai,log=$('aiLog');if(!log)return;
  log.innerHTML=AI.hist.map(m=>m.role==='user'?`<div class="msg me"><small>${esc(A.you)}</small><p>${esc(m.content)}</p></div>`
    :`<div class="msg bot"><small>${esc(A.bot)}</small><p>${esc(m.content)}</p>${m.cites&&m.cites.length?`<details><summary>${esc(A.src)} · ${m.cites.length}</summary>${m.cites.map(c=>`<blockquote dir="ltr" lang="en">${esc(c)}</blockquote>`).join('')}</details>`:''}</div>`).join('')
    +(AI.busy?`<div class="msg bot wait"><small>${esc(A.bot)}</small><p>${esc(A.wait)}</p></div>`:'')+(AI.note?`<p class="ainote">${esc(AI.note)}</p>`:'');
  $('aiSend').disabled=AI.busy;
}
function bindAi(){
  const A=S().ai,f=$('aiForm');if(!f)return;
  $('aiClear').onclick=()=>{AI.hist=[];AI.note='';aiDraw()};
  $('aiQ').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();f.requestSubmit()}};
  f.onsubmit=async e=>{
    e.preventDefault();const q=$('aiQ').value.trim();if(!q||AI.busy)return;
    if(!navigator.onLine){AI.note=A.offline;aiDraw();return}
    const test=AI.test,history=AI.hist.map(m=>({role:m.role,content:m.content})).slice(-8);
    AI.hist.push({role:'user',content:q});AI.busy=true;AI.note='';$('aiQ').value='';aiDraw();
    try{
      const r=await fetch('/api/assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({test,question:q,history,lang})});
      const d=await r.json().catch(()=>({}));
      if(AI.test!==test)return;
      if(r.ok&&d.parts){AI.hist.push({role:'assistant',content:d.parts.map(p=>p.text).join('').trim(),cites:[...new Set(d.parts.flatMap(p=>p.cites||[]))]})}
      else{AI.hist.pop();$('aiQ').value=q;AI.note=d.refused?A.refused:r.status===429?A.busy:d.error==='not_configured'?A.notcfg:A.err}
    }catch(err){if(AI.test!==test)return;AI.hist.pop();$('aiQ').value=q;AI.note=A.err}
    AI.busy=false;aiDraw();
  };
  aiDraw();
}

