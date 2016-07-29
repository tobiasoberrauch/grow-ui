import React from 'react';
import {connect} from 'react-redux';
import {Content} from 'react-mdl';
import {bindActionCreators} from 'redux';
import Grid from '../components/Grid';
import * as GridActions from '../actions/grid-actions';

const AppContent = React.createClass({
  displayName: 'AppContent',

  render() {
    const {generators, generator, gridActions} = this.props;
    
    return (
      <Content>
        <Grid
          items={generators}
          selectedItem={generator.selectedGenerator}
          onItemSelect={gridActions.gridItemSelected}/>
      </Content>
    );
  }
});

let mapStateToProps = function (state) {
  return {
    generators: state.generator.generators,
    generator: state.generator,
    selectedFolder: state.prompt
  };
};
let mapDispatchToProps = function (dispatch) {
  return {
    gridActions: bindActionCreators(GridActions, dispatch)
  };
};
let mergeProps = function (stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
};
let options = {};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(AppContent);
