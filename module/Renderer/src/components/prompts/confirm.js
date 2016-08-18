import React from 'react';
import {Button} from 'react-mdl';
import PromptMixin from '../../mixins/prompt-mixin';
import Container from '../prompt-form/container';
import Label from '../prompt-form/label';
import styles from '../../styles/components/prompts/confirm';

export default React.createClass({
  displayName: 'ConfirmPrompt',

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _onClickNo: function (event) {
    this.setState({
      answer: false
    });
    event.preventDefault();
  },

  _onClickYes: function (event) {
    this.setState({
      answer: true
    });
    event.preventDefault();
  },

  render: function () {

    return (
      <Container>
        <Label message={this.props.message} color={this.props.color}/>
        <div style={styles.options}>
          <Button onClick={this._onClickNo} labelStyle={!this.state.answer && styles.noActive}>No</Button>
          <Button onClick={this._onClickYes} labelStyle={this.state.answer && styles.yesActive}>Yes</Button>
        </div>
      </Container>
    );
  }
});
