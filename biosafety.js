/* ---------- Medical waste management and laboratory biosafety (data only; js/biosafety-view.js renders) ----------
   Waste scheme = WHO recommended segregation scheme (Table 3.1 of the WHO 2017 summary of "Safe management of wastes
   from health-care activities"); national colour codes can differ and always take precedence.
   Text pairs: English field + Arabic field ending in "Ar" (lists: same order). */
Object.assign(REFS,{
who_hcw:{c:'Chartier Y, Emmanuel J, Pieper U, et al., eds. Safe management of wastes from health-care activities. 2nd ed. Geneva: World Health Organization; 2014.'},
who_hcw_sum:{c:'World Health Organization. Safe management of wastes from health-care activities: a summary. Geneva: WHO; 2017 (WHO/FWC/WSH/17.05).',u:'https://iris.who.int/handle/10665/259491'},
osha_bbp:{c:'Occupational Safety and Health Administration. Bloodborne pathogens standard, 29 CFR 1910.1030. Washington, DC: US Department of Labor.'},
osha_eye:{c:'Occupational Safety and Health Administration. Medical services and first aid, 29 CFR 1910.151(c) (eyewash and drench facilities for corrosive materials).'},
ansi_eyewash:{c:'ANSI/ISEA Z358.1. American National Standard for Emergency Eyewash and Shower Equipment. Arlington, VA: International Safety Equipment Association (current edition).'},
kuhar2013:{c:'Kuhar DT, Henderson DK, Struble KA, et al. Updated US Public Health Service guidelines for the management of occupational exposures to human immunodeficiency virus and recommendations for postexposure prophylaxis. Infect Control Hosp Epidemiol. 2013;34(9):875–892.',u:'https://doi.org/10.1086/672271'},
schillie2013:{c:'Schillie S, Murphy TV, Sawyer M, et al. CDC guidance for evaluating health-care personnel for hepatitis B virus protection and for administering postexposure management. MMWR Recomm Rep. 2013;62(RR-10):1–19.'}
});

