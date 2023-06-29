module.exports = {
    entryPoints: ['src/index.js'],
    outfile: 'dist/main.js',
    bundle: true,
    loader: {
        '.mustache': 'text'
    }
};
