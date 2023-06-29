import Hex from "./Hex";
import mustache from "mustache";

import defaultTemplate from './sidebar/default.mustache';
import hexTemplate from './sidebar/hex.mustache';

export default class Sidebar {
    constructor() {
        this._container = null;
    }

    /**
     * @returns {HTMLElement}
     */
    get container() {
        if(this._container == null) {
            this._container = document.createElement('div');
        }

        return this._container
    }

    render(sidebarContainer) {
        this._container = sidebarContainer;
        this.container.classList.add('sidebar');

        this.renderTemplate(defaultTemplate);
    }

    renderTemplate(template, data = {}) {
        const rendered = mustache.render(template, data);

        this.container.innerHTML = rendered;
    }

    /**
     *
     * @param {Hex} hex
     */
    loadHex(hex) {
        this.renderTemplate(hexTemplate, hex);

        const nameInput = this.container.querySelector('#name');

        nameInput.oninput = e => {
            hex.name = nameInput.value;
        }
    }
}
