/* ---------- Laboratory instruments: schematic 3D models and viewer ---------- */
// Loaded on demand (dynamic import) from app.js when the "3D model" tab is opened. Models are schematic:
// built from simple shapes in code, with named parts that match INSTR[].parts in instruments.js. 1 unit ≈ 10 cm.
import {Scene,PerspectiveCamera,WebGLRenderer,Group,Mesh,MeshStandardMaterial,BoxGeometry,CylinderGeometry,
  TorusGeometry,SphereGeometry,CircleGeometry,ConeGeometry,HemisphereLight,DirectionalLight,Vector3,Vector2,Raycaster,Box3,Color,
  BufferGeometry,Float32BufferAttribute,Points,PointsMaterial,SRGBColorSpace,ACESFilmicToneMapping,OrbitControls} from './three.min.js';

const C={body:0xe9edf2,dark:0x3a4352,steel:0xaab3bf,blue:0x1f63c6,wax:0xf2e8cf,glass:0xcfe8ff,red:0xd23f57,black:0x1c2029,
  amber:0xd99b2b,cold:0x8fc6ee,white:0xfafbfc,green:0x22966a,blood:0x8e1b24,plasma:0xf1d58a,purple:0x7a5bd6};
const mk=(geo,c,o={})=>new Mesh(geo,new MeshStandardMaterial({color:c,roughness:.5,metalness:.05,...o}));
const metal=c=>({color:c,metalness:.65,roughness:.3});
const box=(w,h,d,c,o)=>mk(new BoxGeometry(w,h,d),c,o);
const cyl=(rt,rb,h,c,o,s=32)=>mk(new CylinderGeometry(rt,rb,h,s),c,o);
const sph=(r,c,o)=>mk(new SphereGeometry(r,20,14),c,o);
const glass=(op=.25)=>({transparent:true,opacity:op,roughness:.1,metalness:0,depthWrite:false});
const glow=c=>({emissive:c,emissiveIntensity:.8});
function at(m,x,y,z,rx=0,ry=0,rz=0){m.position.set(x,y,z);m.rotation.set(rx,ry,rz);return m}
function wheel(r,c){ // handwheel in the y–z plane, turning about x
  const g=new Group(),rim=mk(new TorusGeometry(r,r*.09,12,48),c,metal(c));rim.rotation.y=Math.PI/2;g.add(rim);
  for(let i=0;i<3;i++){const s=box(r*.07,r*2,r*.09,c,metal(c));s.rotation.x=i*Math.PI/3;g.add(s)}
  const hub=cyl(r*.2,r*.2,r*.3,C.dark);hub.rotation.z=Math.PI/2;g.add(hub);
  const h=cyl(r*.08,r*.08,r*.55,C.black);h.rotation.z=Math.PI/2;h.position.set(r*.3,r*.9,0);g.add(h);return g;
}
const grp=(...ms)=>{const g=new Group();ms.forEach(m=>g.add(m));return g};
const tube=(c,h=.5)=>grp(at(cyl(.05,.05,h,C.glass,glass(.45)),0,0,0),at(cyl(.045,.045,h*.6,c),0,-h*.18,0),at(cyl(.06,.06,.08,C.purple),0,h/2,0));
const screen=(w,h)=>box(w,h,.03,0x18325e,glow(0x1f63c6));

class Model{
  constructor(){this.root=new Group();this.parts={}}
  // add objects (positioned in model space) to a named part; ex = direction the part moves in the exploded view
  add(id,ex,...objs){
    let g=this.parts[id];
    if(!g){g=new Group();g.userData={part:id,ex:new Vector3(...(ex||[0,0,0]))};this.parts[id]=g;this.root.add(g)}
    objs.forEach(o=>{o.traverse(m=>{m.userData.part=id;if(o.userData.soft)m.userData.soft=true});g.add(o)});
    return objs[0];
  }
}
const soft=o=>{o.userData.soft=true;return o};   // see-through covers: picked only when nothing else is under the pointer
function particles(n,spread,c=0xe6f3ff,size=.04){const p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(Math.random()-.5)*spread[0];p[i*3+1]=Math.random()*spread[1];p[i*3+2]=(Math.random()-.5)*spread[2]}
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(p,3));return new Points(g,new PointsMaterial({color:c,size,transparent:true,opacity:.75,depthWrite:false}))}

