import React from 'react';
import {Layout} from 'react-mdl';
import AppHeader from './AppHeader';

const App = React.createClass({
  displayName: 'App',

  render() {
    return (
      <Layout fixedHeader style={{ backgroundColor: '#fafafa' }}>
        <AppHeader title="Flow"/>
        {this.props.children}
      </Layout>
    );
  }
});

export default App;
