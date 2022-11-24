const { json, select, selectAll, geoOrthographic, geoPath, geoGraticule } = d3

let geojson, globe, projection,path, graticule, infoPanel, isMouseDown = false, rotation = {x: 0, y:0}

const globeSize = {
    w: window.innerWidth / 2,
    h: window.innerHeight
}

json('https://gist.githubusercontent.com/manuelm1209/ef3db0624f1d3e55d68e45c0cf38411d/raw/geo-map-world-110metres.json').then(data => init(data))

const init = data => {
    geojson = data
    drawGlobe()
    drawGraticule()
    renderInfoPanel()
    createHoverEffect()
    createDraggingEvents()
}

countrySelected =  'fill: #09E1CD; stroke-width: 2.5px; stroke: white; stroke-dasharray: 0; stroke-opacity: 1;';
countryUnselected = 'fill: #212838; stroke-width: 1px; stroke: #060a0f; stroke-dasharray: 2; stroke-opacity: 0.2;';



const endeavor = [
    {id:"United Mexican States" , name: "México", companies: 154 , entrepreneurs : 200 , former_employees: 372, website: "", description: "Mexico, (Spanish: México)[a][b] officially the United Mexican States,[c] is a country in the southern portion of North America. It is bordered to the north by the United States; to the south and west by the Pacific Ocean; to the southeast by Guatemala, Belize, and the Caribbean Sea; and to the east by the Gulf of Mexico.[12] Mexico covers 1,972,550 square kilometers (761,610 sq mi),[13] making it the world's 13th-largest country by area; with approximately 126,014,024 inhabitants,[5] it is the 10th-most-populous country and has the most Spanish-speakers. Mexico is organized as a federal republic comprising 31 states and Mexico City, its capital. Other major urban areas include Monterrey, Guadalajara, Puebla, Toluca, Tijuana, Ciudad Juárez, and León.[14]" },
    {id:"Republic of Colombia" , name: "Colombia", companies: 432 , entrepreneurs : 100 , former_employees: 675, website: "", description: "Officially the Republic of Colombia,[a] is a country in South America with an insular region in North America. It is bordered by the Caribbean Sea to the north, Venezuela to the east, Brazil to the southeast, Ecuador and Peru to the south, the Pacific Ocean to the west and Panama to the northwest. Colombia comprises 32 departments and the Capital District of Bogotá, the country's largest city. It covers an area of 1,141,748 square kilometers (440,831 sq mi), with a population of 50 million. Colombia's cultural heritage reflects influences by various Amerindian civilizations, European settlement, enslaved Africans, as well as immigration from Europe and the Middle East. Spanish is the nation's official language, besides which over 70 languages are spoken." },
    {id:"United States of America" , name: "U.S.A", companies: 123 , entrepreneurs : 330 , former_employees: 876, website: "", description: "The United States of America (U.S.A. or USA), commonly known as the United States (U.S. or US) or America, is a country located in North America. It consists of 50 states, a federal district, five major unincorporated territories, nine Minor Outlying Islands,[j] and 326 Indian reservations. It is the third-largest country by both land and total area.[d] The United States shares land borders with Canada to its north and with Mexico to its south. It has maritime borders with the Bahamas, Cuba, Russia, and other nations.[k] With a population of over 331 million,[e] it is the third most populous country in the world. The national capital is Washington, D.C., and the most populous city and financial center is New York City." },
    {id:"Canada" , name: "Canada", companies: 275 , entrepreneurs : 300 , former_employees: 345, website: "", description: "Canada is a country in North America. Its ten provinces and three territories extend from the Atlantic Ocean to the Pacific Ocean and northward into the Arctic Ocean, covering over 9.98 million square kilometres (3.85 million square miles), making it the world's second-largest country by total area. Its southern and western border with the United States, stretching 8,891 kilometres (5,525 mi), is the world's longest binational land border. Canada's capital is Ottawa, and its three largest metropolitan areas are Toronto, Montreal, and Vancouver." },
    {id:"Commonwealth of Puerto Rico" , name: "Puerto Rico", companies: 534 , entrepreneurs : 230 , former_employees: 63, website: "", description: "Puerto Rico[c] (Spanish for 'rich port'; abbreviated PR; Taino: Boriken, Borinquen),[10] officially the Commonwealth of Puerto Rico[b] (Spanish: Estado Libre Asociado de Puerto Rico, lit. 'Free Associated State of Puerto Rico'), is a Caribbean island and unincorporated territory of the United States. It is located in the northeast Caribbean Sea, approximately 1,000 miles (1,600 km) southeast of Miami, Florida, between the Dominican Republic and the U.S. Virgin Islands, and includes the eponymous main island and several smaller islands, such as Mona, Culebra, and Vieques. It has roughly 3.2 million residents, and its capital and most populous city is San Juan.[10] Spanish and English are the official languages of the executive branch of government,[11] though Spanish predominates." },
    {id:"Republic of Peru" , name: "Peru", companies: 234 , entrepreneurs : 300 , former_employees: 987, website: "", description: "Peru (/pəˈruː/ (listen); Spanish: Perú [peˈɾu]; Quechua: Piruw [pɪɾʊw];[8] Aymara: Piruw [pɪɾʊw]), officially the Republic of Peru (Spanish: República del Perú (help·info)), is a country in western South America. It is bordered in the north by Ecuador and Colombia, in the east by Brazil, in the southeast by Bolivia, in the south by Chile, and in the south and west by the Pacific Ocean. Peru is a megadiverse country with habitats ranging from the arid plains of the Pacific coastal region in the west to the peaks of the Andes mountains extending from the north to the southeast of the country to the tropical Amazon basin rainforest in the east with the Amazon River.[9] Peru has a population of 32 million, and its capital and largest city is Lima. At 1.28 million km2 (0.5 million mi2), Peru is the 19th largest country in the world, and the third largest in South America." },
    {id:"Federative Republic of Brazil" , name: "Brazil", companies: 187 , entrepreneurs : 320 , former_employees: 645, website: "", description: "Brazil (Portuguese: Brasil; Brazilian Portuguese: [bɾaˈziw]),[nt 1] officially the Federative Republic of Brazil (Portuguese: República Federativa do Brasil),[9] is the largest country in both South America and Latin America. At 8.5 million square kilometers (3,300,000 sq mi)[10] and with over 217 million people, Brazil is the world's fifth-largest country by area and the seventh most populous. Its capital is Brasília, and its most populous city is São Paulo. The federation is composed of the union of the 26 states and the Federal District. It is the largest country to have Portuguese as an official language and the only one in the Americas;[11][12] one of the most multicultural and ethnically diverse nations, due to over a century of mass immigration from around the world;[13] and the most populous Roman Catholic-majority country." },
    {id:"Republic of Chile" , name: "Chile", companies: 76 , entrepreneurs : 300 , former_employees: 534, website: "", description: "Chile,[a] officially the Republic of Chile,[b] is a country in the western part of South America. It is the southernmost country in the world, and the closest to Antarctica, occupying a long and narrow strip of land between the Andes to the east and the Pacific Ocean to the west. Chile covers an area of 756,096 square kilometers (291,930 sq mi), with a population of 17.5 million as of 2017.[5] It shares land borders with Peru to the north, Bolivia to the north-east, Argentina to the east, and the Drake Passage in the far south. Chile also controls the Pacific islands of Juan Fernández, Isla Salas y Gómez, Desventuradas, and Easter Island in Oceania. It also claims about 1,250,000 square kilometers (480,000 sq mi) of Antarctica under the Chilean Antarctic Territory.[nb 2] The country's capital and largest city is Santiago, and its national language is Spanish." },
    {id:"Argentine Republic" , name: "Argentina", companies: 63 , entrepreneurs : 540 , former_employees: 423, website: "", description: "Argentina (Spanish pronunciation: [aɾxenˈtina] (listen)), officially the Argentine Republic[A] (Spanish: República Argentina), is a country in the southern half of South America. Argentina covers an area of 2,780,400 km2 (1,073,500 sq mi),[B] making it the second-largest country in South America after Brazil, the fourth-largest country in the Americas, and the eighth-largest country in the world. It shares the bulk of the Southern Cone with Chile to the west, and is also bordered by Bolivia and Paraguay to the north, Brazil to the northeast, Uruguay and the South Atlantic Ocean to the east, and the Drake Passage to the south. Argentina is a federal state subdivided into twenty-three provinces, and one autonomous city, which is the federal capital and largest city of the nation, Buenos Aires. The provinces and the capital have their own constitutions, but exist under a federal system. Argentina claims sovereignty over the Falkland Islands, South Georgia and the South Sandwich Islands, and a part of Antarctica." },
    {id:"Republic of Ecuador" , name: "Ecuador", companies: 56 , entrepreneurs : 670 , former_employees: 534, website: "", description: "Ecuador (/ˈɛkwədɔːr/ (listen) EK-wə-dor; Spanish pronunciation: [ekwaˈðoɾ] (listen); Quechua: Ikwayur; Shuar: Ecuador or Ekuatur),[13][14] officially the Republic of Ecuador (Spanish: República del Ecuador, which literally translates as 'Republic of the Equator'; Quechua: Ikwadur Ripuwlika; Shuar: Ekuatur Nunka),[15][16] is a country in northwestern South America, bordered by Colombia on the north, Peru on the east and south, and the Pacific Ocean on the west. Ecuador also includes the Galápagos Islands in the Pacific, about 1,000 kilometers (621 mi) west of the mainland. The country's capital and largest city is Quito." },
    {id:"Oriental Republic of Uruguay" , name: "Uruguay", companies: 87 , entrepreneurs : 560 , former_employees: 876, website: "", description: "Uruguay (/ˈjʊərəɡwaɪ/ (listen);[10] Spanish: [uɾuˈɣwaj] (listen)), officially the Oriental Republic of Uruguay (Spanish: República Oriental del Uruguay), is a country in South America. It shares borders with Argentina to its west and southwest and Brazil to its north and northeast; while bordering the Río de la Plata to the south and the Atlantic Ocean to the southeast. It is part of the Southern Cone region of South America. Uruguay covers an area of approximately 181,034 square kilometers (69,898 sq mi) and has a population of an estimated 3.51 million, of whom 2 million live in the metropolitan area of its capital and largest city, Montevideo." },
    {id:"Ireland" , name: "Ireland", companies: 45 , entrepreneurs : 340 , former_employees: 654, website: "", description: "Ireland (/ˈaɪərlənd/ (listen) YRE-lənd; Irish: Éire [ˈeːɾʲə] (listen); Ulster-Scots: Airlann [ˈɑːrlən]) is an island in the North Atlantic Ocean, in north-western Europe. It is separated from Great Britain to its east by the North Channel, the Irish Sea, and St George's Channel. Ireland is the second-largest island of the British Isles, the third-largest in Europe, and the twentieth-largest on Earth.[8]" },
    {id:"Portuguese Republic" , name: "Portugal", companies: 43 , entrepreneurs : 50 , former_employees: 423, website: "", description: "Portugal, officially the Portuguese Republic (Portuguese: República Portuguesa [ʁɛˈpuβlikɐ puɾtuˈɣezɐ]),[note 4] is a country whose mainland is located on the Iberian Peninsula of Southwestern Europe, and whose territory also includes the Atlantic archipelagos of the Azores and Madeira. It features the westernmost point in continental Europe, and its Iberian portion is bordered to the west and south by the Atlantic Ocean and to the north and east by Spain, the sole country to have a land border with Portugal. Its two archipelagos form two autonomous regions with their own regional governments. Lisbon is the capital and largest city by population." },
    {id:"Kingdom of Spain" , name: "Spain", companies: 23 , entrepreneurs : 320 , former_employees: 123, website: "", description: "Spain (Spanish: España, [esˈpaɲa] (listen)), or the Kingdom of Spain (Reino de España),[f] is a country primarily located in southwestern Europe with parts of territory in the Atlantic Ocean and across the Mediterranean Sea.[11][g] The largest part of Spain is situated on the Iberian Peninsula; its territory also includes the Canary Islands in the Atlantic Ocean, the Balearic Islands in the Mediterranean Sea, and the autonomous cities of Ceuta and Melilla in Africa. The country's mainland is bordered to the south by Gibraltar; to the south and east by the Mediterranean Sea; to the north by France, Andorra and the Bay of Biscay; and to the west by Portugal and the Atlantic Ocean. With an area of 505,990 km2 (195,360 sq mi), Spain is the second-largest country in the European Union (EU) and, with a population exceeding 47.4 million, the fourth-most populous EU member state. Spain's capital and largest city is Madrid; other major urban areas include Barcelona, Valencia, Seville, Zaragoza, Málaga, Murcia, Palma de Mallorca, Las Palmas de Gran Canaria and Bilbao." },
    {id:"Kingdom of Morocco" , name: "Morocco", companies: 65 , entrepreneurs : 120 , former_employees: 543, website: "", description: "Morocco (/məˈrɒkoʊ/ (listen)),[note 3] officially the Kingdom of Morocco,[note 4] is the westernmost country in the Maghreb region of North Africa. It overlooks the Mediterranean Sea to the north and the Atlantic Ocean to the west, and has land borders with Algeria to the east, and the disputed territory of Western Sahara to the south. Morocco also claims the Spanish exclaves of Ceuta, Melilla and Peñón de Vélez de la Gomera, and several small Spanish-controlled islands off its coast.[17] It spans an area of 446,300 km2 (172,300 sq mi)[18] or 710,850 km2 (274,460 sq mi),[b] with a population of roughly 37 million. Its official and predominant religion is Islam, and the official languages are Arabic and Berber; the Moroccan dialect of Arabic and French are also widely spoken. Moroccan identity and culture is a vibrant mix of Berber, Arab, and European cultures. Its capital is Rabat, while its largest city is Casablanca.[19]" },
    {id:"Italian Republic" , name: "Italy", companies: 87 , entrepreneurs : 50 , former_employees: 765, website: "", description: "Italy (Italian: Italia [iˈtaːlja] (listen)), officially the Italian Republic[11][12] (Italian: Repubblica Italiana [reˈpubblika itaˈljaːna]),[13][14] is a country located in the middle of the Mediterranean Sea, in Southern Europe;[15][16][17] its territory largely coincides with the homonymous geographical region.[18] Italy is also considered part of Western Europe.[19][note 1] A unitary parliamentary republic with Rome as its capital and largest city, the country covers a total area of 301,230 km2 (116,310 sq mi) and shares land borders with France, Switzerland, Austria, Slovenia and the enclaved microstates of Vatican City and San Marino. Italy has a territorial exclave in Switzerland, Campione. With over 60 million inhabitants,[20] Italy is the third-most populous member state of the European Union." },
    {id:"Arab Republic of Egypt" , name: "Egypt", companies: 34 , entrepreneurs : 60 , former_employees: 876, website: "", description: "Egypt (Arabic: مِصر, romanized: Miṣr, Egyptian Arabic pronunciation: [mæsˤr]), officially the Arab Republic of Egypt, is a transcontinental country spanning the northeast corner of Africa and southwest corner of Asia via a land bridge formed by the Sinai Peninsula. It is bordered by the Mediterranean Sea to the north, the Gaza Strip of Palestine and Israel to the northeast, the Red Sea to the east, Sudan to the south, and Libya to the west. The Gulf of Aqaba in the northeast separates Egypt from Jordan and Saudi Arabia. Cairo is the capital and largest city of Egypt, while Alexandria, the second-largest city, is an important industrial and tourist hub at the Mediterranean coast.[13] At approximately 100 million inhabitants, Egypt is the 14th-most populated country in the world." },
    {id:"Hellenic Republic" , name: "Greece", companies: 23 , entrepreneurs : 70 , former_employees: 432, website: "", description: "Greece,[a] officially the Hellenic Republic,[b] is a country in Southeast Europe. It is situated on the southern tip of the Balkans, and is located at the crossroads of Europe, Asia, and Africa. Greece shares land borders with Albania to the northwest, North Macedonia and Bulgaria to the north, and Turkey to the northeast. The Aegean Sea lies to the east of the mainland, the Ionian Sea to the west, and the Sea of Crete and the Mediterranean Sea to the south. Greece has the longest coastline on the Mediterranean Basin, featuring thousands of islands. The country consists of nine traditional geographic regions, and has a population of approximately 10.4 million. Athens is the nation's capital and largest city, followed by Thessaloniki and Patras." },
    {id:"Republic of Poland" , name: "Poland", companies: 54 , entrepreneurs : 87 , former_employees: 123, website: "", description: "Poland,[b] officially the Republic of Poland,[c] is a country in Central Europe. It is divided into 16 administrative provinces called voivodeships, covering an area of 312,696 km2 (120,733 sq mi). Poland has a population of over 38 million and is the fifth-most populous member state of the European Union. Warsaw is the nation's capital and largest metropolis. Other major cities include Kraków, Wrocław, Łódź, Poznań, Gdańsk, and Szczecin." },
    {id:"Romania" , name: "Romania", companies: 50 , entrepreneurs : 76 , former_employees: 435, website: "", description: "Romania (/roʊˈmeɪniə/ (listen) roh-MAY-nee-ə; Romanian: România [romɨˈni.a] (listen)) is a country located at the crossroads of Central, Eastern, and Southeast Europe. It borders Bulgaria to the south, Ukraine to the north, Hungary to the west, Serbia to the southwest, Moldova to the east, and the Black Sea to the southeast. It has a predominantly temperate-continental climate, and an area of 238,397 km2 (92,046 sq mi), with a population of around 19 million. Romania is the twelfth-largest country in Europe and the sixth-most populous member state of the European Union. Its capital and largest city is Bucharest, followed by Iași, Cluj-Napoca, Timișoara, Constanța, Craiova, Brașov, and Galați." },
    {id:"Republic of Bulgaria" , name: "Bulgaria", companies: 87 , entrepreneurs : 87 , former_employees: 655, website: "", description: "Bulgaria (/bʌlˈɡɛəriə, bʊl-/ (listen); Bulgarian: България, romanized: Balgariya), officially the Republic of Bulgaria,[a] is a country in Southeast Europe. It is situated on the eastern flank of the Balkans, and is bordered by Romania to the north, Serbia and North Macedonia to the west, Greece and Turkey to the south, and the Black Sea to the east. Bulgaria covers a territory of 110,994 square kilometres (42,855 sq mi), and is the sixteenth-largest country in Europe. Sofia is the nation's capital and largest city; other major cities are Plovdiv, Varna and Burgas." },
    {id:"Republic of Turkey" , name: "Turkey", companies: 43 , entrepreneurs : 67 , former_employees: 654, website: "", description: "Turkey (Turkish: Türkiye [ˈtyɾcije]), officially the Republic of Türkiye (Turkish: Türkiye Cumhuriyeti [ˈtyɾcije dʒumˈhuːɾijeti] (listen)), is a transcontinental country located mainly on the Anatolian Peninsula in Western Asia, with a small portion on the Balkan Peninsula in Southeast Europe. It shares borders with the Black Sea to the north; Georgia to the northeast; Armenia, Azerbaijan, and Iran to the east; Iraq to the southeast; Syria and the Mediterranean Sea to the south; the Aegean Sea to the west; and Greece and Bulgaria to the northwest. Cyprus is located off the south coast. Turks form the vast majority of the nation's population and Kurds are the largest minority.[4] Ankara is Turkey's capital, while Istanbul is its largest city and financial centre." },
    {id:"Lebanese Republic" , name: "Lebanon", companies: 65 , entrepreneurs : 98 , former_employees: 343, website: "", description: "Lebanon (/ˈlɛbənɒn, -nən/ Listen LEB-ə-non, -⁠nən, Arabic: لُبْنَان, romanized: lubnān, Lebanese Arabic pronunciation: [lɪbˈneːn]), officially the Republic of Lebanon (Arabic: الجمهورية اللبنانية) or the Lebanese Republic,[a] is a country in Western Asia. It is located between Syria to the north and east and Israel to the south, while Cyprus lies to its west across the Mediterranean Sea; its location at the crossroads of the Mediterranean Basin and the Arabian hinterland has contributed to its rich history and shaped a cultural identity of religious diversity.[15] It is part of the Levant region of the Middle East. Lebanon is home to roughly six million people and covers an area of 10,452 square kilometres (4,036 sq mi), making it the second smallest country in continental Asia. The official language of the state is Arabic, while French is also formally recognized; the Lebanese dialect of Arabic is used alongside Modern Standard Arabic throughout the country." },
    {id:"Hashemite Kingdom of Jordan" , name: "Jordan", companies: 34 , entrepreneurs : 76 , former_employees: 876, website: "", description: "Jordan (Arabic: الأردن; tr. Al-ʾUrdunn [al.ʔur.dunː]), officially the Hashemite Kingdom of Jordan,[a] is a country in Western Asia. It is situated at the crossroads of Asia, Africa, and Europe,[8] within the Levant region, on the East Bank of the Jordan River. Jordan is bordered by Saudi Arabia to the south and east, Iraq to the northeast, Syria to the north, and the Palestinian West Bank, Israel, and the Dead Sea to the west. It has a 26 km (16 mi) coastline on the Gulf of Aqaba in the Red Sea to the southwest. The Gulf of Aqaba separates Jordan from Egypt.[9] Amman is Jordan's capital and largest city, as well as its economic, political, and cultural centre." },
    {id:"Kingdom of Saudi Arabia" , name: "Saudi Arabia", companies: 76 , entrepreneurs : 56 , former_employees: 56, website: "", description: "Saudi Arabia,[d] officially the Kingdom of Saudi Arabia (KSA),[e] is a country in Western Asia. It covers the bulk of the Arabian Peninsula, and has a land area of about 2,150,000 km2 (830,000 sq mi), making it the fifth-largest country in Asia, the second-largest in the Arab world, and the largest in Western Asia and the Middle East. It is bordered by the Red Sea to the west; Jordan, Iraq, and Kuwait to the north; the Persian Gulf, Qatar and the United Arab Emirates to the east; Oman to the southeast; and Yemen to the south. Bahrain is an island country off the east coast. The Gulf of Aqaba in the northwest separates Saudi Arabia from Egypt. Saudi Arabia is the only country with a coastline along both the Red Sea and the Persian Gulf, and most of its terrain consists of arid desert, lowland, steppe, and mountains. Its capital and largest city is Riyadh. The country is home to Mecca and Medina, the two holiest cities in Islam." },
    {id:"United Arab Emirates" , name: "U.A.E", companies: 78 , entrepreneurs : 36 , former_employees: 645, website: "", description: "The United Arab Emirates (UAE; Arabic: الإمارات العربية المتحدة al-ʾImārāt al-ʿArabīyah al-Muttaḥidah), or simply the Emirates (Arabic: الإمارات al-ʾImārāt), is a country in Western Asia (The Middle East). It is located at the eastern end of the Arabian Peninsula and shares borders with Oman and Saudi Arabia, while having maritime borders in the Persian Gulf with Qatar and Iran. Abu Dhabi is the nation's capital, while Dubai, the most populous city, is an international hub." },
    {id:"Islamic Republic of Pakistan" , name: "Pakistan", companies: 76 , entrepreneurs : 35 , former_employees: 543, website: "", description: "Pakistan (Urdu: پاکِستان [ˈpaːkɪstaːn]) [d], officially the Islamic Republic of Pakistan (Urdu: اِسلامی جمہوریہ پاکِستان) is a country in South Asia. It is the world's fifth-most populous country, with a population of almost 243 million people, and has the world's second-largest Muslim population just behind Indonesia.[18] Pakistan is the 33rd-largest country in the world by area and 2nd largest in South Asia, spanning 881,913 square kilometres (340,509 square miles). It has a 1,046-kilometre (650-mile) coastline along the Arabian Sea and Gulf of Oman in the south, and is bordered by India to the east, Afghanistan to the west, Iran to the southwest, and China to the northeast. It is separated narrowly from Tajikistan by Afghanistan's Wakhan Corridor in the north, and also shares a maritime border with Oman. Islamabad is the nation's capital, while Karachi is its largest city and financial centre." },
    {id:"People's Republic of Bangladesh" , name: "Bangladesh", companies: 56 , entrepreneurs : 87 , former_employees: 234, website: "", description: "Bangladesh (/ˌbæŋɡləˈdɛʃ, ˌbɑːŋ-/;[12] Bengali: বাংলাদেশ, pronounced [ˈbaŋlaˌdeʃ] (listen)), officially the People's Republic of Bangladesh, is a country in South Asia. It is the eighth-most populous country in the world, with a population exceeding 165 million people in an area of 148,460 square kilometres (57,320 sq mi).[7] Bangladesh is among the most densely populated countries in the world, and shares land borders with India to the west, north, and east, and Myanmar to the southeast; to the south it has a coastline along the Bay of Bengal. It is narrowly separated from Bhutan and Nepal by the Siliguri Corridor; and from China by the Indian state of Sikkim in the north. Dhaka, the capital and largest city, is the nation's political, financial and cultural center. Chittagong, the second-largest city, is the busiest port on the Bay of Bengal. The official language is Bengali, one of the easternmost branches of the Indo-European language family." },
    {id:"Kingdom of Thailand" , name: "Thailand", companies: 54 , entrepreneurs : 345 , former_employees: 64, website: "", description: "Thailand[a] (/ˈtaɪlænd, ˈtaɪlənd/ TY-land, TY-lənd), historically known as Siam[b][9][10] (/saɪˈæm, ˈsaɪæm/) and officially the Kingdom of Thailand, is a country in Southeast Asia, located at the centre of the Indochinese Peninsula, spanning 513,120 square kilometres (198,120 sq mi), with a population of almost 70 million.[11] The country is bordered to the north by Myanmar and Laos, to the east by Laos and Cambodia, to the south by the Gulf of Thailand and Malaysia, and to the west by the Andaman Sea and the extremity of Myanmar. Thailand also shares maritime borders with Vietnam to the southeast, and Indonesia and India to the southwest. Bangkok is the nation's capital and largest city." },
    {id:"Malaysia" , name: "Malaysia", companies: 43 , entrepreneurs : 76 , former_employees: 977, website: "", description: "Malaysia (/məˈleɪziə, -ʒə/ (listen) mə-LAY-zee-ə, -⁠zhə; Malay: [məlejsiə]) is a country in Southeast Asia. The federal constitutional monarchy consists of thirteen states and three federal territories, separated by the South China Sea into two regions, Peninsular Malaysia and Borneo's East Malaysia. Peninsular Malaysia shares a land and maritime border with Thailand and maritime borders with Singapore, Vietnam, and Indonesia. East Malaysia shares land and maritime borders with Brunei and Indonesia and a maritime border with the Philippines and Vietnam. Kuala Lumpur is the national capital, largest city and the seat of the legislative branch of the federal government. The nearby planned capital of Putrajaya is the administrative capital, which represents the seat of both the executive branch (Cabinet, federal ministries and agencies) and the judicial branch of the federal government. With a population of over 32 million, Malaysia is the world's 45th-most populous country. The southernmost point of continental Eurasia is in Tanjung Piai. In the tropics, Malaysia is one of 17 megadiverse countries, home to numerous endemic species." },
    {id:"Republic of Indonesia" , name: "Indonesia", companies: 87 , entrepreneurs : 45 , former_employees: 645, website: "", description: "Indonesia,[a] officially the Republic of Indonesia,[b] is a country in Southeast Asia and Oceania between the Indian and Pacific oceans. It consists of over 17,000 islands, including Sumatra, Java, Sulawesi, and parts of Borneo and New Guinea. Indonesia is the world's largest archipelagic state and the 14th-largest country by area, at 1,904,569 square kilometres (735,358 square miles). With over 275 million people, Indonesia is the world's fourth-most populous country and the most populous Muslim-majority country. Java, the world's most populous island, is home to more than half of the country's population." },
    {id:"Republic of the Philippines" , name: "Philippines", companies: 98 , entrepreneurs : 76 , former_employees: 324, website: "", description: "The Philippines (/ˈfɪlɪpiːnz/ (listen); Filipino: Pilipinas),[13] officially the Republic of the Philippines (Filipino: Republika ng Pilipinas),[d] is an archipelagic country in Southeast Asia. It is situated in the western Pacific Ocean and consists of around 7,641 islands that are broadly categorized under three main geographical divisions from north to south: Luzon, Visayas, and Mindanao. The Philippines is bounded by the South China Sea to the west, the Philippine Sea to the east, and the Celebes Sea to the southwest. It shares maritime borders with Taiwan to the north, Japan to the northeast, Palau to the east and southeast, Indonesia to the south, Malaysia to the southwest, Vietnam to the west, and China to the northwest. The Philippines covers an area of 300,000 km2 (120,000 sq mi) and, as of 2021, it had a population of around 109 million people,[14] making it the world's thirteenth-most populous country. The Philippines has diverse ethnicities and cultures throughout its islands. Manila is the country's capital, while the largest city is Quezon City; both lie within the urban area of Metro Manila." },
    {id:"Japan" , name: "Japan", companies: 34 , entrepreneurs : 430 , former_employees: 654, website: "", description: "Japan (Japanese: 日本, Nippon or Nihon,[nb 1] and formally 日本国, Nihonkoku[nb 2]) is an island country in East Asia. It is situated in the northwest Pacific Ocean, and is bordered on the west by the Sea of Japan, while extending from the Sea of Okhotsk in the north toward the East China Sea, Philippine Sea, and Taiwan in the south. Japan is a part of the Ring of Fire, and spans an archipelago of 6852 islands covering 377,975 square kilometers (145,937 sq mi); the five main islands are Hokkaido, Honshu (the 'mainland'), Shikoku, Kyushu, and Okinawa. Tokyo is the nation's capital and largest city, followed by Yokohama, Osaka, Nagoya, Sapporo, Fukuoka, Kobe, and Kyoto." },
    {id:"Socialist Republic of Vietnam" , name: "Vietnam", companies: 98 , entrepreneurs : 35 , former_employees: 234, website: "", description: "Vietnam or Viet Nam[n 3] (Vietnamese: Việt Nam, [vîət nāːm] (listen)), officially the Socialist Republic of Vietnam,[n 4] is a country in Southeast Asia, at the eastern edge of mainland Southeast Asia, with an area of 311,699 square kilometres (120,348 sq mi) and population of 96 million, making it the world's fifteenth-most populous country. Vietnam borders China to the north, and Laos and Cambodia to the west. It shares maritime borders with Thailand through the Gulf of Thailand, and the Philippines, Indonesia, and Malaysia through the South China Sea. Its capital is Hanoi and largest city Ho Chi Minh City." },
    {id:"Republic of Tunisia" , name: "Tunisia", companies: 76 , entrepreneurs : 34 , former_employees: 312, website: "", description: "Tunisia,[a] officially the Republic of Tunisia,[b][18] is the northernmost country in Africa. It is a part of the Maghreb region of North Africa, bordered by Algeria to the west and southwest, Libya to the southeast, and the Mediterranean Sea to the north and east. It features the archaeological sites of Carthage dating back to the 9th century, as well as the Great Mosque of Kairouan. Known for its ancient architecture, souks and blue coasts, it covers 163,610 km2 (63,170 sq mi), and has a population of 12.1 million. It contains the eastern end of the Atlas Mountains and the northern reaches of the Sahara desert; much of its remaining territory is arable land. Its 1,300 km (810 mi) of coastline include the African conjunction of the western and eastern parts of the Mediterranean Basin. Tunisia is home to Africa's northernmost point, Cape Angela; and its capital and largest city is Tunis, which is located on its northeastern coast, and lends the country its name." },
    {id:"Republic of Niger" , name: "Nigeria", companies: 65 , entrepreneurs : 76 , former_employees: 123, website: "", description: "Nigeria (/naɪˈdʒɪəriə/ Listen ny-JEER-ee-ə), officially the Federal Republic of Nigeria, is a country in West Africa. It is situated between the Sahel to the north and the Gulf of Guinea to the south in the Atlantic Ocean. It covers an area of 923,769 square kilometres (356,669 sq mi), and with a population of over 225 million, it is the most populous country in Africa, and the world's sixth-most populous country. Nigeria borders Niger in the north, Chad in the northeast, Cameroon in the east, and Benin in the west. Nigeria is a federal republic comprising 36 states and the Federal Capital Territory, where the capital, Abuja, is located. The largest city in Nigeria is Lagos, one of the largest metropolitan areas in the world and the second-largest in Africa." },
    {id:"Republic of Kenya" , name: "Kenya", companies: 34 , entrepreneurs : 87 , former_employees: 53, website: "", description: "Kenya, officially the Republic of Kenya (Swahili: Jamhuri ya Kenya), is a country in East Africa. At 580,367 square kilometres (224,081 sq mi), Kenya is the world's 48th largest country by area. With a population of more than 47.6 million in the 2019 census,[12] Kenya is the 29th most populous country in the world.[6] Kenya's capital and largest city is Nairobi, while its oldest, currently second largest city, and first capital is the coastal city of Mombasa. Kisumu City is the third-largest city and also an inland port on Lake Victoria. Other important urban centres include Nakuru and Eldoret. As of 2020, Kenya is the third-largest economy in sub-Saharan Africa after Nigeria and South Africa.[13] Kenya is bordered by South Sudan to the northwest, Ethiopia to the north, Somalia to the east, Uganda to the west, Tanzania to the south, and the Indian Ocean to the southeast. Its geography, climate and population vary widely, ranging from cold snow-capped mountaintops (Batian, Nelion and Point Lenana on Mount Kenya) with vast surrounding forests, wildlife and fertile agricultural regions to temperate climates in western and rift valley counties and dry less fertile arid and semi-arid areas and absolute deserts (Chalbi Desert and Nyiri Desert)." },
    {id:"Republic of South Africa" , name: "South Africa", companies: 23 , entrepreneurs : 80 , former_employees: 987, website: "", description: "South Africa, officially the Republic of South Africa (RSA), is the southernmost country in Africa. It is bounded to the south by 2,798 kilometres (1,739 mi) of coastline that stretch along the South Atlantic and Indian Oceans;[14][15][16] to the north by the neighbouring countries of Namibia, Botswana, and Zimbabwe; and to the east and northeast by Mozambique and Eswatini. It also completely enclaves the country Lesotho.[17] It is the southernmost country on the mainland of the Old World, and the second-most populous country located entirely south of the equator, after Tanzania. South Africa is a biodiversity hotspot, with unique biomes, plant and animal life. With over 60 million people, the country is the world's 24th-most populous nation and covers an area of 1,221,037 square kilometres (471,445 square miles). South Africa has three capital cities, with the executive, judicial and legislative branches of government based in Pretoria, Bloemfontein, and Cape Town respectively. The largest city is Johannesburg." },
];
  
