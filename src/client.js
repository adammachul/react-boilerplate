import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux'; 
import configureStore from './redux/store';

const initialState = window.__INITIAL_STATE__;
const history = createHistory();
const store = configureStore(history, initialState);
const rootElement = document.getElementById('root');

const renderApp = () => {
    const App = require('./containers/App').default;

    render (
        <AppContainer>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <App />
                </ConnectedRouter>
            </Provider>
        </AppContainer>,
        rootElement,
    )
}

if (module.hot) {
    const reRenderApp = () => {
        renderApp();
        //try catch
    }

    module.hot.accept('./containers/App', () => {
        setImmediate( () => {
            unmountComponentAtNode(rootElement);
            reRenderApp();
        })
    })
}

renderApp();
