/* ---------- Physiology, pathophysiology and image interpretation (data only; js/physiology-view.js renders) ----------
   PHYS_SYS: five core systems with clinical correlates that link to tests (by name), calculators (CALC_DEF ids),
   anatomy diagrams (ANAT ids) and radiology cases (RAD.cases ids). HISTO_GUIDE: how to read a slide, linking
   atlas slides. RAD: X-ray, CT and MRI fundamentals and systematic reading. Values are educational. */
Object.assign(REFS,{
guyton:{c:'Hall JE, Hall ME. Guyton and Hall Textbook of Medical Physiology. 14th ed. Philadelphia: Elsevier; 2021.'},
herring:{c:'Herring W. Learning Radiology: Recognizing the Basics. 4th ed. Philadelphia: Elsevier; 2019.'},
kdigo_aki:{c:'Kidney Disease: Improving Global Outcomes (KDIGO) Acute Kidney Injury Work Group. KDIGO clinical practice guideline for acute kidney injury. Kidney Int Suppl. 2012;2(1):1–138.'},
uaht:{c:'Thygesen K, Alpert JS, Jaffe AS, et al. Fourth universal definition of myocardial infarction (2018). Circulation. 2018;138(20):e618–e651.'}
});

const PHYS_SYS=[
{id:'cardio',en:'Cardiovascular physiology',ar:'فسيولوجيا القلب والأوعية الدموية',ic:'heart',anat:['heart'],
 intro:'The heart pumps blood through two circuits in series; pressure, flow and resistance are linked (flow = pressure difference ÷ resistance).',
 introAr:'يضخ القلب الدم عبر دورتين متتاليتين؛ والضغط والجريان والمقاومة مترابطة (الجريان = فرق الضغط ÷ المقاومة).',
 core:[
  {h:'Cardiac output',hAr:'النتاج القلبي',d:'Cardiac output = heart rate × stroke volume (about 5 L/min at rest). Stroke volume depends on preload, contractility and afterload.'},
  {h:'Frank–Starling mechanism',hAr:'آلية فرانك-ستارلنغ',d:'Within limits, the more the ventricle is filled (stretched) in diastole, the more forcefully it contracts, so output matches venous return.'},
  {h:'Blood pressure',hAr:'ضغط الدم',d:'Mean arterial pressure ≈ diastolic pressure + one third of the pulse pressure; it is kept steady by the baroreceptor reflex (fast) and the renin–angiotensin–aldosterone system (slow).'},
  {h:'Coronary blood flow',hAr:'الجريان التاجي',d:'The left ventricle is perfused mainly in diastole, so a fast heart rate (short diastole) reduces myocardial oxygen supply while raising demand.'}],
 corr:[
  {id:'mi',t:'Acute myocardial infarction',ar:'احتشاء عضلة القلب الحاد',mech:'Rupture of an atherosclerotic plaque triggers a coronary thrombus; the myocardium beyond it becomes ischaemic and, after about 20–30 minutes, begins to die (necrosis), releasing cardiac troponin.',
   labs:['Cardiac troponin above the 99th percentile upper reference limit with a rise and/or fall on repeat testing (fourth universal definition).','A single normal troponin very early after symptoms does not exclude infarction: repeat as the local protocol states.','Lipid profile and glucose identify risk factors.'],
   tests:['Cardiac markers','Lipid profile','Blood glucose (fasting and random)'],calc:['ldl']},
  {id:'hf',t:'Heart failure',ar:'قصور القلب',mech:'Low cardiac output activates the sympathetic system and the renin–angiotensin–aldosterone system; salt and water retention raises venous pressure, causing pulmonary and peripheral oedema. Stretched ventricles release natriuretic peptides.',
   labs:['Raised BNP or NT-proBNP supports the diagnosis; a normal value makes heart failure unlikely.','Renal function and electrolytes: diuretics and reduced renal perfusion cause hyponatraemia, hypokalaemia or a rising creatinine.'],
   tests:['Cardiac markers','Renal function tests','Electrolytes and minerals'],calc:['egfr'],img:'rad-cxr-chf'},
  {id:'athero',t:'Atherosclerosis and dyslipidaemia',ar:'تصلّب الشرايين واضطراب الدهون',mech:'LDL particles enter the arterial wall, become oxidised and are taken up by macrophages (foam cells); inflammation and smooth muscle growth build a fibrous plaque that narrows the lumen or ruptures.',
   labs:['LDL cholesterol is the main treatment target; calculated LDL (Friedewald) is invalid when triglycerides are high.','Check fasting glucose or HbA1c and renal function as part of cardiovascular risk.'],
   tests:['Lipid profile','HbA1c (glycated haemoglobin)'],calc:['ldl']}],
 ref:['guyton','uaht','tietz']},

{id:'resp',en:'Respiratory physiology',ar:'فسيولوجيا الجهاز التنفسي',ic:'pulse',anat:['resp'],
 intro:'The lungs exchange oxygen and carbon dioxide across a very thin alveolar membrane; ventilation and blood flow must be matched.',
 introAr:'تتبادل الرئتان الأكسجين وثاني أكسيد الكربون عبر غشاء سنخي رقيق جداً؛ ويجب أن تتوافق التهوية مع جريان الدم.',
 core:[
  {h:'Ventilation–perfusion matching',hAr:'توافق التهوية والتروية',d:'Gas exchange is efficient only where ventilated alveoli are also perfused. Low V/Q (e.g. pneumonia) causes hypoxaemia; high V/Q (e.g. pulmonary embolism) creates dead space.'},
  {h:'Oxygen transport',hAr:'نقل الأكسجين',d:'Almost all oxygen is carried bound to haemoglobin. The oxygen dissociation curve shifts right (easier release to tissues) with raised CO₂, acidity, temperature and 2,3-DPG.'},
  {h:'Carbon dioxide transport',hAr:'نقل ثاني أكسيد الكربون',d:'Most CO₂ travels as bicarbonate formed by carbonic anhydrase in red cells; the rest is dissolved or bound to haemoglobin.'},
  {h:'Acid–base control',hAr:'ضبط الحموضة والقاعدية',d:'pH depends on the ratio of bicarbonate (regulated by the kidneys) to pCO₂ (regulated by the lungs): Henderson–Hasselbalch.'}],
 corr:[
  {id:'racid',t:'Respiratory acidosis',ar:'الحماض التنفسي',mech:'Hypoventilation (e.g. COPD exacerbation, sedative overdose, neuromuscular weakness) retains CO₂, raising pCO₂ and lowering pH. The kidneys compensate over days by retaining bicarbonate.',
   labs:['Blood gas: low pH, high pCO₂; bicarbonate normal in acute and raised in chronic disease.','Check that calculated and measured pH agree (Henderson–Hasselbalch).'],
   tests:['Electrolytes and minerals'],calc:['hh']},
  {id:'pneu',t:'Pneumonia',ar:'الالتهاب الرئوي',mech:'Alveoli fill with inflammatory exudate (consolidation); perfused but unventilated lung acts as a shunt and causes hypoxaemia.',
   labs:['Raised white cells (neutrophilia) and CRP in bacterial pneumonia.','Blood cultures and sputum Gram stain and culture before antibiotics when possible.'],
   tests:['Complete blood count (CBC)','C-reactive protein (CRP)','Blood culture','Gram stain'],calc:[],img:'rad-cxr-pneumonia'},
  {id:'ptx',t:'Pneumothorax',ar:'استرواح الصدر',mech:'Air enters the pleural space and abolishes the negative intrapleural pressure that keeps the lung expanded; the lung collapses towards the hilum. Tension pneumothorax shifts the mediastinum and is an emergency.',
   labs:['Diagnosis is clinical and radiological; laboratory tests are not needed to confirm it.','Look for a visceral pleural line with no lung markings beyond it.'],
   tests:[],calc:[],img:'rad-cxr-ptx'}],
 ref:['guyton','herring']},

{id:'renal',en:'Renal physiology, fluids and electrolytes',ar:'فسيولوجيا الكلى والسوائل والكهارل',ic:'drop',anat:['urinary'],
 intro:'The kidneys filter about 180 L of plasma a day and reabsorb almost all of it, adjusting water, sodium, potassium and acid to keep the internal environment constant.',
 introAr:'تصفّي الكليتان نحو 180 لتراً من البلازما يومياً وتعيدان امتصاص معظمها تقريباً، فتضبطان الماء والصوديوم والبوتاسيوم والحمض للحفاظ على ثبات البيئة الداخلية.',
 core:[
  {h:'Glomerular filtration rate',hAr:'معدّل الترشيح الكبيبي',d:'GFR (about 90–120 mL/min/1.73 m² in young adults) is the best overall index of kidney function; serum creatinine rises only when GFR falls substantially, so eGFR equations are used.'},
  {h:'Water balance',hAr:'توازن الماء',d:'Antidiuretic hormone (ADH) inserts water channels in the collecting duct; plasma sodium and osmolality reflect water balance more than sodium balance.'},
  {h:'Sodium and potassium',hAr:'الصوديوم والبوتاسيوم',d:'Aldosterone increases sodium reabsorption and potassium secretion in the distal nephron; insulin, beta-agonists and alkalosis move potassium into cells.'},
  {h:'Acid excretion',hAr:'إطراح الحمض',d:'The kidneys reclaim filtered bicarbonate and excrete acid as ammonium and titratable acid, generating new bicarbonate.'}],
 corr:[
  {id:'aki',t:'Acute kidney injury and chronic kidney disease',ar:'إصابة الكلى الحادة ومرض الكلى المزمن',mech:'AKI is a rapid fall in GFR (pre-renal, intrinsic or post-renal causes); CKD is reduced GFR or kidney damage lasting more than 3 months, leading to anaemia, acidosis, hyperphosphataemia and hyperkalaemia.',
   labs:['KDIGO AKI: creatinine rise of ≥ 26.5 µmol/L (0.3 mg/dL) within 48 hours, or ≥ 1.5 times baseline within 7 days, or low urine output.','eGFR equations are not valid while creatinine is changing (AKI).','Urine albumin/creatinine ratio and urinalysis show kidney damage.'],
   tests:['Renal function tests','Electrolytes and minerals','24-hour urine protein and albumin/creatinine ratio','Urine general examination (GUE)'],calc:['egfr']},
  {id:'hyperk',t:'Hyperkalaemia',ar:'فرط بوتاسيوم الدم',mech:'Reduced renal excretion (AKI, CKD, drugs such as ACE inhibitors), shift out of cells (acidosis, insulin deficiency) or release from damaged cells. High potassium destabilises cardiac membranes and can cause arrhythmia.',
   labs:['Exclude pseudohyperkalaemia first: haemolysis, delayed separation, EDTA contamination or fist clenching during collection.','Repeat urgently on a fresh, non-haemolysed sample if the result is unexpected.'],
   tests:['Electrolytes and minerals','Renal function tests','Venous blood collection (phlebotomy)'],calc:['egfr']},
  {id:'macid',t:'Metabolic acidosis and the anion gap',ar:'الحماض الاستقلابي والفجوة الأنيونية',mech:'Gain of acid or loss of bicarbonate lowers HCO₃⁻ and pH; the lungs compensate by hyperventilation (lower pCO₂). A raised anion gap means unmeasured acid anions (e.g. ketones, lactate, uraemia, toxins); a normal gap suggests bicarbonate loss (diarrhoea, renal tubular acidosis).',
   labs:['Calculate the anion gap; correct mentally for low albumin.','Check glucose and ketones (diabetic ketoacidosis), lactate and renal function.'],
   tests:['Electrolytes and minerals','Renal function tests','Blood glucose (fasting and random)'],calc:['ag','hh']}],
 ref:['guyton','kdigo_aki','kdigo','tietz']},

{id:'endo',en:'Endocrine physiology',ar:'فسيولوجيا الغدد الصماء',ic:'dna',anat:['endo'],
 intro:'Hormones act through feedback loops: most hypothalamic–pituitary axes are controlled by negative feedback from the hormone of the target gland.',
 introAr:'تعمل الهرمونات عبر حلقات تغذية راجعة: تُضبط معظم محاور الوطاء والغدة النخامية بتغذية راجعة سلبية من هرمون الغدة الهدف.',
 core:[
  {h:'Negative feedback',hAr:'التغذية الراجعة السلبية',d:'In primary gland failure the trophic hormone rises (e.g. high TSH in primary hypothyroidism); in pituitary failure both the trophic and target hormones are low.'},
  {h:'Glucose homeostasis',hAr:'توازن الغلوكوز',d:'Insulin lowers blood glucose by increasing uptake and storage; glucagon, cortisol, adrenaline and growth hormone raise it.'},
  {h:'Thyroid hormones',hAr:'هرمونات الغدة الدرقية',d:'T4 is converted to the more active T3 in tissues; thyroid hormones set the metabolic rate.'},
  {h:'Cortisol rhythm',hAr:'إيقاع الكورتيزول',d:'Cortisol is highest in the early morning and lowest around midnight, so the time of sampling must be recorded.'}],
 corr:[
  {id:'dm',t:'Diabetes mellitus and ketoacidosis',ar:'داء السكري والحماض الكيتوني',mech:'Insulin deficiency (type 1) or resistance with failing secretion (type 2) causes hyperglycaemia. Severe insulin deficiency increases fat breakdown and ketone production, causing a raised anion gap metabolic acidosis (DKA).',
   labs:['Diagnosis (ADA): fasting plasma glucose ≥ 7.0 mmol/L (126 mg/dL), 2-hour OGTT glucose ≥ 11.1 mmol/L (200 mg/dL), HbA1c ≥ 48 mmol/mol (6.5%), or random glucose ≥ 11.1 mmol/L with symptoms.','DKA: hyperglycaemia, ketones and a raised anion gap acidosis; check potassium closely.'],
   tests:['Blood glucose (fasting and random)','Oral glucose tolerance test (OGTT)','HbA1c (glycated haemoglobin)','24-hour urine protein and albumin/creatinine ratio'],calc:['ag','hh']},
  {id:'thyroid',t:'Hypothyroidism and hyperthyroidism',ar:'قصور الدرقية وفرط نشاطها',mech:'Primary hypothyroidism (often autoimmune) lowers T4 and raises TSH; Graves’ disease (TSH-receptor antibodies) raises T4 and T3 and suppresses TSH.',
   labs:['TSH is the best first-line test for primary thyroid disease.','Interpret with care in pregnancy, acute illness and with biotin supplements (assay interference).'],
   tests:['Thyroid function tests'],calc:[]},
  {id:'adrenal',t:'Cushing’s syndrome and Addison’s disease',ar:'متلازمة كوشينغ وداء أديسون',mech:'Excess cortisol causes central obesity, hypertension, hyperglycaemia and hypokalaemia; adrenal failure (Addison’s) causes weakness, low blood pressure, hyponatraemia and hyperkalaemia.',
   labs:['Record the sampling time for cortisol.','Hyponatraemia with hyperkalaemia in an unwell patient: consider adrenal insufficiency urgently.'],
   tests:['Cortisol, prolactin and β-hCG','Electrolytes and minerals','Blood glucose (fasting and random)'],calc:[]}],
 ref:['guyton','ada','tietz']},

{id:'neuro',en:'Neurophysiology',ar:'الفسيولوجيا العصبية',ic:'body',anat:['brain','spine','eye'],
 intro:'Neurons signal with electrical impulses and chemical transmitters; the brain is protected by the blood–brain barrier and cushioned by cerebrospinal fluid.',
 introAr:'تتواصل العصبونات بالنبضات الكهربائية والنواقل الكيميائية؛ ويحمي الدماغَ الحاجزُ الدموي الدماغي ويحيط به السائل الدماغي الشوكي.',
 core:[
  {h:'Resting membrane potential',hAr:'جهد الغشاء أثناء الراحة',d:'About −70 mV, set mainly by potassium leak channels and maintained by the Na⁺/K⁺-ATPase.'},
  {h:'Action potential',hAr:'جهد الفعل',d:'Opening of voltage-gated sodium channels depolarises the membrane; potassium efflux repolarises it. Myelin allows fast saltatory conduction.'},
  {h:'Synaptic transmission',hAr:'النقل المشبكي',d:'Calcium entry at the nerve terminal releases neurotransmitter that binds receptors on the next cell.'},
  {h:'Cerebrospinal fluid',hAr:'السائل الدماغي الشوكي',d:'Produced mainly by the choroid plexus (about 500 mL per day), it circulates through the ventricles and subarachnoid space and is absorbed through the arachnoid granulations.'}],
 corr:[
  {id:'mening',t:'Meningitis',ar:'التهاب السحايا',mech:'Infection inflames the meninges; bacteria and neutrophils increase CSF protein and consume glucose, while inflammation raises intracranial pressure.',
   labs:['Bacterial: high neutrophils, high protein, low CSF glucose (low CSF : blood glucose ratio) — take a blood glucose at the same time.','Viral: lymphocytes, normal glucose, mildly raised protein.','Gram stain, culture and blood cultures; process CSF at once.'],
   tests:['CSF cytology','Gram stain','Blood culture','Blood glucose (fasting and random)'],calc:[]},
  {id:'hypona',t:'Hyponatraemia and the brain',ar:'نقص صوديوم الدم والدماغ',mech:'Low plasma osmolality moves water into brain cells, causing cerebral oedema (headache, confusion, seizures). Correcting chronic hyponatraemia too fast can cause osmotic demyelination.',
   labs:['Check plasma osmolality to exclude pseudohyponatraemia (high lipids or proteins) and hyperglycaemia.','Glucose, renal function and thyroid and adrenal function help find the cause.'],
   tests:['Electrolytes and minerals','Blood glucose (fasting and random)','Thyroid function tests','Cortisol, prolactin and β-hCG'],calc:[]},
  {id:'ich',t:'Intracranial haemorrhage',ar:'النزف داخل القحف',mech:'Bleeding into the brain (hypertension, anticoagulants) or between the brain and skull (trauma: subdural or extradural haematoma) raises intracranial pressure and damages tissue.',
   labs:['Non-contrast CT is the first test: fresh blood is bright (hyperdense).','Check platelets, PT/INR and APTT, especially on anticoagulants.'],
   tests:['Complete blood count (CBC)','Prothrombin time (PT / INR)','Activated partial thromboplastin time (APTT)'],calc:['inr'],img:'rad-ct-ich'}],
 ref:['guyton','herring']}
];

