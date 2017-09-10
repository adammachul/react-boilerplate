const WebpackIsomorphicTools = require('webpack-isomorphic-tools/plugin');

module.exports = {
    assets: {
        images: {
            extensions: ['png', 'jpg', 'gif', 'ico', 'svg']
        },
        fonts: {
            extensions: ['eot', 'ttf', 'woff', 'woff2']
        },
        styleModules: {
            extensions: ['css', 'scss'],
            filter: (module, regex, options, log) => {
                if (options.development) {
                    return WebpackIsomorphicTools.styleLoaderFilter(module, regex, options, log);
                }

                return regex.test(module.name);
            },
            path: (module, options, log) => {
                if (options.development) {
                    return WebpackIsomorphicTools.styleLoaderPathExtractor(module, options, log);
                }

                return module.name;
            },
            parser: (module, options, log) => {
                if (options.development) {
                    return WebpackIsomorphicTools.cssModulesLoaderParser(module, options, log);
                }

                return module.source;
            }
        }
    },
}
