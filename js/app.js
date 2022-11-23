const { json, select, selectAll, geoOrthographic, geoPath, geoGraticule } = d3

let geojson, globe, projection,path, graticule, infoPanel, isMouseDown = false, rotation = {x: 0, y:0}

const globeSize = {
    w: window.innerWidth / 2,
    h: window.innerHeight
}

json('../geo.json').then(data => init(data))

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
    {id:"United Mexican States" , name: "México", companies: 154 , entrepreneurs : 200 },
    {id:"Republic of Colombia" , name: "Colombia", companies: 432 , entrepreneurs : 100 },
    {id:"United States of America" , name: "U.S.A", companies: 123 , entrepreneurs : 330 },
    {id:"Canada" , name: "Canada", companies: 275 , entrepreneurs : 300 },
    {id:"Commonwealth of Puerto Rico" , name: "Puerto Rico", companies: 534 , entrepreneurs : 230 },
    {id:"Republic of Peru" , name: "Colombia", companies: 234 , entrepreneurs : 300 },
    {id:"Federative Republic of Brazil" , name: "Brazil", companies: 187 , entrepreneurs : 320 },
    {id:"Republic of Chile" , name: "Chile", companies: 76 , entrepreneurs : 300 },
    {id:"Argentine Republic" , name: "Argentina", companies: 63 , entrepreneurs : 540 },
    {id:"Republic of Ecuador" , name: "Ecuador", companies: 56 , entrepreneurs : 670 },
    {id:"Oriental Republic of Uruguay" , name: "Uruguay", companies: 87 , entrepreneurs : 560 },
    {id:"Ireland" , name: "Ireland", companies: 45 , entrepreneurs : 340 },
    {id:"Portuguese Republic" , name: "Portugal", companies: 43 , entrepreneurs : 50 },
    {id:"Kingdom of Spain" , name: "Spain", companies: 23 , entrepreneurs : 320 },
    {id:"Kingdom of Morocco" , name: "Morocco", companies: 65 , entrepreneurs : 120 },
    {id:"Italian Republic" , name: "Italy", companies: 87 , entrepreneurs : 50 },
    {id:"Arab Republic of Egypt" , name: "Egypt", companies: 34 , entrepreneurs : 60 },
    {id:"Hellenic Republic" , name: "Greece", companies: 23 , entrepreneurs : 70 },
    {id:"Republic of Poland" , name: "Poland", companies: 54 , entrepreneurs : 87 },
    {id:"Romania" , name: "Romania", companies: 50 , entrepreneurs : 76 },
    {id:"Republic of Bulgaria" , name: "Bulgaria", companies: 87 , entrepreneurs : 87 },
    {id:"Republic of Turkey" , name: "Turkey", companies: 43 , entrepreneurs : 67 },
    {id:"Lebanese Republic" , name: "Lebanon", companies: 65 , entrepreneurs : 98 },
    {id:"Hashemite Kingdom of Jordan" , name: "Jordan", companies: 34 , entrepreneurs : 76 },
    {id:"Kingdom of Saudi Arabia" , name: "Saudi Arabia", companies: 76 , entrepreneurs : 56 },
    {id:"United Arab Emirates" , name: "U.A.E", companies: 78 , entrepreneurs : 36 },
    {id:"Islamic Republic of Pakistan" , name: "Pakistan", companies: 76 , entrepreneurs : 35 },
    {id:"People's Republic of Bangladesh" , name: "Bangladesh", companies: 56 , entrepreneurs : 87 },
    {id:"Kingdom of Thailand" , name: "Thailand", companies: 54 , entrepreneurs : 345 },
    {id:"Malaysia" , name: "Malaysia", companies: 43 , entrepreneurs : 76 },
    {id:"Republic of Indonesia" , name: "Indonesia", companies: 87 , entrepreneurs : 45 },
    {id:"Republic of the Philippines" , name: "Philippines", companies: 98 , entrepreneurs : 76 },
    {id:"Japan" , name: "Japan", companies: 34 , entrepreneurs : 430 },
    {id:"Socialist Republic of Vietnam" , name: "Vietnam", companies: 98 , entrepreneurs : 35 },
    {id:"Republic of Tunisia" , name: "Tunisia", companies: 76 , entrepreneurs : 34 },
    {id:"Republic of Niger" , name: "Nigeria", companies: 65 , entrepreneurs : 76 },
    {id:"Republic of Kenya" , name: "Kenya", companies: 34 , entrepreneurs : 87 },
    {id:"Republic of South Africa" , name: "South Africa", companies: 23 , entrepreneurs : 80 },
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

const menuContainer = d3.select('body')
    .append('div')
    .attr('class', 'drag-menu-container')
    .style('width', globeSize.w)
    .style('left', (window.innerWidth - globeSize.w));


menuContainer.append("div").append("p").text("DRAG TO NAVIGATE AROUND THE MAP").attr('class', 'drag-text')



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
    .style('left', (window.innerWidth / 8));


countryTitle = menuContainerInfo.append("div").append("h1").text("Select a country...").attr('class', 'country-title-text')


const countryQuantity = menuContainerInfo
.append('div')
.attr('class', 'quantity-container');


companiesDiv = countryQuantity.append('div').attr('class', 'div-companies');
entrepreneursDiv = countryQuantity.append('div').attr('class', 'div-entrepreneurs');


companiesTitle = companiesDiv.append('div').append("p").attr('class', 'country-quantity-titles');
companiesText = companiesDiv.append('div').append("h3").attr('class', 'country-companies-text');

entrepreneursTitle = entrepreneursDiv.append('div').append("p").attr('class', 'country-quantity-titles');
entrepreneursText = entrepreneursDiv.append('div').append("h3").attr('class', 'country-entrepreneurs-text');






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