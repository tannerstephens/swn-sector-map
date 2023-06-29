import { Svg, Element } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js';
import HexGrid from './container/HexGrid';
import Sidebar from './container/Sidebar';
import Hex from './container/Hex';


export default class Container extends Svg {
    constructor() {
        super();
        this.node.setAttribute('pointer-events', 'bounding-box');

        this
            .panZoom({ zoomMin: 0.5, zoomMax: 2, zoomFactor: 0.5 });

        this.hexGrid = new HexGrid();
        this.createGlobalEventListeners()

        this.mouseTrackerHex = null;

        this.dragged = false;

        this.sidebar = new Sidebar();
    }

    /**
     *
     * @param {*} param0
     * @returns {Hex}
     */
    pointToHex({x, y}) {
        const {x: offsetX, y: offsetY, w: vboxWidth, h: vboxHeight} = this.viewbox();
        const xAdjust = vboxWidth / this.width();
        const yAdjust = vboxHeight / this.height();

        const hex = this.hexGrid.pointToHex({x: (x * xAdjust) + offsetX , y: (y * yAdjust) + offsetY});

        if(hex instanceof Hex) {
            return hex;
        } else {
            return new Hex(hex);
        }
    }


    add(element) {
        if(element instanceof Hex) {
            super.add(element.polygon);
        } else {
            super.add(element);
        }

        return this;
    }

    createGlobalEventListeners() {
        this.on('mousemove', ({layerX: x, layerY: y}) => {
            const hex = this.pointToHex({x, y});

            if(hex != this.mouseTrackerHex) {
                if(this.mouseTrackerHex && !this.mouseTrackerHex.real) {
                    this.mouseTrackerHex.remove();
                }

                this.mouseTrackerHex = hex;

                if(hex.real) {
                    return
                }

                this.add(hex);
            }
        });

        this.on('click', ({layerX: x, layerY: y}) => {
            if(this.dragged) {
                this.dragged = false;
                return
            }

            const hex = this.pointToHex({x, y});

            if(hex.real) {
                this.sidebar.loadHex(hex);
            }

            hex
                .stroke({color: '#222'})
                .fill('#ccc');


            this.add(hex);
            hex.real = true;
            this.hexGrid.setHexes([hex]);
        });

        this.on('panning', e => {
            this.dragged = true;
        });

        this.on('contextmenu', e => {
            e.preventDefault();

            const {layerX: x, layerY: y} = e;
            const hex = this.pointToHex({x, y});

            if(hex.real) {
                hex.remove();

                this.hexGrid = this.hexGrid.remove(hex);
            }
        })

        window.onresize = () => {
            const parent = this.node.parentNode;

            if(parent) {
                this
                    .size(parent.clientWidth, parent.clientHeight)
                    .viewbox(`0 0 ${parent.clientWidth} ${parent.clientHeight}`);
            }
        }

    }

    _renderSvg(svgContainer) {
        const parent = svgContainer.parentNode;
        parent.replaceChild(this.node, svgContainer);
        this
            .size(parent.clientWidth, parent.clientHeight)
            .viewbox(`0 0 ${parent.clientWidth} ${parent.clientHeight}`);
    }

    render(svgContainer, sidebarContainer) {
        this.sidebar.render(sidebarContainer);
        this._renderSvg(svgContainer);
    }
}
