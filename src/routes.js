import HomePage from './containers/HomePage';
import NotFoundPage from './containers/NotFoundPage';

const routes = [
    {
        path: '/',
        exact: true,
        component: HomePage
        //loadData:
    },
    {
        path: '*',
        component: NotFoundPage
    }
]

export default routes;
