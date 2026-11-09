// shell.js: Lightbox, toasts, theme, language, start-up. Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Lightbox with zoom ---------- */
let zoom=1;
function openLb(m){if(!m)return;zoom=1;$('lbImg').src=m.f;$('lbImg').alt=m.cap;$('lbImg').style.transform='';$('lbCap').textContent=m.cap+' — '+m.by+' ('+m.lic+')';$('lb').hidden=false}
const setZoom=z=>{zoom=Math.min(5,Math.max(1,z));$('lbImg').style.transform=`scale(${zoom})`};
$('lbIn').onclick=()=>setZoom(zoom+.5);$('lbOut').onclick=()=>setZoom(zoom-.5);$('lbClose').onclick=()=>{$('lb').hidden=true};
$('lbStage').addEventListener('wheel',e=>{e.preventDefault();setZoom(zoom+(e.deltaY<0?.25:-.25))},{passive:false});
addEventListener('keydown',e=>{if(e.key==='Escape')$('lb').hidden=true});

/* ---------- Shell ---------- */
let toastT=0;
// kind: 'info' (default), 'ok' or 'err'; errors stay a little longer
function toast(t,btn,fn,kind='info'){$('toastTxt').textContent=t;const b=$('toastBtn');b.hidden=!btn;if(btn){b.textContent=btn;b.onclick=fn}const el=$('toast');el.dataset.kind=kind;el.hidden=false;clearTimeout(toastT);if(!btn)toastT=setTimeout(()=>el.hidden=true,kind==='err'?4500:2600)}
const THEMES=['auto','light','dark','contrast'];
function applyTheme(){
  const h=document.documentElement;if(theme==='auto')h.removeAttribute('data-theme');else h.setAttribute('data-theme',theme);
  ['themeBtn','themeBtnM'].forEach(id=>{const b=$(id);b.innerHTML=ico({auto:'auto',dark:'moon',light:'sun',contrast:'contrast'}[theme]);b.title=S().theme[theme];b.setAttribute('aria-label',S().theme[theme])});
}
// errors outside render() (event handlers, promises) from this site's own scripts: tell the user, keep the page
let lastErrToast=0;
const errToast=()=>{if(Date.now()-lastErrToast<5000)return;lastErrToast=Date.now();toast(S().fault.toast,null,null,'err')};
addEventListener('error',e=>{if(e.filename&&e.filename.startsWith(location.origin))errToast()});
addEventListener('unhandledrejection',()=>errToast());
// status indicator in the top bar (glowing green online, amber offline)
function netStatus(){
  const on=navigator.onLine!==false,t=on?S().net.stOn:S().net.stOff;
  ['netDot','netDotM'].forEach(id=>{const e=$(id);if(!e)return;e.classList.toggle('off',!on);e.title=t;e.setAttribute('aria-label',t)});
  const tx=$('netTxt');if(tx)tx.textContent=t;
}
addEventListener('offline',()=>{netStatus();toast(S().net.off,null,null,'err')});
addEventListener('online',()=>{netStatus();toast(S().net.on,null,null,'ok')});
function applyLang(){
  const s=S(),h=document.documentElement;h.lang=lang;h.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('.langs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
  $('sbName').textContent=s.short;$('sbCred').textContent=s.cred;$('mbName').textContent=s.short;$('sbFoot').textContent=s.name;$('foot').textContent=s.foot;$('q').placeholder=s.q;
  $('sidenav').innerHTML=NAVS.map(([r,h,ic])=>(r==='saved'?'<div class="sep"></div>':'')+`<a href="${h}" data-r="${r}">${ico(ic)}<span>${esc(s.nav[r])}</span></a>`).join('');
  $('tabbar').innerHTML=[['home','#','home'],['tests','#/tests','grid'],['atlas','#/atlas','image'],['learn','#/learn','cap'],['more','#/about','more']].map(([r,h,ic])=>`<a href="${h}" data-r="${r}"><span class="ic">${ico(ic)}</span><span>${esc(s.tab[r])}</span></a>`).join('');
  $('phName').textContent=s.name;$('phCred').textContent=s.cred;
  try{localStorage.setItem('lg-lang',lang)}catch(e){}
  applyTheme();netStatus();render();
}
document.querySelectorAll('.langs button').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;applyLang()});
['themeBtn','themeBtnM'].forEach(id=>$(id).onclick=()=>{theme=THEMES[(THEMES.indexOf(theme)+1)%THEMES.length];try{localStorage.setItem('lg-theme',theme)}catch(e){}applyTheme()});
// search re-renders after a short pause in typing instead of on every keystroke
let qT=0;
$('q').oninput=()=>{clearTimeout(qT);qT=setTimeout(render,140)};
// a specimen-guide hit in the global search opens the guide already filtered by the same words
$('view').addEventListener('click',e=>{const a=e.target.closest('[data-preq]');if(a){PS.q=a.dataset.preq;PS.cat='all'}
  // an anatomy hit opens its diagram in study mode with that structure selected
  const p=e.target.closest('[data-anpin]');if(p){const[id,k]=p.dataset.anpin.split(':'),d=ANAT.find(x=>x.id===id);if(d){const st=anState(d);st.mode='study';st.sel=+k;st.shown=[]}}});
addEventListener('hashchange',()=>{$('q').value='';if(location.hash==='#/exam'&&QZ&&QZ.exam&&QZ.done)QZ=null;render();scrollTo({top:0,behavior:'instant'})});

/* ---------- Start ---------- */
try{const l=localStorage.getItem('lg-lang');if(l==='ar'||l==='en')lang=l;else if(/^ar\b/i.test(navigator.language||''))lang='ar';const th=localStorage.getItem('lg-theme');if(THEMES.includes(th))theme=th}catch(e){}
applyLang();
if('serviceWorker' in navigator){
  // updates are silent: sw.js fetches network-first, so the newest files load on the next open
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(r=>r.update()).catch(()=>{}));
}