/* ---------- builders: each fills the model and returns update(t) → status text ---------- */
const BUILD={
/* ===== Histopathology ===== */
microtome(M){
  M.add('base',[0,-.9,0],at(box(3.4,.3,2.4,C.dark),0,.15,0));
  M.add('feed',[-.6,.2,-1],at(box(1.7,1.9,1.5,C.body),-.2,1.25,-.2),at(box(1.76,.08,1.56,C.blue),-.2,2.2,-.2));
  const hw=M.add('handwheel',[1.3,0,0],at(wheel(.62,C.steel),.85,1.3,-.2));
  M.add('handwheel',null,at(box(.12,.25,.12,C.red),.72,.55,-.2));   // handwheel lock
  M.add('coarse',[-1.1,0,0],at(cyl(.26,.26,.12,C.dark),-1.11,1.45,-.2,0,0,Math.PI/2));
  M.add('thickness',[0,.5,.6],at(cyl(.16,.16,.08,C.blue),-.75,1.8,.58,Math.PI/2),at(box(.4,.16,.02,C.black),-.2,1.85,.56));
  const clamp=M.add('clamp',[0,.4,1.1],at(box(.7,.55,.45,C.steel,metal(C.steel)),-.2,1.6,.78));
  const block=M.add('block',[0,.6,1.8],at(box(.46,.38,.14,C.white),-.2,1.6,1.07));
  const face=M.add('block',null,at(box(.36,.3,.06,C.wax),-.2,1.6,1.16));
  M.add('knifeholder',[0,-.4,1.2],at(box(1.6,.35,.55,C.steel,metal(C.steel)),-.2,.78,1.32));
  M.add('blade',[0,0,1.9],at(box(1.3,.025,.24,0xdfe5ec,metal(0xdfe5ec)),-.2,.99,1.27,-.28));
  M.add('guard',[0,.5,2.2],at(box(1.32,.06,.06,C.red),-.2,1.04,1.41));
  M.add('tray',[0,-.6,1.6],at(box(2.1,.08,.85,C.black),-.2,.34,1.8));
  const rib=[];for(let i=0;i<7;i++)rib.push(M.add('ribbon',[0,.3,2.6],at(box(.36,.006,.3,C.wax),-.2,.98-i*.07,1.5+i*.29,.24)));
  return t=>{
    const a=t*1.8;hw.rotation.x=a;
    const y=1.32+.28*Math.cos(a);clamp.position.y=block.position.y=face.position.y=y;
    const n=Math.floor(a/(2*Math.PI))%8;rib.forEach((r,i)=>r.visible=i<n);
    return n?`Stroke ${n}: a section is cut at the set thickness and joins the ribbon.`:'Trimming the block face, then cutting begins.';
  };
},
processor(M){
  const ST=[['10% NBF','fixation',0xe8c46a],['70% alcohol','dehydration',0xbcd7f2],['90% alcohol','dehydration',0xb0cff0],['100% alcohol','dehydration',0xa4c7ee],['100% alcohol','dehydration',0xa4c7ee],['100% alcohol','dehydration',0xa4c7ee],
    ['Xylene','clearing',0xf3efb0],['Xylene','clearing',0xf3efb0],['Xylene','clearing',0xf3efb0],['Paraffin wax','infiltration',C.wax],['Paraffin wax','infiltration',C.wax],['Paraffin wax','infiltration',C.wax]];
  const R=1.45,pos=i=>{const th=i*Math.PI/6;return[R*Math.cos(th),-R*Math.sin(th)]};
  M.add('base',[0,-.8,0],at(cyl(2.05,2.15,.35,C.body),0,.175,0));
  M.add('panel',[0,0,1],at(box(1.1,.4,.12,C.dark),0,.3,2.12,-.3),at(box(.7,.22,.02,C.blue),0,.32,2.19,-.3));
  ST.forEach(([,,c],i)=>{const[x,z]=pos(i);
    if(i<9)M.add('reagents',[x*.35,.2,z*.35],at(cyl(.3,.28,.72,C.glass,glass(.35)),x,.71,z),at(cyl(.27,.25,.5,c,{transparent:true,opacity:.8}),x,.62,z));
    else M.add('wax',[x*.35,.2,z*.35],at(cyl(.34,.34,.75,C.steel,metal(C.steel)),x,.72,z),at(cyl(.3,.3,.02,C.wax),x,1.1,z),at(box(.14,.08,.08,C.red),x*1.24,.45,z*1.24));});
  M.add('column',[0,-.3,0],at(cyl(.22,.25,2.3,C.body),0,1.5,0),at(cyl(.3,.3,.18,C.dark),0,2.65,0));
  const arm=M.add('arm',[0,.9,0],grp(at(box(R+.15,.14,.22,C.dark),(R+.15)/2,2.66,0),at(cyl(.035,.035,.9,C.steel,metal(C.steel)),R,2.2,0)));
  const bm=at(cyl(.22,.22,.42,C.steel,{...metal(C.steel),wireframe:true}),R,1.6,0),cas=[];
  const bk=M.add('basket',[0,1.3,0],grp(bm));for(let i=0;i<4;i++){const c=at(box(.08,.3,.26,[C.blue,C.green,C.amber,C.red][i]),R-.15+i*.1,1.6,0);bk.add(c);c.userData.part='basket';cas.push(c)}
  M.add('hood',[0,1.8,0],soft(at(mk(new SphereGeometry(2.08,40,14,0,Math.PI*2,0,Math.PI/2),C.glass,glass(.12)),0,.35,0)));
  M.parts.hood.scale.y=.62;
  const T=2.6;
  return t=>{
    const s=Math.floor(t/T)%12,u=(t%T)/T,th=s*Math.PI/6+(u>.78?(u-.78)/.22*Math.PI/6:0);
    arm.rotation.y=bk.rotation.y=th;
    const dip=u<.12?u/.12:u<.6?1:u<.78?1-(u-.6)/.18:0,y=1.95-dip*1.05;bm.position.y=y;cas.forEach(c=>c.position.y=y);
    return `Station ${s+1} of 12 · ${ST[s][0]} — ${ST[s][1]}`;
  };
},
embedding(M){
  M.add('console',[0,-.7,0],at(box(3.0,1.0,1.6,C.body),0,.5,0),at(box(.8,.18,.03,C.dark),-.9,.75,.81));
  M.add('hotplate',[0,.15,.5],at(box(2.6,.06,1.0,0xc9d0d8,metal(0xc9d0d8)),0,1.03,.25));
  M.add('reservoir',[0,.9,-.7],at(box(1.2,.8,.6,C.body),0,1.5,-.45),at(box(1.24,.08,.64,C.blue),0,1.94,-.45),at(box(.6,.12,.02,C.dark),0,1.6,-.14));
  M.add('nozzle',[0,.5,.5],at(box(.16,.1,.3,C.dark),0,1.3,-.05),at(cyl(.045,.025,.22,C.steel,metal(C.steel)),0,1.17,.07));
  const stream=M.add('nozzle',null,at(cyl(.015,.015,.07,C.amber,{transparent:true,opacity:.75}),0,1.08,.07));
  M.add('cassettebath',[-.9,.4,0],at(box(.75,.14,.8,C.dark),-1.05,1.08,.25),at(box(.68,.02,.72,C.wax,{transparent:true,opacity:.7}),-1.05,1.14,.25));
  for(let i=0;i<6;i++)M.add('cassettebath',null,at(box(.09,.18,.26,[C.blue,C.green,C.white][i%3]),-1.3+i*.1,1.17,.25));
  M.add('mouldwarmer',[.9,.6,-.4],at(box(.62,.4,.6,C.body),1.1,1.26,-.45),at(box(.5,.28,.02,C.glass,glass(.5)),1.1,1.26,-.14));
  M.add('forceps',[.6,.5,.6],at(cyl(.06,.06,.08,C.dark),.85,1.07,.62),at(cyl(.06,.06,.08,C.dark),1.05,1.07,.62),at(box(.025,.4,.025,C.steel,metal(C.steel)),.85,1.24,.62,.2),at(box(.025,.4,.025,C.steel,metal(C.steel)),1.05,1.24,.62,-.2));
  M.add('coldspot',[0,.3,.8],at(box(.3,.065,.3,C.cold),.45,1.05,.45));
  M.add('coldplate',[1.2,-.3,0],at(box(1.2,.45,1.2,C.body),2.45,.225,.1),at(box(1.1,.04,1.1,C.cold),2.45,.47,.1));
  const tray=box(.32,.08,.26,0xc0c7d0,metal(0xc0c7d0)),fill=box(.28,.06,.22,C.amber,{transparent:true,opacity:.7}),cas=box(.34,.05,.28,C.blue);
  fill.position.y=.02;cas.position.y=.08;const mould=M.add('mould',[0,.8,1.4],grp(tray,fill,cas));
  const A=new Vector3(0,1.1,.07),B=new Vector3(2.45,.53,.1),molten=new Color(C.amber),solid=new Color(C.wax);
  return t=>{
    const u=t%9;
    if(u<3){mould.position.copy(A);fill.scale.y=Math.max(.05,u/3);cas.visible=u>2.2;stream.visible=u<2.2;fill.material.color.copy(molten);fill.material.opacity=.7;return 'Molten wax fills the warm mould; the tissue is oriented and the cassette placed on top.'}
    stream.visible=false;cas.visible=true;fill.scale.y=1;
    if(u<5){const k=(u-3)/2;mould.position.lerpVectors(A,B,k);mould.position.y+=Math.sin(k*Math.PI)*.35;return 'The filled mould is moved to the cold plate.'}
    mould.position.copy(B);const k=Math.min(1,(u-5)/3);fill.material.color.copy(molten).lerp(solid,k);fill.material.opacity=.7+.3*k;
    return 'On the cold plate the wax solidifies into a block.';
  };
},
floatbath(M){
  M.add('bath',[0,-.6,0],at(cyl(1.1,1.12,.55,C.body),0,.275,0));
  M.add('basin',[0,.25,0],at(cyl(.97,.97,.02,C.black),0,.53,0));
  M.add('water',[0,.6,0],soft(at(cyl(.97,.97,.012,0x6aa9e0,glass(.3)),0,.555,0)));
  M.add('thermostat',[0,0,.8],at(box(.7,.26,.16,C.dark),0,.28,1.08),at(box(.3,.1,.02,0x2bd18a,glow(0x1a8f5c)),-.12,.3,1.17),at(cyl(.06,.06,.05,C.steel,metal(C.steel)),.2,.28,1.18,Math.PI/2));
  const rib=[];for(let i=0;i<5;i++)rib.push(M.add('ribbon',[0,.9,0],at(box(.26,.006,.22,C.wax),-.55+i*.27,.565,0)));
  const slide=M.add('slide',[0,1,.8],at(box(.27,.012,.78,C.glass,glass(.55)),.58,.5,.35,-.9));
  const sec=M.add('slide',null,at(box(.24,.006,.2,C.wax),.58,.5,.35,-.9));
  M.add('dryer',[1,-.4,0],at(box(1.6,.32,1.1,C.body),2.3,.16,0),at(box(1.5,.03,1.0,0xc9a36a,metal(0xc9a36a)),2.3,.335,0));
  for(let i=0;i<3;i++)M.add('dryer',null,at(box(.26,.012,.76,C.glass,glass(.6)),1.95+i*.35,.36,.05));
  M.add('rack',[.8,.6,-.6],at(box(1.1,.08,.25,C.dark),2.3,.39,-.38));
  for(let i=0;i<5;i++)M.add('rack',null,at(box(.012,.5,.24,C.glass,glass(.6)),1.9+i*.2,.65,-.38));
  return t=>{
    const u=t%8,w=Math.max(0,1-u/3);rib.forEach((r,i)=>{r.rotation.z=Math.sin(u*6+i)*.18*w;r.position.y=.565+Math.abs(Math.sin(u*5+i))*.02*w});
    if(u<3){slide.position.y=sec.position.y=.5;sec.visible=false;rib[4].visible=true;return 'The ribbon relaxes on the warm water and the wrinkles flatten.'}
    const k=Math.min(1,(u-3)/2.5);rib[4].visible=k<.3;sec.visible=k>=.3;
    slide.position.y=sec.position.y=.5+k*.5;slide.rotation.x=sec.rotation.x=-.9+k*.4;
    return k<1?'A labelled slide is slipped under a section and lifted out.':'The slide drains, then dries on the hot plate.';
  };
},
stainer(M){
  const ST=[['Xylene','dewax',0xf3efb0],['Xylene','dewax',0xf3efb0],['100% alcohol','rehydrate',0xbcd7f2],['70% alcohol','rehydrate',0xcfe2f6],['Water','rinse',0x8fc0ee],['Haematoxylin','stain nuclei',0x4b2a7a],['Acid-alcohol','differentiate',0xf1c9d2],['Bluing','blue nuclei',0x3b6fd6],['Eosin','stain cytoplasm',0xe36b9a],['Alcohol → xylene','dehydrate and clear',0xf3efb0]];
  const X=i=>-1.85+i*.4;
  M.add('cabinet',[0,-.8,0],at(box(4.6,1.0,1.6,C.body),0,.5,0));
  M.add('hood',[0,1.4,0],soft(at(box(4.4,.95,1.45,C.glass,glass(.12)),0,1.5,0)));
  M.add('loader',[-.6,0,.9],at(box(.62,.3,.42,C.dark),-1.95,.62,.86),at(box(.4,.05,.03,C.steel,metal(C.steel)),-1.95,.65,1.08));
  ST.forEach(([,,c],i)=>M.add('stations',[0,.3,.4],at(box(.34,.36,.5,C.glass,glass(.3)),X(i),1.18,.2),at(box(.3,.28,.46,c,{transparent:true,opacity:.85}),X(i),1.15,.2)));
  M.add('gantry',[0,.9,-.7],at(box(4.4,.08,.1,C.steel,metal(C.steel)),0,1.9,-.35),at(box(.08,.9,.08,C.steel,metal(C.steel)),-2.15,1.45,-.35),at(box(.08,.9,.08,C.steel,metal(C.steel)),2.15,1.45,-.35));
  const car=M.add('arm',[0,1.3,-.5],at(box(.3,.22,.3,C.dark),X(0),1.9,-.2));
  const rod=M.add('arm',null,at(cyl(.03,.03,.5,C.steel,metal(C.steel)),X(0),1.7,.2));
  const rk=[box(.3,.06,.36,C.steel,metal(C.steel))];for(let i=0;i<6;i++){const s=box(.012,.28,.24,C.glass,glass(.65));s.position.set(-.12+i*.048,-.16,0);rk.push(s)}
  const rack=M.add('rack',[0,1.6,.4],grp(...rk));
  M.add('filter',[.8,.9,-.5],at(box(.8,.32,.3,C.dark),1.3,2.12,-.55));
  M.add('coverslipper',[1.3,-.4,0],at(box(1.4,1.3,1.6,C.body),3.12,.65,0),at(box(.9,.5,.03,C.glass,glass(.4)),3.12,1.0,.81));
  M.add('mountant',[1.2,.8,.4],at(cyl(.09,.09,.3,C.amber,{transparent:true,opacity:.85}),2.85,1.45,.25),at(cyl(.015,.015,.25,C.steel,metal(C.steel)),2.85,1.2,.25));
  M.add('coverglass',[1.6,.8,-.4],at(box(.4,.3,.3,C.glass,glass(.5)),3.4,1.45,-.25));
  const T=1.8,N=ST.length;
  return t=>{
    const s=Math.floor(t/T)%(N+2),u=(t%T)/T;
    if(s>=N){const x=X(N-1)+(s===N?u:1)*(3.12-X(N-1));car.position.x=rod.position.x=x;rack.position.set(x,1.55,.2);return s===N?'The rack goes to the coverslipper.':'Mountant and a coverslip are applied to each slide.'}
    const x=X(s)+(u>.8?(u-.8)/.2*.4:0),dip=u<.15?u/.15:u<.65?1:u<.8?1-(u-.65)/.15:0;
    car.position.x=rod.position.x=x;rack.position.set(x,1.62-dip*.42,.2);
    return `Station ${s+1} of ${N} · ${ST[s][0]} — ${ST[s][1]}`;
  };
},
cryostat(M){
  M.add('cabinet',[0,-.7,0],at(box(2.4,1.6,1.6,C.body),0,.8,0),at(box(.1,1.0,1.6,C.body),-1.15,2.1,0),at(box(.1,1.0,1.6,C.body),1.15,2.1,0),at(box(2.4,.12,1.6,C.body),0,2.66,0));
  M.add('chamber',[0,0,-.9],at(box(2.2,.95,.06,0x2a3242),0,2.1,-.77),at(box(2.2,.04,1.5,0xdfeaf5),0,1.62,0));
  M.add('window',[0,.6,1.2],soft(at(box(2.2,.62,.03,C.glass,glass(.22)),0,2.28,.8)));
  M.add('panel',[.6,0,.6],at(box(.8,.26,.05,C.dark),.6,1.42,.82),at(box(.4,.12,.02,C.blue,glow(0x174a96)),.5,1.43,.85));
  M.add('compressor',[0,-.4,.6],at(box(1.8,.55,.03,C.dark),0,.45,.81));
  for(let i=0;i<6;i++)M.add('compressor',null,at(box(1.6,.03,.02,C.steel),0,.27+i*.07,.83));
  const hw=M.add('handwheel',[1,0,0],at(wheel(.5,C.steel),1.32,1.85,0));
  const head=M.add('specimenhead',[0,.5,-.6],at(box(.4,.5,.4,C.steel,metal(C.steel)),.1,2.2,-.3));
  const chuck=M.add('chuck',[0,.7,.2],at(cyl(.13,.13,.12,C.dark),.1,2.2,-.05,Math.PI/2));
  const oct=M.add('chuck',null,at(box(.2,.2,.07,C.white),.1,2.2,.04));
  M.add('knifeholder',[0,-.4,.5],at(box(.9,.2,.38,C.steel,metal(C.steel)),.1,1.78,.12));
  M.add('blade',[0,0,1],at(box(.8,.02,.13,0xdfe5ec,metal(0xdfe5ec)),.1,1.9,.06,-.2));
  M.add('antiroll',[0,.5,.9],at(box(.55,.015,.15,C.glass,glass(.5)),.1,1.93,.1,-.2),at(box(.08,.12,.08,C.dark),.42,1.97,.12));
  const sec=M.add('antiroll',null,at(box(.18,.004,.14,C.white),.1,1.925,.1,-.2));
  M.add('freezeshelf',[-.8,.3,0],at(box(.5,.05,.55,C.cold),-.7,1.7,-.25),at(cyl(.1,.1,.1,C.dark),-.8,1.78,-.3),at(cyl(.1,.1,.1,C.dark),-.58,1.78,-.15));
  const fog=particles(60,[2,.8,1.3]);fog.position.y=1.7;M.root.add(fog);   // cold vapour (decoration, not a part)
  return t=>{
    const a=t*1.6;hw.rotation.x=a;const y=2.05+.18*Math.cos(a);head.position.y=chuck.position.y=oct.position.y=y;
    sec.scale.x=Math.min(1,((a/(2*Math.PI))%1)*2.2);
    const p=fog.geometry.attributes.position;for(let i=0;i<p.count;i++){let yy=p.getY(i)+.004;if(yy>.8)yy=0;p.setY(i,yy)}p.needsUpdate=true;
    return 'The frozen block passes the cold blade; the section slides out flat under the anti-roll plate.';
  };
},

/* ===== Haematology & blood bank ===== */
haemanalyser(M){
  M.add('fluidics',[0,-.6,-.4],at(box(2.6,1.9,1.5,C.body),0,.95,-.1));
  M.add('screen',[-1.6,0,0],at(box(1.1,.75,.06,C.dark),-1.9,1.5,.2,0,.35),at(screen(1,.62),-1.88,1.5,.24,0,.35),at(box(.12,.6,.12,C.dark),-1.95,.8,.15));
  M.add('reagents',[1.6,0,0],at(box(.45,.8,.45,C.white),1.65,.4,-.3),at(box(.45,.8,.45,0xd9e7f7),1.65,.4,.25),at(box(.3,.06,.3,C.blue),1.65,.83,.25));
  M.add('apertures',[-.5,.3,1],at(box(.5,.5,.06,C.glass,glass(.4)),-.6,1.25,.68),at(cyl(.12,.12,.4,C.glass,glass(.5)),-.75,1.25,.6),at(cyl(.12,.12,.4,C.glass,glass(.5)),-.45,1.25,.6));
  M.add('hb',[.1,.4,1],at(box(.28,.3,.2,C.green),.05,1.3,.66),at(box(.08,.08,.02,0x7cffb1,glow(0x22966a)),.05,1.3,.77));
  const flow=M.add('flowcell',[.6,.6,1],at(box(.12,.6,.12,C.glass,glass(.5)),.6,1.3,.66),at(box(.35,.12,.12,C.red,glow(0x7a0d17)),.85,1.3,.66));
  const cells=particles(20,[.06,.55,.06],0xd23f57,.05);cells.position.set(.6,1.02,.66);M.add('flowcell',null,cells);
  const probe=M.add('sampler',[0,.6,1.2],at(cyl(.02,.02,.6,C.steel,metal(C.steel)),.9,.95,.95));
  const rack=M.add('sampler',null,at(box(1.4,.2,.22,C.dark),.3,.25,1.0));
  const tubes=[];for(let i=0;i<5;i++){const tb=tube(C.blood);tb.position.set(-.2+i*.25,.55,1.0);M.add('sampler',null,tb);tubes.push(tb)}
  const S=['Mixing and aspirating the EDTA sample','Impedance count: red cells and platelets sized in the apertures','Haemoglobin measured photometrically after lysis','Flow cytometry: white cells separated by laser scatter','Results, histograms and flags on the screen'];
  return t=>{
    const u=(t%10)/10,s=Math.min(4,Math.floor(u*5));probe.position.y=.95-(s===0?Math.sin(u*5*Math.PI)*.25:0);
    const pos=cells.geometry.attributes.position;for(let i=0;i<pos.count;i++){let y=pos.getY(i)+.012;if(y>.55)y=0;pos.setY(i,y)}pos.needsUpdate=true;
    tubes.forEach((tb,i)=>tb.position.x=-.2+i*.25+(t*.04%.25));return S[s];
  };
},
coagulometer(M){
  M.add('screen',[-1.4,0,0],at(box(.9,.6,.05,C.dark),-1.75,1.35,.3,0,.3),at(screen(.8,.5),-1.73,1.35,.33,0,.3));
  M.add('cuvettes',[0,-.5,0],at(box(2.6,.9,1.5,C.body),0,.45,0));
  M.add('samples',[-.8,.3,.6],at(cyl(.45,.45,.12,C.dark),-.7,.96,.25));
  for(let i=0;i<8;i++){const a=i*Math.PI/4,tb=tube(C.plasma,.35);tb.position.set(-.7+Math.cos(a)*.32,1.15,.25+Math.sin(a)*.32);M.add('samples',null,tb)}
  M.add('reagents',[.8,.3,.6],at(cyl(.45,.45,.14,C.cold),.7,.97,.25));
  for(let i=0;i<6;i++){const a=i*Math.PI/3;M.add('reagents',null,at(cyl(.07,.07,.25,C.white),.7+Math.cos(a)*.3,1.15,.25+Math.sin(a)*.3))}
  M.add('incubator',[0,.2,1],at(box(.8,.12,.3,0xd99b2b),0,.96,.55));
  for(let i=0;i<4;i++)M.add('cuvettes',null,at(box(.07,.12,.07,C.glass,glass(.6)),-.24+i*.16,1.06,.55));
  M.add('detector',[0,.5,1.2],at(box(.3,.25,.25,C.dark),.6,1.1,.65),at(box(.06,.06,.06,C.red,glow(0xd23f57)),.6,1.1,.8));
  const arm=M.add('probe',[0,1,0],grp(at(box(1.6,.08,.1,C.steel,metal(C.steel)),0,1.8,-.4),at(box(.12,.12,.12,C.dark),0,1.75,-.3),at(cyl(.015,.015,.6,C.steel,metal(C.steel)),0,1.45,-.3)));
  return t=>{
    const u=(t%8)/8;arm.position.x=Math.sin(u*Math.PI*2)*.6;arm.position.z=u<.5?.6:.55;
    const k=u<.3?'Plasma and reagent are pipetted into a cuvette':u<.55?'Warming to 37 °C':u<.9?`Timing until the clot forms: ${(11+u*3).toFixed(1)} s`:'Clot detected; PT and INR calculated';
    return k;
  };
},
centrifuge(M){
  M.add('motor',[0,-.6,0],at(box(1.8,.8,1.8,C.body),0,.4,0),at(cyl(.75,.75,.02,C.dark),0,.81,0));
  const rot=M.add('rotor',[0,.9,0],grp(at(cyl(.12,.12,.25,C.steel,metal(C.steel)),0,.95,0),...[0,1,2,3].map(i=>at(box(.7,.05,.1,C.steel,metal(C.steel)),Math.cos(i*Math.PI/2)*.3,.95,Math.sin(i*Math.PI/2)*.3,0,-i*Math.PI/2))));
  const bk=[0,1,2,3].map(i=>{const b=grp(at(cyl(.11,.09,.35,C.steel,metal(C.steel)),0,0,0),at(cyl(.05,.05,.3,C.blood),0,.05,0));b.position.set(Math.cos(i*Math.PI/2)*.62,.95,Math.sin(i*Math.PI/2)*.62);M.add('buckets',[Math.cos(i*Math.PI/2)*.5,1.1,Math.sin(i*Math.PI/2)*.5],b);return b});
  M.add('lid',[0,1.6,-.6],soft(at(cyl(.85,.85,.06,C.glass,glass(.35)),0,1.25,0)),at(box(1.8,.05,.3,C.body),0,.83,-.75));
  M.add('controls',[0,0,1],at(box(1.2,.35,.05,C.dark),0,.45,.92),at(cyl(.08,.08,.05,C.blue),-.35,.45,.95,Math.PI/2),at(cyl(.08,.08,.05,C.blue),.35,.45,.95,Math.PI/2),at(box(.3,.12,.02,0x2bd18a,glow(0x1a8f5c)),0,.47,.95));
  M.add('hctrotor',[1.9,0,0],at(box(1.1,.5,1.1,C.body),2.2,.25,0),at(cyl(.45,.45,.04,C.steel,metal(C.steel)),2.2,.52,0),...Array.from({length:12},(_,i)=>at(box(.35,.02,.02,C.blood),2.2+Math.cos(i*Math.PI/6)*.22,.55,Math.sin(i*Math.PI/6)*.22,0,-i*Math.PI/6)));
  return t=>{
    const u=t%10,sp=u<2?u/2:u<7?1:u<9?1-(u-7)/2:0;rot.rotation.y+=sp*.35;bk.forEach((b,i)=>{const a=rot.rotation.y+i*Math.PI/2;b.position.set(Math.cos(a)*.62,.95,-Math.sin(a)*.62);b.rotation.z=-sp*Math.PI/2*.9*Math.cos(a);b.rotation.x=sp*Math.PI/2*.9*Math.sin(a)});
    return u<2?'Accelerating: the buckets swing out':u<7?'Spinning at the set RCF: cells sediment below the serum':u<9?'Braking gently':'Stopped — the lid can be opened';
  };
},
esranalyser(M){
  M.add('display',[0,0,.9],at(box(2.2,.9,.12,C.body),0,.45,.8),at(box(1.1,.25,.02,0x8fbf8a,glow(0x2a5a28)),-.3,.6,.87),...Array.from({length:12},(_,i)=>at(box(.1,.08,.02,C.white),.55+(i%4)*.13,.25+Math.floor(i/4)*.12,.87)));
  M.add('positions',[0,-.5,0],at(box(2.2,.9,1.5,C.body),0,.45,0),at(box(2.1,.1,1.0,C.white),0,.95,-.1));
  const tubes=[],lv=[];for(let i=0;i<6;i++){const g=grp(at(cyl(.06,.06,.9,C.glass,glass(.45)),0,0,0),at(cyl(.055,.055,.82,C.blood),0,-.03,0),at(cyl(.07,.07,.08,C.purple),0,.48,0));g.position.set(-.75+i*.3,1.4,-.1);M.add('positions',null,g);tubes.push(g);
    const pl=at(cyl(.056,.056,.01,C.plasma),0,0,0);g.add(pl);lv.push(pl)}
  const sensor=M.add('sensor',[0,.6,-.6],grp(at(box(1.9,.08,.12,C.dark),0,0,0),at(box(.08,.08,.08,C.red,glow(0xd23f57)),0,0,.08)));sensor.position.set(0,1.0,-.3);
  M.add('timer',[-1,0,.4],at(box(.3,.3,.3,C.dark),-.9,1.05,.45));
  M.add('thermo',[1,0,.4],at(cyl(.05,.05,.3,C.steel,metal(C.steel)),.95,1.1,.45),at(sph(.06,C.red),.95,.95,.45));
  return t=>{
    const u=(t%10)/10;tubes.forEach((g,i)=>{const fall=Math.min(.35,u*.35*(.5+i*.15));g.children[1].scale.y=1-fall/.82;g.children[1].position.y=-.03-fall/2;lv[i].position.y=.38-fall;});   // plasma/red-cell boundary
    sensor.position.y=1.0+((t*.4)%1)*.85;
    return u<.95?`Red cells settle; the infrared sensor reads the plasma/red-cell boundary (${Math.round(u*60)} min)`:'ESR reported in mm/h';
  };
},
bbfridge(M){
  // open cabinet (back, sides, top, bottom) behind a glass door, so the shelves and units are visible
  M.add('cabinet',[0,0,-.6],at(box(1.6,2.6,.08,C.white),0,1.3,-.51),at(box(.1,2.6,1.1,C.white),-.75,1.3,0),at(box(.1,2.6,1.1,C.white),.75,1.3,0),at(box(1.6,.2,1.1,C.white),0,2.5,0),at(box(1.6,.25,1.1,C.white),0,.12,0),
    soft(at(box(1.4,2.2,.04,C.glass,glass(.2)),0,1.3,.57)));
  for(let s=0;s<4;s++){M.add('cabinet',null,at(box(1.4,.03,.9,C.steel,metal(C.steel)),0,.45+s*.5,0));for(let b=0;b<3;b++)M.add('cabinet',null,at(box(.35,.08,.25,C.blood),-.45+b*.45,.52+s*.5,.1))}
  const fan=M.add('fan',[0,.6,-.6],grp(...[0,1,2,3].map(i=>at(box(.04,.3,.02,C.dark),0,0,0,0,0,i*Math.PI/4))));fan.position.set(0,2.45,-.45);
  M.add('probe',[.8,0,0],at(cyl(.08,.08,.22,C.glass,glass(.6)),.55,.6,.25),at(cyl(.01,.01,.6,C.dark),.55,.95,.25));
  M.add('logger',[0,.5,.6],at(box(.6,.3,.05,C.dark),0,2.75,.56),at(box(.3,.12,.02,0x2bd18a,glow(0x1a8f5c)),0,2.75,.59));
  const led=M.add('alarm',[.6,.5,.6],at(sph(.06,C.green,glow(0x22966a)),.45,2.75,.6));
  const ag=M.add('agitator',[2,0,0],at(box(1.3,1.2,.9,C.body),2,.6,0));
  const shelf=M.add('agitator',null,grp(at(box(1.1,.03,.7,C.steel,metal(C.steel)),0,0,0),at(box(.3,.05,.22,C.plasma),-.25,.04,0),at(box(.3,.05,.22,C.plasma),.25,.04,0)));shelf.position.set(2,1.25,0);
  return t=>{fan.rotation.z=t*12;shelf.position.x=2+Math.sin(t*4)*.06;led.material.emissiveIntensity=.5+.4*Math.sin(t*3);
    return (t%8)<4?'Red cells at 1–6 °C: forced air keeps every shelf at the same temperature':'Platelets at 20–24 °C on the agitator: constant gentle movement';};
},
grouping(M){
  M.add('racks',[-1.2,0,.6],at(box(1.0,.2,.4,C.dark),-1.3,.95,.5),...Array.from({length:5},(_,i)=>{const tb=tube(C.blood,.4);tb.position.set(-1.7+i*.2,1.2,.5);return tb}));
  M.add('cards',[-1.2,.4,-.6],at(box(.9,.6,.5,C.body),-1.3,1.15,-.35),...Array.from({length:6},(_,i)=>at(box(.04,.4,.3,C.white),-1.6+i*.12,1.5,-.35)));
  M.add('incubator',[0,.3,-.8],at(box(.8,.3,.5,C.amber),0,1.0,-.4));
  const cc=M.add('cardcentrifuge',[1.2,.3,0],grp(at(cyl(.55,.55,.15,C.dark),0,0,0),...[0,1,2,3,4,5].map(i=>at(box(.04,.3,.2,C.white),Math.cos(i*Math.PI/3)*.38,.15,Math.sin(i*Math.PI/3)*.38,0,-i*Math.PI/3))));cc.position.set(1.0,.98,.2);
  M.add('reader',[1.2,0,1],at(box(.6,.5,.4,C.dark),1.0,1.15,.95),at(cyl(.08,.08,.08,C.black),1.0,1.15,.75,Math.PI/2));
  M.add('racks',null,at(box(3.4,.9,1.8,C.body),0,.45,0));
  const arm=M.add('probe',[0,1,0],grp(at(box(3,.08,.1,C.steel,metal(C.steel)),0,1.95,-.1),at(box(.15,.15,.15,C.dark),0,1.9,0),at(cyl(.015,.015,.5,C.steel,metal(C.steel)),0,1.6,0)));
  return t=>{const u=(t%9)/9;arm.position.x=-1.3+Math.sin(u*Math.PI)*2.3;cc.rotation.y=u>.55&&u<.85?t*10:cc.rotation.y;
    return u<.3?'Plasma and red cells are pipetted into the gel card':u<.55?'Antiglobulin cards incubate at 37 °C':u<.85?'Card centrifuge: free cells pass through the gel':'Camera reads each microtube: 0 to 4+';};
},

/* ===== Clinical biochemistry ===== */
chemanalyser(M){
  M.add('computer',[-1.8,0,0],at(box(1,.65,.05,C.dark),-2.3,1.6,.3,0,.4),at(screen(.9,.55),-2.28,1.6,.33,0,.4));
  M.add('sampletray',[-.8,.4,.6],at(cyl(.55,.55,.12,C.dark),-1.0,1.06,.3),...Array.from({length:10},(_,i)=>{const a=i*Math.PI/5,tb=tube(C.plasma,.35);tb.position.set(-1.0+Math.cos(a)*.4,1.25,.3+Math.sin(a)*.4);return tb}));
  M.add('reagenttray',[.8,.4,-.6],at(cyl(.6,.6,.3,C.cold),.9,1.15,-.35),...Array.from({length:8},(_,i)=>at(box(.12,.25,.2,C.white),.9+Math.cos(i*Math.PI/4)*.42,1.42,-.35+Math.sin(i*Math.PI/4)*.42,0,-i*Math.PI/4)));
  const rc=M.add('reaction',[0,.5,.9],grp(at(cyl(.5,.5,.08,C.steel,metal(C.steel)),0,0,0),...Array.from({length:24},(_,i)=>at(box(.05,.12,.05,C.glass,glass(.6)),Math.cos(i*Math.PI/12)*.42,.08,Math.sin(i*Math.PI/12)*.42))));rc.position.set(.3,1.06,.55);
  M.add('photometer',[0,0,1.2],at(box(.25,.3,.25,C.dark),.3,1.12,1.08),at(box(.05,.05,.05,C.amber,glow(0xd99b2b)),.3,1.15,1.21));
  M.add('wash',[.9,.4,.6],at(box(.25,.3,.2,C.steel,metal(C.steel)),.8,1.25,.75));
  M.add('probes',[0,1,0],at(cyl(.06,.06,.6,C.dark),-.35,1.35,.1),at(box(.7,.06,.08,C.steel,metal(C.steel)),-.05,1.65,.1));
  const arm2=M.add('probes',null,at(box(.7,.06,.08,C.steel,metal(C.steel)),.55,1.75,-.05));
  M.add('sampletray',null,at(box(3.4,1.0,2.0,C.body),0,.5,0));
  return t=>{rc.rotation.y=Math.floor(t*2)*Math.PI/12;arm2.rotation.y=Math.sin(t*2)*.6;const s=Math.floor(t/2)%4;
    return ['Sample probe pipettes serum into a cuvette','Reagent probe adds reagent; the reaction runs at 37 °C','The carousel steps each cuvette past the photometer','Used cuvettes are washed and checked for reuse'][s];};
},
spectro(M){
  M.add('display',[0,.4,.8],at(box(2.6,.8,1.6,C.body),0,.4,0),at(box(.8,.2,.02,0x8fbf8a,glow(0x2a5a28)),-.6,.65,.81),at(cyl(.12,.12,.06,C.dark),.4,.55,.82,Math.PI/2));
  M.add('lamp',[-1,.6,0],at(box(.4,.4,.4,C.dark),-1.0,1.05,-.3),at(sph(.1,0xfff2b0,glow(0xffe08a)),-1.0,1.05,-.05));
  M.add('mono',[-.3,.7,0],at(box(.5,.35,.4,C.steel,metal(C.steel)),-.35,1.05,-.3),at(box(.02,.3,.3,0x9cc4ff,glass(.6)),-.35,1.05,-.05,0,.6));
  M.add('holder',[.4,.7,.4],at(box(.3,.4,.3,C.dark),.3,1.05,-.3),at(box(.12,.3,.12,C.glass,glass(.5)),.3,1.25,-.05),at(box(.1,.18,.1,0xd99b2b,{transparent:true,opacity:.7}),.3,1.2,-.05));
  M.add('detector',[1,.6,0],at(box(.35,.35,.35,C.dark),.95,1.05,-.3),at(box(.05,.15,.15,C.blue),.77,1.05,-.05));
  const beam=at(cyl(.025,.025,1.7,0xffffff,{emissive:0xffffff,emissiveIntensity:1,transparent:true,opacity:.8}),-.05,1.05,-.05,0,0,Math.PI/2);M.root.add(beam);
  const col=new Color();
  return t=>{const w=400+((t*40)%300);col.setHSL((1-(w-400)/300)*.75,1,.55);beam.material.color.copy(col);beam.material.emissive.copy(col);
    return `Light at ${Math.round(w)} nm passes through the cuvette; the detector measures what is not absorbed (A = log I₀/I)`;};
},
ise(M){
  M.add('display',[0,0,1],at(box(2.2,1.6,1.4,C.white),0,.8,0),at(box(.9,.35,.02,0x8fbf8a,glow(0x2a5a28)),-.4,1.25,.71));
  const probe=M.add('probe',[0,.6,1],at(cyl(.02,.02,.5,C.steel,metal(C.steel)),.75,.45,.85));
  const el=[['Na⁺',C.blue],['K⁺',C.green],['Cl⁻',C.amber],['Ref',C.dark]];
  el.forEach(([,c],i)=>M.add('electrodes',[0,0,1.2],at(box(.25,.3,.25,c),-.5+i*.32,.75,.75)));
  const path=M.add('electrodes',null,at(cyl(.025,.025,1.6,C.glass,glass(.6)),-.05,.75,.92,0,0,Math.PI/2));
  M.add('calibrant',[-1.4,0,0],at(box(.5,.6,.4,0xd9e7f7),-1.45,.3,.3),at(box(.5,.6,.4,0xe6f3e1),-1.45,.3,-.2));
  const roller=M.add('pump',[1.3,0,.6],grp(at(cyl(.18,.18,.12,C.dark),0,0,0,Math.PI/2),...[0,1,2].map(i=>at(cyl(.04,.04,.14,C.steel,metal(C.steel)),Math.cos(i*2.1)*.13,Math.sin(i*2.1)*.13,0,Math.PI/2))));roller.position.set(1.0,.8,.75);
  const slug=sph(.04,C.red,glow(0x7a0d17));M.add('pump',null,slug);
  return t=>{const u=(t%5)/5;roller.rotation.z=-t*3;slug.position.set(.75-u*1.6,.75,.92);
    const i=Math.max(0,Math.min(3,Math.floor((.75-slug.position.x+.05)/.32)));
    return u<.1?'Sample aspirated':`Sample passes the ${el[i][0]} electrode: potential ∝ log(ion activity) (Nernst)`;};
},
clia(M){
  M.add('computer',[-1.8,0,0],at(box(.9,.6,.05,C.dark),-2.1,1.7,.2,0,.4),at(screen(.8,.5),-2.08,1.7,.23,0,.4));
  M.add('samples',[-1,.3,.8],at(box(1.0,.25,.5,C.dark),-1.2,1.1,.55),...Array.from({length:6},(_,i)=>{const tb=tube(C.plasma,.35);tb.position.set(-1.6+i*.16,1.3,.55);return tb}));
  M.add('reagents',[0,.4,-.8],at(cyl(.55,.55,.3,C.cold),-.2,1.15,-.45),...Array.from({length:6},(_,i)=>at(box(.14,.25,.22,C.white),-.2+Math.cos(i*Math.PI/3)*.38,1.42,-.45+Math.sin(i*Math.PI/3)*.38,0,-i*Math.PI/3)));
  const ves=[];for(let i=0;i<8;i++){const v=at(cyl(.05,.04,.12,C.white),.3+i*.14,1.06,.5);M.add('vessels',[0,.3,.9],v);ves.push(v)}
  M.add('vessels',null,at(box(1.3,.08,.2,0xd99b2b),.8,.98,.5));
  M.add('wash',[.9,.5,0],at(box(.4,.35,.35,C.steel,metal(C.steel)),1.0,1.18,0),at(cyl(.08,.08,.36,C.dark),1.0,1.18,.2));
  const lum=M.add('luminometer',[1.6,.4,0],at(box(.45,.5,.45,C.black),1.6,1.25,.3));
  const flash=M.add('luminometer',null,at(sph(.07,0x9fd0ff,glow(0x9fd0ff)),1.6,1.25,.54));
  M.add('samples',null,at(box(3.6,1.0,1.8,C.body),0,.5,0));
  return t=>{const u=(t%8)/8;ves.forEach((v,i)=>v.position.x=.3+((i*.14+u*1.12)%1.12));flash.material.emissiveIntensity=u>.8?3*Math.sin((u-.8)*15*Math.PI)**2:.1;
    return u<.4?'Sample and antibody-coated microparticles react in the vessels':u<.8?'Magnetic wash removes unbound material':'Trigger added: the luminometer counts the flash of light';};
},
flame(M){
  M.add('display',[0,0,1],at(box(2.0,1.0,1.4,0x7f95a8),0,.5,0),at(box(.8,.25,.02,0x8fbf8a,glow(0x2a5a28)),-.3,.7,.71),at(box(.6,.3,.02,C.white),.45,.65,.71));
  M.add('burner',[0,.8,0],at(box(.6,.8,.6,0x7f95a8),.55,1.4,-.2),at(cyl(.14,.14,.05,C.black),.55,1.4,.11,Math.PI/2));
  const fl=M.add('burner',null,at(mk(new ConeGeometry(.08,.28,16),0xffa040,{emissive:0xff8a20,emissiveIntensity:1.2,transparent:true,opacity:.9}),.55,1.42,-.05));
  M.add('nebuliser',[-.6,.4,.8],at(cyl(.03,.03,.5,C.glass,glass(.6)),-.65,1.05,.55,.6),at(cyl(.15,.15,.18,C.glass,glass(.5)),-.65,.75,.8));
  M.add('filters',[.8,.6,.6],at(box(.3,.3,.08,0xffd84a,glass(.7)),.95,1.4,.1),at(box(.3,.3,.08,0xc23cff,glass(.6)),1.05,1.4,.1));
  M.add('detector',[1.2,.6,0],at(box(.35,.35,.35,C.dark),1.2,1.4,-.2));
  M.add('gas',[-1.4,0,-.6],at(cyl(.25,.25,1.1,C.red),-1.5,.55,-.6),at(box(.4,.5,.4,C.dark),-1.5,.25,.2));
  return t=>{fl.scale.set(1+.1*Math.sin(t*20),1+.2*Math.sin(t*13),1);const s=Math.floor(t/3)%3,k=[['Na',589,0xffb000],['K',766,0xc070ff],['Li',671,0xff3050]][s];
    fl.material.emissive.setHex(k[2]);return `${k[0]} atoms in the flame emit light at ${k[1]} nm; the filter passes it to the detector`;};
},

/* ===== Microbiology & immunology ===== */
bsc(M){
  M.add('blower',[0,1.2,0],at(box(2.6,.6,1.3,C.body),0,2.75,-.1),at(cyl(.3,.3,.3,C.dark),0,2.75,-.1));
  M.add('exhaust',[0,1.6,-.6],at(box(1.2,.15,.8,0xf4f6f9),0,3.12,-.3),at(box(1.1,.04,.7,0xd9dde3),0,3.21,-.3));
  M.add('downflow',[0,.8,.4],at(box(2.4,.12,1.1,0xf4f6f9),0,2.38,-.05),...Array.from({length:10},(_,i)=>at(box(.02,.1,1.0,0xd9dde3),-1.1+i*.24,2.31,-.05)));
  M.add('worksurface',[0,-.6,0],at(box(2.6,1.1,1.3,C.body),0,.55,-.1),at(box(2.4,.04,1.0,C.steel,metal(C.steel)),0,1.12,-.15));
  M.add('grille',[0,-.2,.8],at(box(2.4,.05,.14,C.dark),0,1.13,.42));
  M.add('sash',[0,.8,1],soft(at(box(2.5,.85,.03,C.glass,glass(.25)),0,1.95,.55,-.12)));
  M.add('monitor',[.8,.5,.8],at(box(.6,.3,.05,C.dark),.8,2.75,.58),at(cyl(.12,.12,.04,C.white),.8,2.75,.62,Math.PI/2));
  M.add('uv',[-.8,.5,.4],at(cyl(.03,.03,1.6,0x9fa8ff,glow(0x6a5cff)),-.5,2.25,.2,0,0,Math.PI/2));
  [-1.25,1.25].forEach(x=>M.add('worksurface',null,at(box(.06,1.2,1.3,C.body),x,1.75,-.1)));M.add('worksurface',null,at(box(2.6,1.2,.05,C.body),0,1.75,-.75));
  const air=particles(140,[2.2,1.15,.9],0x6aa9e0,.035);air.position.set(0,1.15,-.1);M.root.add(air);
  return t=>{const p=air.geometry.attributes.position;for(let i=0;i<p.count;i++){let y=p.getY(i)-.012,z=p.getZ(i);if(y<.08){z+=.02;y=.08}if(z>.55||y<0){y=1.15;z=(Math.random()-.5)*.9}p.setY(i,y);p.setZ(i,z)}p.needsUpdate=true;
    return 'HEPA-filtered downflow protects the sample; room air entering the front grille protects the worker';};
},
incubator(M){
  M.add('chamber',[0,0,-.7],at(box(1.8,2.2,.08,C.steel,metal(C.steel)),0,1.1,-.8),at(box(.08,2.2,1.6,C.steel,metal(C.steel)),-.88,1.1,0),at(box(.08,2.2,1.6,C.steel,metal(C.steel)),.88,1.1,0),at(box(1.8,.08,1.6,C.steel,metal(C.steel)),0,.04,0),at(box(1.8,.08,1.6,C.steel,metal(C.steel)),0,2.16,0));
  for(let s=0;s<3;s++){M.add('chamber',null,at(box(1.65,.02,1.4,C.steel,{wireframe:true}),0,.5+s*.55,-.05));for(let p=0;p<4;p++)M.add('chamber',null,at(cyl(.14,.14,.06,0xd23f57),-.55+p*.37,.55+s*.55,0))}
  const door=M.add('door',[0,0,1.2],grp(at(box(1.7,2.1,.03,C.glass,glass(.25)),.85,0,0)));door.position.set(-.85,1.1,.82);
  M.add('controls',[0,.6,.6],at(box(1.9,.35,.3,C.dark),0,2.4,.6),at(box(.5,.15,.02,0xff5a5a,glow(0x7a1a1a)),-.4,2.42,.76),at(box(.5,.15,.02,0x8fbf8a,glow(0x2a5a28)),.35,2.42,.76));
  M.add('co2',[1.3,.3,0],at(cyl(.04,.04,.5,C.dark),1.05,1.9,-.4,0,0,Math.PI/2),at(cyl(.12,.12,1.2,C.steel,metal(C.steel)),1.5,.7,-.4));
  M.add('water',[0,-.3,.6],at(box(1.3,.08,.7,0x6aa9e0,glass(.6)),0,.12,0));
  const led=M.add('alarm',[-.9,.6,.6],at(sph(.05,C.green,glow(0x22966a)),.8,2.42,.77));
  M.add('chamber',null,soft(at(box(2.0,2.4,1.8,C.body,glass(.12)),0,1.1,0)));
  return t=>{const u=(t%8)/8;door.rotation.y=-(u<.25?u/.25:u<.5?1:u<.75?1-(u-.5)/.25:0)*1.6;led.material.emissiveIntensity=.4+.4*Math.sin(t*3);
    return u<.75?'The inner glass door opens briefly to load plates (lid down)':'Closed: 35–37 °C and 5–10% CO₂ held constant';};
},
bloodculture(M){
  M.add('computer',[-1.6,0,0],at(box(.8,.55,.05,C.dark),-1.75,2.1,.3,0,.3),at(screen(.7,.45),-1.73,2.1,.33,0,.3));
  M.add('cells',[0,0,-.5],at(box(1.8,2.2,1.4,C.black),0,1.1,0));
  const dr=[0,1].map(i=>{const d=grp(at(box(.8,.9,.1,0x2b2f38),0,0,.7));M.add('drawers',[i?.6:-.6,0,1],d);d.position.set(i?.42:-.42,.6,0);return d});
  const bottles=[];for(let i=0;i<6;i++){const b=grp(at(cyl(.08,.08,.35,C.glass,glass(.6)),0,0,0),at(cyl(.07,.07,.2,C.blood),0,-.06,0),at(cyl(.04,.04,.06,C.blue),0,.2,0),at(cyl(.08,.08,.02,0xf2d24a),0,-.18,0));b.position.set(-.7+i*.28,.95,.6);M.add('bottles',[0,.8,1],b);bottles.push(b)}
  M.add('scanner',[1,.5,.6],at(box(.25,.15,.25,C.dark),.7,2.3,.5),at(box(.12,.03,.02,C.red,glow(0xd23f57)),.7,2.26,.63));
  M.add('drawers',null,at(box(1.6,.5,.05,0x2b2f38),0,1.75,.71),at(screen(.6,.35),0,1.75,.74));
  return t=>{const u=(t%10)/10,o=u<.2?u/.2:u<.8?1:1-(u-.8)/.2;dr.forEach(d=>d.position.z=o*.5);bottles.forEach(b=>b.position.z=.6+o*.5);
    const sens=bottles[3].children[3].material;sens.color.setHex(u>.5?0xf6e57d:0xf2d24a);sens.emissive.setHex(u>.5?0xffd000:0);sens.emissiveIntensity=u>.5?.6:0;
    return u<.5?'Bottles incubate at 35–37 °C; each sensor is read about every 10 minutes':'CO₂ from growth changes the sensor: bottle flagged positive → Gram stain';};
},
elisa(M){
  M.add('optics',[0,.6,-.6],at(box(1.4,.7,1.0,0xd5d9de),-.5,.6,-.2),at(box(1.2,.2,.8,0xc7ccd3),-.5,1.0,-.2));
  M.add('detectors',[0,.9,0],at(box(1.0,.06,.2,C.dark),-.5,.95,.05));
  M.add('keypad',[0,0,.8],at(box(.5,.2,.4,C.dark),.1,.3,.55),at(box(.3,.08,.02,0x8fbf8a,glow(0x2a5a28)),.1,.42,.75));
  const pl=M.add('carrier',[0,.3,1.2],grp(at(box(.86,.04,.58,C.black),0,0,0)));pl.position.set(-.5,.35,.6);
  const wells=[];for(let r=0;r<8;r++)for(let c=0;c<12;c++){const w=at(cyl(.025,.025,.04,C.white,{transparent:true,opacity:.85}),-.385+c*.07,.03,-.245+r*.07);pl.add(w);w.userData.part='carrier';wells.push(w)}
  M.add('manifold',[1.2,.6,0],at(box(1.0,.6,.8,C.body),1.4,.3,0),at(box(.8,.06,.12,C.steel,metal(C.steel)),1.4,.75,.2));
  const ndl=M.add('manifold',null,grp(...Array.from({length:8},(_,i)=>at(cyl(.008,.008,.2,C.steel,metal(C.steel)),1.12+i*.08,0,0))));ndl.position.set(0,.7,.2);
  M.add('bottles',[2,0,0],at(cyl(.25,.25,.7,0xf4f6f9,glass(.7)),2.35,.35,-.2),at(cyl(.25,.25,.7,0xe9d9b0,glass(.7)),2.35,.35,.4));
  const blue=new Color(0x2a6fd6),yel=new Color(0xf2d24a),wh=new Color(C.white);
  return t=>{const u=(t%10)/10;ndl.position.y=.7-(u<.3?Math.abs(Math.sin(u*20))*.12:0);pl.position.z=u<.6?.6:.6-((u-.6)/.4)*.7;
    wells.forEach((w,i)=>{const k=((i*37)%100)/100;w.material.color.copy(wh).lerp(u<.45?blue:yel,u<.3?0:Math.min(1,(u-.3)*4)*k)});
    return u<.3?'Washer removes unbound conjugate':u<.45?'TMB substrate turns blue where enzyme is bound':u<.6?'Stop solution turns it yellow':'Plate read at 450 nm (reference about 620–650 nm)';};
},
microscope(M){
  M.add('base',[0,-.5,0],at(box(1.2,.2,1.5,C.white),0,.1,0),at(box(.35,1.9,.4,C.white),0,1.1,-.55));
  const beam=at(cyl(.04,.04,.9,0xfff2b0,{emissive:0xffe08a,emissiveIntensity:1,transparent:true,opacity:.55}),0,.65,.15);M.add('base',null,beam);
  M.add('condenser',[0,-.2,.8],at(cyl(.15,.12,.2,C.dark),0,.72,.15),at(mk(new TorusGeometry(.17,.02,8,24),C.steel,metal(C.steel)),0,.75,.15,Math.PI/2));
  M.add('stage',[0,0,1.2],at(box(.9,.05,.75,C.dark),0,.9,.15),at(box(.5,.01,.18,C.glass,glass(.7)),0,.93,.15));
  const nose=M.add('objectives',[0,.3,1],grp(at(cyl(.2,.2,.1,C.steel,metal(C.steel)),0,0,0),...[0,1,2,3].map(i=>at(cyl(.035,.045,.18+i*.03,[C.red,C.amber,C.green,C.white][i]),Math.cos(i*Math.PI/2)*.12,-.12,Math.sin(i*Math.PI/2)*.12))));nose.position.set(0,1.32,.15);
  M.add('eyepieces',[0,.8,.4],at(box(.3,.25,.4,C.white),0,1.9,0),at(cyl(.06,.06,.3,C.dark),-.08,2.12,.18,-.6),at(cyl(.06,.06,.3,C.dark),.08,2.12,.18,-.6));
  M.add('focus',[.8,0,0],at(cyl(.15,.15,.08,C.dark),.22,.9,-.5,0,0,Math.PI/2),at(cyl(.09,.09,.12,C.steel,metal(C.steel)),.28,.9,-.5,0,0,Math.PI/2));
  M.add('fluor',[0,.6,-1.1],at(box(.4,.4,.7,C.dark),0,1.6,-.95),at(box(.25,.2,.25,0x3aa0ff,glass(.7)),0,1.6,-.45),at(box(.7,.3,.5,0x8c96a6),.9,.15,-.6));
  return t=>{const u=(t%9)/9;nose.rotation.y=Math.floor(u*4)*Math.PI/2;const flu=u>.5;beam.material.color.setHex(flu?0x3aa0ff:0xfff2b0);beam.material.emissive.setHex(flu?0x2a7fff:0xffe08a);
    return flu?'Fluorescence: excitation light → dichroic mirror → specimen; emitted light passes the emission filter':`Bright-field: condenser light through the specimen; objective ${['4×','10×','40×','100× oil'][Math.floor(u*8)%4]}`;};
},

/* ===== Molecular biology ===== */
thermocycler(M){
  M.add('fan',[0,-.5,-.6],at(box(1.6,.9,1.5,C.body),0,.45,0),...Array.from({length:6},(_,i)=>at(box(.02,.5,.02,C.dark),-.5+i*.2,.45,-.76)));
  const blk=M.add('block',[0,.5,.4],at(box(.9,.12,.65,0xc0c7d0,metal(0xc0c7d0)),0,.96,.15));
  for(let r=0;r<8;r++)for(let c=0;c<12;c++)M.add('block',null,at(cyl(.022,.016,.06,C.white),-.385+c*.07,1.03,-.1+r*.07));
  const lid=M.add('lid',[0,1,-.6],grp(at(box(1.0,.15,.75,C.body),0,.08,.37),at(box(.3,.06,.06,C.dark),0,.1,.74)));lid.position.set(0,1.0,-.22);
  M.add('panel',[0,0,1],at(box(1.6,.35,.15,C.dark),0,.25,.82,-.4),at(screen(.6,.2),-.3,.27,.89,-.4));
  const hot=new Color(0xff4a3a),warm=new Color(0xf2a33a),cool=new Color(0x3a8ff2);
  return t=>{const u=t%6,stp=u<2?0:u<4?1:2;const c=[hot,cool,warm][stp];blk.material.color.lerp(c,.08);blk.material.emissive=blk.material.emissive||new Color();blk.material.emissive.copy(blk.material.color).multiplyScalar(.15);
    lid.rotation.x=0;return `Cycle ${Math.floor(t/6)%35+1}: ${['denaturation ≈ 95 °C — strands separate','annealing ≈ 55 °C — primers bind','extension 72 °C — Taq copies the target'][stp]}`;};
},
qpcr(M){
  M.add('lid',[0,.9,-.4],at(box(1.6,.3,1.4,0xc7ccd3),0,1.55,-.3,-.5));
  M.add('block',[0,-.5,0],at(box(1.8,1.1,1.6,0xd5d9de),0,.55,0),at(cyl(.55,.55,.05,C.black),0,1.12,.1));
  const rot=M.add('block',null,grp(at(cyl(.45,.45,.04,C.steel,metal(C.steel)),0,0,0),...Array.from({length:18},(_,i)=>at(cyl(.025,.02,.12,C.white,{transparent:true,opacity:.9}),Math.cos(i*Math.PI/9)*.37,.06,Math.sin(i*Math.PI/9)*.37))));rot.position.set(0,1.17,.1);
  M.add('excitation',[1,.4,0],at(box(.25,.2,.2,C.dark),.6,1.18,.6),at(sph(.04,0x3aa0ff,glow(0x2a7fff)),.6,1.18,.48));
  M.add('filters',[1.2,.4,.4],at(box(.15,.15,.15,0x52d36a,glass(.7)),.85,1.18,.6),at(box(.2,.2,.2,C.dark),1.0,1.18,.6));
  M.add('software',[-1.6,0,0],at(box(.9,.6,.05,C.dark),-1.6,1.3,.3,0,.4),at(screen(.8,.5),-1.58,1.3,.33,0,.4));
  const tubes=rot.children.slice(1);
  return t=>{rot.rotation.y=t*6;const cyc=Math.floor(t*2)%40+1,f=1/(1+Math.exp(-(cyc-24)/2));tubes.forEach((tb,i)=>{tb.material.emissive=tb.material.emissive||new Color();tb.material.emissive.setHex(i%3?0x30ff70:0);tb.material.emissiveIntensity=i%3?f*1.2:0});
    return `Cycle ${cyc}: fluorescence read every cycle${cyc>=24?' — signal crossed the threshold (Ct ≈ 24)':''}`;};
},
gel(M){
  M.add('tank',[0,-.4,0],soft(at(box(2.4,.5,1.2,C.glass,glass(.3)),0,.25,0)),at(box(2.4,.03,1.2,C.glass,glass(.4)),0,.02,0));
  M.add('tank',null,at(box(2.3,.25,1.1,0x9fd0ff,glass(.25)),0,.2,0));
  M.add('tray',[0,.6,0],at(box(1.6,.06,.9,0xe9f1fb,{transparent:true,opacity:.85}),0,.25,0));
  M.add('tray',null,...Array.from({length:6},(_,i)=>at(box(.03,.05,.08,0x1c2029),-.7,.29,-.3+i*.12)));
  const bands=[];for(let l=0;l<6;l++)for(let b=0;b<3;b++){const m=at(box(.02,.01,.08,0xff7ad9,glow(0xff4fc3)),-.7,.29,-.3+l*.12);M.add('tray',null,m);bands.push([m,[.9,.6,.35][b]*(l===0?1:(.7+((l*b)%3)*.15))])}
  M.add('electrodes',[0,.3,.8],at(cyl(.02,.02,1.0,C.black),-1.15,.4,0,Math.PI/2),at(cyl(.02,.02,1.0,C.red),1.15,.4,0,Math.PI/2));
  M.add('lid',[0,1.2,0],soft(at(box(2.5,.04,1.25,C.glass,glass(.25)),0,.55,0)),at(box(.12,.12,.12,C.black),-1.15,.6,.5),at(box(.12,.12,.12,C.red),1.15,.6,.5));
  M.add('power',[0,0,-1.6],at(box(1.2,.6,.8,0x2f3d55),0,.3,-1.4),at(box(.5,.18,.02,0x8fbf8a,glow(0x2a5a28)),-.15,.4,-.99),at(cyl(.06,.06,.04,C.black),.35,.25,-.99,Math.PI/2),at(cyl(.06,.06,.04,C.red),.5,.25,-.99,Math.PI/2));
  M.add('imager',[2,0,0],at(box(1.0,.5,.9,C.dark),2.4,.25,0),at(box(.8,.03,.7,0x7d6bff,glow(0x4b38ff)),2.4,.51,0));
  return t=>{const u=(t%10)/10;bands.forEach(([m,sp])=>m.position.x=-.7+u*1.4*sp);
    return u<.95?`DNA (negative) runs from the black to the red electrode; small fragments move fastest (${Math.round(u*40)} min)`:'Bands compared with the DNA ladder under blue/UV light';};
},
nanodrop(M){
  M.add('detector',[0,-.4,0],at(box(1.1,.8,1.1,C.white),0,.4,0));
  M.add('pedestal',[0,.2,.8],at(cyl(.08,.08,.05,C.steel,metal(C.steel)),0,.83,.2));
  const drop=M.add('pedestal',null,at(sph(.05,0x9fd0ff,glass(.7)),0,.88,.2));
  const arm=M.add('arm',[0,.8,0],grp(at(box(.3,.08,.6,C.white),0,0,.3),at(cyl(.07,.07,.05,C.steel,metal(C.steel)),0,-.06,.55)));arm.position.set(0,1.2,-.35);
  M.add('arm',null,at(box(.3,.5,.2,C.white),0,1.05,-.4));
  const beam=at(cyl(.015,.015,.25,0xd8f0ff,{emissive:0xd8f0ff,emissiveIntensity:1,transparent:true,opacity:.8}),0,.95,.2);M.add('light',[.8,0,0],beam,at(box(.2,.2,.2,C.dark),.4,.6,.2));
  return t=>{const u=(t%6)/6,down=u<.3?u/.3:u<.8?1:1-(u-.8)/.2;arm.rotation.x=(1-down)*-.9;beam.visible=u>.35&&u<.75;drop.scale.y=1+down*.6;
    return u<.3?'1–2 µL is placed on the lower pedestal':u<.75?'The arm closes; light passes through the liquid column (A260, A280, A230)':'Concentration and A260/280, A260/230 ratios shown';};
},
microfuge(M){
  M.add('controls',[0,-.4,.8],at(box(1.4,.6,1.4,C.white),-1,.3,0),at(box(.6,.15,.02,0x8fbf8a,glow(0x2a5a28)),-1,.42,.71));
  const rot=M.add('rotor',[0,.6,0],grp(at(cyl(.45,.38,.15,C.steel,metal(C.steel)),0,0,0),...Array.from({length:12},(_,i)=>at(cyl(.035,.025,.18,i%6===0?0xd23f57:C.white),Math.cos(i*Math.PI/6)*.32,.05,Math.sin(i*Math.PI/6)*.32,Math.sin(i*Math.PI/6)*.6,0,-Math.cos(i*Math.PI/6)*.6))));rot.position.set(-1,.68,0);
  M.add('rotorlid',[0,1.1,0],soft(at(cyl(.46,.46,.06,C.glass,glass(.4)),-1,.82,0)));
  M.add('cup',[1.2,.6,0],at(box(.9,.5,.9,0x2f3d55),1.2,.25,0));
  const cup=M.add('cup',null,grp(at(cyl(.16,.2,.12,C.black),0,0,0),at(cyl(.05,.05,.45,C.glass,glass(.5)),0,.28,0),at(cyl(.045,.045,.15,0x6aa9e0),0,.15,0)));cup.position.set(1.2,.56,0);
  M.add('mode',[1.6,0,.6],at(cyl(.08,.08,.05,C.white),1.2,.25,.46,Math.PI/2));
  return t=>{const u=(t%8)/8;rot.rotation.y=u<.5?t*25:rot.rotation.y;cup.position.x=1.2+(u>=.5?Math.cos(t*30)*.03:0);cup.position.z=u>=.5?Math.sin(t*30)*.03:0;
    return u<.5?'Microcentrifuge: balanced tubes spin at the kit speed (× g)':'Vortex mixer: the cup orbits fast and mixes the closed tube';};
},
/* ---- equipment manual additions ---- */
flowcyto(M){
  M.add('fluidics',[-1.6,0,0],at(box(.9,1.1,1.2,C.white),-1.6,.55,0),at(cyl(.22,.22,.8,0x6aa9e0,glass(.6)),-1.75,.6,.1),at(cyl(.2,.2,.7,0xd9c27a,glass(.6)),-1.4,.55,.1));
  M.add('optics',[0,.8,-.6],at(box(2,.9,1.3,C.body),.2,1.55,-.05));
  M.add('lasers',[0,1.2,-.6],at(box(.5,.25,.3,C.dark),-.55,1.55,-.45),at(box(.5,.25,.3,C.dark),-.55,1.85,-.45));
  const beam=M.add('lasers',null,at(box(.9,.02,.02,0x3b8cff,glow(0x1f63c6)),-.05,1.55,-.45));
  M.add('flowcell',[0,0,.9],at(cyl(.04,.04,.9,C.glass,glass(.5)),.4,1.55,-.45),at(box(.16,.16,.16,C.glass,glass(.35)),.4,1.55,-.45));
  M.add('detectors',[1,.4,0],at(box(.25,.25,.25,C.black),.85,1.55,-.45),...[0,1,2].map(i=>at(box(.18,.18,.18,i===0?0x2e7d32:i===1?0xd99b2b:0xb73a3a),.95+i*.24,1.95,-.1)));
  M.add('computer',[1.8,0,.4],at(box(.9,.6,.05,C.dark),1.9,1.2,.5,0,-.4),at(screen(.8,.5),1.88,1.2,.53,0,-.4));
  const cells=Array.from({length:5},(_,i)=>{const c=sph(.035,i%2?0x7a5bd6:0xd23f57);M.add('flowcell',null,c);c.position.set(.4,2,-.45);return c});
  return t=>{cells.forEach((c,i)=>{c.position.y=1.98-((t*.35+i*.18)%.9)});beam.material.emissiveIntensity=.6+.3*Math.sin(t*6);
    return (t%6)<3?'Hydrodynamic focusing: cells cross the laser one at a time':'Each cell gives forward scatter, side scatter and fluorescence signals';};
},
autoclave(M){
  const ch=M.add('chamber',[0,0,-.6],at(cyl(.75,.75,1.8,C.steel,metal(C.steel)),0,1,0,Math.PI/2));
  M.add('basket',[0,0,1.4],at(box(1,.6,1.3,C.steel,{wireframe:true}),0,.85,0));
  const door=M.add('door',[0,0,1],grp(at(cyl(.78,.78,.1,C.steel,metal(C.steel)),0,0,0,Math.PI/2),at(mk(new TorusGeometry(.3,.04,10,32),C.dark),0,0,.08)));door.position.set(0,1,.95);
  M.add('gauge',[.6,.6,.6],at(cyl(.18,.18,.05,C.white),.95,1.65,.6,Math.PI/2));
  const needle=M.add('gauge',null,grp(at(box(.02,.14,.01,C.red),0,.06,0)));needle.position.set(.95,1.65,.64);
  M.add('controls',[1,0,.4],at(box(.4,.7,.3,C.dark),1.05,.75,.6),at(screen(.25,.2),1.05,.85,.76));
  M.add('valve',[0,.8,0],at(cyl(.06,.06,.25,C.amber,metal(C.amber)),-.3,1.85,-.3));
  M.add('drain',[0,-.4,.4],at(cyl(.05,.05,.6,C.dark),-.5,.2,.6,0,0,Math.PI/2),at(cyl(.12,.12,.08,C.steel),-.8,.2,.6,0,0,Math.PI/2));
  M.add('chamber',null,at(box(2,.25,1.8,C.body),0,.12,0));
  return t=>{const u=(t%12)/12;door.rotation.y=u<.15?-1.2*(1-u/.15):u>.9?-1.2*(u-.9)/.1:0;needle.rotation.z=-(u>.2&&u<.85?Math.min(1,(u-.2)/.15)*2.2:0);ch.material.emissive.setHex(u>.35&&u<.75?0x3a1a00:0);
    return u<.15?'Load the basket loosely, caps loosened, indicator in place':u<.35?'Air removal and heating':u<.75?'Holding at 121 °C for the validated time':u<.9?'Exhaust and cooling: wait for zero pressure':'Open the door slightly and let the steam escape';};
},
colonycounter(M){
  M.add('stage',[0,-.3,0],at(box(1.6,.35,1.4,C.dark),0,.18,0),at(cyl(.5,.5,.03,0xfff6d8,glow(0xfff2c0)),0,.37,0));
  M.add('grid',[0,.3,0],...Array.from({length:7},(_,i)=>at(box(.96,.004,.008,C.black),0,.39,-.42+i*.14)),...Array.from({length:7},(_,i)=>at(box(.008,.004,.96,C.black),-.42+i*.14,.39,0)));
  const plate=grp(at(cyl(.45,.45,.06,C.glass,glass(.4)),0,0,0),at(cyl(.43,.43,.03,0xe9c46a,{transparent:true,opacity:.8}),0,-.01,0));
  for(let i=0;i<18;i++){const a=i*2.4,r=.08+(i*.37%1)*.3;plate.add(at(sph(.018,0xf4f1e6),Math.cos(a)*r,.025,Math.sin(a)*r))}
  M.add('stage',null,plate);plate.position.set(0,.43,0);
  M.add('lens',[0,.8,-.4],at(cyl(.03,.03,1,C.steel,metal(C.steel)),-.7,.85,-.55),at(box(.6,.04,.04,C.steel,metal(C.steel)),-.4,1.35,-.55),at(mk(new TorusGeometry(.32,.03,10,40),C.dark),0,1.1,-.1,Math.PI/2),at(cyl(.3,.3,.02,C.glass,glass(.25)),0,1.1,-.1));
  const pen=M.add('pen',[.8,.5,.4],at(cyl(.025,.015,.5,C.blue),0,0,0));
  M.add('display',[.8,0,.6],at(box(.6,.25,.04,C.black),.45,.25,.72),at(screen(.4,.15),.45,.25,.745));
  return t=>{const k=Math.floor(t*1.5)%18,a=k*2.4,r=.08+(k*.37%1)*.3;pen.position.set(Math.cos(a)*r,.72+.04*Math.abs(Math.sin(t*4.7)),Math.sin(a)*r);pen.rotation.z=.4;
    return `Touching each colony adds one: ${k+1} counted`;};
},
freezer(M){
  M.add('cabinet',[0,0,-.5],at(box(1.4,2.4,1.1,C.white),0,1.3,0),at(box(1.4,.12,1.1,C.dark),0,.06,0));
  [0,1,2].forEach(i=>M.add('inner',[0,0,.5],at(box(1.2,.62,.03,C.glass,glass(.35)),0,.5+i*.7+.05,.5)));
  const door=M.add('door',[.6,0,1.2],grp(at(box(1.36,2.3,.1,C.white),.68,0,0),at(box(.05,.5,.08,C.steel,metal(C.steel)),1.2,0,.08)));door.position.set(-.68,1.3,.6);
  M.add('display',[0,.5,.6],at(box(.6,.22,.04,C.black),0,2.35,.67),at(screen(.45,.14),0,2.35,.69));
  const led=M.add('alarm',[.7,.5,.6],at(sph(.045,C.green,glow(0x22966a)),.5,2.35,.69));
  M.add('compressor',[0,-.4,-.6],at(box(1.2,.35,.6,C.dark),0,.25,-.25),at(box(1,.3,.02,0x555c66),0,.25,.56));
  return t=>{const u=(t%9)/9;door.rotation.y=u<.3?-1.4*Math.sin(u/.3*Math.PI):0;led.material.color.setHex(u<.3?0xd99b2b:0x22966a);led.material.emissive.setHex(u<.3?0x7a4a00:0x22966a);
    return u<.3?'Door open: warm air enters — keep openings short':'Closed: temperature recorded continuously, alarm armed';};
},
gelcard(M){
  M.add('incubator',[-1.2,0,0],at(box(1,.5,.8,C.body),-1.2,.25,0),...[0,1,2,3].map(i=>at(box(.03,.25,.6,C.dark),-1.5+i*.2,.52,0)));
  M.add('centrifuge',[1,0,0],at(cyl(.7,.75,.5,C.white),.8,.25,0));
  const rot=M.add('rotor',[1,.6,0],grp(at(cyl(.08,.08,.1,C.steel,metal(C.steel)),0,0,0),...Array.from({length:6},(_,i)=>{const g=grp(at(box(.04,.4,.25,C.dark),0,0,0));g.position.set(Math.cos(i*Math.PI/3)*.45,.15,Math.sin(i*Math.PI/3)*.45);g.rotation.y=-i*Math.PI/3;return g})));rot.position.set(.8,.55,0);
  const card=grp(at(box(.7,.5,.02,C.white),0,0,0));
  for(let i=0;i<6;i++){card.add(at(cyl(.035,.035,.32,C.glass,glass(.5)),-.27+i*.108,-.05,.015));card.add(at(cyl(.03,.03,.04,C.blood),-.27+i*.108,i<2?.08:-.19,.02))}
  M.add('card',[0,.8,.8],card);card.position.set(-.2,1.1,.6);
  M.add('viewer',[0,0,1],at(box(.9,.08,.5,0xfff6d8,glow(0xfff2c0)),-.2,.7,.6));
  return t=>{const u=(t%10)/10;rot.rotation.y=u>.4?t*12:0;
    return u<.4?'Antiglobulin cards incubate at 37 °C':u<.8?'Fixed card programme: free cells pass through the gel':'Read: agglutinates at the top = positive, button at the bottom = negative';};
},
waterbath(M){
  M.add('tank',[0,0,0],at(box(1.8,.6,1.1,C.steel,metal(C.steel)),0,.3,0));
  const water=M.add('tank',null,at(box(1.7,.04,1,0x6aa9e0,glass(.55)),0,.52,0));
  const lid=M.add('lid',[0,.9,-.3],at(box(1.85,.04,1.15,C.glass,glass(.3)),0,.66,0));
  M.add('heater',[0,-.4,-.6],at(cyl(.03,.03,1.5,C.red),0,.15,-.4,0,0,Math.PI/2),at(cyl(.06,.06,.2,C.dark),.75,.35,-.42));
  M.add('thermostat',[0,0,.8],at(box(.7,.25,.05,C.dark),-.4,.3,.58),at(screen(.35,.12),-.45,.3,.61),at(cyl(.05,.05,.04,C.white),-.12,.3,.61,Math.PI/2));
  M.add('thermometer',[.5,.6,0],at(cyl(.015,.015,.7,C.glass,glass(.6)),.7,.65,.3),at(cyl(.01,.01,.35,C.red),.7,.5,.3));
  M.add('rack',[0,.7,0],at(box(1,.04,.5,C.white),-.1,.42,.05),...Array.from({length:8},(_,i)=>at(tube(C.blood,.35),-.45+i*.12,.5,.05)));
  return t=>{water.position.y=.52+.004*Math.sin(t*3);lid.position.y=.66+((t%10)<3?.25*Math.sin((t%10)/3*Math.PI):0);
    return 'Water held at 37 ± 1 °C: check the calibrated thermometer, not only the display';};
}
};

