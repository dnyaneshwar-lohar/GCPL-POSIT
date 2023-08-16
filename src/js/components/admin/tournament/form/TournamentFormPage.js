import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Image from "../../../shared/assets/sport.jpg";
import { Card, Button, Col, Row } from "antd";
import TournamentFormModal from "./TournamentFormModal";
import Message from "../../../shared/message";
import actions from "../../../modules/tournament/form/tournamentFormAction.js";

class TournamentFormPage extends Component {
  constructor(){
    super();
    this.state = {
      dispatched: false,
      visible: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(actions.doNew());
    this.setState({ dispatched: true });
  }

  handleClick = (e) => {
    this.setState({ visible: true });
  }
  closeModal = () => {
    this.setState({ visible: false });
  }

  render() {
    const twoColumnsResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 12,
      style: { marginBottom: 24 }
    };
    return (
      <React.Fragment>
        <Card
          bodyStyle={{ padding: 35 }}
          cover={<img alt="sport" src={Image} />}
        >
          <h5 className="mb-4"> Create Tournament</h5>
          <Row gutter={24}>
            <Col {...twoColumnsResponsiveProps} align="middle">
              <p>Get started by Creating Tournament</p>
            </Col>
            <Col {...twoColumnsResponsiveProps} align="middle">
              <Button type="primary" shape="round" onClick={this.handleClick}>
                {"Create"}
              </Button>
              <TournamentFormModal
                visible={this.state.visible}
                onCancel={this.closeModal}
                saveLoading={this.props.saveLoading}
                findLoading={this.props.findLoading}
              />
            </Col>
          </Row>
        </Card>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    record: state.tournament.form.record,
    saveLoading: state.tournament.form.saveLoading,
    findLoading: state.tournament.form.findLoading,
  };
}

export default connect(mapStateToProps)(TournamentFormPage);
