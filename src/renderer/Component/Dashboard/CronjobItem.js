import React from 'react';
import CasualFashionService from '../../CasualFashion/CasualFashionService';
import {Table, TableHeader} from '../DataTable';

export default React.createClass({
  getInitialState: function () {
    return {
      cronjobs: []
    };
  },

  componentWillMount () {
    this.casualFashionService = new CasualFashionService();
  },
  componentDidMount () {
    this.casualFashionService.getCronjobs((err, cronjobs) => {
      this.setState({
        cronjobs: cronjobs
      });
    });
  },


  render() {
    return (
      <div>
        <h3>Cronjobs</h3>
        <Table sortable rowKeyColumn="id" shadow={0} rows={this.state.cronjobs}>
          <TableHeader name="label" tooltip="The amazing material name">Name</TableHeader>
          <TableHeader name="lastexecution" tooltip="">Letzte Ausführung</TableHeader>
          <TableHeader name="laststatuscode" tooltip="The amazing material name">Status</TableHeader>
        </Table>
      </div>
    );
  }
});