function findInfo (country) {
    return endeavor.find((d) => d.id == country);
}


const drawGlobe = () => {

    globe = select('body')
    .append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight)

    projection = geoOrthographic()
    .fitSize([globeSize.w, globeSize.h], geojson)
    .translate([window.innerWidth - globeSize.w / 2, window.innerHeight / 2])

    path = geoPath().projection(projection)
    

    globe
    .selectAll('path')
    .data(geojson.features)
    .enter().append('path')
    .attr('d', path)
    .attr('class', 'country')
    .style('fill', function(d) {return (findInfo(d.properties.formal_en) ? '#b0f1f0' : '#33415c' );})     
}


///////////////////
// Map drag info //
///////////////////

const dragInfoContainer = d3.select('body')
    .append('div')
    .attr('class', 'drag-menu-container')
    .style('width', globeSize.w)
    .style('left', (window.innerWidth - globeSize.w));


    dragInfoContainer.append("div").append("p").text("DRAG TO NAVIGATE AROUND THE MAP").attr('class', 'drag-text')



const drawGraticule = () => {
    graticule = geoGraticule()

    globe
    .append('path')
    .attr('class', 'graticule')
    .attr('d', path(graticule()))  
}


//////////////////
// Country info //
//////////////////

const renderInfoPanel = () => infoPanel = select('body').append('article').attr('class', 'country-info')

