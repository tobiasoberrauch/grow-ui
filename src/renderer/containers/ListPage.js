import React from 'react';
import Grid from '../components/grid.jsx';
import * as GridActions from '../actions/grid-actions';

export default class ListPage extends React.Component {


  render() {
    const { dispatch, generator, selectedFolder } = this.props;
    const {} = generator;

    const gridActions = bindActionCreators(GridActions, dispatch);

    return (
      <Grid
        selectedGenerator={selectedGenerator}
        generators={generators}
        gridItemSelected={gridActions.gridItemSelected}/>
    );
  }
}
