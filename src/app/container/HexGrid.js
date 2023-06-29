import { defineHex, Grid, Direction } from 'honeycomb-grid';
import Hex from './Hex';

const DIRECTIONS = [
    Direction.NE,
    Direction.E,
    Direction.SE,
    Direction.SW,
    Direction.W,
    Direction.NW,
];

export default class HexGrid extends Grid {
    /**
     *
     * @param {Object} settings
     * @param {Number} settings.hexSize
     * @param {Traverser} settings.traverser
     */
    constructor(hexes) {
        super(Hex, hexes);
    }

    toJSON() {
        const json = super.toJSON();

        json.coordinates.forEach(hex => (delete hex.polygon));

        return json;
    }

    getAllNeighbors(hex, allowOutside) {
        return DIRECTIONS.map(direction => this
            .neighborOf(hex, direction, {
                allowOutside
            }));
    }

    remove(hex) {
        return new HexGrid(this.filter(hex1 => hex1 != hex));
    }
}
