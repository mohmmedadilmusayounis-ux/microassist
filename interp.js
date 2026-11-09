/* ---------- Lab results interpreter: fields, critical limits, pattern rules ---------- */
// data + pure functions only; app.js renders. Reference intervals are the platform's educational adult values
// (same numbers as the test pages); critical limits are teaching examples - every laboratory uses its own list.
Object.assign(REFS,{
kost:{c:'Kost GJ. Critical limits for urgent clinician notification at US medical centers. JAMA. 1990;263(5):704–707.',u:'https://doi.org/10.1001/jama.1990.03440050098038'},
mentzer:{c:'Mentzer WC Jr. Differentiation of iron deficiency from thalassaemia trait. Lancet. 1973;1(7808):882.',u:'https://doi.org/10.1016/s0140-6736(73)91446-3'},
kwo:{c:'Kwo PY, Cohen SM, Lim JK. ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries. Am J Gastroenterol. 2017;112(1):18–35.',u:'https://doi.org/10.1038/ajg.2016.517'}
});

// ri: [lo,hi] or {M:[lo,hi],F:[lo,hi]} (null = no limit); crit: [lo,hi] example critical limits with source cs; rg: accepted input range
const IP_FIELDS=[
{g:'cbc',k:'hb',l:'Haemoglobin',u:'g/dL',ri:{M:[13.5,17.5],F:[12.0,15.5]},crit:[6.6,19.9],cs:'kost',rg:[1,25],test:'Complete blood count (CBC)'},
{g:'cbc',k:'rbc',l:'Red cell count',u:'×10¹²/L',ri:{M:[4.5,5.9],F:[4.0,5.2]},rg:[0.5,10],test:'Complete blood count (CBC)'},
{g:'cbc',k:'mcv',l:'MCV',u:'fL',ri:[80,100],rg:[40,150],test:'Complete blood count (CBC)'},
{g:'cbc',k:'mch',l:'MCH',u:'pg',ri:[27,33],rg:[10,50],test:'Complete blood count (CBC)'},
{g:'cbc',k:'rdw',l:'RDW-CV',u:'%',ri:[11.5,14.5],rg:[8,40],test:'Complete blood count (CBC)'},
{g:'cbc',k:'wbc',l:'White cell count',u:'×10⁹/L',ri:[4.0,11.0],crit:[2.0,37.0],cs:'kost',rg:[0.1,500],test:'Complete blood count (CBC)'},
{g:'cbc',k:'neut',l:'Neutrophils (absolute)',u:'×10⁹/L',ri:[2.0,7.5],crit:[0.5,null],cs:'dacie',rg:[0,300],test:'WBC differential (blood film)'},
{g:'cbc',k:'lymph',l:'Lymphocytes (absolute)',u:'×10⁹/L',ri:[1.0,4.0],rg:[0,400],test:'WBC differential (blood film)'},
{g:'cbc',k:'plt',l:'Platelets',u:'×10⁹/L',ri:[150,450],crit:[37,910],cs:'kost',rg:[1,3000],test:'Complete blood count (CBC)'},
{g:'chem',k:'na',l:'Sodium',u:'mmol/L',ri:[135,145],crit:[120,160],cs:'kost',rg:[90,200],test:'Electrolytes and minerals'},
{g:'chem',k:'k',l:'Potassium',u:'mmol/L',ri:[3.5,5.1],crit:[2.8,6.2],cs:'kost',rg:[1,12],test:'Electrolytes and minerals'},
{g:'chem',k:'cl',l:'Chloride',u:'mmol/L',ri:[98,107],rg:[60,150],test:'Electrolytes and minerals'},
{g:'chem',k:'hco3',l:'Bicarbonate',u:'mmol/L',ri:[22,29],rg:[1,60],test:'Electrolytes and minerals'},
{g:'chem',k:'urea',l:'Urea',u:'mmol/L',ri:[2.5,7.8],rg:[0.5,100],test:'Renal function tests'},
{g:'chem',k:'cre',l:'Creatinine',u:'µmol/L',ri:{M:[62,106],F:[44,80]},rg:[10,3000],test:'Renal function tests'},
{g:'chem',k:'glu',l:'Glucose',u:'mmol/L',ri:[3.9,5.5],crit:[2.8,25],cs:'platform',rg:[0.5,100],test:'Blood glucose (fasting and random)'},
{g:'chem',k:'ca',l:'Calcium, total',u:'mmol/L',ri:[2.15,2.55],crit:[1.5,3.24],cs:'kost',rg:[0.5,5],test:'Electrolytes and minerals'},
{g:'chem',k:'alb',l:'Albumin',u:'g/L',ri:[35,50],rg:[5,70],test:'Liver function tests'},
{g:'chem',k:'alt',l:'ALT',u:'U/L',ri:{M:[null,45],F:[null,35]},rg:[1,20000],test:'Liver function tests'},
{g:'chem',k:'ast',l:'AST',u:'U/L',ri:[10,40],rg:[1,20000],test:'Liver function tests'},
{g:'chem',k:'alp',l:'ALP (adult)',u:'U/L',ri:[40,130],rg:[1,5000],test:'Liver function tests'},
{g:'chem',k:'bil',l:'Total bilirubin',u:'µmol/L',ri:[3,21],rg:[1,1000],test:'Liver function tests'}
];
const ipRI=(f,sex)=>Array.isArray(f.ri)?f.ri:f.ri[sex||'M'];
// glucose: the fasting interval applies only to fasting samples; a random sample is flagged only outside 3.9–11.1
const ipRange=(f,c)=>f.k==='glu'&&!c.fasting?[3.9,11.1]:ipRI(f,c.sex);
function ipFlag(f,v,c){
  const[lo,hi]=ipRange(f,c),cr=f.crit||[];
  if(cr[0]!=null&&v<cr[0])return'LL';if(cr[1]!=null&&v>cr[1])return'HH';
  if(lo!=null&&v<lo)return'L';if(hi!=null&&v>hi)return'H';return'N';
}

