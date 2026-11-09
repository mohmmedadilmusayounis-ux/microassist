/* ---------- Clinical search vocabulary, disease panels and calculators ---------- */
// data only: app.js renders it. Every formula cites a REFS id; values are educational, not laboratory-specific.
Object.assign(REFS,{
kdigo:{c:'Kidney Disease: Improving Global Outcomes (KDIGO) CKD Work Group. KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int. 2024;105(4S):S117–S314.',u:'https://doi.org/10.1016/j.kint.2023.10.018'}
});

/* abbreviations and spelling variants → words that appear in test names or content */
const SYN={
cbc:['complete blood count','full blood count','fbc'],fbc:['complete blood count','cbc'],esr:['erythrocyte sedimentation rate','westergren'],
crp:['c-reactive protein'],pt:['prothrombin time','inr'],inr:['prothrombin time'],aptt:['activated partial thromboplastin time','ptt'],
ddimer:['d-dimer'],lft:['liver function'],rft:['renal function','urea','creatinine'],kft:['renal function'],bun:['urea'],egfr:['renal function'],
tft:['thyroid function'],tsh:['thyroid function'],ft4:['thyroid function'],hcg:['β-hcg','pregnancy'],
hba1c:['glycated haemoglobin','a1c'],a1c:['hba1c'],fbs:['blood glucose','fasting'],rbs:['blood glucose','random'],ogtt:['oral glucose tolerance'],
ldl:['lipid profile'],hdl:['lipid profile'],tg:['lipid profile','triglycerides'],cholesterol:['lipid profile'],
gue:['urine general examination'],ua:['urine general examination','urinalysis'],urinalysis:['urine general examination'],acr:['albumin/creatinine ratio'],
afb:['ziehl','acid-fast'],zn:['ziehl'],gms:['grocott'],pas:['periodic acid','pas-diastase'],he:['haematoxylin and eosin'],
ihc:['immunohistochemistry'],fna:['fine-needle aspiration','fna'],fnac:['fine-needle aspiration'],pap:['papanicolaou'],lbc:['liquid-based cytology'],mgg:['may-grünwald-giemsa'],
pcr:['polymerase chain reaction','pcr'],qpcr:['real-time pcr'],naat:['xpert','nucleic acid'],genexpert:['xpert'],hpv:['hpv dna'],
hbsag:['hbsag'],hiv:['hiv'],hcv:['hcv'],aso:['aso'],rf:['rheumatoid factor'],dat:['direct antiglobulin','coombs'],coombs:['antiglobulin'],
crossmatch:['crossmatch'],abo:['abo and rh'],
haemoglobin:['hemoglobin'],hemoglobin:['haemoglobin'],anemia:['anaemia'],anaemia:['anemia'],hematology:['haematology'],haematology:['hematology'],
leukocyte:['wbc','leucocyte'],tb:['tuberculosis','ziehl','xpert'],
hemolysis:['haemolysis','haemolysed'],haemolysis:['hemolysis','haemolysed'],hemolyzed:['haemolysed','haemolysis'],lipemia:['lipaemia'],lipaemia:['lipemia'],icteric:['icterus'],
'purple':['lavender'],'lavender':['purple'],'gold':['sst'],'sst':['gold'],'gray':['grey'],'grey':['gray'],'vacutainer':['tube'],'phlebotomy':['venepuncture','venous blood collection'],'venipuncture':['venepuncture'],
'تحلل':['haemolysis'],'ترتيب':['order of draw'],'رفض':['reject'],typhoid:['widal'],kala:['rk39','leishmaniasis'],
'سكر':['blood glucose','hba1c'],'دم':['blood'],'بول':['urine'],'براز':['stool']
};

