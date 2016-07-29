import insight from './utils/insight';
import {render} from 'react-dom';
import React from 'react';
import App from './containers/App';
import {Provider} from 'react-redux';
import configureStore from './stores/configure-store';
import tapEventPlugin from 'react-tap-event-plugin';
import connectActionsToIpc from './utils/connect-actions-to-ipc';

// Set up tap events
tapEventPlugin();

const store = configureStore();

// Starts communication channel with atom-shell browser side
connectActionsToIpc(store);

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;


insight.init(function () {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('content')
  );
});
