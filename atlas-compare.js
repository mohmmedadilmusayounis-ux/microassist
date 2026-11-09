/* ---------- Normal vs abnormal: extra slides and side-by-side comparison sets (data only) ----------
   js/compare-view.js renders the comparisons. Each set has one normal slide and one or more abnormal items;
   rows = [feature EN, feature AR, normal, abnormal]. An item without a slide (photo: null) is described in text only,
   because no openly licensed photograph was found. Photographs: Wikimedia Commons, licence shown (resized = modified). */
Object.assign(REFS,{
feakins:{c:'Feakins RM. Inflammatory bowel disease biopsies: updated British Society of Gastroenterology reporting guidelines. J Clin Pathol. 2013;66(12):1005–1026.',u:'https://doi.org/10.1136/jclinpath-2013-201885'}
});
ATLAS.push(
{id:'haem-lymph',sub:'wbc',f:'images/haem-lymph.jpg',title:'Normal small lymphocyte',ar:'خلية لمفاوية صغيرة طبيعية',organ:'Peripheral blood',stain:'Wright',cat:'haem',proto:'WBC differential (blood film)',
view:'A small lymphocyte among normal red cells: a round, dense, dark purple nucleus with only a thin rim of blue cytoplasm; it is about the size of a red cell.',
key:['The commonest lymphocyte in blood: about 7–10 µm, close to the size of a red cell.'],
feat:['Round nucleus with dense, clumped chromatin','Scant, pale blue cytoplasm (high N:C ratio)','No granules or only a few azurophilic granules'],
crit:['Lymphocytosis in adults: think viral infection; in older adults with smudge cells, CLL'],
ddx:['Reactive lymphocytes (larger, abundant blue cytoplasm)','CLL cells (similar, with smudge cells)','Nucleated red cells (denser nucleus, pinkish cytoplasm)'],
teach:['Use the small lymphocyte nucleus as a built-in size ruler for red cells.'],
ref:['dacie','bain_bc'],by:'Echinaceapallida',lic:'CC BY-SA 4.0',src:WCF+'Blood-lymphocyte2.jpg'},

{id:'haem-baso',sub:'wbc',f:'images/haem-baso.jpg',title:'Normal basophil',ar:'خلية قاعدية طبيعية',organ:'Peripheral blood',stain:'Wright',cat:'haem',proto:'WBC differential (blood film)',
view:'A basophil among red cells and platelets: large dark purple-black granules fill the cell and hide most of the nucleus.',
key:['The least common white cell in blood (usually under 1–2% of the differential).'],
feat:['Coarse purple-black granules covering the nucleus','Cell slightly smaller than or similar to a neutrophil'],
crit:['Basophilia is a clue to chronic myeloid leukaemia and other myeloproliferative neoplasms'],
ddx:['Neutrophil with toxic granulation (granules do not hide the nucleus)','Mast cell (tissue, not usually in blood)'],
teach:['Granules are water-soluble: poor fixation or washing can leave basophils looking empty.'],
ref:['dacie','bain_bc'],by:'Echinaceapallida',lic:'CC BY-SA 4.0',src:WCF+'Blood-basophil2.jpg'},

{id:'haem-pltclump',sub:'plt',f:'images/haem-pltclump.jpg',title:'Platelet clumps (aggregates)',ar:'تكتّل الصفائح الدموية',organ:'Peripheral blood',stain:'May-Grünwald-Giemsa',cat:'haem',proto:'Complete blood count (CBC)',
view:'Two large aggregates of purple platelets joined together, with a few red cells around them, on a May-Grünwald-Giemsa film.',
key:['Clumped platelets are not counted individually by the analyser, so the platelet count is falsely low (pseudothrombocytopenia).'],
feat:['Tight groups of many platelets','Often at the feathered edge of the film'],
crit:['A low count with clumps on the film is not true thrombocytopenia: report the clumps and recollect (e.g. citrate tube) if a count is needed'],
ddx:['Giant platelets','Fibrin strands from a partly clotted sample'],
pit:['EDTA-dependent clumping is a common laboratory artefact; a partly clotted sample also lowers the count'],
teach:['Always review the film before reporting an unexpectedly low platelet count.'],
ref:['dacie','bain_bc'],by:'Tommaso Leonardi (caption cropped)',lic:'CC BY 3.0',src:WCF+'Platelets.jpg'},

{id:'uc',f:'images/uc-intermed.jpg',title:'Ulcerative colitis — chronic active colitis',ar:'التهاب القولون التقرحي – التهاب مزمن نشط',organ:'Colon (biopsy)',stain:'H&E',cat:'he',proto:'Haematoxylin and eosin (H&E) staining',
view:'Colonic mucosa with a dense inflammatory infiltrate filling the lamina propria between crypts of uneven size and spacing; near the top, a crypt lumen is filled with neutrophils (crypt abscess). Second image: higher power of the inflamed lamina propria and crypts.',
key:['Ulcerative colitis is a chronic inflammatory bowel disease of the colon that starts in the rectum and extends continuously.','Chronic features (architectural distortion, basal plasmacytosis) separate it from acute infective colitis.'],
feat:['Crypt architectural distortion: crypts irregular, branched or reduced','Dense lymphoplasmacytic infiltrate in the lamina propria, including basal plasmacytosis','Activity: neutrophils in crypt epithelium (cryptitis) and crypt lumens (crypt abscesses)'],
crit:['IBD: chronic changes plus activity; UC is diffuse and continuous from the rectum, mucosal','Crohn disease: patchy, may be transmural, granulomas in some cases'],
ddx:['Acute infective colitis (no architectural distortion)','Crohn colitis','Ischaemic and drug-induced colitis'],
pit:['Treated UC can look patchy and lose rectal involvement','Biopsy early in the disease may lack chronic features'],
mark:['Stool cultures and C. difficile testing to exclude infection; dysplasia surveillance in long-standing colitis'],
teach:['Compare with the normal colon slide: straight, evenly spaced crypts reaching the muscularis mucosae.'],
ref:['feakins','robbins'],by:'CoRus13',lic:'CC BY-SA 4.0',src:WCF+'Moderate_chronic_active_ulcerative_colitis,_intermed._mag.jpg',
more:[{f:'images/uc-high.jpg',cap:'Higher power: crypts surrounded by dense inflammation with plasma cells and neutrophils.',by:'CoRus13',lic:'CC BY-SA 4.0',src:WCF+'Moderate_chronic_active_ulcerative_colitis,_high_mag.jpg'}]}
);

