import React from 'react';
import {IconMenu, IconButton, MenuItem, RaisedButton, Toolbar, ToolbarGroup} from 'material-ui';

const AppHeader = React.createClass({
  displayName: 'AppHeader',

  getInitialState() {
    return {
      value: 3
    };
  },
  handleChange(event, index, value) {
    this.setState({value});
  },
  render() {
    const toolbarStyle = {
      position: 'fixed',
      zIndex: 5
    };

    return (
      <Toolbar style={toolbarStyle}>
        <ToolbarGroup>
          <IconMenu iconButtonElement={
            <IconButton touch={true} iconClassName="material-icons">Flow</IconButton>
          }>
            <MenuItem primaryText="Download"/>
            <MenuItem primaryText="More Info"/>
          </IconMenu>
        </ToolbarGroup>
        <ToolbarGroup lastChild={true} style={{ float: 'right' }}>
          <RaisedButton label="Create Broadcast" primary={true}/>
        </ToolbarGroup>
      </Toolbar>
    );
  }
});

export default AppHeader;
