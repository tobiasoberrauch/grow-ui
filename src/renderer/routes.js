import React from 'react';
import App from './containers/App';
import NoMatch from './Component/Content/NoMatch';
import Dashboard from './Component/Dashboard/Component';
import Store from './Component/Content/Store';
import Components from './Component/Content/Components';
import Networks from './Component/Content/Networks';
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
