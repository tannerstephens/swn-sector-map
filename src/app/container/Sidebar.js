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

    bind(sidebarContainer) {
        this._container = sidebarContainer;
        this.container.classList.add('sidebar');
    }

    render(elements) {
        this.clear();

        let elementsList = elements;
        if(elements instanceof HTMLElement) {
            elementsList = [elements];
        }

        elementsList.forEach(element => {
            this.container.appendChild(element);
        })
    }

    clear() {
        this.container.innerHTML = '';
    }
}
