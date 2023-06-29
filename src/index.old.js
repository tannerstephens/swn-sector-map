



const directions = [
    Direction.NE,
    Direction.E,
    Direction.SE,
    Direction.SW,
    Direction.W,
    Direction.NW
];

/**
 *
 * @param {Grid} grid
 * @param {Hex} hex
 * @returns {Array<Hex>}
 */
const getAllNeighbors = (grid, hex) => {
    const neighbors = new Array();
    directions.forEach(dir => {
        const n = grid.neighborOf([hex.q, hex.r], dir, {allowOutside: false});
        if(n != undefined) {neighbors.push(n);}

    });

    return neighbors;
}

const edgeIsFloating = (grid, hex) => {
    if(!hex.edge) {
        return false;
    }

    return !getAllNeighbors(grid, hex).some(hex => !hex.edge);
}

document.addEventListener('DOMContentLoaded', () => {
    const draw = createAndRenderSvg();

    const hexSize = 60;
    const gridSize = 11;
    const horizontalOffset = (innerWidth - (hexSize*gridSize*2)) / 2
    const verticalOffset = (innerHeight - (hexSize*gridSize*3/2)) / 2


    let grid = new Grid(hex, rectangle({ width: gridSize, height: gridSize }));

    grid.filter(hex => {
        const neighbors = getAllNeighbors(grid, hex);
        hex.edge = neighbors.length < 6;
        return hex.edge;
    }).forEach(hex => {
        if(edgeIsFloating(grid, hex)) {
            grid = grid.filter(hex1 => hex1 != hex);
        }
    })

    /**
     *
     * @param {Hex} hex
     */
    const renderHex = hex => {
        let fill = hex.edge ? '#fff' : '#eee';

        const polygon = draw
            .polygon(hex.corners.map(({x,y}) => `${x + horizontalOffset},${y+verticalOffset}`))
            .fill(fill)
            .stroke({width: 1, color: '#555'});

        if(hex.edge) {
            draw.text('+').center(hex.x+horizontalOffset, hex.y+verticalOffset).font({
                size: 50,
                anchor: 'middle',
            })
        }

        hex.poly = polygon;

        polygon.on('mouseenter', e => {
            polygon.fill('#eee');
        });

        polygon.on('mouseleave', e => {
            polygon.fill(fill)
        });

        polygon.on('contextmenu', e => {
            e.preventDefault()
            if(hex.edge) {
                return;
            }

            fill = '#fff';
            hex.poly.fill(fill);
            hex.edge = true;

            getAllNeighbors(grid, hex).forEach(hex1 => {
                if(edgeIsFloating(grid, hex1)) {
                    grid = grid.filter(hex2 => hex1 != hex2);
                    draw.removeElement(hex1.poly);
                }
            })

            if(edgeIsFloating(grid, hex)) {
                grid = grid.filter(hex1 => hex1 != hex);
                draw.removeElement(hex.poly);
            }

        });

        polygon.on('click', e => {
            if(hex.edge) {
                hex.edge = false;
                fill = '#eee';
                polygon.fill(fill);

                directions.forEach(dir => {
                    if(grid.neighborOf(hex, dir, {allowOutside: false}) == undefined) {
                        const newHex = grid.neighborOf(hex, dir);
                        newHex.edge = true;
                        renderHex(newHex);
                        grid.setHexes([newHex]);
                    }
                })
            }
        })
    }

    grid.forEach(renderHex);
});


// Live Reload
if(window.DEV) {
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
}