/* derived values shown with the results; each returns null when inputs are missing */
const IP_DERIVED=[
 {id:'egfr',l:'eGFR (CKD-EPI 2021)',calc:'egfr',ref:['ckdepi'],run:(v,c)=>v.cre!=null&&c.age>=18&&c.sex?CALC_DEF.find(x=>x.id==='egfr').run({scr:v.cre,age:c.age,sex:c.sex},'si'):null},
 {id:'ca',l:'Albumin-adjusted calcium',calc:'ca',ref:['payne'],run:v=>v.ca!=null&&v.alb!=null?CALC_DEF.find(x=>x.id==='ca').run({ca:v.ca,alb:v.alb},'si'):null},
 {id:'ag',l:'Anion gap',calc:'ag',ref:['tietz'],run:v=>v.na!=null&&v.cl!=null&&v.hco3!=null?CALC_DEF.find(x=>x.id==='ag').run({na:v.na,cl:v.cl,hco3:v.hco3}):null},
 {id:'mentzer',l:'Mentzer index (MCV ÷ RBC)',ref:['mentzer'],run:v=>v.mcv!=null&&v.rbc?{v:r1(v.mcv/v.rbc,1),u:'',interp:'Screening only, for microcytosis: < 13 favours thalassaemia trait, > 13 favours iron deficiency.'}:null},
 {id:'rr',l:'Liver injury R ratio',ref:['kwo'],run:(v,c)=>{if(v.alt==null||v.alp==null)return null;const r=(v.alt/(c.sex==='F'?35:45))/(v.alp/130);return{v:r1(r,1),u:'',interp:'(ALT ÷ ALT upper limit) ÷ (ALP ÷ ALP upper limit): ≥ 5 hepatocellular, ≤ 2 cholestatic, 2–5 mixed. Meaningful only when the enzymes are raised.'}}},
 {id:'astalt',l:'AST : ALT ratio',ref:['kwo'],run:v=>v.ast!=null&&v.alt?{v:r1(v.ast/v.alt,1),u:''}:null}
];

