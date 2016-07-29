import React from 'react';
import {Layout} from 'react-mdl';
import AppContent from './AppContent';
import AppHeader from './AppHeader';

const App = React.createClass({
  displayName: 'App',

  render() {
    return (
      <Layout fixedHeader style={{ backgroundColor: '#fafafa' }}>
        <AppHeader title="Flow"/>
        <AppContent />
      </Layout>
    );
  }
});

export default App;
