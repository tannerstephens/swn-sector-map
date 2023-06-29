import Container from './app/Container';

export default class App {
    constructor() {
        this.container = new Container();
    }

    bind(svgContainer, sidebarContainer) {
        this.container.bind(svgContainer, sidebarContainer);
    }
}
