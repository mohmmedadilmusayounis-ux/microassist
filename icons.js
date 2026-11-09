// icons.js: Icons, procedure-step icons, tube drawings, schematic stain drawings. Classic script: shares top-level names with the other js/ files (load order in index.html).
/* ---------- Icons ---------- */
const IC={
book:'<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
drop:'<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',
clock:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9.5 2.5h5"/>',
flask:'<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.3 21.5h11.4a2 2 0 0 0 1.8-3L14 9V3"/><path d="M7 15h10"/>',
gland:'<circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M5.3 18.7l2.8-2.8M15.9 8.1l2.8-2.8"/>',
cup:'<path d="M6 4h12l-1.3 16a1 1 0 0 1-1 1H8.3a1 1 0 0 1-1-1z"/><path d="M6.4 9h11.2"/>',
worm:'<path d="M3 15c2.5-6 5.5 2 8-3.5S16.5 13 21 7"/>',
bact:'<rect x="5" y="8" width="14" height="8" rx="4"/><path d="M3 12h2M19 12h2M8.5 8 7.5 5M15.5 8l1-3M8.5 16l-1 3M15.5 16l1 3"/>',
shield:'<path d="M12 3l8 3v6c0 5-3.6 8-8 9-4.4-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
bag:'<path d="M7 6h10v10a5 5 0 0 1-10 0z"/><path d="M12 2.5V6M12 9.5v5M9.5 12h5"/>',
scope:'<path d="M9.5 3.5l3.5 2-3 5.5-3.5-2zM8 10l-1.5 2.5M5 21h14M13 21a6 6 0 0 0 3.5-10.5M9 18h5"/>',
cells:'<circle cx="8.5" cy="9" r="4.5"/><circle cx="16" cy="15.5" r="4.5"/><circle cx="8.5" cy="9" r="1.3"/><circle cx="16" cy="15.5" r="1.3"/>',
atyp:'<circle cx="12" cy="12" r="9"/><path d="M8.5 10c1-2.6 4.6-3 6-1 1.3 1.8.3 3.5-.6 4.6-1 1.3-3.4 2-4.7.8-1.2-1.1-1.4-2.6-.7-4.4z"/>',
dna:'<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12M8 6h8M8 18h8M9.5 9.5h5M9.5 14.5h5"/>',
spin:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 3v4M19.8 16.5 16.3 14.5M4.2 16.5l3.5-2"/>',
heat:'<path d="M12 2.5c1 4 6 6 6 11.5a6 6 0 0 1-12 0c0-3 1.8-5 3-7 .2 2 1 3 2 3.2 0-3 0-5.5 1-7.7z"/>',
therm:'<path d="M10 4.5a2 2 0 0 1 4 0V14a4 4 0 1 1-4 0z"/><path d="M12 9v6.5"/>',
stain:'<path d="M14.5 3.5l6 6-2 2-6-6zM12.5 7.5 5 15v4h4l7.5-7.5"/>',
slide:'<rect x="2" y="8" width="20" height="8" rx="1.2"/><path d="M5 10h6v4H5z"/>',
syringe:'<path d="M18 2.5l3.5 3.5M19.8 4.2l-9 9M14.5 5.5l4 4M7.5 12.5l4 4M9 15l-5.5 5.5"/>',
tube:'<path d="M8.5 3h7M10 3v13.5a2 2 0 0 0 4 0V3"/><path d="M10 11h4"/>',
mix:'<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 3v5h5M4 13a8 8 0 0 0 14.5 4.5L20 16M20 21v-5h-5"/>',
wash:'<path d="M7.5 4c2.8 3.7 3.8 5.8 3.8 7.7a3.8 3.8 0 0 1-7.6 0C3.7 9.8 4.7 7.7 7.5 4zM16.5 10c2 2.7 2.8 4.1 2.8 5.5a2.8 2.8 0 0 1-5.6 0c0-1.4.8-2.8 2.8-5.5z"/>',
cut:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.2 8.2 20 20M8.2 15.8 20 4"/>',
doc:'<path d="M6 2.5h9l4.5 4.5v14.5H6z"/><path d="M14.5 2.5V7h5M9 12h7M9 16h5"/>',
check:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.5h6V4M9 13l2 2 4-4"/>',
warn:'<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.5M12 17.5v.3"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.3"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
home:'<path d="M3.5 11 12 4l8.5 7M6 9.5V20h4.5v-5.5h3V20H18V9.5"/>',
grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
cap:'<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v5c3 2 8 2 11 0v-5M21.5 9v5"/>',
star:'<path d="m12 3.2 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>',
quote:'<path d="M6 7h5v5H7.5L6 16M13 7h5v5h-3.5L13 16"/>',
share:'<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4M8.2 13.2l7.6 4"/>',
print:'<path d="M7 8V3h10v5M7 17H4.5V9.5A1.5 1.5 0 0 1 6 8h12a1.5 1.5 0 0 1 1.5 1.5V17H17"/><path d="M7 13.5h10V21H7z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
auto:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>',
contrast:'<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M3.5 20.5 20.5 3.5V17a3.5 3.5 0 0 1-3.5 3.5z" fill="currentColor"/>',
body:'<circle cx="12" cy="4.5" r="2"/><path d="M6 8.5h12M12 8.5v6M12 14.5l-3 6.5M12 14.5l3 6.5M6 8.5l-1.5 6M18 8.5l1.5 6"/>',
heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
bone:'<path d="M8 6.5a2.5 2.5 0 1 0-3.4 2.3 2.5 2.5 0 1 0 2.3 3.4l5.1 5.1a2.5 2.5 0 1 0 3.4 2.3 2.5 2.5 0 1 0 2.3-3.4l-5.1-5.1A2.5 2.5 0 0 0 8 6.5z"/>',
quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.3"/>',
timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4M9.5 2.5h5M19 6l-1.5 1.5"/>',
cards:'<rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v13"/>',
case:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 5v2M3 12.5h18"/>',
notes:'<path d="M5 3.5h14v17H5z"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
image:'<rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m21 16-5-5-8 8"/>',
next:'<path d="m9 5 7 7-7 7"/>',prev:'<path d="M15 5l-7 7 7 7"/>',back:'<path d="M15 5l-7 7 7 7"/>',
more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
calc:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6.5h8v3H8zM8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01"/>',
chat:'<path d="M4 5.5h16v10H9l-4 3.5v-3.5H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
swap:'<path d="M7 4 3.5 7.5 7 11M3.5 7.5h13M17 13l3.5 3.5L17 20M20.5 16.5h-13"/>',
pulse:'<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',
cube:'<path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z"/><path d="M3.5 7 12 11.5 20.5 7M12 11.5v10"/>'
};
const ico=k=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IC[k]||IC.flask}</svg>`;
const BRANCH_IC={gen:'check',hem:'drop',coag:'clock',chem:'flask',endo:'gland',urine:'cup',para:'worm',micro:'bact',sero:'shield',mol:'dna',bank:'bag',histo:'scope',cyto:'cells',cpath:'atyp'};
// each procedure step gets a picture chosen from what the step says (first rule that matches wins)
const STEP_RULES=[
 ['stain',/\b(stain|haematoxylin|hematoxylin|eosin|giemsa|leishman|carbol|fuchsin|schiff|silver|alcian|congo|og-6|ea-50|counterstain|methylene blue|crystal violet|safranin|iodine|dab|chromogen|trichrome|aniline|ferrocyanide|periodic acid|reagent strip|blue in)/i],
 ['spin',/centrifug|cytospin|\bspin\b/i],
 ['heat',/steam|boil|heat-induced|heat until|heat-fix|heat fix|thermal cycler|cycle in/i],
 ['wash',/^(wash|rinse)/i],
 ['doc',/^(record|report|calculate|validate|plot|grade|document|assign|read the result)/i],
 ['check',/^(check|confirm)/i],
 ['flask',/^fix|dewax|dehydrat|rehydrat|xylene|differentiat|decolouri|bleach|oxidis|sensitis|mordant|tone in|retrieval|metabisulphite|master mix|lyse/i],
 ['therm',/incubat|°c|oven|water bath|cryostat|freez|warm|refrigerat|cool/i],
 ['cut',/\b(cut|section|trim|gross|slice|blade|microtom|saw|embed|orient)/i],
 ['syringe',/needle|venepuncture|inoculat|aspirat|insert|tourniquet|collect|draw|inject|swab|cough|load the|pipette/i],
 ['scope',/microscop|examine|screen|oil|\bscan|under the|polari|look for|look at|read the|read at|read and|count\b|identify .*cells|assess|judge|study|power:|visualise/i],
 ['slide',/smear|film|slide|spread|coverslip|mount|pick up|gel/i],
 ['flask',/\bfix|formalin|alcohol|ethanol|methanol|xylene|clear|acid|decalcif|reagent|solution|buffer|dilut|prepare|add /i],
 ['mix',/mix|invert|resuspend|agitat|suspend|shake|swirl/i],
 ['tube',/tube|label|fill|container|vial|bottle|sample|cartridge/i],
 ['clock',/minute|second|hour|time|day|wait/i],
 ['doc',/record|report|document|\blog\b|validate|phone|calculate|plot|grade|correlat/i],
 ['check',/check|confirm|verify|ensure|control|identif|reject|bring the kit/i]
];
const stepIcon=t=>{for(const[k,re]of STEP_RULES)if(re.test(t))return k;return 'check'};
const TUBES=[
 [/edta|lavender/i,'#8d63c4','EDTA'],[/citrate|\(blue\)/i,'#3b82d6','Citrate'],[/fluoride|grey/i,'#9aa1a9','Fluoride'],
 [/heparin|green/i,'#2f9a59','Heparin'],[/serum|plain|gel tube|red\/gold/i,'#d23b33','Serum'],[/urine/i,'#e5c540','Urine'],
 [/stool/i,'#8a6a3c','Stool'],[/formalin|nbf|tissue|paraffin/i,'#cbb36f','Formalin'],[/sputum/i,'#b9b28a','Sputum'],
 [/csf/i,'#d9e6f2','CSF'],[/fluid|effusion/i,'#e7d39a','Fluid'],[/smear|slide|fna|brush/i,'#7f8fb8','Slide'],[/dna|rna|extract/i,'#6f8fd8','Nucleic acid'],[/capillary|finger|blood/i,'#c0262d','Blood']
];
const tubeSvg=c=>`<svg viewBox="0 0 22 44" aria-hidden="true"><rect x="4" y="1" width="14" height="7" rx="2" fill="${c}"/><path d="M5.5 8h11v28a5.5 5.5 0 0 1-11 0z" fill="#fff" fill-opacity=".9" stroke="#b9c4d6"/><path d="M5.5 20h11v16a5.5 5.5 0 0 1-11 0z" fill="${c}" fill-opacity=".55"/></svg>`;
// the generic "Blood" tube is shown only when no specific tube matched
function tubesFor(t){const out=[];for(const[re,c,l]of TUBES){if(l==='Blood'&&out.length)continue;if(re.test(t)&&!out.some(x=>x[1]===l))out.push([c,l]);if(out.length===2)break}return out}

/* ---------- Schematic stain drawings (not photographs) ---------- */
function schematic(s){
  // deterministic pseudo-random layout so the drawing is stable
  let seed=7;const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
  const W=240,H=160,o=[`<rect width="${W}" height="${H}" fill="${s.bg}"/>`];
  if(s.xs==='rings'||s.xs==='gram'){
    for(let i=0;i<14;i++){const x=20+rnd()*200,y=18+rnd()*124;
      if(s.xs==='rings'){o.push(`<circle cx="${x}" cy="${y}" r="14" fill="${s.cy}" stroke="#d9b2ab"/>`);if(i%4===0)o.push(`<circle cx="${x+2}" cy="${y-1}" r="4.5" fill="none" stroke="#5b7ec8" stroke-width="1.6"/><circle cx="${x+5.5}" cy="${y-3}" r="1.8" fill="${s.x}"/>`)}
      else{if(i%2)for(let k=0;k<5;k++)o.push(`<circle cx="${x+rnd()*10}" cy="${y+rnd()*10}" r="2.6" fill="${s.x}"/>`);else o.push(`<rect x="${x}" y="${y}" width="11" height="4" rx="2" fill="#e0607e" transform="rotate(${rnd()*180} ${x} ${y})"/>`)}}
  }else{
    for(let i=0;i<9;i++){const x=24+(i%3)*80+rnd()*16,y=26+Math.floor(i/3)*50+rnd()*8,pap=s.xs==='pap';
      o.push(`<ellipse cx="${x}" cy="${y}" rx="${pap?28:24}" ry="${pap?20:17}" fill="${pap&&i%2?s.x:s.cy}" opacity=".95"/>`);
      const brown=s.xs==='nucleiBrown'&&i%3===0;o.push(`<circle cx="${x+rnd()*4}" cy="${y+rnd()*3}" r="${pap?(i%2?3:5):7}" fill="${brown?s.x:s.nu}"/>`)}
    if(s.xs==='fibre')for(let i=0;i<5;i++){const y=10+i*34;o.push(`<path d="M0 ${y} C 60 ${y+18}, 120 ${y-18}, 240 ${y+8}" stroke="${s.x}" stroke-width="3" fill="none" opacity=".85"/>`)}
    if(s.xs==='rods')for(let i=0;i<14;i++){const x=10+rnd()*220,y=10+rnd()*140;o.push(`<rect x="${x}" y="${y}" width="10" height="2.6" rx="1.3" fill="${s.x}" transform="rotate(${rnd()*180} ${x} ${y})"/>`)}
    if(s.xs==='granules')for(let i=0;i<18;i++)o.push(`<circle cx="${30+rnd()*180}" cy="${20+rnd()*120}" r="${2+rnd()*3}" fill="${s.x}"/>`);
    if(s.xs==='blob')for(let i=0;i<4;i++)o.push(`<ellipse cx="${30+rnd()*180}" cy="${25+rnd()*110}" rx="${14+rnd()*12}" ry="${8+rnd()*8}" fill="${s.x}" opacity=".8"/>`);
  }
  return `<svg class="sch" viewBox="0 0 ${W} ${H}" role="img" aria-label="Schematic">${o.join('')}</svg>`;
}

