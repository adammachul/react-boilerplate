import React from 'react';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';
import _ from 'lodash';

const Html = ({store, htmlContent }) => {
    const head = Helmet.renderStatic();
    const attrs = head.htmlAttributes.toComponent();
    const { lang, ...rest } = attrs || {};
    const assets = webpackIsomorphicTools.assets();

    return (
        <html {...rest} lang={ lang || 'en' }>
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                {head.title.toComponent()}
                {head.base.toComponent()}
                {head.meta.toComponent()}
                {head.link.toComponent()}

                {_.keys(assets.styles).map(style => (
                    <link
                        key={_.uniqueId()}
                        href={assets.styles[style]}
                        media="screen, projection"
                        rel="stylesheet"
                        type="text/css"
                    />
                ))}

                {
                    _.keys(assets.styles).length === 0 ?
                        <style
                            dangerouslySetInnerHTML={{ __html:
                                require('./global/normalize.css')._style +
                                require('./containers/HomePage/styles.scss')._style +
                                require('./containers/App/styles.scss')._style,
                            }}
                        />
                        : null
                }

            </head>
            <body>
                <div
                    id="root"
                    dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
                />

                <script
                    dangerouslySetInnerHTML={{
                        __html: store && `window.__INITIAL_STATE__=${serialize(store.getState())};`,
                    }}
                />

                {
                    _.keys(assets.javascript).reverse().map( script =>
                        <script key={_.uniqueId()} src={assets.javascript[script]} />,
                    )
                }
                {head.script.toComponent()}
            </body>
        </html>
    );
};

Html.defaultProps = { htmlContent: '' };

export default Html;