// sw = swatch colour of the container
const BIO_STREAMS=[
{id:'infectious',n:'Infectious waste',ar:'النفايات المُعدية',colour:'Yellow',colourAr:'أصفر',sw:'#f2c200',ic:'drop',
 label:'Biohazard symbol; highly infectious waste (cultures, stocks) also marked HIGHLY INFECTIOUS',
 labelAr:'رمز الخطر البيولوجي؛ وتُعلَّم النفايات شديدة العدوى (المزارع والمخزونات) أيضاً بعبارة «شديدة العدوى»',
 container:'Strong leak-proof plastic bag placed in a container; bags for highly infectious waste must withstand autoclaving',
 containerAr:'كيس بلاستيكي قوي مانع للتسرّب داخل حاوية؛ وأكياس النفايات شديدة العدوى يجب أن تتحمّل التعقيم بالأوتوكلاف',
 examples:['Gauze, swabs and dressings soaked in blood or body fluids','Used blood and specimen tubes, plastic pipettes and gloves contaminated with blood','Microbiology cultures and stocks (highly infectious: autoclave before they leave the laboratory)'],
 examplesAr:['الشاش والمسحات والضمادات المشبعة بالدم أو سوائل الجسم','أنابيب الدم والعيّنات المستعملة والماصات البلاستيكية والقفازات الملوّثة بالدم','مزارع ومخزونات الأحياء الدقيقة (شديدة العدوى: تُعقَّم بالأوتوكلاف قبل خروجها من المختبر)'],
 collect:'When three-quarters full or at least once a day',collectAr:'عند امتلائها حتى ثلاثة أرباعها أو مرة يومياً على الأقل',
 treat:['Steam treatment (autoclave, 121–134 °C) or another non-burn technology is preferred','Incineration at 850–1100 °C where steam treatment is not available'],
 treatAr:['يُفضَّل التعقيم بالبخار (الأوتوكلاف، 121–134 °م) أو تقنية أخرى لا تعتمد على الحرق','الحرق في محرقة عند 850–1100 °م إذا لم يتوفر التعقيم بالبخار']},
{id:'sharps',n:'Sharps waste',ar:'نفايات الأدوات الحادة',colour:'Yellow',colourAr:'أصفر',sw:'#f2c200',ic:'syringe',
 label:'Marked SHARPS with the biohazard symbol',labelAr:'تُعلَّم بكلمة «أدوات حادة» مع رمز الخطر البيولوجي',
 container:'Puncture-proof, leak-resistant sharps container, closed when filled to the line or three-quarters full',
 containerAr:'حاوية مقاومة للثقب والتسرّب، تُغلق عند امتلائها حتى الخط أو ثلاثة أرباعها',
 examples:['Needles and syringes with attached needles, lancets, scalpel blades','Infusion sets, glass Pasteur pipettes','Broken glass slides, tubes and vials'],
 examplesAr:['الإبر والمحاقن المتصلة بإبر، والواخزات، وشفرات المشارط','أطقم التسريب الوريدي، وماصات باستور الزجاجية','الشرائح والأنابيب والقوارير الزجاجية المكسورة'],
 collect:'When filled to the line or three-quarters full',collectAr:'عند امتلائها حتى الخط أو ثلاثة أرباعها',
 treat:['Autoclave (often with shredding) or incineration','Never recap, bend or break used needles by hand; drop them straight into the container'],
 treatAr:['التعقيم بالأوتوكلاف (غالباً مع التقطيع) أو الحرق','لا تُعِد غطاء الإبرة المستعملة ولا تثنِها أو تكسرها باليد؛ ضعها مباشرة في الحاوية']},
{id:'pathological',n:'Pathological waste',ar:'النفايات الباثولوجية',colour:'Yellow',colourAr:'أصفر',sw:'#f2c200',ic:'cut',
 label:'Biohazard symbol',labelAr:'رمز الخطر البيولوجي',
 container:'Strong leak-proof plastic bag placed in a container',containerAr:'كيس بلاستيكي قوي مانع للتسرّب داخل حاوية',
 examples:['Human tissues, organs and body parts after diagnosis','Placentas and fetal tissue','Unused blood products'],
 examplesAr:['الأنسجة والأعضاء البشرية بعد التشخيص','المشيمة والأنسجة الجنينية','مشتقات الدم غير المستعملة'],
 collect:'When three-quarters full or at least once a day',collectAr:'عند امتلائها حتى ثلاثة أرباعها أو مرة يومياً على الأقل',
 treat:['Incineration or another method allowed by national rules','Respect national, cultural and religious requirements for human tissue'],
 treatAr:['الحرق أو طريقة أخرى تسمح بها اللوائح الوطنية','مراعاة المتطلبات الوطنية والثقافية والدينية للتعامل مع الأنسجة البشرية']},
{id:'chemical',n:'Chemical and pharmaceutical waste',ar:'النفايات الكيميائية والدوائية',colour:'Brown',colourAr:'بني',sw:'#7a4a1f',ic:'flask',
 label:'Labelled with the appropriate hazard symbol (e.g. toxic, corrosive, flammable)',labelAr:'ملصق رمز الخطر المناسب (مثل: سام، أكّال، قابل للاشتعال)',
 container:'Plastic bag or rigid container suited to the chemical; keep incompatible chemicals apart',
 containerAr:'كيس بلاستيكي أو حاوية صلبة مناسبة للمادة؛ مع فصل المواد الكيميائية غير المتوافقة',
 examples:['Used solvents and reagents (e.g. xylene, alcohols, formalin)','Expired or unused medicines; cytotoxic (genotoxic) drug waste','Heavy metals: broken mercury thermometers, batteries'],
 examplesAr:['المذيبات والكواشف المستعملة (مثل الزايلين والكحولات والفورمالين)','الأدوية منتهية الصلاحية أو غير المستعملة؛ ونفايات الأدوية السامة للخلايا','المعادن الثقيلة: موازين الحرارة الزئبقية المكسورة والبطاريات'],
 collect:'On demand',collectAr:'عند الطلب',
 treat:['Treat as hazardous waste under national rules, usually through a licensed contractor','Return expired medicines to the supplier where possible; cytotoxic waste needs high-temperature incineration','Never pour solvents or toxic chemicals down the sink; follow the Safety Data Sheet'],
 treatAr:['تُعامل كنفايات خطرة وفق اللوائح الوطنية، وغالباً عبر جهة مرخّصة','تُعاد الأدوية منتهية الصلاحية إلى المورّد متى أمكن؛ والنفايات السامة للخلايا تحتاج حرقاً بدرجة حرارة عالية','لا تسكب المذيبات أو المواد السامة في المغسلة؛ اتبع صحيفة بيانات السلامة']},
{id:'radioactive',n:'Radioactive waste',ar:'النفايات المشعّة',colour:'Radiation symbol',colourAr:'رمز الإشعاع',sw:'#9aa0a6',ic:'warn',
 label:'Radiation symbol',labelAr:'رمز الإشعاع',
 container:'Lead box; stored behind lead shielding',containerAr:'صندوق من الرصاص، ويُخزَّن خلف درع رصاصي',
 examples:['Unused radionuclide solutions and kits (e.g. radioimmunoassay reagents)','Contaminated glassware, packaging and absorbent paper','Excreta from patients treated with unsealed radionuclides'],
 examplesAr:['محاليل وعُدد النظائر المشعّة غير المستعملة (مثل كواشف الفحص المناعي الإشعاعي)','الأدوات الزجاجية والتغليف والورق الماص الملوّث','فضلات المرضى المعالَجين بنظائر مشعّة غير محكمة الإغلاق'],
 collect:'On demand',collectAr:'عند الطلب',
 treat:['Store for decay, labelled with radionuclide, date and time needed for full decay, under national regulations','Involve the radiation protection officer; sealed sources go back to the supplier'],
 treatAr:['تُخزَّن حتى تضمحل، مع ملصق يبيّن النظير والتاريخ والمدة اللازمة للاضمحلال الكامل، وفق اللوائح الوطنية','بإشراف مسؤول الوقاية من الإشعاع؛ وتُعاد المصادر المغلقة إلى المورّد']},
{id:'general',n:'General (non-hazardous) waste',ar:'النفايات العامة (غير الخطرة)',colour:'Black',colourAr:'أسود',sw:'#1b1b1b',ic:'doc',
 label:'No hazard symbol',labelAr:'بدون رمز خطر',
 container:'Plastic bag inside a container, or a container that is disinfected after use',containerAr:'كيس بلاستيكي داخل حاوية، أو حاوية تُطهَّر بعد الاستعمال',
 examples:['Paper towels from hand washing, office paper','Food waste, packaging and cardboard boxes','Clean, empty reagent containers (not contaminated)'],
 examplesAr:['مناديل تجفيف اليدين وأوراق المكاتب','بقايا الطعام والتغليف وصناديق الكرتون','عبوات الكواشف الفارغة النظيفة (غير الملوّثة)'],
 collect:'When three-quarters full or at least once a day',collectAr:'عند امتلائها حتى ثلاثة أرباعها أو مرة يومياً على الأقل',
 treat:['Municipal collection, landfill or recycling','About 85% of health-care waste is general waste: good segregation keeps hazardous waste (and cost) small'],
 treatAr:['الجمع البلدي أو الطمر أو إعادة التدوير','نحو 85% من نفايات الرعاية الصحية نفايات عامة: الفرز الجيد يقلّل النفايات الخطرة وتكلفتها']}
];