/* disease → exact test names (the audit rejects any name that is not a test) and linked calculators */
const DX=[
{k:'Diabetes mellitus',ar:'داء السكري',aka:['diabetes','diabetic','hyperglycaemia','hyperglycemia','dm','سكري','السكري'],calc:['egfr'],
 tests:['Blood glucose (fasting and random)','HbA1c (glycated haemoglobin)','Oral glucose tolerance test (OGTT)','24-hour urine protein and albumin/creatinine ratio','Renal function tests','Lipid profile']},
{k:'Kidney disease',ar:'أمراض الكلى',aka:['kidney','renal failure','ckd','aki','nephrotic','الكلى','كلى','الفشل الكلوي'],calc:['egfr','ag'],
 tests:['Renal function tests','Electrolytes and minerals','24-hour urine protein and albumin/creatinine ratio','Urine general examination (GUE)']},
{k:'Anaemia',ar:'فقر الدم',aka:['anaemia','anemia','pallor','فقر الدم','الأنيميا','انيميا'],calc:[],
 tests:['Complete blood count (CBC)','WBC differential (blood film)','Reticulocyte count','Iron studies','Vitamin B12 and folate','Sickling test (sodium metabisulphite)']},
{k:'Sickle cell disease',ar:'فقر الدم المنجلي',aka:['sickle','المنجلي'],calc:[],
 tests:['Sickling test (sodium metabisulphite)','Complete blood count (CBC)','WBC differential (blood film)','Reticulocyte count']},
{k:'Bleeding or thrombosis',ar:'النزف والتخثر',aka:['bleeding','haemorrhage','hemorrhage','thrombosis','dic','warfarin','anticoagulant','نزيف','نزف','تخثر','جلطة'],calc:['inr'],
 tests:['Prothrombin time (PT / INR)','Activated partial thromboplastin time (APTT)','Fibrinogen (Clauss) and D-dimer','Complete blood count (CBC)']},
{k:'Liver disease',ar:'أمراض الكبد',aka:['liver','hepatitis','jaundice','cirrhosis','الكبد','كبد','يرقان','اليرقان'],calc:[],
 tests:['Liver function tests','Rapid tests: HBsAg, HCV antibody, HIV','Prothrombin time (PT / INR)','Complete blood count (CBC)']},
{k:'Dyslipidaemia / cardiovascular risk',ar:'اضطراب الدهون',aka:['dyslipidaemia','dyslipidemia','hyperlipidaemia','hypercholesterolaemia','الدهون','الكوليسترول'],calc:['ldl'],
 tests:['Lipid profile','Blood glucose (fasting and random)','HbA1c (glycated haemoglobin)']},
{k:'Myocardial infarction',ar:'احتشاء عضلة القلب',aka:['myocardial','infarction','heart attack','chest pain','الجلطة القلبية','القلب'],calc:[],
 tests:['Cardiac markers','Electrolytes and minerals','Lipid profile']},
{k:'Acute pancreatitis',ar:'التهاب البنكرياس',aka:['pancreatitis','البنكرياس'],calc:['ca'],
 tests:['Pancreatic enzymes','Electrolytes and minerals','Liver function tests','Lipid profile']},
{k:'Thyroid disease',ar:'أمراض الغدة الدرقية',aka:['thyroid','goitre','goiter','hypothyroid','hyperthyroid','الغدة الدرقية','الدرقية'],calc:[],
 tests:['Thyroid function tests','Thyroid FNA – Bethesda System']},
{k:'Calcium disorders',ar:'اضطرابات الكالسيوم',aka:['calcium','hypocalcaemia','hypercalcaemia','hypocalcemia','hypercalcemia','الكالسيوم'],calc:['ca'],
 tests:['Electrolytes and minerals','Renal function tests','Liver function tests']},
{k:'Malaria',ar:'الملاريا',aka:['malaria','plasmodium','ملاريا','الملاريا'],calc:[],
 tests:['Malaria thick and thin blood films','Complete blood count (CBC)']},
{k:'Tuberculosis',ar:'السل',aka:['tuberculosis','tb','mycobacterium','السل','الدرن'],calc:[],
 tests:['Ziehl–Neelsen stain (AFB)','Xpert MTB/RIF (cartridge-based NAAT)','Ziehl–Neelsen for tissue (AFB) and Wade–Fite','Sputum and bronchial cytology']},
{k:'Typhoid / brucellosis',ar:'التيفوئيد والحمى المالطية',aka:['typhoid','enteric fever','brucella','brucellosis','التيفوئيد','التايفويد','المالطية'],calc:[],
 tests:['Blood culture','Widal test (typhoid)','Brucella serology']},
{k:'Visceral leishmaniasis (kala-azar)',ar:'الليشمانيا الحشوية (الكالازار)',aka:['leishmaniasis','kala-azar','kala azar','كالازار','الكالازار','الليشمانيا'],calc:[],
 tests:['rK39 test (visceral leishmaniasis / kala-azar)','Complete blood count (CBC)']},
{k:'Schistosomiasis',ar:'البلهارسيا',aka:['schistosomiasis','schistosoma','bilharzia','بلهارسيا','البلهارسيا'],calc:[],
 tests:['Urine for Schistosoma haematobium','Stool general examination','Urine general examination (GUE)']},
{k:'Urinary tract infection',ar:'التهاب المسالك البولية',aka:['uti','urinary tract infection','cystitis','pyelonephritis','التهاب المسالك','التهاب البول'],calc:[],
 tests:['Urine general examination (GUE)','Urine culture and colony count','Antimicrobial susceptibility test (Kirby–Bauer disc diffusion)']},
{k:'Sepsis / bacteraemia',ar:'تسمم الدم',aka:['sepsis','septicaemia','septicemia','bacteraemia','bacteremia','تسمم الدم','الإنتان'],calc:[],
 tests:['Blood culture','Gram stain','Antimicrobial susceptibility test (Kirby–Bauer disc diffusion)','C-reactive protein (CRP)','Complete blood count (CBC)']},
{k:'Blood transfusion',ar:'نقل الدم',aka:['transfusion','نقل الدم'],calc:[],
 tests:['ABO and Rh(D) grouping (tube method)','Crossmatch (antiglobulin method)','Direct antiglobulin test (DAT / direct Coombs)']},
{k:'Pregnancy',ar:'الحمل',aka:['pregnancy','pregnant','الحمل','حامل'],calc:[],
 tests:['Urine pregnancy test (hCG)','Cortisol, prolactin and β-hCG','Oral glucose tolerance test (OGTT)','ABO and Rh(D) grouping (tube method)']},
{k:'Breast cancer',ar:'سرطان الثدي',aka:['breast','الثدي'],calc:[],
 tests:['Breast FNA – IAC Yokohama System','Immunohistochemistry (IHC), polymer method','Haematoxylin and eosin (H&E) staining']},
{k:'Cervical cancer screening',ar:'فحص سرطان عنق الرحم',aka:['cervical','cervix','عنق الرحم'],calc:[],
 tests:['High-risk HPV DNA testing','Cervical cytology – Bethesda System','Papanicolaou (Pap) stain','Liquid-based cytology (ThinPrep / SurePath)']},
{k:'Lymphadenopathy',ar:'تضخم العقد اللمفية',aka:['lymphadenopathy','lymph node','lymphoma','العقد اللمفية','الغدد الليمفاوية'],calc:[],
 tests:['Lymph node FNA – Sydney System','Ziehl–Neelsen for tissue (AFB) and Wade–Fite','Immunohistochemistry (IHC), polymer method','Complete blood count (CBC)']},
{k:'Amyloidosis',ar:'الداء النشواني',aka:['amyloid','amyloidosis','النشواني'],calc:[],
 tests:['Congo red (amyloid)','24-hour urine protein and albumin/creatinine ratio']},
{k:'Fungal infection',ar:'العدوى الفطرية',aka:['fungal','fungus','mycosis','mycetoma','فطري','الفطريات','المايستوما'],calc:[],
 tests:['Grocott methenamine silver (fungi)','PAS and PAS-diastase']}
];

