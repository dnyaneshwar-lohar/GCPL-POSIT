import React, { Component } from "react";
import { Textbox, Radiobox, Select } from "react-inputs-validation";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import {
  Modal,
  Row,
  Col,
  Form,
  Card,
  Image,
  Container
} from "react-bootstrap";
import "./Profile.css";
import MessageDialog from "../message_dialog/MessageDialog.jsx";
import jwt_decode from "jwt-decode";
import "antd/dist/antd.css";
import { Alert } from "antd";
import { Redirect, Link } from "react-router-dom";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

var approveStatusAlert;
const phaseOptions = [
  {
    name: "Select Phase",
    id: ""
  },
  {
    name: "Phase1",
    id: "Phase1"
  },
  {
    name: "Phase2",
    id: "Phase2"
  },
  {
    name: "Phase3",
    id: "Phase3"
  },
  {
    name: "Phase4",
    id: "Phase4"
  }
];

const buildingOptions = [
  {
    name: "Building",
    id: ""
  },
  {
    name: "LotusA",
    id: "LotusA"
  },
  {
    name: "LotusB",
    id: "LotusB"
  },
  {
    name: "LotusC",
    id: "LotusC"
  },
  {
    name: "LotusD",
    id: "LotusD"
  }
];

const flatOptions = [
  {
    name: "Flat No",
    id: ""
  },
  {
    name: "101",
    id: "101"
  },
  {
    name: "102",
    id: "102"
  },
  {
    name: "103",
    id: "103"
  },
  {
    name: "104",
    id: "104"
  }
];

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_id: "",
      ownerPhase: "",
      ownerBuilding: "",
      ownerFlat: "",
      ownerFirstname: "",
      playerFirstname:"",
      ownerLastname: "",
      errorFirstname: false,
      errorLastName: false,
      errorPhase: false,
      errorBuilding: false,
      errorFlatNo: false,
      ownerInformation: [],
      ownerAproveStatus: "",
      dialogMessage: "",
      msgType: "",
      showDialog: false,
      validate: "",
      loggedIn: true
    };
  }

  async componentWillMount() {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        var decoded = jwt_decode(token);
        await this.setState({
          token: token,
          account_id: decoded.userData.account_id
        });
      } else {
        this.setState({
          loggedIn: false
        });
      }
    } catch (e) {
      console.log(e);
    }
    this.getPlayerOwner();
  }

  toggleValidating(validate) {
    this.setState({ validate });
  }

  handleWarning = () => {
    var data = [
      this.state.ownerFirstname,
      this.state.ownerLastname,
      this.state.ownerPhase,
      this.state.ownerBuilding,
      this.state.ownerFlat
    ];
    const {
      errorFirstname,
      errorLastName,
      errorPhase,
      errorBuilding,
      errorFlatNo
    } = this.state;
    if (
      !errorFirstname &&
      !errorLastName &&
      !errorFlatNo &&
      !errorPhase &&
      !errorBuilding &&
      JSON.stringify(data) != JSON.stringify(this.state.ownerInformation)
    ) {
      this.setState({ showDialog: true });
    }
  };

  handleOwnerUpdate = () => {
    const date = new Date();
    const stringDate = JSON.stringify(date);
    const valDate = stringDate.slice(1, 11);
    this.toggleValidating(true);
    var status = 0;
    fetch(
      "http://localhost:4000/ownerUpdate?user_first_name=" +
        this.state.ownerFirstname +
        "&user_last_name=" +
        this.state.ownerLastname +
        "&phase_no=" +
        this.state.ownerPhase +
        "&building_no=" +
        this.state.ownerBuilding +
        "&flat_no=" +
        this.state.ownerFlat +
        "&approve_status=" +
        parseInt(status) +
        "&account_id=" +
        this.state.account_id +
        "&update_date=" +
        valDate
    ).
    then(

      fetch(
        "http://localhost:4000/ownerUpdateAtAdmin?player_first_name=" +
        this.state.playerFirstname +
          "&account_id=" +
          this.state.account_id +
         "&user_first_name=" +
        this.state.ownerFirstname +
        "&user_last_name=" +
        this.state.ownerLastname 
          
      )
    );
  };

  handleCancle = () => {
    this.getPlayerOwner();
    this.setState({ showDialog: false });
  };

  getPlayerOwner = () => {
    fetch(
      "http://localhost:4000/getCurrentOwner?account_id=" +
      this.state.account_id
    )
      .then(response => response.json())
      .then(findresponse => {
        this.setState({
          ownerInformation: findresponse.data
        });
        this.state.ownerInformation.map(owner => {
          this.setState({
            ownerPhase: owner.phase_no,
            ownerBuilding: owner.building_no,
            ownerFlat: owner.flat_no,
            ownerFirstname: owner.user_first_name,
            playerFirstname:owner.user_first_name,
            ownerLastname: owner.user_last_name,
            ownerAproveStatus: owner.approve_status
          });
        });
        this.setState({
          ownerInformation: [
            this.state.ownerFirstname,
            this.state.ownerLastname,
            this.state.ownerPhase,
            this.state.ownerBuilding,
            this.state.ownerFlat
          ]
        });
      });
  };

  render() {
    if (this.state.showDialog) {
      var showMessage = (
        <MessageDialog
          dialogMessage="account status will become pending until admin approves it and you will be logged out immediately"
          messageType="warning"
          handleOk={this.handleOwnerUpdate}
          handleCancle={this.handleCancle}
          logout={this.props.handleLogout}
        />
      );
    }
    if (this.state.loggedIn === false) {
      return <Redirect to="/login" />;
    }
    if (this.state.ownerAproveStatus) {
      approveStatusAlert = (
        <Alert
          className="statusMsg"
          description=" Your account is approved by Admin !"
          type="success"
          showIcon
        />
      );
    }
    const {
      ownerFirstname,
      ownerLastname,
      ownerPhase,
      ownerBuilding,
      ownerFlat,
      validate,
      ownerAproveStatus
    } = this.state;
    return (
      <div>
        <div className="container-fluid profileDiv ">
          <Link to={`/home`}>
            <Button
              type="primary"
              icon={<LeftOutlined />}
              style={{
                marginBottom: 15,
                marginLeft: 20,
                marginTop: 20
              }}
            >
              {'Home'}
            </Button>
          </Link>
          <center>
            <h4 className="profileTitle">Owner Profile</h4>
            <hr className="horizontalLine"></hr>
            <Card className="profilecard">
              <Card.Body>
                <form className="regForm">
                  <div className="form-group">
                    <Row>
                      <Col lg="4">
                        <strong>
                          <label className="formLabel">First Name :</label>
                        </strong>
                      </Col>
                      <Col lg="8">
                        <Textbox
                          attributesInput={{
                            name: "ownerFirstname",
                            className: "form-control profile_label",
                            placeholder: "First Name",
                            type: "text"
                          }}
                          value={
                            ownerFirstname.charAt(0).toUpperCase() +
                            ownerFirstname.slice(1).toLowerCase()
                          }
                          onChange={(ownerFirstname, e) => {
                            this.setState({ ownerFirstname });
                          }}
                          onBlur={e => { }}
                          validate={validate}
                          validationCallback={res =>
                            this.setState({
                              errorFirstname: res,
                              validate: false
                            })
                          }
                          validationOption={{
                            className: "form-control",
                            name: "First Name",
                            reg: /^[a-zA-Z]*$/,
                            check: true,
                            required: true
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="form-group">
                    <Row>
                      <Col lg="4">
                        <strong>
                          <label className="formLabel">Last Name :</label>
                        </strong>
                      </Col>
                      <Col lg="8">
                        <Textbox
                          attributesInput={{
                            name: "Last name",
                            className: "form-control profile_label",
                            placeholder: "Last Name",
                            type: "text"
                          }}
                          value={
                            ownerLastname.charAt(0).toUpperCase() +
                            ownerLastname.slice(1).toLowerCase()
                          }
                          onChange={(ownerLastname, e) => {
                            this.setState({ ownerLastname });
                          }}
                          onBlur={e => { }}
                          validate={validate}
                          validationCallback={res =>
                            this.setState({
                              errorLastName: res,
                              validate: false
                            })
                          }
                          validationOption={{
                            className: "form-control",
                            name: "Last Name",
                            reg: /^[a-zA-Z]*$/,
                            check: true,
                            required: true
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="form-group">
                    <Row>
                      <Col lg="4">
                        <strong>
                          <label className="formLabel">Phase No :</label>
                        </strong>
                      </Col>
                      <Col lg="8">
                        <Select
                          attributesWrapper={{}}
                          attributesInput={{
                            id: "ownerPhase",
                            name: "ownerPhase"
                          }}
                          value={ownerPhase}
                          disabled={false}
                          showSearch={true}
                          optionList={phaseOptions}
                          onChange={(res, e) => {
                            this.setState({ ownerPhase: res.id });
                          }}
                          onBlur={() => { }}
                          validate={validate}
                          validationCallback={res =>
                            this.setState({ errorPhase: res, validate: false })
                          }
                          validationOption={{
                            name: "Phase Name",
                            check: true,
                            required: true
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="form-group">
                    <Row>
                      <Col sm="4">
                        <strong>
                          <label className="formLabel">Building No :</label>
                        </strong>
                      </Col>
                      <Col lg="8">
                        <Select
                          attributesWrapper={{}}
                          attributesInput={{
                            id: "ownerBuilding",
                            name: "ownerBuilding"
                          }}
                          value={ownerBuilding}
                          disabled={false}
                          showSearch={true}
                          optionList={buildingOptions}
                          onChange={(res, e) => {
                            this.setState({ ownerBuilding: res.id });
                          }}
                          onBlur={() => { }}
                          validate={validate}
                          validationCallback={res =>
                            this.setState({
                              errorBuilding: res,
                              validate: false
                            })
                          }
                          validationOption={{
                            name: "Building Name",
                            check: true,
                            required: true
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="form-group">
                    <Row>
                      <Col sm="4">
                        <strong>
                          <label className="formLabel">Flat No :</label>
                        </strong>
                      </Col>
                      <Col lg="8">
                        <Select
                          attributesWrapper={{}}
                          attributesInput={{
                            id: "ownerFlat",
                            name: "ownerFlat"
                          }}
                          value={ownerFlat}
                          disabled={false}
                          showSearch={true}
                          optionList={flatOptions}
                          onChange={(res, e) => {
                            this.setState({ ownerFlat: res.id });
                          }}
                          onBlur={() => { }}
                          validate={validate}
                          validationCallback={res =>
                            this.setState({ errorFlatNo: res, validate: false })
                          }
                          validationOption={{
                            name: "Flat Number",
                            check: true,
                            required: true
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Button
                      className="registrationBtn"
                      onClick={this.handleWarning}
                    >
                      Update
                    </Button>
                  </div>
                  <div>{approveStatusAlert}</div>
                </form>
              </Card.Body>
            </Card>
          </center>
        </div>
        <div>{showMessage}</div>
      </div>
    );
  }
}

export default Profile;