/* ---------- reading a histology slide ---------- */
const HISTO_GUIDE={
 steps:[
  {t:'Check the request and the slide',ar:'راجع الطلب والشريحة',d:'Patient details, specimen site, clinical question, stain used (H&E, special stain or IHC) and the slide label.'},
  {t:'Low power (×4): tissue and architecture',ar:'التكبير المنخفض (×4): النسيج والبنية',d:'What tissue is it? Is the overall architecture normal? Find the abnormal area and the normal tissue next to it.'},
  {t:'Medium power (×10): pattern',ar:'التكبير المتوسط (×10): النمط',d:'Glandular, solid, papillary or diffuse growth; stroma, inflammation, necrosis and the edge of the lesion (pushing or infiltrative).'},
  {t:'High power (×40): cells and nuclei',ar:'التكبير العالي (×40): الخلايا والأنوية',d:'Nuclear size, shape, chromatin, nucleoli and mitoses; cytoplasm; the nuclear-to-cytoplasmic ratio; organisms or deposits.'},
  {t:'Confirm with special stains or IHC',ar:'التأكيد بالصبغات الخاصة أو الكيمياء المناعية',d:'Choose the stain that answers the question: PAS for mucin and fungi, Congo red for amyloid, Perls for iron, Masson for fibrosis, IHC for cell lineage or markers.'},
  {t:'Compare with normal and look-alikes',ar:'قارن بالطبيعي وبما يشبهه',d:'Ask what else could look like this; use the Normal vs Abnormal guide and the atlas look-alikes.'},
  {t:'Conclude and correlate',ar:'استنتج واربط بالحالة السريرية',d:'Summarise the diagnosis in standard terms and check it fits the clinical and radiological findings; an expert pathologist signs the report.'}],
 malig:['Nuclear enlargement and a high nuclear-to-cytoplasmic ratio','Pleomorphism (variation in size and shape) and hyperchromasia','Irregular nuclear membranes and prominent nucleoli','Increased and atypical mitoses','Loss of normal polarity and architecture','Invasion through the basement membrane (the defining feature of carcinoma)'],
 sets:[
  {t:'Normal mucosa to adenoma to carcinoma',ar:'من الغشاء المخاطي الطبيعي إلى الورم الغدي ثم السرطان',slides:['colon-normal','ta-low','ta-high','crc-crib']},
  {t:'Inflammation and injury',ar:'الالتهاب والأذية',slides:['uc','giemsa-hp']},
  {t:'Special stains',ar:'الصبغات الخاصة',slides:['pas-mucin','congo-sv','perls-liver','masson-glom']},
  {t:'Immunohistochemistry',ar:'الكيمياء النسيجية المناعية',slides:['ihc-ki67','her2-ihc','er-ilc']},
  {t:'Cytology',ar:'علم الخلايا',slides:['pap-lsil','pap-hsil','pap-adenoca']}],
 ref:['robbins','bancroft']
};

