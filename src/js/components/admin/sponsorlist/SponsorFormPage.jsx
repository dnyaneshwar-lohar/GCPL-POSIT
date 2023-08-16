import React, { Component } from "react";
import SponsorForm from "./SponsorForm.jsx";
import PageTitle from "../../shared/styles/PageTitle.jsx";
import SponsorService from "../../modules/sponsor/SponsorServices";

class SponsorFormPage extends Component {
  constructor(){
    super();
    this.state = {
      dispatched: false,
      record: '',
      IDs: ''
    };
  }

  componentDidMount = async () => {
    const { match } = this.props;

    if (this.isEditing()) {
      const record = await SponsorService.find(this.props.match.params.ID);
      this.setState({record: record});
    } else {
      const IDs = await SponsorService.findEmail();
      this.setState({IDs: IDs});
    }

    this.setState({ dispatched: true });
  }

  isEditing = () => {
    const { match } = this.props;
    return !!match.params.ID;
  };

  title = () => {
    return this.isEditing() ? "Edit Sponsor" : "New Sponsor";
  };

  render() {
    return (
      <React.Fragment>
        <PageTitle>{this.title()}</PageTitle>
        {this.state.dispatched && (
          <SponsorForm
            record={this.state.record}
            isEditing={this.isEditing()}
            onCancel={() => this.props.history.push("/admin/sponsor")}
            ID={this.state.IDs}
          />
        )}
      </React.Fragment>
    );
  }
}

export default SponsorFormPage;
