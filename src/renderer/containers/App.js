import React from 'react';
import mui from 'material-ui';
import AppHeader from './AppHeader';
import AppContent from './AppContent';
import AppFooter from './AppFooter';

let themeManager = mui.Styles.ThemeManager;

const App = React.createClass({
  displayName: 'App',

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: themeManager.getMuiTheme(mui.Styles.LightRawTheme)
    };
  },

  render() {
    return (
      <main>
        <AppHeader />
        <AppContent />
        <AppFooter />
      </main>
    );
  }
});

export default App;