/* ---------- radiology: modalities, scales, systematic reading, image cases ---------- */
const HAG={by:'Mikael Häggström',lic:'CC0'};
const RAD={
 mods:[
  {id:'xray',t:'Plain radiography (X-ray)',ar:'التصوير الشعاعي البسيط (الأشعة السينية)',ic:'image',
   how:'X-rays pass through the body onto a detector; dense tissues absorb more and appear white, while air lets X-rays through and appears black. A single projection superimposes all structures.',
   pts:['Five basic densities, from black to white: air, fat, soft tissue and fluid, bone, metal.','A border between two structures is visible only if their densities differ (the silhouette sign).','Uses ionising radiation; low dose for a chest X-ray.']},
  {id:'ct',t:'Computed tomography (CT)',ar:'التصوير المقطعي المحوسب',ic:'spin',
   how:'An X-ray tube rotates around the patient and a computer reconstructs cross-sectional slices. Each pixel is given a density in Hounsfield units (HU), with water set to 0 and air to −1000.',
   pts:['Windows (lung, soft tissue, bone, brain) choose which HU range is shown in grey shades.','Excellent for bleeding, fractures, lungs and the abdomen; fast in emergencies.','Higher radiation dose than plain films; iodinated contrast can affect the kidneys and cause allergic reactions — check renal function when indicated.']},
  {id:'mri',t:'Magnetic resonance imaging (MRI)',ar:'التصوير بالرنين المغناطيسي',ic:'gland',
   how:'A strong magnetic field and radio waves excite hydrogen nuclei (mainly in water and fat); the signal they return depends on the tissue and on the sequence used.',
   pts:['T1-weighted: fat bright, fluid dark — good for anatomy.','T2-weighted: fluid bright — good for oedema and disease; FLAIR is T2 with the fluid signal suppressed.','No ionising radiation; some implants, pacemakers and metal fragments are contraindications; screen every patient.']}],
 hu:[['Air','الهواء','−1000'],['Lung','الرئة','About −900 to −500'],['Fat','الدهون','About −100 to −50'],['Water','الماء','0'],['Cerebrospinal fluid','السائل الدماغي الشوكي','About +15'],['Soft tissue and muscle','الأنسجة الرخوة والعضلات','About +20 to +60'],['Acute clotted blood','الدم المتخثر الحديث','About +50 to +80'],['Bone','العظم','About +400 to more than +1000'],['Metal','المعادن','Several thousand (often off the scale)']],
 mri:[['Fat','الدهون','Bright','Bright (fast spin echo)'],['Water, CSF, oedema','الماء والسائل الدماغي الشوكي والوذمة','Dark','Bright'],['Cortical bone, air','العظم القشري والهواء','Dark','Dark'],['Grey vs white matter','المادة الرمادية مقابل البيضاء','White matter brighter than grey','Grey matter brighter than white']],
 cxr:{
  ripe:[
   {k:'R',t:'Rotation',ar:'الدوران',d:'Spinous processes should be midway between the medial ends of the clavicles.'},
   {k:'I',t:'Inspiration',ar:'الشهيق',d:'About 5–6 anterior ribs (or 9–10 posterior ribs) above the diaphragm in a good inspiration.'},
   {k:'P',t:'Projection',ar:'الإسقاط',d:'PA (standard) or AP (portable); the heart looks larger on an AP film, so do not judge heart size on AP.'},
   {k:'E',t:'Exposure',ar:'التعريض',d:'The thoracic vertebrae should be just visible behind the heart.'}],
  abcde:[
   {k:'A',t:'Airway',ar:'المجرى الهوائي',d:'Trachea central, carina and main bronchi; any mass or deviation.'},
   {k:'B',t:'Breathing (lungs and pleura)',ar:'التنفس (الرئتان والجنبة)',d:'Compare both lungs zone by zone; consolidation, masses, pneumothorax, pleural effusion (blunted costophrenic angles).'},
   {k:'C',t:'Cardiac and mediastinum',ar:'القلب والمنصف',d:'Heart size (cardiothoracic ratio below 0.5 on a PA film), clear heart borders, mediastinal width and hila.'},
   {k:'D',t:'Diaphragm',ar:'الحجاب الحاجز',d:'Right hemidiaphragm usually slightly higher than the left; free air under the diaphragm suggests a perforated viscus.'},
   {k:'E',t:'Everything else',ar:'كل ما عدا ذلك',d:'Bones (ribs, clavicles, spine), soft tissues, lines, tubes and devices; review areas: apices, behind the heart, below the diaphragm.'}]},
 cthead:[
  {k:'Blood',t:'Blood',ar:'الدم',d:'Fresh blood is hyperdense (bright): look inside the brain, around it (subdural, extradural, subarachnoid) and in the ventricles.'},
  {k:'Cisterns',t:'Cisterns',ar:'الصهاريج',d:'Basal cisterns should be open; effacement suggests raised pressure.'},
  {k:'Brain',t:'Brain',ar:'الدماغ',d:'Grey–white differentiation, symmetry, midline shift, low-density areas (infarct, oedema).'},
  {k:'Ventricles',t:'Ventricles',ar:'البطينات',d:'Size and symmetry: dilatation (hydrocephalus) or compression.'},
  {k:'Bone',t:'Bone',ar:'العظم',d:'Bone window for fractures of the skull vault and base.'}],
 cases:[
  {id:'rad-cxr-normal',mod:'xray',f:'images/rad-cxr-normal.jpg',t:'Normal PA chest radiograph',ar:'صورة صدر خلفية-أمامية طبيعية',...HAG,src:'https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg',
   find:['Trachea central; both lungs clear with lung markings to the edges.','Sharp costophrenic angles and clear heart borders.','Heart width less than half the chest width (PA film).']},
  {id:'rad-cxr-pneumonia',mod:'xray',f:'images/rad-cxr-pneumonia.jpg',t:'Lobar pneumonia',ar:'التهاب رئوي فصّي',...HAG,src:'https://commons.wikimedia.org/wiki/File:X-ray_of_lobar_pneumonia.jpg',
   find:['Dense, white consolidation confined to one lobe.','Air bronchograms (dark air-filled bronchi within the white lung) may be seen.','Silhouette sign: loss of the border of the structure next to the consolidated lobe.'],link:'resp'},
  {id:'rad-cxr-ptx',mod:'xray',f:'images/rad-cxr-ptx.jpg',t:'Pneumothorax (annotated)',ar:'استرواح الصدر (مع شرح)',...HAG,src:'https://commons.wikimedia.org/wiki/File:X-ray_subtle_pneumothorax_in_inspiration_-_annotated.jpg',
   find:['A thin visceral pleural line with no lung markings beyond it.','Subtle pneumothoraces are easiest to see at the apex.','Check for mediastinal shift away from the affected side (tension).'],link:'resp'},
  {id:'rad-cxr-chf',mod:'xray',f:'images/rad-cxr-chf.jpg',t:'Heart failure signs (annotated)',ar:'علامات قصور القلب (مع شرح)',...HAG,src:'https://commons.wikimedia.org/wiki/File:Chest_radiograph_with_signs_of_congestive_heart_failure_-_annotated.jpg',
   find:['Enlarged heart (cardiothoracic ratio above 0.5 on a PA film).','Upper lobe blood diversion and interstitial oedema (Kerley B lines at the bases).','Pleural effusions blunting the costophrenic angles.'],link:'cardio'},
  {id:'rad-ct-normal',mod:'ct',f:'images/rad-ct-normal.jpg',t:'Normal CT brain (axial)',ar:'تصوير مقطعي طبيعي للدماغ (محوري)',...HAG,src:'https://commons.wikimedia.org/wiki/File:CT_of_a_normal_brain,_axial_16.png',
   find:['Grey matter slightly brighter than white matter.','CSF in ventricles and sulci is dark (about +15 HU); bone is white.','Symmetrical hemispheres with no midline shift.']},
  {id:'rad-ct-ich',mod:'ct',f:'images/rad-ct-ich.jpg',t:'Intracerebral haemorrhage (CT)',ar:'نزف داخل الدماغ (تصوير مقطعي)',by:'Glitzy queen00 (English Wikipedia)',lic:'Public domain',src:'https://commons.wikimedia.org/wiki/File:Intracerebral_hemorrage_(CT_scan).jpg',
   find:['Bright (hyperdense) fresh blood in the brain, here extending into and filling the lateral ventricles (intraventricular extension).','Compare with the dark CSF of normal ventricles; look for mass effect and hydrocephalus.','Check coagulation and platelets in the laboratory.'],link:'neuro'},
  {id:'rad-ct-sdh',mod:'ct',f:'images/rad-ct-sdh.jpg',t:'Subdural haematoma (CT, arrow)',ar:'ورم دموي تحت الجافية (تصوير مقطعي، سهم)',by:'Glitzy queen00 (English Wikipedia)',lic:'Public domain',src:'https://commons.wikimedia.org/wiki/File:Trauma_subdural_arrow.jpg',
   find:['Crescent-shaped collection between brain and skull that can cross suture lines.','Acute blood is bright; older blood becomes darker.','Mass effect: compressed ventricle and midline shift.'],link:'neuro'}],
 ref:['herring']
};
