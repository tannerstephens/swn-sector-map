const esbuild = require("esbuild")
const options = require('./build_options');

const watch = async () => {
    const ctx = await esbuild.context({...options, define: {'window.DEV': 'true'}});
    await ctx.watch();
    const { host, port } = await ctx.serve({servedir: 'dist'});

    console.log('Watchserver started')
    console.log(`http://localhost:${port}/`)
}

watch();
