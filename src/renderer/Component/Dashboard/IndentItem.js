import React from 'react';
import CasualFashionService from '../../CasualFashion/CasualFashionService';
import {Table, TableHeader} from '../DataTable';

export default React.createClass({
  getInitialState: function () {
    return {
      indents: []
    };
  },

  componentWillMount () {
    this.casualFashionService = new CasualFashionService();
  },
  componentDidMount () {
    this.casualFashionService.getIndents((err, indents) => {
      this.setState({
        indents: indents.filter(indent => indent.paymentmethod_name == "Paypal")
      });
    });
  },


  render() {
    return (
      <div>
        <h3>Aufträge</h3>
        <Table sortable rowKeyColumn="id" shadow={0} rows={this.state.indents}>
          <TableHeader name="customername" tooltip="The amazing material name">Kunde</TableHeader>
          <TableHeader name="indentstatus_name" tooltip="">Status</TableHeader>
          <TableHeader name="paymentmethod_name" tooltip="The amazing material name">Zahlungsart</TableHeader>
          <TableHeader name="sumtotal" tooltip="The amazing material name">Gesamt</TableHeader>
        </Table>
      </div>
    );
  }
});
