import React from 'react';
import {Card, CardTitle, Cell, Grid} from 'react-mdl';
import GridItem from './GridItem';

export default React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    selectedItem: React.PropTypes.object,
    onItemSelect: React.PropTypes.func
  },

  render: function () {
    const {items, onItemSelect, selectedItem} = this.props;

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
        <Cell col={4}>
          <GridItem
            name={item.name}
            description={item.description}
            version={item.version}
            active={item.name === selectedItem.name}
            enabled={!selectedItem.name}
            isCompatible={item.isCompatible}
            onItemSelect={onItemSelect}/>
        </Cell>
      );
    });

    return (
      <Grid>
        {gridItems}
      </Grid>
    );
  }
});
