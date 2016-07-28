import React from 'react';
import Toolbar from '../components/Toolbar';

import mui from 'material-ui';
let themeManager = mui.Styles.ThemeManager;


class Application extends React.Component {
  static propTypes = {
    children: React.PropTypes.element.isRequired
  };

  getChildContext() {
    return {
      muiTheme: themeManager.getMuiTheme(mui.Styles.LightRawTheme)
    };
  }

  render() {
    return (
      <div id="application">
        <Toolbar />
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Application;
