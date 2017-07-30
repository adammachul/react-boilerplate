import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import _ from 'lodash';

import config from '../../config';
import routes from '../../routes';

import '../../global/normalize.css';

const App = () => {

    const routeWithSubRoutes = route => (
        <Route
            key={_.uniqueId()}
            exact={route.exact || false}
            path={route.path}
            render={ props => (
                <route.component {...props} routes={route.routes} />
            )}
        />
    );

    return (
        <div>
            <Helmet {...config.app} />
            <Switch>
                { routes.map(route => routeWithSubRoutes(route))}
            </Switch>
        </div>
    )
}

export default App;
