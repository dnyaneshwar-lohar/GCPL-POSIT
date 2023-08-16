import React, { Component } from "react";
import { Modal, Button } from "antd";
import TournamentForm from "../../tournament/form/TournamentForm";
import actions from "../../../modules/tournament/form/tournamentFormAction.js";
import { connect } from "react-redux";

class TournamentFormModal extends Component {

  doSubmit = data => {
    const { dispatch } = this.props;
    if ( this.isEditing() ) {
      dispatch(actions.doUpdate(data));
      this.Cancel();
    } else {
      dispatch(actions.doCreate(data));
      this.Cancel();
    }
  };

  Cancel = () => {
    this.props.onCancel();
  }

  isEditing = () => {
    const { record } = this.props;
    return !!record;
  };

  title = () => {
    return this.isEditing() ? "Edit Tournament" : "New Tournament";
  };

  render() {
    return (
      <Modal
        title={this.title()}
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        footer={false}
        width="80%"
      >
        <TournamentForm
          onCancel={this.props.onCancel}
          onSubmit={this.doSubmit}
          saveLoading={this.props.saveLoading}
          findLoading={this.props.findLoading}
          isEditing={this.isEditing()}
          record={this.props.record}
        />
      </Modal>
    );
  }
}
export default connect()(TournamentFormModal);