// "Which bin?" practice items: [item, Arabic item, correct stream, why, Arabic why]
const BIO_SORT=[
['Used hypodermic needle still attached to its syringe','إبرة حقن مستعملة ما زالت متصلة بالمحقنة','sharps','Needles and syringes with attached needles are sharps: never recap or detach them by hand.','الإبر والمحاقن المتصلة بها أدوات حادة: لا تُعِد غطاءها ولا تفصلها باليد.'],
['Broken glass slide with a blood smear','شريحة زجاجية مكسورة عليها مسحة دم','sharps','Broken glass can cut and is contaminated: it goes in the puncture-proof sharps container.','الزجاج المكسور يجرح وهو ملوّث: يوضع في حاوية الأدوات الحادة المقاومة للثقب.'],
['Gauze soaked with a patient’s blood','شاش مشبع بدم المريض','infectious','Items soaked in blood or body fluids are infectious waste (yellow bag with biohazard symbol).','المواد المشبعة بالدم أو سوائل الجسم نفايات مُعدية (كيس أصفر عليه رمز الخطر البيولوجي).'],
['Old bacterial culture plates from the microbiology bench','أطباق مزارع بكتيرية قديمة من قسم الأحياء الدقيقة','infectious','Cultures are highly infectious waste: autoclave them before they leave the laboratory.','المزارع نفايات شديدة العدوى: تُعقَّم بالأوتوكلاف قبل خروجها من المختبر.'],
['Expired antibiotic tablets from the pharmacy','أقراص مضادات حيوية منتهية الصلاحية من الصيدلية','chemical','Pharmaceutical waste goes in the brown chemical/pharmaceutical stream; return to the supplier if possible.','النفايات الدوائية تذهب إلى المسار البني (الكيميائي والدوائي)؛ وتُعاد إلى المورّد إن أمكن.'],
['Used xylene from the histology staining line','زايلين مستعمل من خط الصبغ النسيجي','chemical','Solvents are chemical waste: collect in a labelled container, never down the sink.','المذيبات نفايات كيميائية: تُجمع في حاوية عليها ملصق، ولا تُسكب في المغسلة.'],
['Biopsy tissue left after the diagnosis is complete','نسيج خزعة متبقٍّ بعد اكتمال التشخيص','pathological','Human tissue is pathological waste (yellow, biohazard), usually incinerated.','الأنسجة البشرية نفايات باثولوجية (صفراء، خطر بيولوجي)، وتُحرق عادةً.'],
['Empty, clean cardboard box from a reagent delivery','صندوق كرتون نظيف فارغ من شحنة كواشف','general','Clean packaging is general waste (black) and may be recycled.','التغليف النظيف نفايات عامة (سوداء) ويمكن إعادة تدويره.'],
['Leftover vial from a radioimmunoassay (I-125) kit','قارورة متبقية من عُدّة فحص مناعي إشعاعي (يود-125)','radioactive','Radioactive waste goes in a lead box labelled with the radiation symbol, stored for decay.','النفايات المشعّة توضع في صندوق رصاصي عليه رمز الإشعاع، وتُخزَّن حتى تضمحل.'],
['Paper towel used to dry clean, washed hands','منديل ورقي لتجفيف اليدين بعد غسلهما','general','Hand towels are not contaminated: general waste. Putting them in yellow bags wastes money.','مناديل اليدين غير ملوّثة: نفايات عامة. ووضعها في الأكياس الصفراء هدر للمال.'],
['Used glass Pasteur pipette','ماصة باستور زجاجية مستعملة','sharps','Glass pipettes can break and cut: sharps container.','الماصات الزجاجية قد تنكسر وتجرح: حاوية الأدوات الحادة.'],
['Broken mercury thermometer','ميزان حرارة زئبقي مكسور','chemical','Mercury is a toxic heavy metal: collect as chemical waste, never in general waste.','الزئبق معدن ثقيل سام: يُجمع كنفايات كيميائية، ولا يوضع أبداً مع النفايات العامة.']
];

