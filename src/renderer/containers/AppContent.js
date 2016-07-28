import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Grid from '../components/Grid';
import Loader from '../components/Loader';
import PromptForm from '../components/prompt-form/index.jsx';
import * as GridActions from '../actions/grid-actions';
import * as PromptFormActions from '../actions/prompt-form-actions';

const AppContent = React.createClass({
  displayName: 'AppContent',

  render() {
    const {generators, generator, gridActions, selectedFolder} = this.props;
    const {selectedGenerator, actualFormType, questions, isLoading} = generator;

    const promptContainerStyle = {
      display: selectedGenerator.name ? 'block' : 'none',
      paddingTop: '56px'
    };

    const gridStyle = {
      display: selectedGenerator.name ? 'none' : 'block',
      paddingTop: '76px'
    };

    return (
      <section>
        <div className="content" style={gridStyle}>
          <Grid
            selectedGenerator={selectedGenerator}
            items={generators}
            itemSelected={gridActions.gridItemSelected}/>
        </div>
        <div className="content" style={promptContainerStyle}>
          <Loader isLoading={isLoading}/>
          <PromptForm
            generator={selectedGenerator}
            questions={questions}
            type={actualFormType}
            selectedFolder={selectedFolder}
            selectFolder={PromptFormActions.selectFolder}
            submitSelectedFolder={PromptFormActions.submitSelectedFolder}
            submitForm={PromptFormActions.submitForm}
          />
        </div>
      </section>
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
