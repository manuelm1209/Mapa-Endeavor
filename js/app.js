
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
}

const drawGraticule = () => {
    graticule = geoGraticule()

    globe
    .append('path')
    .attr('class', 'graticule')
    .attr('d', path(graticule()))  
}

const renderInfoPanel = () => infoPanel = select('body').append('article').attr('class', 'info')

const createHoverEffect = () => {
    globe
    .selectAll('.country')
    .on('mouseover', function(e, d){
        const {formal_en, economy} = d.properties
        console.log(formal_en, economy);
        infoPanel.html (`<h1>${formal_en}</h1><hr><p>${economy}</p>`)
        globe.selectAll('.country').style('fill', '#33415c')
        select(this).style('fill', '#09E1CD')
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

        rotation.x += movementX /3
        rotation.y += movementY*-1 /3

        projection.rotate([rotation.x,rotation.y])
        selectAll('.country').attr('d', path)
        selectAll('.graticule').attr('d', path(graticule()))

        }
        


    })

}