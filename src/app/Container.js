import { Svg, Element } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js';
import HexGrid from './container/HexGrid';
import Sidebar from './container/Sidebar';
import Hex from './container/Hex';
import renderHex from './container/templates/hex';

const DEFAULTS = {
    stroke: {color: '#fff', width: 3},
    fill: '#fff5',
    selectedStroke: {color: '#ff0', width: 3},
};


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
        this.selectedHex = null;
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


    add(element, pos) {
        if(element instanceof Hex) {
            super.add(element.polygon, pos);
        } else {
            super.add(element, pos);
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

                if(!hex.real) {
                    this.add(hex, 0);
                }




            }
        });

        this.on('click', ({layerX: x, layerY: y}) => {
            if(this.dragged) {
                this.dragged = false;
                return
            }

            const hex = this.pointToHex({x, y});

            if(this.selectedHex) {
                this.selectedHex
                    .stroke(DEFAULTS.stroke);
            }

            if(!hex.real) {
                hex
                    .fill(DEFAULTS.fill);

                this.add(hex);
                hex.real = true;
                this.hexGrid.setHexes([hex]);
            }

            this.selectedHex = hex;
            hex
                .stroke(DEFAULTS.selectedStroke)
                .front();

            this.sidebar.render(renderHex(hex));

        });

        this.on('panning', e => {
            this.dragged = true;
        });

        this.on('contextmenu', e => {
            e.preventDefault();

            const {layerX: x, layerY: y} = e;
            const hex = this.pointToHex({x, y});

            if(this.selectedHex) {
                this.selectedHex
                    .stroke(DEFAULTS.stroke);
                this.sidebar.clear();
            }

            this.selectedHex = null;

            if(hex.real) {
                hex.remove();

                this.hexGrid = this.hexGrid.remove(hex);

                this.sidebar.clear();
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

    _bindSvg(svgContainer) {
        const parent = svgContainer.parentNode;
        parent.replaceChild(this.node, svgContainer);
        this
            .size(parent.clientWidth, parent.clientHeight)
            .viewbox(`0 0 ${parent.clientWidth} ${parent.clientHeight}`);
    }

    bind(svgContainer, sidebarContainer) {
        this.sidebar.bind(sidebarContainer);
        this._bindSvg(svgContainer);
    }
}
