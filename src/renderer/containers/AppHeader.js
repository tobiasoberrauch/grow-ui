import React from 'react';
import {Header, HeaderRow, Navigation, Textfield} from 'react-mdl';

const AppHeader = React.createClass({
  displayName: 'AppHeader',

  render() {
    return (
      <Header>
        <HeaderRow title={this.props.title}>
          <Navigation>
            <a href="">Komponenten</a>
            <a href="">Netzwerk</a>
          </Navigation>
          <Textfield
            value=""
            onChange={() => {}}
            label="Search"
            expandable
            expandableIcon="search"
          />
        </HeaderRow>
      </Header>
    );
  }
});

export default AppHeader;
