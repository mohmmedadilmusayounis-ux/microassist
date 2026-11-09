// router.js: Router, navigation, print page boxes and render(). Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Router ---------- */
function route(){
  const h=location.hash,m=h.match(/^#\/(\w+)(?:\/([\w-]+))?(?:\/(\d+))?/);
  if(!m)return{r:'home'};
  const [,a,b,c]=m;
  if(a==='t'){const br=BR(b),x=br&&ALL.find(y=>y.b===br&&y.i===+c);if(x)return{r:'test',x}}
  if(a==='b'&&BR(b))return{r:'branch',b:BR(b)};
  if(a==='notes'&&BR(b))return{r:'notes',b:BR(b)};
  if(a==='quiz')return{r:'quiz',scope:BR(b)?b:'all'};
  if(a==='flash')return{r:'flash',scope:BR(b)?b:'all'};
  if(a==='case'){const cs=CASES.find(x=>x.id===b);if(cs)return{r:'case',c:cs}}
  if(a==='atlas'||a==='gallery'){const sl=ATLAS.find(x=>x.id===b);return sl?{r:'slide',a:sl}:{r:'atlas'}}
  if(a==='calc'){const cl=CALC_DEF.find(x=>x.id===b);return cl?{r:'calc1',c:cl}:{r:'calc'}}
  if(a==='pre'){const br=BR(b),x=br&&ALL.find(y=>y.b===br&&y.i===+c);return{r:'pre',x:x||null}}
  if(a==='interp')return{r:'interp'};
  if(a==='lab3d'){const x=INSTR.find(y=>y.id===b);return x?{r:'instr',x}:{r:'lab3d'}}
  if(a==='sim'){const sm=SIMS.find(y=>y.id===b);return sm?{r:'sim1',sm}:{r:'sim'}}
  if(a==='compare'){const c=COMPARE.find(y=>y.id===b);return c?{r:'compare1',c}:{r:'compare'}}
  if(a==='anat'){const d=ANAT.find(y=>y.id===b);return d?{r:'anat1',d}:{r:'anat'}}
  if(a==='aquiz')return aqScopes().includes(b)?{r:'aquiz1',scope:b}:{r:'aquiz'};
  if(a==='iquiz')return iqScopes().includes(b)?{r:'iquiz1',scope:b}:{r:'iquiz'};
  if(a==='guide'){const g=GUIDES.find(y=>y.id===b);return g?{r:'guide1',g}:{r:'guide'}}
  if(a==='phys'){const y=PHYS_SYS.find(z=>z.id===b);return y?{r:'phys1',y}:{r:'phys',tab:PHYS_TABS.includes(b)?b:'sys'}}
  if(a==='para'){const p=PARASITES.find(y=>y.id===b);return p?{r:'para1',p}:{r:'para',tab:PARA_TABS.includes(b)?b:'trem'}}
  if(a==='bio'){const p=BIO_PROTO.find(y=>y.id===b);return p?{r:'bio1',p}:{r:'bio',tab:BIO_TABS.includes(b)?b:'waste'}}
  if(['tests','learn','exam','cases','refs','saved','about','search'].includes(a))return{r:a};
  return{r:'home'};
}
const NAVS=[['home','#','home'],['tests','#/tests','grid'],['atlas','#/atlas','image'],['anat','#/anat','body'],['para','#/para','worm'],['phys','#/phys','pulse'],['learn','#/learn','cap'],['calc','#/calc','calc'],['interp','#/interp','pulse'],['pre','#/pre','tube'],['lab3d','#/lab3d','scope'],['sim','#/sim','flask'],['guide','#/guide','case'],['bio','#/bio','shield'],['saved','#/saved','star'],['refs','#/refs','quote'],['about','#/about','info']];
const SECT={home:'home',tests:'tests',branch:'tests',test:'tests',atlas:'atlas',slide:'atlas',learn:'learn',quiz:'learn',exam:'learn',flash:'learn',cases:'learn',case:'learn',notes:'learn',calc:'calc',calc1:'calc',interp:'interp',pre:'pre',lab3d:'lab3d',instr:'lab3d',sim:'sim',sim1:'sim',guide:'guide',guide1:'guide',bio:'bio',bio1:'bio',para:'para',para1:'para',phys:'phys',phys1:'phys',iquiz:'learn',iquiz1:'learn',anat:'anat',anat1:'anat',compare:'atlas',compare1:'atlas',aquiz:'anat',aquiz1:'anat',refs:'refs',saved:'saved',about:'about',search:'home'};
let lastKey='';
// print / PDF: running header, footer note, date and "page n / m" in the @page margin boxes (Chrome, Edge)
const cssStr=t=>'"'+String(t).replace(/[\\"]/g,'\\$&').replace(/\s+/g,' ')+'"';
function pageBoxes(title){
  const s=S(),d=new Date().toLocaleDateString(lang==='ar'?'ar':'en-GB',{year:'numeric',month:'long',day:'numeric'}),f='font:7.5pt Inter,"IBM Plex Sans Arabic",sans-serif;color:#555';
  $('pageBoxes').textContent=`@media print{@page{@top-left{content:${cssStr(s.name+' · '+s.cred)};${f};color:#16489a;font-weight:600}@top-right{content:${cssStr(title)};${f}}`
    +`@bottom-left{content:${cssStr(s.printFoot)};${f};width:60%}@bottom-right{content:${cssStr(d+' · '+location.host+' · ')} counter(page) " / " counter(pages);${f}}}@page:first{@top-left{content:none}@top-right{content:none}}}`;
}
// error boundary: a failure while building or binding one page shows a fallback card instead of a blank screen
function render(){
  try{renderView()}catch(err){showFault(err)}
}
function showFault(err){
  console.error(err);
  try{if(V3){V3.dispose();V3=null}}catch(e){}
  const F=S().fault;
  $('view').innerHTML=`<div class="card fault" role="alert"><div class="cb">${ico('warn')}<h2>${esc(F.h)}</h2><p>${esc(F.p)}</p><div class="btns"><button type="button" class="btn pri" id="faultRetry">${esc(F.retry)}</button><a class="btn" href="#">${esc(F.home)}</a></div></div></div>`;
  $('faultRetry').onclick=render;
}
function renderView(){
  if(V3){V3.dispose();V3=null}   // leaving an instrument page frees the WebGL context
  const s=S(),q=($('q').value||'').toLowerCase().trim(),rt=route(),v=$('view');
  let html,title='',bind=null;
  if(q){html=viewSearch(q);title=s.search}
  else switch(rt.r){
    case 'test':html=viewTest(rt.x);title=rt.x.t[0];bind=()=>bindTest(rt.x);
      if(lastKey!==rt.x.t[0]){recent=[rt.x.t[0],...recent.filter(n=>n!==rt.x.t[0])].slice(0,10);store('lg-recent',recent);if(!viewed.includes(rt.x.t[0])){viewed.push(rt.x.t[0]);store('lg-viewed',viewed)}lastKey=rt.x.t[0]}break;
    case 'branch':html=viewBranch(rt.b);title=bName(rt.b);break;
    case 'tests':html=viewTests();title=s.nav.tests;break;
    case 'learn':html=viewLearn();title=s.learn.h;break;
    case 'quiz':if(!QZ||QZ.exam||QZ.scope!==rt.scope)startQuiz(rt.scope,false);html=viewQuiz();title=s.learn.quiz;bind=bindQuiz;break;
    case 'exam':if(!QZ||!QZ.exam)startQuiz('all',true);html=viewQuiz();title=s.learn.exam;bind=bindQuiz;break;
    case 'flash':if(!FC||FC.scope!==rt.scope)FC={scope:rt.scope,cards:deck(rt.scope),i:0,flip:false};html=viewFlash();title=s.learn.flash;bind=bindFlash;break;
    case 'cases':html=viewCases();title=s.learn.cases;break;
    case 'case':html=viewCase(rt.c);title=rt.c.t;bind=()=>bindCase(rt.c);break;
    case 'calc':html=viewCalcs();title=s.calc.h;bind=bindConv;break;
    case 'calc1':html=viewCalc(rt.c);title=rt.c.t;bind=()=>bindCalc(rt.c);break;
    case 'interp':html=viewInterp();title=s.interp.h;bind=bindInterp;break;
    case 'sim':html=viewSims();title=s.sim.h;break;
    case 'sim1':html=viewSim(rt.sm);title=rt.sm.t;bind=()=>bindSim(rt.sm);break;
    case 'compare':html=viewCompares();title=s.cmp.h;bind=bindCompares;break;
    case 'compare1':html=viewCompare(rt.c);title=cmpName(rt.c);bind=()=>bindCompare(rt.c);break;
    case 'anat':html=viewAnat();title=s.anat.h;break;
    case 'anat1':html=viewAnatOne(rt.d);title=lang==='ar'?rt.d.ar:rt.d.title;bind=()=>bindAnatOne(rt.d);break;
    case 'aquiz':html=viewAQuizzes();title=s.anat.quiz;break;
    case 'aquiz1':html=viewAQuiz(rt.scope);title=s.anat.quiz;bind=()=>bindAQuiz(rt.scope);break;
    case 'iquiz':html=viewIQuizzes();title=s.iquiz.h;break;
    case 'iquiz1':html=viewIQuiz(rt.scope);title=s.iquiz.h;bind=()=>bindIQuiz(rt.scope);break;
    case 'guide':html=viewGuides();title=s.guide.h;break;
    case 'guide1':html=viewGuide(rt.g);title=rt.g.t;bind=()=>bindGuide(rt.g);break;
    case 'phys':html=viewPhys(rt.tab);title=s.phys.h;bind=()=>bindPhys(rt.tab);break;
    case 'phys1':html=viewPhysOne(rt.y);title=phName(rt.y);break;
    case 'para':html=viewPara(rt.tab);title=s.para.h;bind=()=>bindPara(rt.tab);break;
    case 'para1':html=viewParaOne(rt.p);title=rt.p.n;bind=()=>bindParaOne(rt.p);break;
    case 'bio':html=viewBio(rt.tab);title=s.bio.h;bind=()=>bindBio(rt.tab);break;
    case 'bio1':html=viewBioProto(rt.p);title=bioName(rt.p);bind=()=>bindBioProto(rt.p);break;
    case 'pre':if(rt.x)PS.test=rt.x.t[0];html=viewPre();title=s.pre.h;bind=bindPre;break;
    case 'lab3d':html=viewLab3d();title=s.lab3d.h;bind=bindLab3d;break;
    case 'instr':html=viewInstr(rt.x);title=rt.x.name;bind=()=>bindInstr(rt.x);break;
    case 'notes':html=viewNotes(rt.b);title=s.learn.notes;break;
    case 'refs':html=viewRefs();title=s.nav.refs;break;
    case 'saved':html=viewSaved();title=s.nav.saved;break;
    case 'about':html=viewAbout();title=s.nav.about;break;
    case 'atlas':html=viewAtlas();title=s.atlas.h;bind=()=>document.querySelectorAll('[data-cat]').forEach(c=>c.onclick=e=>{e.preventDefault();atlasCat=c.dataset.cat;render()});break;
    case 'slide':html=viewSlide(rt.a);title=rt.a.title;bind=()=>{bindViewer(rt.a);bindToc();document.querySelectorAll('.crumbs [data-cat]').forEach(c=>c.onclick=e=>{e.preventDefault();atlasCat=c.dataset.cat;location.hash='#/atlas'})};break;
    default:html=viewHome();title=s.nav.home;bind=bindHome;
  }
  v.innerHTML=html;$('ptitle').textContent=title;document.title=title+' · '+s.short;$('phTitle').textContent=title;pageBoxes(title);
  const cur=q?'home':SECT[rt.r]||'home';
  document.querySelectorAll('#sidenav a').forEach(a=>a.setAttribute('aria-current',a.dataset.r===cur?'page':'false'));
  document.querySelectorAll('#tabbar a').forEach(a=>a.setAttribute('aria-current',a.dataset.r===(['refs','about','saved','calc','interp','pre','lab3d','sim','guide','anat','bio','para','phys'].includes(cur)?'more':cur)?'page':'false'));
  if(bind)bind();
}

