import React, { Component } from 'react';
import TeamForm from '../teams/TeamForm.jsx';
import PageTitle from '../../shared/styles/PageTitle.jsx';
import axios from 'axios';
import TeamService from '../../modules/team/TeamServices.js';

class TeamFormPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dispatched: false,
      record: '',
      IDs: '',
    };
    this.getAllCategoriesIDWithName();
    this.getAllSponsorsEmail();
  }

  async componentDidMount() {
    const { match } = this.props;

    if (this.isEditing()) {
      const record = await TeamService.find(this.props.match.params.team);
      this.setState({ record: record });
    }

    const IDs = await TeamService.findTeamName();
    this.setState({ IDs: IDs });

    this.setState({ dispatched: true });
  }

  getAllCategoriesIDWithName = async () => {
    let res = await axios.get('http://localhost:4000/api/getAllCategoriesIDWithName');
    if (res.data) {
      await this.setState({ team_category_options: res.data });
    }
  };

  getAllSponsorsEmail = async () => {
    let res = await axios.get('http://localhost:4000/api/getAllSponsorsEmail');
    if (res.data) {
      await this.setState({ sponsors_email: res.data });
    }
  };

  isEditing = () => {
    const { match } = this.props;
    return !!match.params.team;
  };

  title = () => {
    return this.isEditing() ? 'Edit Team' : 'New Team';
  };

  render() {
    return (
      <React.Fragment>
        <PageTitle>{this.title()}</PageTitle>
        {this.state.dispatched && (
          <TeamForm
            record={this.state.record}
            isEditing={this.isEditing()}
            onCancel={() => this.props.history.push('/admin/team')}
            team_category_options={this.state.team_category_options}
            sponsors_email={this.state.sponsors_email}
            ID={this.state.IDs}
          />
        )}
      </React.Fragment>
    );
  }
}

export default TeamFormPage;
