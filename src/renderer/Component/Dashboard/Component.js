import React from 'react';
import CronjobItem from './CronjobItem';
import IndentItem from './IndentItem';
import {Cell, Grid} from 'react-mdl';

export default React.createClass({
  render() {
    return (
      <Grid>
        <Cell col={6}><CronjobItem /></Cell>
        <Cell col={6}><IndentItem /></Cell>
      </Grid>
    );
  }
});