// emergency protocols: steps {t, ar, d, da, crit} (crit = do it in the first minutes)
const BIO_PROTO=[
{id:'needlestick',t:'Needlestick or sharps injury, or blood splash',ar:'وخز الإبرة أو جرح الأدوات الحادة أو رذاذ الدم',ic:'syringe',
 urgent:'Bleed and wash, then report at once: HIV prophylaxis works best when started within hours.',
 urgentAr:'دع الجرح ينزف واغسله، ثم أبلغ فوراً: الوقاية من فيروس نقص المناعة أنجع ما تكون إذا بدأت خلال ساعات.',
 risk:[['Hepatitis B','التهاب الكبد ب','6–30%'],['Hepatitis C','التهاب الكبد ج','≈ 3%'],['HIV','فيروس نقص المناعة البشرية','≈ 0.3%']],
 riskNote:'Risk of infection after a needlestick from an infected source patient (WHO).',riskNoteAr:'خطر العدوى بعد وخزة إبرة من مريض مصدر مصاب (منظمة الصحة العالمية).',
 steps:[
  {t:'Make the sharp safe',ar:'ضع الأداة الحادة في مكان آمن',crit:true,d:'Stop work and drop the device into the sharps container so nobody else is injured. Do not recap it.',da:'أوقف العمل وضع الأداة في حاوية الأدوات الحادة حتى لا يُصاب غيرك. لا تُعِد غطاءها.'},
  {t:'Bleed and wash the wound',ar:'دع الجرح ينزف واغسله',crit:true,d:'Let the wound bleed freely and wash it with soap and running water. Do not squeeze, suck or scrub it, and do not use bleach or other caustic agents.',da:'دع الجرح ينزف بحرية واغسله بالماء الجاري والصابون. لا تعصره ولا تمصّه ولا تفركه، ولا تستعمل المبيّض أو المواد الكاوية.'},
  {t:'Flush eyes, mouth or nose',ar:'اغسل العين أو الفم أو الأنف',crit:true,d:'For splashes to mucous membranes, flush with plenty of clean water or saline; remove contact lenses.',da:'عند تعرّض الأغشية المخاطية للرذاذ، اغسلها بكمية وفيرة من الماء النظيف أو المحلول الملحي؛ وانزع العدسات اللاصقة.'},
  {t:'Report immediately',ar:'أبلغ فوراً',crit:true,d:'Tell your supervisor and go to occupational health or the emergency department now: post-exposure prophylaxis is time-critical.',da:'أبلغ مشرفك وتوجّه الآن إلى الصحة المهنية أو الطوارئ: الوقاية بعد التعرّض مرتبطة بالوقت.'},
  {t:'Identify the source',ar:'حدّد مصدر التعرّض',d:'Record the source patient or specimen. With consent and according to local policy, test the source for HBsAg, anti-HCV and HIV (rapid HIV test if available).',da:'سجّل المريض أو العيّنة المصدر. وبعد الموافقة ووفق السياسة المحلية، افحص المصدر عن HBsAg وanti-HCV وHIV (فحص HIV سريع إن توفّر).'},
  {t:'Baseline tests for the exposed worker',ar:'الفحوص الأساسية للعامل المتعرّض',d:'HIV, HBsAg and anti-HBs (hepatitis B immunity), and anti-HCV, with the worker’s consent.',da:'فحص HIV وHBsAg وanti-HBs (المناعة ضد التهاب الكبد ب) وanti-HCV، بموافقة العامل.'},
  {t:'HIV post-exposure prophylaxis',ar:'الوقاية بعد التعرّض لفيروس نقص المناعة',d:'If indicated, start as soon as possible, ideally within hours and not later than 72 hours; the course lasts 28 days. Follow the national guideline for the drug regimen.',da:'إذا كانت مستطبّة، ابدأها في أسرع وقت، ويُفضَّل خلال ساعات وليس بعد 72 ساعة؛ ومدتها 28 يوماً. اتبع الدليل الوطني في اختيار الأدوية.'},
  {t:'Hepatitis B protection',ar:'الوقاية من التهاب الكبد ب',d:'If the worker is not immune, give hepatitis B immunoglobulin and/or vaccine as indicated, preferably within 24 hours.',da:'إذا لم يكن العامل منيعاً، يُعطى الغلوبولين المناعي لالتهاب الكبد ب و/أو اللقاح حسب الاستطباب، ويُفضَّل خلال 24 ساعة.'},
  {t:'Hepatitis C follow-up',ar:'متابعة التهاب الكبد ج',d:'There is no prophylaxis: arrange follow-up testing so that infection, if it occurs, is found and treated early.',da:'لا توجد وقاية دوائية: رتّب فحوص المتابعة لاكتشاف العدوى إن حدثت وعلاجها مبكراً.'},
  {t:'Document and follow up',ar:'وثّق وتابع',d:'Complete the incident report, attend follow-up testing on the national schedule, and review how the injury happened to prevent another.',da:'أكمل تقرير الحادث، والتزم بفحوص المتابعة حسب الجدول الوطني، وراجع كيف وقعت الإصابة لمنع تكرارها.'}
 ],
 report:['Date, time and exact location','Device involved (type, gauge, hollow-bore or solid) and whether it had visible blood','Body site, depth of injury and first aid given (with times)','Procedure being done and personal protective equipment worn','Source patient or specimen identifier','People informed and post-exposure prophylaxis decisions'],
 reportAr:['التاريخ والوقت والمكان بدقة','الأداة المسبّبة (نوعها ومقاسها، مجوّفة أم مصمتة) وهل كان عليها دم ظاهر','موضع الإصابة وعمقها والإسعاف الأولي المقدَّم (مع الأوقات)','الإجراء الذي كان يُنفَّذ ومعدات الوقاية الشخصية المستعملة','معرّف المريض أو العيّنة المصدر','الأشخاص الذين أُبلغوا وقرارات الوقاية بعد التعرّض'],
 ref:['who_hcw_sum','kuhar2013','schillie2013','osha_bbp']},

{id:'chemical',t:'Chemical splash to skin or eyes',ar:'رذاذ مادة كيميائية على الجلد أو العين',ic:'flask',
 urgent:'Rinse with running water for at least 15 minutes, starting immediately.',urgentAr:'اشطف بالماء الجاري لمدة 15 دقيقة على الأقل، وابدأ فوراً.',
 steps:[
  {t:'Eyes: go to the eyewash now',ar:'العين: توجّه إلى مغسلة العين فوراً',crit:true,d:'Flush for at least 15 minutes, holding the eyelids open and rolling the eyes; remove contact lenses if they come out easily.',da:'اغسل العين 15 دقيقة على الأقل مع إبقاء الجفون مفتوحة وتحريك العينين؛ وانزع العدسات اللاصقة إن خرجت بسهولة.'},
  {t:'Skin: remove and rinse',ar:'الجلد: انزع الملابس واشطف',crit:true,d:'Remove contaminated clothing and jewellery and rinse the skin under running water (safety shower for large areas) for at least 15 minutes.',da:'انزع الملابس والحُلي الملوّثة واشطف الجلد بالماء الجاري (دُش الطوارئ للمساحات الكبيرة) لمدة 15 دقيقة على الأقل.'},
  {t:'Do not neutralise',ar:'لا تحاول المعادلة',crit:true,d:'Do not put acids, alkalis or other chemicals on the skin or eyes to "neutralise" the splash: plenty of water is the treatment.',da:'لا تضع أحماضاً أو قلويات أو مواد أخرى على الجلد أو العين «لمعادلة» المادة: الماء الوفير هو العلاج.'},
  {t:'Check the Safety Data Sheet',ar:'راجع صحيفة بيانات السلامة',d:'Read the first-aid section of the chemical’s Safety Data Sheet (SDS) and take it, or the label, to the doctor.',da:'اقرأ قسم الإسعافات الأولية في صحيفة بيانات السلامة (SDS) للمادة، وخذها أو الملصق معك إلى الطبيب.'},
  {t:'Get medical assessment',ar:'احصل على تقييم طبي',d:'Every eye splash needs medical review; alkali splashes (e.g. sodium hydroxide) are emergencies.',da:'كل رذاذ في العين يحتاج إلى تقييم طبي؛ ورذاذ القلويات (مثل هيدروكسيد الصوديوم) حالة طارئة.'},
  {t:'Report and restore',ar:'أبلغ وأعِد التجهيز',d:'Report the incident, clean up the spill with the right spill kit, and check that the eyewash is working and accessible again.',da:'أبلغ عن الحادث، ونظّف الانسكاب بالحقيبة المناسبة، وتأكد أن مغسلة العين تعمل ويسهل الوصول إليها.'}
 ],
 report:['Chemical name, concentration and amount','Body site and duration of contact','Time first aid started and how long rinsing lasted','Protective equipment worn (e.g. eye protection)','People informed and medical review'],
 reportAr:['اسم المادة وتركيزها وكميتها','موضع التعرّض ومدة التلامس','وقت بدء الإسعاف ومدة الشطف','معدات الوقاية المستعملة (مثل واقي العين)','الأشخاص الذين أُبلغوا والتقييم الطبي'],
 ref:['osha_eye','ansi_eyewash','who_biosafety']},

{id:'spill',t:'Biological spill (blood, body fluid or culture)',ar:'انسكاب مادة بيولوجية (دم أو سوائل الجسم أو مزارع)',ic:'drop',
 urgent:'Warn others; if aerosols are likely, leave and let them settle before cleaning.',urgentAr:'نبّه الآخرين؛ وإذا احتُمل تكوّن رذاذ هوائي فغادر واتركه يستقر قبل التنظيف.',
 steps:[
  {t:'Warn people and limit spread',ar:'نبّه الآخرين وامنع الانتشار',crit:true,d:'Tell people nearby. If a large spill or broken culture may have made aerosols (e.g. a tube broken in a centrifuge), leave the room, close the door and wait (commonly 30 minutes) for aerosols to settle. Keep a centrifuge lid closed.',da:'أخبر من حولك. إذا احتُمل أن يكوّن الانسكاب الكبير أو المزرعة المكسورة رذاذاً (مثل أنبوب انكسر في جهاز الطرد المركزي)، فغادر الغرفة وأغلق الباب وانتظر (عادة 30 دقيقة) حتى يستقر الرذاذ. أبقِ غطاء جهاز الطرد مغلقاً.'},
  {t:'Put on protective equipment',ar:'ارتدِ معدات الوقاية',crit:true,d:'Gloves, gown or apron and eye protection; respiratory protection if your risk assessment requires it.',da:'القفازات والرداء أو المريلة وواقي العين؛ وحماية تنفسية إذا تطلّبها تقييم المخاطر.'},
  {t:'Cover the spill',ar:'غطِّ الانسكاب',d:'Cover the spill with absorbent paper towels or the absorbent from the spill kit.',da:'غطِّ الانسكاب بمناديل ورقية ماصة أو بالمادة الماصة من حقيبة الانسكاب.'},
  {t:'Apply disinfectant',ar:'ضع المطهّر',d:'Pour disinfectant around the edge and over the spill, working from the outside inwards; e.g. freshly prepared sodium hypochlorite (about 0.5%, roughly 1 : 10 household bleach) for blood, or your laboratory’s validated disinfectant.',da:'اسكب المطهّر حول الحافة ثم فوق الانسكاب من الخارج إلى الداخل؛ مثل هيبوكلوريت الصوديوم المحضّر حديثاً (نحو 0.5%، أي تقريباً 1 : 10 من المبيّض المنزلي) للدم، أو المطهّر المعتمد في مختبرك.'},
  {t:'Wait for the contact time',ar:'انتظر زمن التلامس',d:'Leave it for the contact time in your standard operating procedure (commonly 10–30 minutes).',da:'اتركه طوال زمن التلامس المحدّد في إجراء التشغيل القياسي (عادة 10–30 دقيقة).'},
  {t:'Remove broken glass safely',ar:'أزل الزجاج المكسور بأمان',crit:true,d:'Pick up broken glass with forceps, a scoop or a dustpan, never with hands, and put it in the sharps container.',da:'التقط الزجاج المكسور بملقط أو مجرفة صغيرة، وليس باليد أبداً، وضعه في حاوية الأدوات الحادة.'},
  {t:'Clean and dispose',ar:'نظّف وتخلّص من المخلفات',d:'Collect the absorbed material into yellow infectious waste, then wipe the area again with disinfectant.',da:'اجمع المواد الماصة في كيس النفايات المُعدية الأصفر، ثم امسح المكان مرة أخرى بالمطهّر.'},
  {t:'Remove PPE, wash hands, report',ar:'انزع معدات الوقاية واغسل يديك وأبلغ',d:'Remove protective equipment carefully, wash hands, report to the supervisor or biosafety officer and restock the spill kit.',da:'انزع معدات الوقاية بحذر، واغسل يديك، وأبلغ المشرف أو مسؤول السلامة الحيوية، وأعد تجهيز حقيبة الانسكاب.'}
 ],
 report:['Material spilled (specimen type or organism) and estimated volume','Location and whether aerosols could have formed','People present and any exposure','Disinfectant used and contact time','Clean-up done by whom, and spill kit restocked'],
 reportAr:['المادة المنسكبة (نوع العيّنة أو الكائن) والحجم التقريبي','المكان واحتمال تكوّن رذاذ هوائي','الحاضرون وأي تعرّض','المطهّر المستعمل وزمن التلامس','من قام بالتنظيف، وإعادة تجهيز حقيبة الانسكاب'],
 ref:['who_biosafety','osha_bbp']}
];

