const WebpackIsomorphicTools = require('webpack-isomorphic-tools');

global.__DEV__ = process.env.NODE_ENV !== 'production';

const dirRoot = require('path').join(process.cwd());

global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./tools/webpack/WIT.config'))
    .server(dirRoot, () => {
        if (__DEV__) {
            require('./src/server');
        } else {
            require('./build/server')
        }
    });
