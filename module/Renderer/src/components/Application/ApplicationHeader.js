import React from 'react';
import {Link} from 'react-router';
import {Header, HeaderRow, Navigation, Textfield} from 'react-mdl';

const AppHeader = React.createClass({
  displayName: 'ApplicationHeader',

  render() {
    return (
      <Header>
        <HeaderRow title={this.props.title}>
          <Navigation>
            <Link to="/">Dashboard</Link>
            <Link to="components">Komponenten</Link>
            <Link to="networks">Netzwerk</Link>
            <Link to="store">Store</Link>
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
