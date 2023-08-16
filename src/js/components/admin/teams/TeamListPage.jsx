import React, { Component } from 'react';
import TeamListTable from './TeamListTable.jsx'
import TeamListToolbar from './TeamListToolbar.jsx';

class TeamListPage extends Component {
  render() {
    return (
      <React.Fragment>
          <TeamListToolbar />
          <TeamListTable />
      </React.Fragment>
    );
  }
}

export default TeamListPage;