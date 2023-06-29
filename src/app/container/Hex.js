import { Polygon } from "@svgdotjs/svg.js";
import { Hex as HoneyHex, defineHex } from "honeycomb-grid";

export default class Hex extends defineHex({dimensions: 60, origin: 'topLeft'}) {
    constructor(coords) {
        super(coords);
        this._polygon = null;
        this.real = false;
        this.name = ''
    }

    /**
     * @returns {Polygon}
     */
    get polygon() {
        if(this._polygon == null) {
            this._polygon = new Polygon();
            this._polygon.plot(this.corners.map(({x, y}) => `${x},${y}`));
            this.stroke().fill();
        }

        return this._polygon;
    }

    /**
     *
     * @param {Object} settings
     * @returns {Hex}
     */
    stroke({
        color = '#999',
        width = 1,
    } = {}) {
        this.polygon.stroke({color, width});
        return this;
    }

    fill(color = 'none') {
        this.polygon.fill(color);
        return this;
    }

    remove() {
        this.polygon.remove();
        return this;
    }
}
