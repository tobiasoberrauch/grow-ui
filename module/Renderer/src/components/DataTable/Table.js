import React from 'react';
import classNames from 'classnames';
import clamp from 'clamp';
import makeSelectable from './Selectable';
import makeSortable from './Sortable';


const propTypes = {
  className: React.PropTypes.string,
  rowKeyColumn: React.PropTypes.string,
  rows: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  shadow: React.PropTypes.number
};

class Table extends React.Component {
  renderRow(row, index) {
    const {children, rowKeyColumn} = this.props;
    const columnChildren = React.Children.toArray(children);

    return (
      <tr key={row[rowKeyColumn] || row.key || index} className={row.className}>
        {columnChildren.map((child) => this.renderCell(child.props, row, index))}
      </tr>
    );
  }

  renderCell(column, row, idx) {
    const className = !column.numeric ? 'mdl-data-table__cell--non-numeric' : '';

    return (
      <td key={column.name} className={className}>
        {column.cellFormatter ? column.cellFormatter(row[column.name], row, idx) : row[column.name]}
      </td>
    );
  }

  render() {
    let values = [2, 3, 4, 6, 8, 16, 24];
    let shadows = values.map(v => `mdl-shadow--${v}dp`);

    const {className, shadow, children, rows, ...otherProps} = this.props;
    const shadowLevel = clamp(shadow || 0, 0, shadows.length - 1);
    const classes = classNames('mdl-data-table', {
      [shadows[shadowLevel]]: typeof shadow !== 'undefined'
    }, className);

    let filteredRows = rows.slice(0, 10);
    console.log('filteredRows', filteredRows);


    return (
      <table className={classes} {...otherProps} style={{'white-space': 'normal'}}>
        <thead>
        <tr>{children}</tr>
        </thead>
        <tbody>{filteredRows.map(this.renderRow, this)}</tbody>
      </table>
    );
  }
}

Table.propTypes = propTypes;

export default makeSortable(makeSelectable(Table));