const menuContainerInfo = d3.select('body')
    .append('div')
    .attr('class', 'info-menu-container')
    .style('left', (window.innerWidth / 12));


countryTitle = menuContainerInfo.append("div").append("h1").text("Select a country").attr('class', 'country-title-text')


const countryQuantity = menuContainerInfo
.append('div')
.attr('class', 'quantity-container');


companiesDiv = countryQuantity.append('div').attr('class', 'div-companies');
entrepreneursDiv = countryQuantity.append('div').attr('class', 'div-entrepreneurs');
formerEmployeesDiv = countryQuantity.append('div').attr('class', 'div-entrepreneurs');


companiesTitle = companiesDiv.append('div').append("p").attr('class', 'country-quantity-titles');
companiesText = companiesDiv.append('div').append("h3").attr('class', 'country-companies-text');

entrepreneursTitle = entrepreneursDiv.append('div').append("p").attr('class', 'country-quantity-titles');
entrepreneursText = entrepreneursDiv.append('div').append("h3").attr('class', 'country-entrepreneurs-text');

formerEmployeesTitle = formerEmployeesDiv.append('div').append("p").attr('class', 'country-quantity-titles');
formerEmployeesText = formerEmployeesDiv.append('div').append("h3").attr('class', 'country-former-employees-text');


