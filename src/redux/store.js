import React from 'react';
import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware } from 'redux';

import rootReducer from './reducers';

const configureStore = ( history, initialState ) => {
    const middleware = routerMiddleware(history);
    const store = createStore(rootReducer, initialState, applyMiddleware(middleware));

    if (module.hot) {
        module.hot.accept('./reducers', () => {
            try {
                const nextReducer = require('./reducers').default;

                store.replaceReducer(nextReducer);
            } catch (error) {
                console.error(`Reducer hot reloading error: ${error}`);
            }
        })
    }

    return store;
}

export default configureStore;
