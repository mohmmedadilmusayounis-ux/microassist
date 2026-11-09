// state.js: App state (language, theme, saved/recent/viewed), lookups and small renderers. Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- State ---------- */
// dark research-lab look is the default for new visitors; a theme the visitor picks is remembered (lg-theme)
let lang='en',theme='dark';
const S=()=>STR[lang];
const ALL=LAB.flatMap(b=>b.t.map((t,i)=>({b,i,t})));
const TOTAL=ALL.length,IMGS=Object.entries(IMG).flatMap(([n,l])=>l.map(m=>({...m,test:n})));
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const store=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let saved=load('lg-saved',[]),recent=load('lg-recent',[]),viewed=load('lg-viewed',[]),qhist=load('lg-quiz',[]);
const byName=n=>ALL.find(x=>x.t[0]===n);
const href=x=>`#/t/${x.b.id}/${x.i}`;
const bName=b=>lang==='ar'?b.ar:b.en,bAlt=b=>lang==='ar'?b.en:b.ar;
const BR=id=>LAB.find(b=>b.id===id);

/* ---------- Small renderers ---------- */
const trow=x=>`<a class="trow card" href="${href(x)}"><span class="bi">${ico(BRANCH_IC[x.b.id])}</span><span class="tt"><b>${esc(x.t[0])}</b><small dir="rtl">${esc(x.t[1])}</small></span><span class="go">${ico('next')}</span></a>`;
function donut(parts,size=120,label=''){
  const r=46,c=2*Math.PI*r,tot=parts.reduce((a,p)=>a+p.v,0)||1;let off=0;
  const segs=parts.map(p=>{const l=p.v/tot*c,s=`<circle cx="60" cy="60" r="${r}" fill="none" stroke="${p.c}" stroke-width="14" stroke-dasharray="${l} ${c-l}" stroke-dashoffset="${-off}" transform="rotate(-90 60 60)"/>`;off+=l;return s}).join('');
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true"><circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--sunk)" stroke-width="14"/>${segs}<text x="60" y="66" text-anchor="middle" font-size="18" font-weight="800" fill="var(--text)" font-family="Inter,sans-serif">${esc(label)}</text></svg>`;
}
function lineChart(vals){
  const W=320,H=150,p=24,n=vals.length,mx=100;
  const pts=vals.map((v,i)=>[p+(n===1?0:i*(W-2*p)/(n-1)),H-p-v/mx*(H-2*p)]);
  const grid=[0,25,50,75,100].map(g=>{const y=H-p-g/mx*(H-2*p);return `<line x1="${p}" x2="${W-p}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${p-6}" y="${y+3}" font-size="8" text-anchor="end" fill="var(--faint)">${g}</text>`}).join('');
  const path=pts.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ');
  const area=path+` L ${pts[n-1][0]} ${H-p} L ${pts[0][0]} ${H-p} Z`;
  return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${grid}<path d="${area}" fill="var(--pri)" opacity=".1"/><path d="${path}" fill="none" stroke="var(--pri)" stroke-width="2.4"/>${pts.map(q=>`<circle cx="${q[0]}" cy="${q[1]}" r="3.5" fill="var(--surface)" stroke="var(--pri)" stroke-width="2"/>`).join('')}</svg>`;
}