// daily laboratory biosafety checklist: [item, Arabic]
const BIO_CHECK=[
['Lab coat, gloves and eye protection worn; gloves removed before touching phones, keyboards or door handles','ارتداء معطف المختبر والقفازات وواقي العين؛ وخلع القفازات قبل لمس الهاتف أو لوحة المفاتيح أو مقابض الأبواب'],
['Hands washed after removing gloves and before leaving the laboratory','غسل اليدين بعد خلع القفازات وقبل مغادرة المختبر'],
['No eating, drinking, applying cosmetics or handling contact lenses in the laboratory','عدم الأكل أو الشرب أو وضع مستحضرات التجميل أو العدسات اللاصقة داخل المختبر'],
['Sharps containers within reach and below the fill line (three-quarters)','حاويات الأدوات الحادة في متناول اليد ودون خط الامتلاء (ثلاثة أرباع)'],
['Waste bins lined with the correct colour bag, lidded and labelled','صناديق النفايات مبطّنة بالكيس الصحيح اللون ومغطاة وعليها ملصقات'],
['Spill kit complete and within its expiry date','حقيبة الانسكاب مكتملة وضمن تاريخ الصلاحية'],
['Eyewash station accessible and flushed this week','مغسلة العين متاحة وتم تشغيلها هذا الأسبوع'],
['Biological safety cabinet airflow indicator normal and certification in date','مؤشر تدفق الهواء في خزانة السلامة الحيوية طبيعي وشهادة الفحص سارية'],
['Benches decontaminated at the start and end of work','تطهير أسطح العمل في بداية العمل ونهايته'],
['Sealed centrifuge buckets or rotors used for infectious samples','استخدام دلاء أو دوّارات طرد مركزي محكمة الإغلاق للعيّنات المعدية'],
['Staff hepatitis B vaccination status known and recorded','حالة تطعيم العاملين ضد التهاب الكبد ب معروفة ومسجّلة']
];