/* calculators: one generic renderer; rg = accepted input range ([lo,hi] or per unit system); sys = unit system ('si' or 'cv'); run() returns {v,u,alt,interp,cls} or {err} */
const r1=(x,d=1)=>(Math.round(x*10**d)/10**d).toFixed(d);
const CALC_DEF=[
{id:'egfr',t:'eGFR – CKD-EPI 2021 (race-free)',ar:'معدّل الترشيح الكبيبي المقدَّر',ic:'cup',test:'Renal function tests',ref:['ckdepi','kdigo'],sys:true,
 in:[{k:'scr',l:'Serum creatinine',u:{si:'µmol/L',cv:'mg/dL'},rg:{si:[10,3000],cv:[0.1,35]}},{k:'age',l:'Age',u:'years',rg:[1,120],step:1},{k:'sex',l:'Sex',opt:[['F','Female'],['M','Male']]}],
 f:'eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^−1.200 × 0.9938^Age × 1.012 [if female]; Scr in mg/dL (µmol/L ÷ 88.4); κ = 0.7 (F) / 0.9 (M); α = −0.241 (F) / −0.302 (M).',
 run({scr,age,sex},sys){
   const s=sys==='si'?scr/88.4:scr,f=sex==='F',k=f?0.7:0.9,a=f?-0.241:-0.302;
   if(age<18)return{err:'Adults (18 years and over) only.'};
   const v=Math.round(142*Math.min(s/k,1)**a*Math.max(s/k,1)**-1.2*0.9938**age*(f?1.012:1));
   const g=v>=90?['G1','Normal or high']:v>=60?['G2','Mildly decreased']:v>=45?['G3a','Mildly to moderately decreased']:v>=30?['G3b','Moderately to severely decreased']:v>=15?['G4','Severely decreased']:['G5','Kidney failure'];
   return{v:String(v),u:'mL/min/1.73 m²',interp:`KDIGO GFR category ${g[0]}: ${g[1]}.`,cls:v>=60?'ok':v>=30?'warn':'bad'};
 },
 lim:['Validated for adults; not valid in acute kidney injury (creatinine is not at steady state), pregnancy, amputation, extremes of muscle mass or diet (e.g. vegetarian, creatine supplements).','CKD is diagnosed only when a reduced GFR (< 60) or markers of kidney damage (e.g. albuminuria) persist for more than 3 months.','Use with a creatinine method traceable to IDMS reference material.']},
{id:'ca',t:'Albumin-adjusted (corrected) calcium',ar:'الكالسيوم المصحَّح بالألبومين',ic:'flask',test:'Electrolytes and minerals',ref:['payne'],sys:true,
 in:[{k:'ca',l:'Total calcium',u:{si:'mmol/L',cv:'mg/dL'},rg:{si:[0.5,5],cv:[2,20]}},{k:'alb',l:'Albumin',u:{si:'g/L',cv:'g/dL'},rg:{si:[5,70],cv:[0.5,7]}}],
 f:'Corrected Ca (mmol/L) = measured Ca + 0.02 × (40 − albumin g/L); conventional units: Ca (mg/dL) + 0.8 × (4.0 − albumin g/dL).',
 run({ca,alb},sys){
   const c=sys==='si'?ca:ca/4.008,a=sys==='si'?alb:alb*10,v=c+0.02*(40-a);
   return{v:r1(v,2),u:'mmol/L',alt:`${r1(v*4.008,1)} mg/dL`,interp:'Compare with the laboratory’s total-calcium reference interval (the platform’s educational interval is 2.15–2.55 mmol/L).',cls:v<2.15||v>2.55?'warn':'ok'};
 },
 lim:['An approximation: many laboratories derive their own local adjustment equation, and some no longer report adjusted calcium.','Measure ionised calcium when albumin is very abnormal, in critical illness, renal failure or acid–base disturbance.']},
{id:'ldl',t:'LDL cholesterol – Friedewald',ar:'الكوليسترول منخفض الكثافة (فريدوالد)',ic:'drop',test:'Lipid profile',ref:['friedewald','ncep'],sys:true,
 in:[{k:'tc',l:'Total cholesterol',u:{si:'mmol/L',cv:'mg/dL'},rg:{si:[0.5,30],cv:[20,1200]}},{k:'hdl',l:'HDL cholesterol',u:{si:'mmol/L',cv:'mg/dL'},rg:{si:[0.1,8],cv:[4,300]}},{k:'tg',l:'Triglycerides',u:{si:'mmol/L',cv:'mg/dL'},rg:{si:[0.1,50],cv:[9,4500]}}],
 f:'LDL-C = TC − HDL-C − TG/2.2 (mmol/L) or TC − HDL-C − TG/5 (mg/dL).',
 run({tc,hdl,tg},sys){
   const si=sys==='si';
   if(tg>(si?4.5:400))return{err:'Not valid when triglycerides exceed 4.5 mmol/L (400 mg/dL): request a direct LDL-C measurement.'};
   const v=tc-hdl-tg/(si?2.2:5);
   if(v<=0)return{err:'Result is not physiological: check the entered values.'};
   return si?{v:r1(v,2),u:'mmol/L',alt:`${r1(v*38.67,0)} mg/dL`,cls:'ok'}:{v:r1(v,0),u:'mg/dL',alt:`${r1(v/38.67,2)} mmol/L`,cls:'ok'};
 },
 lim:['Requires a fasting sample (9–12 h) and is invalid in type III hyperlipoproteinaemia (dysbetalipoproteinaemia).','Underestimates LDL-C when LDL-C is low or triglycerides are raised; a direct method is preferred in these cases.']},
{id:'inr',t:'International normalised ratio (INR)',ar:'النسبة المعيارية الدولية (INR)',ic:'clock',test:'Prothrombin time (PT / INR)',ref:['dacie'],
 in:[{k:'pt',l:'Patient PT',u:'seconds',rg:[5,200]},{k:'mnpt',l:'Mean normal PT (MNPT) of the laboratory',u:'seconds',rg:[8,20]},{k:'isi',l:'ISI of the thromboplastin / analyser',u:'',rg:[0.8,3],step:0.01}],
 f:'INR = (patient PT ÷ mean normal PT)^ISI.',
 run({pt,mnpt,isi}){
   const v=(pt/mnpt)**isi;
   return{v:r1(v,1),u:'',interp:'Compare with the therapeutic range set for the patient’s indication (educational: usually 2.0–3.0).',cls:v>3?'warn':'ok'};
 },
 lim:['INR is standardised only for patients stabilised on vitamin K antagonists (e.g. warfarin).','The ISI must match the exact reagent lot and instrument; MNPT is the geometric mean PT of at least 20 healthy adults on the same system.']},
{id:'ag',t:'Anion gap',ar:'الفجوة الأنيونية',ic:'flask',test:'Electrolytes and minerals',ref:['tietz'],
 in:[{k:'na',l:'Sodium',u:'mmol/L',rg:[90,200]},{k:'cl',l:'Chloride',u:'mmol/L',rg:[60,150]},{k:'hco3',l:'Bicarbonate',u:'mmol/L',rg:[1,60]}],
 f:'Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻).',
 run({na,cl,hco3}){
   return{v:r1(na-(cl+hco3),0),u:'mmol/L',interp:'The reference interval depends on the analyser (ion-selective electrode method): use your laboratory’s own interval.',cls:'ok'};
 },
 lim:['Low albumin lowers the anion gap and can hide a raised-gap acidosis.','Interpret together with blood gas results and the clinical picture.']},
{id:'hh',t:'Blood pH – Henderson–Hasselbalch',ar:'الأس الهيدروجيني للدم – معادلة هندرسون-هاسلبالخ',ic:'drop',test:'Electrolytes and minerals',ref:['tietz'],sys:true,
 in:[{k:'hco3',l:'Bicarbonate (HCO₃⁻)',u:'mmol/L',rg:[1,60]},{k:'pco2',l:'pCO₂',u:{si:'kPa',cv:'mmHg'},rg:{si:[1,30],cv:[7.5,225]}}],
 f:'pH = 6.1 + log₁₀ [HCO₃⁻ ÷ (0.03 × pCO₂ in mmHg)]; with pCO₂ in kPa use 0.225 (0.03 × 7.5). 6.1 = pKa of carbonic acid; 0.03 = CO₂ solubility (mmol/L per mmHg).',
 run({hco3,pco2},sys){
   const ph=6.1+Math.log10(hco3/((sys==='si'?0.225:0.03)*pco2));
   const st=ph<7.35?['Acidaemia (pH below 7.35)','bad']:ph>7.45?['Alkalaemia (pH above 7.45)','bad']:['Within the usual 7.35–7.45','ok'];
   return{v:r1(ph,2),u:'',interp:`${st[0]}. Use the measured blood gas pH for patient care; this calculation checks that pH, pCO₂ and HCO₃⁻ agree and shows how they are related.`,cls:st[1]};
 },
 lim:['Blood gas analysers measure pH and pCO₂ and calculate HCO₃⁻ with this equation: a large difference between calculated and measured pH suggests a sample or transcription error.','Venous bicarbonate from the chemistry analyser and arterial pCO₂ are not strictly comparable.','Identify the primary disorder and the expected compensation before calling a disorder mixed.']}
];