countryDescription = menuContainerInfo.append("div").append("p").attr('class', 'country-description-text')


const createHoverEffect = () => {
    globe
    .selectAll('.country')
    .on('mouseover', function(e, d){
        const {formal_en, economy} = d.properties
        // let countryName = findInfo(formal_en) ? findInfo(formal_en).name : formal_en; 
        let countryName = findInfo(formal_en) ? countryTitle.text(findInfo(formal_en).name) : formal_en; 


        let countryCompaniesTitle = findInfo(formal_en) ? companiesTitle.text("Companies") : ""; 
        let countryCompanies = findInfo(formal_en) ? companiesText.text(findInfo(formal_en).companies) : formal_en;
        
        let countryEntrepreneursTitle = findInfo(formal_en) ? entrepreneursTitle.text("Entrepreneurs") : ""; 
        let countryEntrepreneurs = findInfo(formal_en) ? entrepreneursText.text(findInfo(formal_en).entrepreneurs) : formal_en; 

        let countryFormerEmployeesTitle = findInfo(formal_en) ? formerEmployeesTitle.text("Former Employees") : ""; 
        let countryFormerEmployees = findInfo(formal_en) ? formerEmployeesText.text(findInfo(formal_en).former_employees) : formal_en;

        let countryDescriptionText = findInfo(formal_en) ? countryDescription.text(findInfo(formal_en).description) : "";

        console.log(formal_en);
        

        // let countryInfo = findInfo(formal_en) ? findInfo(formal_en).entrepreneurs : formal_en;
        
        // if (findInfo(d.properties.formal_en)) {
        //     infoPanel.html (`<h1>${countryName}</h1><hr><p>Emprendedores: ${countryInfo}</p>`)
        // };

        globe.selectAll('.country').attr('style', function(d) {return (findInfo(d.properties.formal_en) ? 'fill: #b0f1f0' : 'fill: #33415c' );})
        select(this).attr('style', function(d) {return (findInfo(d.properties.formal_en) ? countrySelected : countryUnselected);})
    })
}

const createDraggingEvents = () => {
    globe
    .on('mousedown', () => isMouseDown = true)
    .on('mouseup', () => isMouseDown = false)
    .on('mousemove', e => {

        if (isMouseDown) {
        // Mouse movement amount
        const {movementX, movementY} = e
        
        // Rotation speed
        rotation.x += movementX /5
        rotation.y += movementY*-1 /5

        projection.rotate([rotation.x,rotation.y])
        selectAll('.country').attr('d', path)
        selectAll('.graticule').attr('d', path(graticule()))

        }
    })
}