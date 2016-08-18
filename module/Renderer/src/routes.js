import React from 'react';
import Application from './components/Application/Component';
import NoMatch from './components/Content/NoMatch';
import Dashboard from './components/Dashboard/Component';
import Store from './components/Content/Store';
import Components from './components/Content/Components';
import Networks from './components/Content/Networks';
import {IndexRoute, Route} from 'react-router';

export default (
  <Route path="/" component={Application}>
    <IndexRoute name="dashboard" component={Dashboard}/>
    <Route name="components" path="/components" component={Components}/>
    <Route name="networks" path="/networks" component={Networks}/>
    <Route name="store" path="/store" component={Store}/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
