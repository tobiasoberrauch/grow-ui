import {sample} from 'lodash';
import React, {PropTypes} from 'react';
import {Card, CardMenu, CardTitle, CardActions, Button, CardText, IconButton} from 'react-mdl';
import {humanizeEventName as humanize} from 'underscore-plus';
import insight from '../utils/insight.js';
import GetComponentStyle from './mixins/get-component-style';

function getFormattedName(name) {
  return humanize(name.replace('generator-', ''));
}

export default React.createClass({
  propTypes: {
    name: PropTypes.string,
    version: PropTypes.string,
    active: PropTypes.bool,
    enabled: PropTypes.bool,
    isCompatible: PropTypes.bool,
    onItemSelect: PropTypes.func,
    description: PropTypes.string
  },

  getInitialState: () => {
    return {};
  },

  mixins: [GetComponentStyle],

  onClick: () => {
    const {name, version, isCompatible, onItemSelect} = this.props;

    const itemName = name.replace('generator-', '');
    const actionName = `run-${itemName}-${version}`;
    insight.sendEvent('generator', actionName, `Run ${itemName} in version ${version}`);

    onItemSelect({name, isCompatible});

    document.body.scrollTop = 0;
  },

  onMouseOver: () => {
    this.setState({});
  },

  onMouseOut: () => {
    this.setState({});
  },

  getCardMenu: () => {
    return (
      <CardMenu style={{color: '#fff'}}>
        <IconButton name="share"/>
        <IconButton name="event"/>
      </CardMenu>
    );
  },

  getCardActions: () => {
    const actions = [{
      label: 'Installieren',
      callback: () => {
        console.log('install', arguments);
      }
    }, {
      label: 'Details',
      callback: () => {
        console.log('install', arguments);
      }
    }];
    if (actions.length === 0) {
      return '';
    }

    let cardActions = actions.map(action => {
      return <Button onClick="action.callback">{action.label}</Button>;
    });

    return <CardActions border>{cardActions}</CardActions>;
  },

  render: function () {
    const {description, name} = this.props;

    const cardStyles = {
      //pointerEvents: 'none',
      cursor: 'default'
    };

    const cardTitle = getFormattedName(name);
    const cardTitleStyles = {
      background: `rgb(63,81,181) url(img/generator-angular.png) center / cover`,
      height: '150px'
    };

    return (
      <Card
        style={cardStyles}
        shadow={2}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onClick={this.onClick}>
        <CardTitle style={cardTitleStyles}>{cardTitle}</CardTitle>
        <CardText>{description}</CardText>
        {this.getCardActions()}
        {this.getCardMenu()}
      </Card>
    );
  }
});
