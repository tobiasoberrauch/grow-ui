import React from 'react';
import {Card, CardTitle} from 'material-ui';
import GridItem from './GridItem';

export default React.createClass({
  propTypes: {
    selectedGenerator: React.PropTypes.object,
    items: React.PropTypes.array,
    itemSelected: React.PropTypes.func
  },

  render: function () {
    const {items} = this.props;

    if (!(items && items.length)) {
      return (
        <Card>
          <CardTitle
            title="No installed items found!"
            subtitle="Please install at least one generator to continue."/>
        </Card>
      );
    }

    const gridItems = items.map(item => {
      return (
        <GridItem
          key={item.name}
          name={item.name}
          version={item.version}
          active={item.name === this.props.selectedGenerator.name}
          enabled={!this.props.selectedGenerator.name}
          isCompatible={item.isCompatible}
          gridItemSelected={this.props.itemSelected}/>
      );
    });

    const gridStyle = {
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'space-around'
    };

    return (
      <div style={gridStyle}>
        {gridItems}
      </div>
    );
  }
});