/* pattern rules: each returns null or {lvl:'info'|'warn'|'bad', h, p, ddx[], next[] (test names), calc?, cs? (case id), ref[]} */
const lowF=(F,k)=>F[k]==='L'||F[k]==='LL',highF=(F,k)=>F[k]==='H'||F[k]==='HH';
const IP_RULES=[
 // anaemia classified by MCV
 (v,F,c)=>{
  if(!lowF(F,'hb'))return null;
  const bad=F.hb==='LL'?'bad':'warn',m=v.mcv;
  if(m!=null&&m<80){
    let p='Low haemoglobin with low MCV.';
    if(v.rbc){const mi=v.mcv/v.rbc;p+=` Mentzer index ${r1(mi,1)}: ${mi<13?'favours thalassaemia trait':'favours iron deficiency'} (a screening clue, not a diagnosis).`}
    if(v.rdw!=null&&v.rdw>14.5)p+=' A raised RDW favours iron deficiency over thalassaemia trait.';
    return{lvl:bad,h:'Microcytic anaemia',p,ddx:['Iron deficiency (the most common cause)','Thalassaemia trait','Anaemia of chronic disease / inflammation','Sideroblastic anaemia (rare)'],next:['Iron studies','WBC differential (blood film)','Reticulocyte count'],ref:['dacie','mentzer'],cs:'c1'};
  }
  if(m!=null&&m>100)return{lvl:bad,h:'Macrocytic anaemia',p:'Low haemoglobin with raised MCV.',ddx:['Vitamin B12 or folate deficiency (megaloblastic)','Alcohol and liver disease','Hypothyroidism','Drugs (e.g. methotrexate, hydroxyurea, zidovudine)','Reticulocytosis after bleeding or haemolysis','Myelodysplasia'],next:['Vitamin B12 and folate','Reticulocyte count','WBC differential (blood film)','Liver function tests','Thyroid function tests'],ref:['dacie']};
  if(m!=null)return{lvl:bad,h:'Normocytic anaemia',p:'Low haemoglobin with normal MCV.',ddx:['Acute blood loss','Haemolysis','Anaemia of chronic disease or kidney disease','Early or mixed iron / B12 deficiency','Bone marrow failure or infiltration'],next:['Reticulocyte count','WBC differential (blood film)','Renal function tests','Iron studies'],ref:['dacie']};
  return{lvl:bad,h:'Anaemia',p:'Haemoglobin is low. Enter the MCV to classify the anaemia.',ddx:[],next:['Complete blood count (CBC)','Reticulocyte count'],ref:['dacie']};
 },
 // pancytopenia
 (v,F)=>lowF(F,'hb')&&lowF(F,'wbc')&&lowF(F,'plt')?{lvl:'bad',h:'Pancytopenia',p:'Haemoglobin, white cells and platelets are all low. A blood film is essential and bone marrow examination is often needed.',ddx:['Megaloblastic anaemia (B12 / folate deficiency)','Hypersplenism, including visceral leishmaniasis (kala-azar) in endemic areas','Aplastic anaemia or marrow infiltration (leukaemia, lymphoma, myeloma, metastasis)','Drugs and chemotherapy','Severe infection (sepsis, HIV, disseminated TB)'],next:['WBC differential (blood film)','Reticulocyte count','Vitamin B12 and folate','rK39 test (visceral leishmaniasis / kala-azar)'],ref:['dacie','who_leish']}:null,
 // platelets
 (v,F)=>lowF(F,'plt')&&!(lowF(F,'hb')&&lowF(F,'wbc'))?{lvl:F.plt==='LL'?'bad':'warn',h:'Thrombocytopenia',p:'First exclude pseudothrombocytopenia: look for platelet clumps on the blood film and, if present, repeat the count in a citrate tube.',ddx:['EDTA-dependent platelet clumping (artefact)','Malaria and other infections, sepsis / DIC','Immune thrombocytopenia','Hypersplenism','Drugs, alcohol, B12 / folate deficiency','Marrow failure or infiltration'],next:['WBC differential (blood film)','Malaria thick and thin blood films','Prothrombin time (PT / INR)','Fibrinogen (Clauss) and D-dimer'],ref:['dacie','who_malaria']}:null,
 (v,F)=>highF(F,'plt')?{lvl:F.plt==='HH'?'bad':'warn',h:'Thrombocytosis',p:'Raised platelet count.',ddx:['Reactive: iron deficiency, infection or inflammation, bleeding, after splenectomy, malignancy','Myeloproliferative neoplasm (e.g. essential thrombocythaemia), especially if persistent and very high'],next:['C-reactive protein (CRP)','Iron studies','WBC differential (blood film)'],ref:['dacie']}:null,
 // white cells
 (v,F)=>{const n=v.neut;if(n==null?!lowF(F,'wbc'):!lowF(F,'neut'))return null;if(lowF(F,'hb')&&lowF(F,'wbc')&&lowF(F,'plt'))return null;
  const sev=n!=null&&n<0.5;
  return{lvl:sev?'bad':'warn',h:n!=null?(sev?'Severe neutropenia':'Neutropenia'):'Leucopenia',p:(sev?'Neutrophils below 0.5 ×10⁹/L: high infection risk; report urgently. ':'')+'Many healthy people of African origin have lower neutrophil counts (benign ethnic neutropenia, typically ≥ 1.0–1.5 ×10⁹/L), so compare with previous results and the clinical picture.',ddx:['Benign ethnic neutropenia','Viral infection, overwhelming sepsis','Drugs (e.g. antithyroid drugs, chemotherapy)','B12 / folate deficiency','Hypersplenism','Marrow failure or infiltration'],next:['WBC differential (blood film)','Vitamin B12 and folate','Complete blood count (CBC)'],ref:['dacie','hsieh']}},
 (v,F)=>highF(F,'neut')||(v.neut==null&&highF(F,'wbc'))?{lvl:F.wbc==='HH'?'bad':'warn',h:v.neut!=null?'Neutrophilia':'Leucocytosis',p:F.wbc==='HH'?'Very high white cell count: examine the film for blasts or a leukaemic picture and report urgently.':'Raised white cells / neutrophils.',ddx:['Bacterial infection','Inflammation or tissue necrosis','Corticosteroids, pregnancy, smoking','Myeloproliferative neoplasm (e.g. CML) or leukaemia'],next:['WBC differential (blood film)','C-reactive protein (CRP)','Blood culture'],ref:['dacie']}:null,
 (v,F,c)=>highF(F,'lymph')?{lvl:'warn',h:'Lymphocytosis',p:'Raised absolute lymphocyte count.'+(c.age>=50?' A persistent lymphocytosis in an older adult needs a film review for chronic lymphocytic leukaemia.':''),ddx:['Viral infection (e.g. EBV, CMV, hepatitis)','Pertussis','Chronic lymphocytic leukaemia and other lymphoproliferative disorders'],next:['WBC differential (blood film)'],ref:['dacie']}:null,
 // potassium
 (v,F)=>{if(!highF(F,'k'))return null;const edta=v.ca!=null&&v.ca<2.0||v.alp!=null&&v.alp<30;
  return{lvl:edta||F.k==='HH'?'bad':'warn',h:edta?'Hyperkalaemia: suspect EDTA contamination':'Hyperkalaemia',p:(edta?'High potassium with very low calcium and/or ALP is the typical signature of K-EDTA carry-over (wrong order of draw). Do not report: request a correctly collected sample. ':'')+'Exclude pseudohyperkalaemia before acting: haemolysis, delayed separation or refrigerated whole blood, fist clenching or a long tourniquet, EDTA contamination, and very high platelet or white counts.',ddx:['Pseudohyperkalaemia (pre-analytical)','Kidney failure','Drugs: ACE inhibitors, ARBs, potassium-sparing diuretics','Acidosis, tissue breakdown, adrenal insufficiency'],next:['Specimen rejection criteria','Electrolytes and minerals','Renal function tests'],ref:['clsi_gp41','tietz'],cs:'c2'}},
 (v,F)=>lowF(F,'k')?{lvl:F.k==='LL'?'bad':'warn',h:'Hypokalaemia',p:'Low potassium.',ddx:['Gastrointestinal loss (vomiting, diarrhoea)','Diuretics','Insulin or β-agonist treatment (shift into cells)','Mineralocorticoid excess','Hypomagnesaemia'],next:['Electrolytes and minerals','Renal function tests'],ref:['tietz']}:null,
 // sodium
 (v,F,c)=>{if(!lowF(F,'na'))return null;const hg=v.glu!=null&&v.glu>11.1;
  return{lvl:F.na==='LL'?'bad':'warn',h:'Hyponatraemia',p:(hg?'Glucose is high: hyperglycaemia draws water out of cells and lowers sodium (translocational hyponatraemia). ':'')+'Indirect ion-selective electrodes give falsely low sodium in severe lipaemia or very high protein (pseudohyponatraemia): check with a direct ISE (blood gas analyser) when suspected.',ddx:['Pseudohyponatraemia (lipaemia, paraproteinaemia)','Hyperglycaemia','SIADH, drugs (e.g. thiazides)','Heart, liver or kidney failure','Gastrointestinal losses','Adrenal insufficiency, hypothyroidism'],next:['Electrolytes and minerals','Renal function tests','Thyroid function tests','Cortisol, prolactin and β-hCG'],ref:['tietz']}},
 (v,F)=>highF(F,'na')?{lvl:F.na==='HH'?'bad':'warn',h:'Hypernatraemia',p:'High sodium usually means a water deficit.',ddx:['Dehydration with poor access to water','Diabetes insipidus','Osmotic diuresis (hyperglycaemia)','Sodium gain (hypertonic fluids)'],next:['Electrolytes and minerals','Blood glucose (fasting and random)','Renal function tests'],ref:['tietz']}:null,
 // acid-base from bicarbonate and anion gap
 (v,F)=>{if(!lowF(F,'hco3'))return null;const ag=v.na!=null&&v.cl!=null?v.na-(v.cl+v.hco3):null,dka=v.glu!=null&&v.glu>11.1;
  return{lvl:v.hco3<15?'bad':'warn',h:'Low bicarbonate',p:'Possible metabolic acidosis (or compensation for a respiratory alkalosis): confirm with a blood gas.'+(ag!=null?` Anion gap ${r1(ag,0)} mmol/L: a raised gap suggests ketoacidosis, lactic acidosis, kidney failure or toxins; a normal gap suggests diarrhoea or renal tubular acidosis (compare with your laboratory’s interval).`:'')+(v.alb!=null&&v.alb<35?' Low albumin lowers the anion gap and can hide a raised-gap acidosis.':'')+(dka?' With high glucose, consider diabetic ketoacidosis: check ketones.':''),ddx:['Diabetic or starvation ketoacidosis','Lactic acidosis (shock, sepsis)','Kidney failure','Diarrhoea, renal tubular acidosis','Toxins (e.g. methanol, salicylate)'],next:['Electrolytes and minerals','Renal function tests','Urine general examination (GUE)','Blood glucose (fasting and random)'],calc:'ag',ref:['tietz']}},
 // kidney
 (v,F,c)=>{if(!highF(F,'urea')||highF(F,'cre')||v.cre==null)return null;
  return{lvl:'info',h:'Raised urea with normal creatinine',p:'Urea rises with reduced kidney perfusion and protein load before creatinine changes.',ddx:['Dehydration','Upper gastrointestinal bleeding','High protein intake, catabolic states, corticosteroids'],next:['Renal function tests','Electrolytes and minerals','Complete blood count (CBC)'],ref:['tietz']}},
 (v,F,c)=>{if(!highF(F,'cre'))return null;const e=c.age>=18&&c.sex?CALC_DEF.find(x=>x.id==='egfr').run({scr:v.cre,age:c.age,sex:c.sex},'si'):null;
  return{lvl:e&&+e.v<30?'bad':'warn',h:'Raised creatinine',p:(e?`eGFR ${e.v} mL/min/1.73 m² (${e.interp}) `:'Enter age and sex to estimate GFR. ')+'Compare with previous results: acute kidney injury and chronic kidney disease are separated by the time course (CKD = abnormality for more than 3 months), and eGFR is not valid in AKI.',ddx:['Acute kidney injury (pre-renal, renal, post-renal)','Chronic kidney disease (e.g. diabetic, hypertensive)','Large muscle mass, creatine supplements, some drugs (e.g. trimethoprim) raise creatinine without kidney damage'],next:['Renal function tests','Urine general examination (GUE)','24-hour urine protein and albumin/creatinine ratio','Electrolytes and minerals'],calc:'egfr',ref:['kdigo','ckdepi'],cs:'c12'}},
 // calcium (adjusted for albumin when available)
 (v,F)=>{if(v.ca==null)return null;const adj=v.alb!=null?v.ca+0.02*(40-v.alb):v.ca;
  if(adj>=2.15&&adj<=2.55)return v.alb!=null&&(lowF(F,'ca')||highF(F,'ca'))?{lvl:'info',h:'Calcium normal after albumin adjustment',p:`Adjusted calcium ${r1(adj,2)} mmol/L is within the educational interval: the measured value reflects the albumin level.`,ddx:[],next:['Electrolytes and minerals'],calc:'ca',ref:['payne']}:null;
  const lo=adj<2.15,crit=F.ca==='LL'||F.ca==='HH';
  return lo?{lvl:crit?'bad':'warn',h:'Hypocalcaemia',p:`${v.alb!=null?'Albumin-adjusted':'Measured'} calcium ${r1(adj,2)} mmol/L.${highF(F,'k')?' With high potassium, exclude EDTA contamination first.':''}`,ddx:['EDTA contamination of the sample','Vitamin D deficiency','Chronic kidney disease','Hypoparathyroidism','Hypomagnesaemia','Acute pancreatitis'],next:['Electrolytes and minerals','Renal function tests','Liver function tests'],calc:'ca',ref:['payne','tietz']}
   :{lvl:crit?'bad':'warn',h:'Hypercalcaemia',p:`${v.alb!=null?'Albumin-adjusted':'Measured'} calcium ${r1(adj,2)} mmol/L.`,ddx:['Primary hyperparathyroidism (most common in outpatients)','Malignancy (most common in hospital patients)','Granulomatous disease (TB, sarcoidosis)','Drugs: thiazides, vitamin D, lithium','Immobilisation, thyrotoxicosis'],next:['Electrolytes and minerals','Renal function tests','Liver function tests'],calc:'ca',ref:['payne','tietz']};
 },
 // glucose
 (v,F,c)=>{const g=v.glu;if(g==null)return null;
  if(g<3.9)return{lvl:F.glu==='LL'?'bad':'warn',h:'Hypoglycaemia',p:'Glucose below 3.9 mmol/L. Check that the sample was in a fluoride tube or separated promptly: glucose falls about 5–7% per hour in whole blood.',ddx:['Delayed separation (artefact)','Insulin or sulfonylurea treatment','Sepsis, liver failure, adrenal insufficiency','Insulinoma (rare)'],next:['Blood glucose (fasting and random)'],ref:['ada','tietz']};
  if(c.fasting&&g>=7.0)return{lvl:F.glu==='HH'?'bad':'warn',h:'Fasting glucose in the diabetes range',p:'Fasting glucose ≥ 7.0 mmol/L. Without unequivocal hyperglycaemia, diabetes is confirmed by a second abnormal test (repeat fasting glucose, HbA1c or OGTT).',ddx:['Diabetes mellitus','Stress hyperglycaemia','Drugs (corticosteroids)'],next:['HbA1c (glycated haemoglobin)','Blood glucose (fasting and random)','Oral glucose tolerance test (OGTT)'],ref:['ada']};
  if(c.fasting&&g>=5.6)return{lvl:'info',h:'Impaired fasting glucose (prediabetes)',p:'Fasting glucose 5.6–6.9 mmol/L.',ddx:[],next:['HbA1c (glycated haemoglobin)','Oral glucose tolerance test (OGTT)'],ref:['ada']};
  if(!c.fasting&&g>=11.1)return{lvl:F.glu==='HH'?'bad':'warn',h:'Random glucose ≥ 11.1 mmol/L',p:'Diagnostic of diabetes only with classic symptoms of hyperglycaemia or a hyperglycaemic crisis; otherwise confirm with another test.'+(v.hco3!=null&&v.hco3<22?' Low bicarbonate: consider diabetic ketoacidosis.':''),ddx:['Diabetes mellitus','Stress hyperglycaemia','Drugs (corticosteroids)'],next:['HbA1c (glycated haemoglobin)','Blood glucose (fasting and random)','Urine general examination (GUE)'],ref:['ada']};
  return null},
 // liver
 (v,F,c)=>{const up=highF(F,'alt')||highF(F,'alp')||highF(F,'ast');if(!up||v.alt==null||v.alp==null)return null;
  const r=(v.alt/(c.sex==='F'?35:45))/(v.alp/130),pat=r>=5?'hepatocellular':r<=2?'cholestatic':'mixed';
  const D={hepatocellular:['Viral hepatitis (A–E)','Drug or herbal toxicity','Alcohol-related or metabolic (fatty) liver disease','Ischaemic hepatitis','Autoimmune hepatitis'],cholestatic:['Biliary obstruction (stones, tumour)','Drug-induced cholestasis','Primary biliary cholangitis or sclerosing cholangitis','Infiltration (TB, malignancy)','Bone or placental ALP (check GGT)'],mixed:['Drug-induced liver injury','Alcohol-related liver disease','Infiltrative disease','Any cause above in evolution']};
  return{lvl:'warn',h:`Liver enzymes: ${pat} pattern`,p:`R ratio ${r1(r,1)} (≥ 5 hepatocellular, ≤ 2 cholestatic, 2–5 mixed).`+(v.ast!=null&&v.ast>40&&v.ast/v.alt>=2?' AST : ALT ≥ 2 is often seen in alcohol-related liver disease (also cirrhosis, muscle injury or a haemolysed sample).':'')+(pat!=='hepatocellular'?' A raised GGT confirms that ALP comes from the liver.':''),ddx:D[pat],next:pat==='cholestatic'?['Liver function tests']:['Liver function tests','Rapid tests: HBsAg, HCV antibody, HIV','Prothrombin time (PT / INR)'],ref:['kwo']}},
 (v,F)=>highF(F,'bil')&&!highF(F,'alt')&&!highF(F,'alp')&&!highF(F,'ast')&&v.alt!=null?{lvl:lowF(F,'hb')?'warn':'info',h:lowF(F,'hb')?'Anaemia with raised bilirubin: consider haemolysis':'Isolated raised bilirubin',p:'Bilirubin is raised with normal liver enzymes. Measure the direct (conjugated) fraction: a mainly unconjugated rise suggests Gilbert syndrome or haemolysis.',ddx:['Haemolysis','Gilbert syndrome','Ineffective erythropoiesis (e.g. megaloblastic anaemia)'],next:['Liver function tests','Reticulocyte count','WBC differential (blood film)','Direct antiglobulin test (DAT / direct Coombs)'],ref:['kwo','dacie']}:null,
 (v,F)=>lowF(F,'alb')?{lvl:'info',h:'Low albumin',p:'Low albumin lowers total calcium and the anion gap; interpret both with adjustment.',ddx:['Inflammation or acute illness','Chronic liver disease','Nephrotic syndrome or protein-losing enteropathy','Malnutrition'],next:['Liver function tests','24-hour urine protein and albumin/creatinine ratio','Urine general examination (GUE)'],ref:['tietz']}:null
];

/* worked examples for teaching (fictional values) */
const IP_EX=[
 {id:'ida',l:'Microcytic anaemia',c:{sex:'F',age:24},v:{hb:8.9,rbc:4.4,mcv:68,mch:21,rdw:18.2,wbc:6.2,plt:420}},
 {id:'pan',l:'Pancytopenia',c:{sex:'M',age:35},v:{hb:7.8,mcv:88,wbc:2.1,neut:0.9,lymph:1.0,plt:48}},
 {id:'edta',l:'Sample contamination',c:{sex:'F',age:45},v:{na:139,k:7.1,cl:102,hco3:25,cre:70,ca:1.2,alb:40,alp:12}},
 {id:'dka',l:'High glucose, low bicarbonate',c:{sex:'F',age:22},v:{na:131,k:5.6,cl:96,hco3:9,urea:9.5,cre:130,glu:28}},
 {id:'chol',l:'Cholestatic liver tests',c:{sex:'M',age:60},v:{alt:70,ast:58,alp:420,bil:85,alb:33}}
];