/* unit converter: conventional = f(SI); factors from molecular weights */
const CONV=[
{id:'glu',l:'Glucose',si:'mmol/L',cv:'mg/dL',f:18.016},
{id:'cre',l:'Creatinine',si:'µmol/L',cv:'mg/dL',f:1/88.4},
{id:'urea',l:'Urea → blood urea nitrogen (BUN)',si:'mmol/L urea',cv:'mg/dL BUN',f:2.801},
{id:'chol',l:'Cholesterol (total, LDL, HDL)',si:'mmol/L',cv:'mg/dL',f:38.67},
{id:'tg',l:'Triglycerides',si:'mmol/L',cv:'mg/dL',f:88.57},
{id:'ca',l:'Calcium',si:'mmol/L',cv:'mg/dL',f:4.008},
{id:'bil',l:'Bilirubin',si:'µmol/L',cv:'mg/dL',f:1/17.1},
{id:'uric',l:'Uric acid',si:'µmol/L',cv:'mg/dL',f:1/59.48},
{id:'hb',l:'Haemoglobin / albumin / total protein',si:'g/L',cv:'g/dL',f:0.1},
{id:'a1c',l:'HbA1c',si:'mmol/mol (IFCC)',cv:'% (NGSP/DCCT)',to:x=>x/10.929+2.15,from:y=>(y-2.15)*10.929,dp:{si:0,cv:1},ref:'ngsp'}
];
