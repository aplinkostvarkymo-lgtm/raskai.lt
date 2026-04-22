export interface QueryExample {
  tier1Id: string;
  categoryLabel: string;
  example: string;
  whyGood: [string, string, string, string];
}

export const queryExamples: QueryExample[] = [
  {
    tier1Id: 'BUSINESS_AUTO',
    categoryLabel: 'Verslo automatizavimas',
    example: `Esame paslaugų verslas ir šiuo metu daug administracinių veiksmų atliekame rankiniu būdu. Užklausos ateina iš el. pašto, Facebook, telefono ir web formos, o tada darbuotojas ranka paskirsto informaciją, sukuria užduotis, primena klientui, seka terminus ir perduoda darbus komandai. Dėl to dalis užklausų pasimeta, atsakymai vėluoja, o procesas labai priklauso nuo žmonių disciplinos.

Norime automatizuoti visą pagrindinį užklausos kelią: nuo naujos užklausos gavimo iki jos paskirstymo atsakingam žmogui, statusų sekimo, priminimų ir pagrindinių veiksmų registravimo. Svarbu, kad sistema sujungtų bent el. paštą, web formą ir vidinę užduočių valdymo sistemą. Taip pat norime automatiškai matyti, kurios užklausos naujos, kurios laukia kliento atsakymo, kurios stringa ir kurioms reikia skubaus dėmesio.

Svarbu, kad sprendimas būtų paprastas naudoti, nereikalautų daug rankinio darbo ir ateityje galėtų būti plečiamas. Sėkmingu rezultatu laikytume bent 50 % mažiau rankinio administravimo, greitesnį reakcijos laiką ir aiškų visų užklausų statusų matomumą vienoje vietoje.`,
    whyGood: [
      'Konkrečiai aprašo dabartinius kanalus ir kaip vyksta procesas šiandien',
      'Aiškiai nurodo, kas stringa — pasimesta informacija, vėlavimai, žmogiška priklausomybė',
      'Įvardina reikalingas integracijas: el. paštas, web forma, užduočių sistema',
      'Apibrėžia sėkmę skaičiais: 50 % mažiau rankinio darbo',
    ],
  },
  {
    tier1Id: 'CUSTOMER_SUPPORT_AI',
    categoryLabel: 'Klientų aptarnavimas su AI',
    example: `Turime verslą, kuriame klientai dažnai užduoda pasikartojančius klausimus apie paslaugas, kainas, terminus, užsakymo eigą ir kitus bazinius dalykus. Šiuo metu į visus klausimus atsakinėjama rankiniu būdu per Messenger, el. paštą ir kartais web chat, todėl komanda daug laiko skiria ne pardavimams ar projektams, o pasikartojančiam klientų aptarnavimui.

Norime sukurti AI klientų aptarnavimo sprendimą, kuris gebėtų atsakyti į dažniausius klausimus, nukreipti klientą pagal temą, surinkti pirminę informaciją apie poreikį ir, jei reikia, perduoti sudėtingesnius atvejus žmogui. Svarbu, kad AI naudotų mūsų informaciją: paslaugų aprašymus, DUK, kainų logiką, darbo laiką ir kitus vidinius atsakymų šablonus. Taip pat svarbu, kad sistema nehalucinuotų ir neatsakinėtų užtikrintai ten, kur informacijos neturi.

Norėtume, kad sprendimas veiktų bent viename pagrindiniame kanale pradžioje, o vėliau būtų galima plėsti į kitus kanalus. Sėkmė būtų mažesnis pasikartojančių užklausų krūvis komandai, greitesnis atsakymo laikas ir didesnė dalis klientų, kurie gauna atsakymą be žmogaus įsikišimo.`,
    whyGood: [
      'Nurodo konkrečius kanalus (Messenger, el. paštas, web chat) ir tikrą laiko nuostolio problemą',
      'Aiškiai apibrėžia AI ribas — nehalucinuoti, perduoti žmogui kai nežino',
      'Pamini turimus žinių šaltinius: DUK, kainų logika, darbo laikas',
      'Sėkmė susirišta su komandinės apkrovos mažinimu, ne tik technologiniu sprendimu',
    ],
  },
  {
    tier1Id: 'SALES_AI',
    categoryLabel: 'Pardavimų automatizavimas',
    example: `Gauname nemažai potencialių klientų užklausų, tačiau ne visos jos vienodos kokybės. Dalis jų yra neaiškios, dalis neturi biudžeto, dalis dar nėra pasiruošusios pirkti. Šiuo metu viską vertiname rankiniu būdu, todėl pardavimų komanda sugaišta daug laiko kalbėdama su nepakankamai kvalifikuotais lead'ais, o geri potencialūs klientai kartais negauna pakankamai greito dėmesio.

Norime AI sprendimo, kuris padėtų kvalifikuoti lead'us pagal aiškius kriterijus: poreikio aiškumas, biudžeto požymiai, skubumas, įmonės tipas, sprendimų priėmimo lygis ir tikėtina konversijos tikimybė. Taip pat norime, kad sistema galėtų automatiškai užduoti 2–5 patikslinančius klausimus, susisteminti atsakymus ir pateikti rekomendaciją: ar lead'ą perduoti pardavėjui, ar pirmiausia dar reikia papildomos informacijos.

Svarbu, kad visa informacija būtų matoma CRM arba bent jau vienoje aiškioje sistemoje. Sėkmė būtų mažiau laiko sugaistama nekokybiškiems lead'ams, geresnė prioritetų tvarka ir didesnis kokybiškų pokalbių santykis pardavimų komandoje.`,
    whyGood: [
      'Aprašo konkrečią lead kokybės problemą, ne tik abstraktų noriu daugiau pardavimų',
      'Nurodo tikslius kvalifikavimo kriterijus (6 parametrai) — tiekėjas gali iš karto planuoti sprendimą',
      'Pamini CRM kaip reikiamą integracijos vietą',
      'Sėkmė matuojama pardavimų komandos efektyvumu, ne tik technologiniu diegimu',
    ],
  },
  {
    tier1Id: 'SOCIAL_GROWTH',
    categoryLabel: 'Social media augimas',
    example: `Norime nuosekliai auginti savo verslo matomumą socialiniuose tinkluose, tačiau šiuo metu turinio kūrimas vyksta nereguliariai, idėjos nesistemingos, o rezultatai sunkiai pamatuojami. Turime veikiančią paslaugą ir aiškų verslo tikslą – ne tik rinkti peržiūras, bet auginti auditoriją, kuri virstų realiomis užklausomis.

Ieškome AI sprendimo, kuris padėtų sukurti sistemingą social media augimo procesą: temų generavimą pagal mūsų verslą, turinio kampų parinkimą, postų / reels / short video idėjų kūrimą, publikavimo plano sudarymą ir bazinę rezultatų analizę. Svarbu, kad sistema atsižvelgtų į mūsų tikslinę auditoriją, verslo sritį, komunikacijos toną ir tai, kad norime kurti ne tuščią turinį siekiant viral efekto, o turinį, kuris padeda auginti pasitikėjimą ir generuoti realią paklausą.

Turinys turėtų būti pritaikomas bent Facebook, Instagram ir galbūt TikTok arba YouTube Shorts. Sėkmingas rezultatas būtų aiški turinio sistema, nuoseklus publikavimas, geresnis engagement ir daugiau kokybiškų inbound užklausų.`,
    whyGood: [
      'Skiria turinį siekiant augimo nuo turinį siekiant likes — parodo tikrąjį tikslą',
      'Nurodo konkrečius kanalus (Facebook, Instagram, TikTok / YouTube Shorts)',
      'Pamini komunikacijos tono ir tikslinės auditorijos svarbą — ne tik įrankį',
      'Sėkmė susieta su realiais verslo tikslais: inbound užklausos, ne tik peržiūros',
    ],
  },
  {
    tier1Id: 'CONTENT_PROD',
    categoryLabel: 'Turinio gamyba',
    example: `Kuriame daug turinio arba planuojame jo kurti daugiau, tačiau šiuo metu procesas lėtas ir išsibarstęs. Idėjos, tekstai, vizualai, video scenarijai ir publikavimas nėra sujungti į vieną aiškų workflow, todėl sugaištame daug laiko koordinavimui ir rankiniams veiksmams.

Norime AI turinio gamybos sprendimo, kuris padėtų nuo vienos pagrindinės idėjos ar temos greitai sukurti kelis turinio formatus: ilgesnį tekstą, trumpus social postus, video scenarijų, antraščių variantus, CTA ir pagrindinius vizualinius briefus. Svarbu, kad sistema gebėtų išlaikyti vienodą toną, prisitaikyti prie mūsų auditorijos ir leistų pakartotinai panaudoti tą pačią medžiagą skirtinguose kanaluose.

Jei įmanoma, norėtume, kad dalis proceso būtų automatizuota: pvz., iš įkeltos minties, audio ar transkripto sugeneruoti keli turinio vienetai. Sėkmė būtų ženkliai greitesnė turinio gamyba, mažiau chaoso procese ir galimybė nuosekliai publikuoti be didelio rankinio darbo.`,
    whyGood: [
      'Aprašo tikrą procesų chaosą, ne tik noriu daugiau turinio',
      'Nurodo tikslius turinio formatus: tekstas, socialiniai postai, video scenarijus, briefai',
      'Pamini tono nuoseklumo ir kelių kanalų svarbą',
      'Pristatė išmanią idėją: generuoti turinį iš audio / transkripto — parodo mastą',
    ],
  },
  {
    tier1Id: 'ADS_CREATIVE',
    categoryLabel: 'Reklamos kūryba',
    example: `Vykdome arba planuojame vykdyti mokamą reklamą, tačiau kūrybos procesas per lėtas ir nepakankamai sistemingas. Trūksta variacijų, testavimas nevyksta pakankamai greitai, o reklaminiai tekstai ir kūrybiniai kampai dažnai kuriami intuityviai, ne pagal aiškią logiką.

Norime AI sprendimo, kuris padėtų generuoti reklamos kampus, headline'us, primary text variantus, CTA ir kūrybines kryptis skirtingoms auditorijoms ar pasiūlymams. Svarbu, kad sprendimas remtųsi mūsų produktu ar paslauga, išskirtinumu, kliento skausmo taškais ir turimais pasiūlymais. Jeigu įmanoma, norėtume, kad sistema padėtų kurti ir struktūruotus creative briefus dizaineriui arba sugeneruotų bazines reklamų variacijas testavimui.

Svarbiausias tikslas – ne vien gražūs tekstai, o darbo sistema, kuri leistų nuolat testuoti daugiau kokybiškų variantų. Sėkmė būtų daugiau testuojamų kūrybinių kampų, greitesnis kūrybos ciklas ir geresni reklamos rezultatai.`,
    whyGood: [
      'Identifikuoja tikrą problemą: sprendimų priėmimas intuityviai, ne pagal sistemą',
      "Nurodo tikslius formatus: headline'ai, primary text, CTA, creative briefai",
      'Aiškiai skiria tikslą — ne gražūs tekstai, o testuojama sistema',
      'Sėkmė matuojama per kampų skaičių ir kūrybos ciklo greitį',
    ],
  },
  {
    tier1Id: 'ECOMMERCE_AI',
    categoryLabel: 'E. komercijos AI sprendimai',
    example: `Turime e. parduotuvę ir norime panaudoti AI ne vienam pavieniam veiksmui, o platesniam pardavimo ir turinio optimizavimui. Šiuo metu dalis produktų aprašymų nėra kokybiški, turinio kūrimas lėtas, o kai kurie marketingo veiksmai vykdomi rankiniu būdu. Dėl to neišnaudojame viso e. parduotuvės potencialo.

Norime sprendimo, kuris padėtų automatizuoti ar paspartinti bent kelias sritis: produktų aprašymų generavimą pagal vienodą logiką, kategorijų / SEO tekstų paruošimą, produktų komunikacijos adaptavimą socialiniams tinklams ar naujienlaiškiams ir galbūt bazinę produktų rekomendacijų ar klientų segmentavimo logiką. Svarbu, kad sistema gebėtų dirbti su mūsų produktų duomenimis ir nekurtų bendrinių, silpnų aprašymų.

Jei įmanoma, norime, kad sprendimas integruotųsi su mūsų e. komercijos platforma arba bent leistų patogiai importuoti / eksportuoti duomenis. Sėkmė būtų greitesnis produktinio turinio kūrimas, geresnė produktų komunikacija ir didesnis pardavimų efektyvumas.`,
    whyGood: [
      'Nurodo kelias konkrečias silpnas vietas, ne tik vieną problemą',
      'Aiškiai pasako, ko reikia: aprašymai pagal logiką, ne bendrinis AI tekstas',
      'Pamini integracijos poreikį su e. komercijos platforma',
      'Sėkmė apima tiek turinio greitį, tiek pardavimų efektyvumą',
    ],
  },
  {
    tier1Id: 'KNOWLEDGE_RAG',
    categoryLabel: 'Vidinių žinių AI asistentas',
    example: `Turime daug išsibarsčiusios informacijos dokumentuose, PDF failuose, gairėse, vidiniuose aprašuose ir kitose sistemose. Šiuo metu darbuotojai sugaišta daug laiko ieškodami informacijos rankiniu būdu, dažnai naudoja pasenusius dokumentus arba klausinėja vieni kitų tų pačių dalykų.

Norime sukurti AI žinių asistento sprendimą, kuris leistų darbuotojams natūralia kalba užduoti klausimus ir gauti atsakymus, pagrįstus mūsų vidine dokumentacija. Svarbu, kad atsakymai remtųsi tik patikimais šaltiniais, rodytų, iš kur paimta informacija, ir aiškiai signalizuotų, jei atsakymo dokumentuose nėra. Taip pat svarbu apgalvoti prieigos teises – ne visi darbuotojai turi matyti visą informaciją.

Pageidautina, kad sistema galėtų dirbti su bent kelių tipų failais ir vėliau būti plečiama. Sėkmė būtų greitesnis informacijos radimas, mažiau pasikartojančių klausimų kolegoms ir didesnis vidinių žinių panaudojimas.`,
    whyGood: [
      'Aprašo realią dokumentų chaoso problemą su konkrečiomis pasekmėmis',
      'Nurodo griežtus kokybės reikalavimus: tik patikimi šaltiniai, rodyti iš kur, signalizuoti kai nežino',
      'Pamini prieigos teisių poreikį — parodo, kad sprendimas apgalvotas',
      'Sėkmė matuojama darbuotojų laiko taupojimu, ne tik diegimo faktu',
    ],
  },
  {
    tier1Id: 'OCR_DATA',
    categoryLabel: 'Dokumentų nuskaitymas',
    example: `Turime procesą, kuriame gauname daug dokumentų PDF, nuotraukų ar skenuotų failų formatu. Šiuose dokumentuose yra svarbūs duomenys, kuriuos šiuo metu darbuotojai peržiūri ir suveda rankiniu būdu į lenteles ar kitą sistemą. Tai užima daug laiko ir didina klaidų tikimybę.

Norime AI/OCR sprendimo, kuris gebėtų iš dokumentų automatiškai nuskaityti tekstą, atpažinti svarbius laukus ir susisteminti duomenis į aiškią struktūrą. Mums svarbu, kad sistema ne tik matytų tekstą, bet ir suprastų, kur yra konkretūs laukai, tokie kaip datos, sumos, kontaktai, pavadinimai, kodai ar kita reikalinga informacija. Taip pat aktualus tikslumo klausimas ir galimybė žmogui peržiūrėti abejotinus atvejus.

Idealu, jei galutinis rezultatas galėtų būti eksportuojamas į Excel, Airtable, CRM ar kitą sistemą. Sėkmė būtų mažesnis rankinis suvedimas, greitesnis dokumentų apdorojimas ir mažiau žmogiškų klaidų.`,
    whyGood: [
      'Nurodo tikslius dokumentų tipus: PDF, nuotraukos, skenuoti failai',
      'Skiria matytų tekstą nuo supranta struktūrą — parodo tikrą reikalavimą',
      'Pamini tikslumo kontrolę: žmogus peržiūri abejotinus atvejus',
      'Apibrėžia eksportavimo poreikį su konkrečiomis platformomis',
    ],
  },
  {
    tier1Id: 'DATA_ANALYTICS',
    categoryLabel: 'Duomenų analizė ir dashboardai',
    example: `Turime duomenų keliose vietose – pavyzdžiui, CRM, reklamų platformose, el. prekybos sistemoje, Excel failuose ar kitose verslo sistemose. Šiuo metu sprendimus priimame neturėdami vieno aiškaus vaizdo, nes informacija išsibarsčiusi, ataskaitos ruošiamos rankiniu būdu, o dalis metrikų vėluoja arba ne visada yra patikimos.

Norime sprendimo, kuris sujungtų svarbiausius duomenų šaltinius, sukurtų aiškų dashboardą ir padėtų matyti svarbiausius verslo rodiklius vienoje vietoje. Svarbu, kad būtų galima stebėti bent pagrindinius KPI, matyti tendencijas per laiką ir, jei įmanoma, gauti paprastas AI įžvalgas apie pokyčius ar nukrypimus.

Mums svarbu ne tik gražus dashboardas, bet ir patikima logika: aiškūs duomenų šaltiniai, atnaujinimo dažnis ir suprantama metrikų struktūra. Sėkmingu rezultatu laikytume mažiau rankinių ataskaitų, greitesnį sprendimų priėmimą ir geresnį verslo matomumą.`,
    whyGood: [
      'Surašo konkrečius duomenų šaltinius: CRM, reklamų platformos, el. prekyba, Excel',
      'Aiškiai skiria tikslą — ne gražus dashboardas, o patikima logika ir metrikų struktūra',
      'Nurodo KPI stebėjimo, tendencijų ir AI įžvalgų poreikius',
      'Sėkmė matuojama sprendimų priėmimo greičiu, ne tik vizualizacijos buvimu',
    ],
  },
  {
    tier1Id: 'CUSTOM_DEV',
    categoryLabel: 'Individualus web / app sprendimas',
    example: `Turime konkretų verslo procesą, kurio nepatogu arba neįmanoma efektyviai spręsti naudojant vien tik standartinius įrankius. Šiuo metu dalis veiksmų atliekama per Excel, el. paštą, rankines žinutes ar kelias nesusietas sistemas, dėl ko procesas lėtas, nepatogus ir sunkiai skalėjamas.

Norime sukurti individualų web arba app sprendimą, kuris būtų pritaikytas mūsų konkrečiam naudojimo atvejui. Svarbu, kad sistema turėtų aiškų vartotojų srautą, tam tikrus formų / duomenų įvedimo veiksmus, informacijos saugojimą, statusų sekimą ir bent bazinę administravimo logiką. Jei įmanoma, norėtume ir AI komponento – pavyzdžiui, duomenų klasifikavimo, rekomendacijų ar teksto analizės.

Sprendimas turi būti pakankamai paprastas pirmam etapui, tačiau su galimybe plėstis. Sėkmė būtų tai, kad dabar rankiniu būdu vykdomas procesas taptų viena aiškia, patogia, skaitmenine sistema, kuri taupo laiką ir sumažina klaidų skaičių.`,
    whyGood: [
      'Aiškiai paaiškina, kodėl standartiniai įrankiai nepakanka',
      'Nurodo reikalingas funkcijas: srautas, formos, statusai, administravimas',
      'Pamini AI komponento poreikį kaip papildymą, ne pagrindinį tikslą',
      'Pristatoma skalėjimo galimybė — parodo ilgalaikį mąstymą',
    ],
  },
  {
    tier1Id: 'AI_GOVERNANCE',
    categoryLabel: 'AI naudojimo tvarka',
    example: `Mūsų organizacijoje pradeda daugėti AI naudojimo atvejų, tačiau šiuo metu nėra aiškios tvarkos, kas gali naudoti kokius įrankius, kokiems tikslams, su kokiais duomenimis ir pagal kokias taisykles. Dėl to kyla rizika: darbuotojai gali kelti jautrią informaciją į netinkamus įrankius, atsiranda kokybės problemų, o vadovybė neturi aiškaus matomumo, kaip AI iš tikro naudojamas.

Norime sprendimo ar projekto, kuris padėtų sukurti aiškią AI governance bazę: AI naudojimo politiką, rizikų klasifikavimą, leidžiamų ir neleidžiamų naudojimo atvejų struktūrą, rekomendacijas darbuotojams ir bent bazinį kontrolės / priežiūros modelį. Svarbu, kad visa tai būtų praktiška, ne tik teorinis dokumentas.

Tikslas – saugiai ir efektyviai naudoti AI versle, nesustabdant iniciatyvos, bet sumažinant rizikas. Sėkmingas rezultatas būtų aiškios vidaus taisyklės, suprantami procesai ir mažesnė operacinė bei reputacinė rizika.`,
    whyGood: [
      'Aprašo konkrečias rizikas: jautri informacija, kokybės problemos, vadovybės matomumo trūkumas',
      'Nurodo tikslius reikalavimus: politika, rizikų klasifikavimas, leidžiamų/neleidžiamų atvejų struktūra',
      'Pabrėžia, kad reikia praktinio, ne teorinio sprendimo',
      'Sėkmė apibrėžiama per vidaus taisykles ir sumažintą operacinę riziką',
    ],
  },
  {
    tier1Id: 'COMPLIANCE',
    categoryLabel: 'Atitiktis ir rizikų valdymas',
    example: `Planuojame diegti arba jau naudojame AI sprendimus, tačiau norime įsivertinti atitikties rizikas ir suprasti, kokius reikalavimus turime atitikti pagal mūsų veiklos pobūdį. Ypač aktualūs klausimai susiję su duomenų apsauga, jautrios informacijos naudojimu, darbuotojų ar klientų duomenų tvarkymu, bei bendru AI sprendimų atsekamumu ir atsakomybe.

Ieškome pagalbos įvertinti, kokios yra pagrindinės atitikties rizikos mūsų situacijoje ir kokius praktinius veiksmus reikėtų įsidiegti. Svarbu ne tik teorinė analizė, bet ir konkretūs siūlymai: kokių politikų, procesų, apribojimų ar dokumentacijos reikia, kad galėtume naudoti AI saugiau ir tvarkingiau.

Norime suprasti, ką būtina padaryti dabar, kas yra rekomenduotina vėliau, ir kur yra didžiausios rizikos vietos. Sėkmė būtų aiškus veiksmų planas, mažesnė reguliacinė rizika ir daugiau pasitikėjimo diegiant AI sprendimus.`,
    whyGood: [
      'Nurodo konkrečias atitikties sritis: GDPR, duomenų apsauga, AI atsekamumo',
      'Reikalauja praktinių veiksmų, ne tik teorinės analizės',
      'Aiškiai skiria prioritetus: dabar būtina vs. vėliau rekomenduojama',
      'Sėkmė apibrėžiama per veiksmų plano aiškumą ir pasitikėjimo augimą',
    ],
  },
  {
    tier1Id: 'WEB_TO_AI_MIGRATION',
    categoryLabel: 'LLM Optimizacija (LLMO)',
    example: `Turime verslo svetainę su daugiau nei 80 puslapių turinio — paslaugų aprašymais, DUK, case study'ais ir blog'o straipsniais. Pastebime, kad kai potencialūs klientai naudoja AI paieškos įrankius (ChatGPT, Perplexity, Google AI Overviews), mūsų verslas beveik neminimas ar prastai reprezentuojamas, nors esame aktyvūs rinkoje ir turime gerą reputaciją.

Norime pritaikyti svetainę ir turinį taip, kad jis būtų lengvai suprantamas bei cituojamas AI sistemų. Tai apima struktūrinių duomenų žymėjimą (schema.org), turinio performatavimą į aiškius klausimų-atsakymų blokus, metaduomenų optimizavimą ir pasirengimą vektorizacijai. Svarbu, kad sprendimas apimtų ir techninius pakeitimus, ir turinio struktūros optimizavimą — ne tik vieną pusę.

Norime išlaikyti esamą svetainę, ne ją perstatyti iš naujo. Sėkmę matytume kaip padidėjusį mūsų verslo minėjimą AI paieškos rezultatuose, geresnį turinio suprantamumą AI sistemoms ir paruoštą techninę bazę ateities AI retrieval integracijoms.`,
    whyGood: [
      'Nurodo konkrečią AI paieškos problemą su tikrais įrankiais: ChatGPT, Perplexity, Google AI',
      'Aprašo techninius ir turinio poreikius: schema.org, klausimų-atsakymų struktūra, vektorizacija',
      'Aiškiai nustato apribojimą: esamą svetainę tobulinti, ne perstatyti',
      'Sėkmė matuojama per matomumą AI paieškoje ir paruoštą techninę infrastruktūrą',
    ],
  },
];
