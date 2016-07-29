import React from 'react';
import App from './containers/App';
import NoMatch from './components/Content/NoMatch';
import Dashboard from './components/Content/Dashboard';
import Store from './components/Content/Store';
import Components from './components/Content/Components';
import Networks from './components/Content/Networks';
import {IndexRoute, Route} from 'react-router';

export default (
  <Route path="/" component={App}>
    <IndexRoute name="dashboard" component={Dashboard}/>
    <Route name="components" path="/components" component={Components}/>
    <Route name="networks" path="/networks" component={Networks}/>
    <Route name="store" path="/store" component={Store}/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
//
//export default {
//  name: 'app',
//  path: '/',
//  component: App,
//  indexRouter: {
//    name: 'dashboard',
//    component: Dashboard
//  },
//  childRoutes: [{
//    name: 'components',
//    path: '/components',
//    component: Components
//  }, {
//    name: 'networks',
//    path: '/networks',
//    component: Networks
//  }, {
//    name: 'store',
//    path: '/store',
//    component: Store
//  }, {
//    path: '/*',
//    component: NoMatch
//  }]
//};
