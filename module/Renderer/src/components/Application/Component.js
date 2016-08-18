import React from 'react';
import {Layout} from 'react-mdl';
import ApplicationHeader from './ApplicationHeader';

const App = React.createClass({
  displayName: 'Application',

  render() {
    return (
      <Layout fixedHeader style={{ backgroundColor: '#fafafa' }}>
        <ApplicationHeader title="Flow"/>
        {this.props.children}
      </Layout>
    );
  }
});

export default App;
