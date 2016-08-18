import React from 'react';
import {Layout} from 'react-mdl';
import ApplicationHeader from './ApplicationHeader';

const Application = React.createClass({
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

export default Application;

//export default Relay.createContainer(Application, {
//    fragments: {
//        viewer: () => Relay.QL`
//            fragment on Node {
//                id,
//            }
//        `;
//    }
//});