const COMPARE=[
{id:'rbc',area:'haem',nb:['Uniform round biconcave discs about 7–8 µm across (about the size of a small lymphocyte nucleus); central pallor about one third of the diameter','Even pink-orange (orthochromatic) staining with no inclusions; MCV 80–100 fL with a normal RDW'],t:'Red cells: normal vs abnormal shapes and inclusions',ar:'كريات الدم الحمراء: الطبيعي مقابل الأشكال والمشتملات غير الطبيعية',
 normal:'pbs-neut',normalNote:'Normocytic, normochromic red cells: round biconcave discs of uniform size (about 7–8 µm) with central pallor about one third of the cell diameter.',
 items:[
  {slide:'haem-sickle',ab:['Elongated crescent (sickle) cells with pointed ends, often with target cells and polychromasia','Sickle cell disease: confirm with Hb electrophoresis or HPLC; correlate with haemoglobin and reticulocyte count'],rows:[['Shape','الشكل','Round biconcave disc','Elongated crescent with pointed ends'],['Central pallor','الشحوب المركزي','About one third of the diameter','Absent in sickle cells'],['Cause','السبب','—','HbS polymerises when deoxygenated'],['Next test','الفحص التالي','—','Hb electrophoresis or HPLC; sickling test']]},
  {slide:'haem-target',ab:['Dense central spot inside the pale zone (codocytes)','Liver disease, HbC/HbE or thalassaemia (low MCV), or after splenectomy: correlate with MCV and haemoglobin studies'],rows:[['Shape','الشكل','Round disc','Disc with a central dense spot inside the pale ring ("bull’s eye")'],['Cause','السبب','—','Excess membrane relative to haemoglobin'],['Associations','الارتباطات','—','Liver disease, HbC/HbE, thalassaemia, after splenectomy']]},
  {slide:'haem-sphero',ab:['Small, dense round cells without central pallor','Hereditary spherocytosis or warm autoimmune haemolysis: raised MCHC and reticulocytes; the DAT separates the two'],rows:[['Size','الحجم','7–8 µm','Smaller and denser'],['Central pallor','الشحوب المركزي','Present','Absent'],['Cause','السبب','—','Loss of membrane'],['Associations','الارتباطات','—','Hereditary spherocytosis, warm autoimmune haemolysis'],['Next test','الفحص التالي','—','DAT; EMA binding test for hereditary spherocytosis']]},
  {slide:'haem-schisto',ab:['Red cell fragments with sharp angles (helmet cells, triangles)','Microangiopathic haemolysis: with low platelets and raised LDH, report urgently (TTP, HUS, DIC)'],rows:[['Shape','الشكل','Intact round disc','Fragments with sharp angles (helmet, triangle)'],['Size','الحجم','Uniform','Smaller than normal cells'],['Associations','الارتباطات','—','Microangiopathic haemolysis (TTP, HUS, DIC), mechanical valves'],['Action','الإجراء','—','Report the percentage (ICSH); urgent if platelets are low']]},
  {slide:'haem-hj',ab:['A single small round purple inclusion (nuclear remnant) in red cells','Hyposplenism: splenectomy, sickle cell disease or coeliac disease'],rows:[['Inclusions','المشتملات','None','One small round dark purple dot (nuclear remnant)'],['Cause','السبب','—','The spleen is absent or not working'],['Associations','الارتباطات','—','Splenectomy, sickle cell disease, coeliac disease']]}
 ],
 key:['Judge red cells in the thin part of the film where cells just touch.','Name and grade the dominant abnormal shape and link it to the clinical picture.'],ref:['dacie','bain_bc','icsh_schisto']},

{id:'neut',area:'haem',nb:['10–12 µm; 3–5 nuclear lobes joined by thin chromatin strands','Fine lilac granules in pale pink cytoplasm'],t:'Neutrophils: normal vs hypersegmented and toxic changes',ar:'العدلات: الطبيعية مقابل مفرطة التفصص والتغيرات السمية',
 normal:'pbs-neut',normalNote:'Mature segmented neutrophil: 10–12 µm, 3–5 nuclear lobes joined by thin chromatin strands, fine lilac granules.',
 items:[
  {slide:'haem-hyperseg',ab:['Six or more nuclear lobes','Megaloblastic anaemia: correlate with a raised MCV; measure vitamin B12 and folate'],rows:[['Nuclear lobes','فصوص النواة','3–5','6 or more (or > 5% with 5 lobes)'],['Associated red cells','الكريات الحمراء المصاحبة','Normal','Oval macrocytes (raised MCV)'],['Cause','السبب','—','Vitamin B12 or folate deficiency; some drugs']]},
  {slide:null,t:'Toxic granulation',ab:['Coarse dark purple granules with Döhle bodies and cytoplasmic vacuoles','Severe infection or inflammation, or G-CSF treatment: correlate with the neutrophil count and CRP'],ar:'التحبب السمي',desc:'Coarse, dark purple granules in the neutrophil cytoplasm, often with Döhle bodies (pale blue cytoplasmic patches) and vacuoles. No openly licensed photograph was available for this atlas.',
   rows:[['Granules','الحبيبات','Fine, lilac','Coarse, dark purple'],['Other changes','تغيرات أخرى','None','Döhle bodies, cytoplasmic vacuoles'],['Associations','الارتباطات','—','Severe bacterial infection and sepsis, inflammation, G-CSF treatment, pregnancy']]}
 ],
 key:['Count lobes only where they are joined by thin strands, not overlapping folds.','Toxic changes support infection but are not specific.'],ref:['dacie','bain_bc']},

{id:'lymph',area:'haem',nb:['Small round cell about the size of a red cell (7–10 µm) with a high N:C ratio','Dense, dark purple nucleus with a thin rim of pale blue cytoplasm'],t:'Lymphocytes: normal vs reactive, CLL and blasts',ar:'الخلايا اللمفاوية: الطبيعية مقابل التفاعلية واللوكيميا المزمنة والأرومات',
 normal:'haem-lymph',normalNote:'Small lymphocyte: about the size of a red cell, round dense nucleus, thin rim of blue cytoplasm.',
 items:[
  {slide:'haem-reactive',ab:['Large lymphocytes with abundant blue cytoplasm scalloped by red cells; appearance varies from cell to cell','Viral infection (EBV, CMV): correlate with the lymphocyte count and EBV tests'],rows:[['Size','الحجم','7–10 µm','Large (up to about 2–3 red cells)'],['Cytoplasm','السيتوبلازم','Scant, pale blue rim','Abundant, deeper blue at the edge, scalloped by red cells'],['Population','المجموعة','Uniform','Varied from cell to cell'],['Associations','الارتباطات','—','Infectious mononucleosis (EBV), CMV and other viral infections']]},
  {slide:'haem-smudge',ab:['Crushed lymphocyte nuclei without cytoplasm (smudge cells)','Chronic lymphocytic leukaemia: correlate with the lymphocyte count; confirm by flow cytometry'],rows:[['Cell','الخلية','Intact','Crushed nucleus without cytoplasm (smudge cell)'],['Associations','الارتباطات','—','Chronic lymphocytic leukaemia (fragile cells)'],['Next test','الفحص التالي','—','Flow cytometry (CD5, CD19, CD23)']]},
  {slide:'haem-auer',ab:['Large blasts with fine chromatin, nucleoli and Auer rods','Acute myeloid leukaemia: urgent flow cytometry, cytogenetics and a coagulation screen'],rows:[['Size','الحجم','Small','Large (blast)'],['Chromatin','الكروماتين','Dense, clumped','Fine, open, with nucleoli'],['N:C ratio','نسبة النواة للسيتوبلازم','High','Very high'],['Inclusions','المشتملات','None','Auer rods (myeloid blasts only)'],['Action','الإجراء','—','Report urgently; flow cytometry; coagulation screen']]}
 ],
 key:['Reactive cells vary; a monotonous population raises concern for leukaemia or lymphoma.','Blasts with Auer rods prove myeloid lineage.'],ref:['dacie','bain_bc','who_haem5']},

{id:'plt',area:'haem',nb:['Small fragments about 2–3 µm, scattered singly between red cells','Purple granular centre with a paler edge; platform educational count 150–450 ×10⁹/L'],t:'Platelets: normal vs giant platelets and clumps',ar:'الصفائح الدموية: الطبيعية مقابل العملاقة والمتكتلة',
 normal:'pbs-neut',normalNote:'Normal platelets: small (about 2–3 µm) purple granular fragments scattered singly between red cells.',
 items:[
  {slide:'haem-gplt',ab:['Platelets as large as or larger than red cells','High platelet turnover (immune thrombocytopenia) or inherited macrothrombocytopenia: correlate with the platelet count and MPV'],rows:[['Size','الحجم','2–3 µm','As large as or larger than a red cell'],['Cause','السبب','—','High platelet turnover (immune thrombocytopenia) or inherited macrothrombocytopenia'],['Analyser effect','تأثير الجهاز','Counted correctly','May be counted as red cells: count falsely low']]},
  {slide:'haem-pltclump',ab:['Platelets stuck together in aggregates','Falsely low analyser count (pseudothrombocytopenia): report the clumps; recollect in citrate if a count is needed'],rows:[['Distribution','التوزيع','Scattered singly','Tight aggregates, often at the feathered edge'],['Analyser effect','تأثير الجهاز','Counted correctly','Count falsely low (pseudothrombocytopenia)'],['Action','الإجراء','—','Report clumps; recollect in citrate if a count is needed']]}
 ],
 key:['Never report thrombocytopenia without checking the film for clumps and giant platelets.'],ref:['dacie','bain_bc']},

{id:'colon',area:'histo',nb:['Straight, evenly spaced test-tube crypts resting on the muscularis mucosae','Pink cytoplasm, clear goblet-cell mucin and small basal blue nuclei; lamina propria of normal cellularity'],t:'Colon: normal mucosa vs adenocarcinoma and ulcerative colitis',ar:'القولون: الغشاء المخاطي الطبيعي مقابل السرطان الغدي والتهاب القولون التقرحي',
 normal:'colon-normal',normalNote:'Normal colonic mucosa: straight, evenly spaced crypts rich in goblet cells, small basal nuclei, normal lamina propria.',
 items:[
  {slide:'crc-crib',ab:['Back-to-back and cribriform glands with enlarged, stratified, hyperchromatic nuclei invading through the muscularis mucosae','Adenocarcinoma: report type, grade, stage (pT, pN) and margins; CK20/CDX2 immunoprofile and MMR/MSI testing'],rows:[['Architecture','البنية','Straight, evenly spaced crypts','Back-to-back, fused and cribriform glands'],['Nuclei','الأنوية','Small, basal, uniform','Enlarged, hyperchromatic, stratified, pleomorphic'],['Goblet cells','الخلايا الكأسية','Abundant','Reduced or absent'],['Stroma','اللحمة','Lamina propria','Desmoplastic stroma; "dirty" luminal necrosis'],['Defining feature','السمة الفارقة','Confined to mucosa','Invasion through the muscularis mucosae'],['Markers','الواسمات','CK20+, CDX2+','CK20+, CK7−, CDX2+, SATB2+; MMR/MSI testing']]},
  {slide:'uc',ab:['Distorted, branched crypts, a dense lymphoplasmacytic infiltrate, cryptitis and crypt abscesses','Chronic active colitis of ulcerative colitis pattern: exclude infection (stool culture, C. difficile) and correlate with endoscopy'],rows:[['Architecture','البنية','Straight, parallel crypts','Distorted, branched or reduced crypts'],['Lamina propria','الصفيحة المخصوصة','Normal cellularity','Dense lymphoplasmacytic infiltrate with basal plasmacytosis'],['Activity','النشاط','No neutrophils in crypts','Cryptitis and crypt abscesses'],['Distribution','التوزيع','—','Continuous from the rectum, mucosal (Crohn: patchy, may be transmural)'],['Key distinction','التمييز الأساسي','—','Chronic changes separate IBD from acute infective colitis']]}
 ],
 key:['Start at low power: crypt architecture is the first clue in every colonic biopsy.','Carcinoma = invasion; colitis = inflammation with or without architectural distortion.'],ref:['who_dig','feakins','robbins']}
];
