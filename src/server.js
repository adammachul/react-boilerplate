import path from 'path';
import express from 'express';
import React from 'react';

import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';

import createHistory from 'history/createMemoryHistory';
import configureStore from './redux/store';
import Html from './Html';
import App from './containers/App';
import routes from './routes';
import { port, host } from './config';

const app = express();


if (__DEV__) {
    const webpack = require('webpack');
    const webpackConfig = require('../tools/webpack/webpack.client');

    const compiler = webpack(webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        noInfo: true,
        stats: 'errors-only'
    }));

    app.use(require('webpack-hot-middleware')(compiler));
}


app.get('*', (req, res) => {
    if (__DEV__) webpackIsomorphicTools.refresh();

    const history = createHistory();
    const store = configureStore(history);
    const renderHtml = (store, htmlContent) => {
        const html = renderToStaticMarkup(<Html store={store} htmlContent={htmlContent} />);

        return `<!doctype html>${html}`;
    }

    const loadBranchData = () => {
        const promises = [];

        routes.some( (route) => {
            const match = matchPath(req.url, route);

            if (match && route.loadData) promises.push(route.loadData(store.dispatch, match.params));

            return match;
        });

        return Promise.all(promises);
    };

    loadBranchData()
        .then(() => {
            const routerContext = {};
            const htmlContent = renderToString(
                <Provider store={store}>
                    <StaticRouter location={req.url} context={routerContext}>
                        <App />
                    </StaticRouter>
                </Provider>
            );

            if (routerContext.url) {
                res.status(301).setHeader('Location', routerContext.url);
                res.end();

                return;
            }

            const status = routerContext.status === '404' ? 404 : 200;

            res.status(status).send(renderHtml(store, htmlContent));
        })
        .catch((err) => {
            res.status(404).send('Not Found');

            console.error(`Rendering routes error: ${err}`);
        });
});


if (port) {
    app.listen(port, host, (err) => {
        if (err) console.error(`Error: ${err}`);
        console.info(`Listening at port http://${host}:${port}`);
    })
} else {
    console.error(`No PORT environment variable specified`);
}
