import insight from './utils/insight';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, hashHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import routes from './routes';
import configureStore from './stores/configure-store';
import tapEventPlugin from 'react-tap-event-plugin';
import connectActionsToIpc from './utils/connect-actions-to-ipc';


// Set up tap events
tapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

// Starts communication channel with atom-shell browser side
connectActionsToIpc(store);

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;


insight.init(function () {
  render(
    <Provider store={store}>
      <Router history={history} routes={routes}/>
    </Provider>,
    document.getElementById('content')
  );
});
