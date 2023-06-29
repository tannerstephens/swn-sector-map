import App from "./App";

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.bind(document.getElementById('svg'), document.getElementById('sidebar'));
});

// Live Reload
if(window.DEV) {
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
}
