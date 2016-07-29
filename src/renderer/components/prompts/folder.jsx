import React, {PropTypes} from 'react';
import {Button} from 'react-mdl';
import PromptMixin from './prompt-mixin';
import Container from '../prompt-form/container';
import Label from '../prompt-form/label';
import styles from '../../styles/components/prompts/folder';

export default React.createClass({
  displayName: 'FolderPrompt',

  propTypes: {
    selectedFolder: PropTypes.string,
    selectFolder: PropTypes.func
  },

  mixins: [PromptMixin],

  _onClick: function (e) {
    this.props.selectFolder();
    e.preventDefault();
  },

  render: function () {

    const isEmpty = !!this.props.selectedFolder;

    return (
      <Container>
        <Label
          message={this.props.message}
          color={this.props.color}
        />
        <div className="prompt-elements">
          <Button
            raised
            style={styles.button}
            primary={!!isEmpty}
            onClick={this._onClick}
          >Select a folder</Button>
          <span style={styles.display}>{this.props.selectedFolder}</span>
        </div>
      </Container>
    );
  }
});