/* ---------- viewer ---------- */
export function webglOK(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(e){return false}}

export function mountViewer(el,instr,{names={},onSelect=()=>{},onStatus=()=>{},reduceMotion=false}={}){
  const renderer=new WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;
  el.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
  const labelLayer=document.createElement('div');labelLayer.className='v3labels';el.appendChild(labelLayer);
  const tip=document.createElement('div');tip.className='v3tip';tip.hidden=true;el.appendChild(tip);
  const scene=new Scene(),camera=new PerspectiveCamera(38,1,.05,100);
  scene.add(new HemisphereLight(0xffffff,0x8a97ab,1.5));
  const key=new DirectionalLight(0xffffff,1.6);key.position.set(4,7,6);scene.add(key);
  const fill=new DirectionalLight(0xdfe9ff,.6);fill.position.set(-5,3,-4);scene.add(fill);
  const M=new Model(),update=BUILD[instr.id](M);scene.add(M.root);let status=update(0);   // first frame before framing
  const floor=new Mesh(new CircleGeometry(4.2,64),new MeshStandardMaterial({color:0xdde4ee,roughness:.9}));floor.rotation.x=-Math.PI/2;floor.position.y=-.01;scene.add(floor);
  // centre the model on the floor
  const bb=new Box3().setFromObject(M.root),ctr=bb.getCenter(new Vector3()),size=bb.getSize(new Vector3());
  M.root.position.sub(new Vector3(ctr.x,0,ctr.z));
  // frame the whole instrument for the current aspect ratio (narrow phone screens need a longer distance)
  const target=new Vector3(0,size.y*.45,0),dir=new Vector3(.75,.55,1).normalize(),radius=size.length()/2,home=new Vector3();
  let moved=false,dist=1;
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.target.copy(target);controls.enableDamping=true;controls.enablePan=false;controls.maxPolarAngle=Math.PI*.49;
  function frame(){const vf=camera.fov*Math.PI/360,hf=Math.atan(Math.tan(vf)*camera.aspect);
    dist=radius/Math.sin(Math.min(vf,hf))*.85;   // the bounding sphere is generous for box-shaped instruments
    home.copy(target).addScaledVector(dir,dist);
    controls.minDistance=dist*.3;controls.maxDistance=dist*2;if(!moved){camera.position.copy(home);controls.update()}}
  controls.addEventListener('start',()=>{moved=true});
  // a plain mouse wheel scrolls the page; Ctrl/⌘ + wheel (and trackpad pinch, which sends ctrlKey) zooms the model
  const wheelGuard=e=>{if(!e.ctrlKey&&!e.metaKey)e.stopPropagation()};el.addEventListener('wheel',wheelGuard,{capture:true});
  const ids=Object.keys(M.parts),labels={};ids.forEach(id=>{const d=document.createElement('button');d.type='button';d.className='v3lab';d.textContent=names[id]||id;d.onclick=()=>select(id,true);labelLayer.appendChild(d);labels[id]=d});
  let playing=!reduceMotion,t=0,showLabels=false,sel=null,raf=0,visible=true,last=performance.now(),dead=false;
  const meshes=[];M.root.traverse(m=>{if(m.isMesh)meshes.push(m)});
  meshes.forEach(m=>{if(m.material.emissive&&m.material.emissive.getHex())m.userData.glow=true});
  function paint(){meshes.forEach(m=>{const on=m.userData.part===sel;if(m.material.emissive&&!m.userData.glow){m.material.emissive.setHex(on?0x1f63c6:0);m.material.emissiveIntensity=on?.55:1}})}
  function select(id,fromUser){sel=sel===id&&fromUser?null:id;paint();Object.entries(labels).forEach(([k,d])=>d.classList.toggle('on',k===sel));onSelect(sel)}
  function setExplode(k){ids.forEach(id=>M.parts[id].position.copy(M.parts[id].userData.ex).multiplyScalar(k))}
  const ray=new Raycaster(),ptr=new Vector2();
  function pick(e){const r=renderer.domElement.getBoundingClientRect();ptr.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ptr,camera);
    const hits=ray.intersectObjects(meshes,false).filter(h=>h.object.visible&&h.object.userData.part);const solid=hits.find(h=>!h.object.userData.soft);return(solid||hits[0]||{}).object}
  let down=null;
  const pd=e=>{down=[e.clientX,e.clientY]};
  const pu=e=>{if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<6){const o=pick(e);select(o?o.userData.part:null,true)}down=null};
  const pm=e=>{if(e.pointerType!=='mouse'||down){tip.hidden=true;return}const o=pick(e);if(!o){tip.hidden=true;renderer.domElement.style.cursor='';return}
    const r=el.getBoundingClientRect();tip.textContent=names[o.userData.part]||o.userData.part;tip.style.left=(e.clientX-r.left+12)+'px';tip.style.top=(e.clientY-r.top+12)+'px';tip.hidden=false;renderer.domElement.style.cursor='pointer'};
  const pl=()=>{tip.hidden=true};
  renderer.domElement.addEventListener('pointerdown',pd);renderer.domElement.addEventListener('pointerup',pu);renderer.domElement.addEventListener('pointermove',pm);renderer.domElement.addEventListener('pointerleave',pl);
  function resize(){const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();frame()}
  const ro=new ResizeObserver(resize);ro.observe(el);resize();
  const io=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)loop()});io.observe(el);
  const v=new Vector3(),bx=new Box3();
  // labels follow each part's current bounding-box centre (moves with the animation and the exploded view)
  function drawLabels(){const w=el.clientWidth,h=el.clientHeight;
    ids.forEach(id=>{const d=labels[id],show=showLabels||id===sel;d.hidden=!show;if(!show)return;
      bx.setFromObject(M.parts[id]).getCenter(v).project(camera);
      d.style.transform=`translate(${(v.x*.5+.5)*w}px,${(-v.y*.5+.5)*h}px) translate(-50%,-50%)`;d.hidden=v.z>1})}
  function loop(){
    if(dead||raf)return;
    raf=requestAnimationFrame(()=>{raf=0;if(dead||!visible||document.hidden)return;
      const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;if(playing)t+=dt;
      const s=update(t);if(s!==status){status=s;onStatus(s)}
      controls.update();renderer.render(scene,camera);drawLabels();loop()});
  }
  const vis=()=>{last=performance.now();loop()};document.addEventListener('visibilitychange',vis);
  onStatus(status);loop();
  return{
    setPlay(p){playing=p;last=performance.now()},isPlaying:()=>playing,
    setExplode,setLabels(b){showLabels=b},select:id=>select(id,false),
    reset(){moved=false;controls.target.copy(target);setExplode(0);frame()},
    partIds:ids,
    dispose(){dead=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();el.removeEventListener('wheel',wheelGuard,{capture:true});document.removeEventListener('visibilitychange',vis);controls.dispose();
      scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()});renderer.dispose();renderer.forceContextLoss&&renderer.forceContextLoss();el.innerHTML=''}
  };
}
