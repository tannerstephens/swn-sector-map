import Container from './app/Container';

export default class App {
    constructor() {
        this.container = new Container();
    }

    render(svgContainer, sidebarContainer) {
        this.container.render(svgContainer, sidebarContainer);
    }
}
