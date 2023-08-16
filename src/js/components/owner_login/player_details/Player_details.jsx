import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Modal, Col, Row } from "../../../../../node_modules/react-bootstrap";
import { Table, Tag, Button, Popconfirm, Tooltip, Spin, Divider } from "antd";
import { DeleteTwoTone } from '@ant-design/icons';
import { Textbox, Select } from "react-inputs-validation";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import MessageDialog from "../message_dialog/MessageDialog.jsx";
import { Redirect } from "react-router-dom";
import "./Player_details.css";
import jwt_decode from "jwt-decode";
import axios from "axios";
import moment from "moment";

const t_shirt_size = [
  {
    name: "T-shirt size",
    id: "",
  },
  {
    name: "32",
    id: "32",
  },
  {
    name: "34",
    id: "34",
  },
  {
    name: "36",
    id: "36",
  },
  {
    name: "38",
    id: "38",
  },
  {
    name: "40",
    id: "40",
  },
  {
    name: "42",
    id: "42",
  },
  {
    name: "44",
    id: "44",
  },
];

const date = new Date();
const stringDate = JSON.stringify(date);
const valDate = stringDate.slice(1, 11);

class Player_details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_id: "",
      player_id: "",
      allRegisteredPlayers: [],
      category_id: "",
      fees: "",
      memberRegModal: false,
      shirtSize: "",
      flag: 0,
      errorShirtSize: "false",
      game_id: "CRI",
      validate: "",
      showDialog: false,
      loggedIn: true,
      dialogMessage: "",
      messageType: "",
      registration_id: "",
      tournament_id: "",
      tournament_name: "",
      tournaments: [],
      tournament_StartDate: "",
      tournament_EndDate: "",
      owner_player_id: ""
    };
    this.handlePlayerRegister = this.handlePlayerRegister.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  async componentDidMount() {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        var decoded = jwt_decode(token);
        await this.setState({
          token: token,
          account_id: decoded.userData.account_id,
        });
      } else {
        this.setState({
          loggedIn: false,
        });
      }
    } catch (e) {
      console.log(e);
    }
    this.fetchTournament();
    this.getAccountMasterPlayerId();
  }

  onHide = () => {
    this.setState({ memberRegModal: false });
  };

  handleErrorOk = () => {
    this.setState({ showDialog: false });
  };

  handleUpdate = () => {
    this.setState({ showDialog: false });
    this.props.getPlayerDetails();
  };

  showModal = () => {
    this.setState({ memberRegModal: true });
  };

  doCancelReg = () => {
    fetch(
      "http://localhost:4000/doCancelReg?registration_id=" +
        this.state.registration_id
    ).then((response) => this.props.getPlayerDetails());
  };

  deletePlayer = async (id) => {
    await fetch(
      "http://localhost:4000/doDeletePlayer?player_id=" + id
    ).then(response => this.props.getPlayerDetails());
  };

  toggleValidating(validate) {
    this.setState({ validate });
  }

  handlePlayerRegister = () => {
    const { errorShirtSize } = this.state;
    if (this.state.category_id == "NA") {
      this.setState({ memberRegModal: false });
      this.setState({ shirtSize: "" });
      this.setState({
        dialogMessage: "You does not belongs to any active category",
        messageType: "negative",
      });
      this.setState({ showDialog: true });
    } else {
      this.toggleValidating(true);

      if (!errorShirtSize) {
        fetch("http://localhost:4000/confirmPlayerRegister", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playerRegDetails: {
              tournament_year: new Date().getFullYear(),
              registration_date: valDate,
              player_id: this.state.player_id,
              category_id: this.state.category_id,
              t_shirt_size: this.state.shirtSize,
              participation_fees: this.state.fees,
              approve_status: 0,
              game_id: this.state.game_id,
              verify_date: null,
              verify_by: null,
              tournament_id: this.state.tournament_id,
            },
          }),
        });
        this.setState({ memberRegModal: false });
        this.setState({
          dialogMessage: "Player registration Successfull.",
          messageType: "positive",
        });
        this.setState({ showDialog: true });
        this.setState({ shirtSize: "" });
      }
    }
  };

  fetchTournament = () => {
    fetch("http://localhost:4000/fetchTournament")
      .then(response => response.json())
      .then(findresponse => {
        this.setState({ tournaments: findresponse.data });
      })
      .then(findresponse => {
        this.state.tournaments.map((tournament,index) => {
          this.setState({tournament_id: tournament.tournament_id});
          this.setState({tournament_name: tournament.tournament_name});
          this.setState({tournament_StartDate: moment(tournament.StartDate).subtract(1,'month').format('YYYY-MM-DD')});
          this.setState({tournament_EndDate: moment(tournament.StartDate).format('YYYY-MM-DD')});
        });
      });
  };

  getAccountMasterPlayerId = () => {
    fetch(
      "http://localhost:4000/getAccountMasterPlayerId?account_id=" + this.state.account_id
    )
    .then(async (response) => await response.json())
    .then(
      async (response) =>
        await this.setState(
          {
            owner_player_id: response.owner_player_id
          }
        )
    )
  }

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/login" />;
    }

    if (this.state.showDialog) {
      var message = (
        <MessageDialog
          dialogMessage={this.state.dialogMessage}
          messageType={this.state.messageType}
          handleUpdate={this.handleUpdate}
          handleErrorOk={this.handleErrorOk}
        />
      );
    }

    let tooltip_msg;
    let tooltip_color;
    if (
      this.state.tournament_EndDate == "" &&
      this.state.tournament_StartDate == ""
    ) {
      tooltip_msg = "No ongoing tournament";
      tooltip_color = "red";
    } else {
      if (this.state.tournament_EndDate <= valDate) {
        tooltip_msg = "Registrations are closed";
        tooltip_color = "red";
      }
      else if (this.state.tournament_StartDate > valDate) {
        tooltip_msg = "Registrations starts from "+ moment(this.state.tournament_StartDate).format('DD MMM YYYY');
        tooltip_color = "green";
      }
    }

    const columns = [
      {
        title: "Photo",
        dataIndex: "player_photo",
        key: "player_photo",
        align: 'center',
        render: (player_photo) => {
           const image = Buffer.from(player_photo, "utf8");
           return image.length <=15 ? <Tag color={"red"}>NA</Tag> : <img src={image} width="100px" height="100px" alt="No image"/>;
        }
      },
      {
        title: "First Name",
        dataIndex: "player_first_name",
        key: "player_first_name",
        align: 'center'
      },
      {
        title: "Last Name",
        dataIndex: "player_last_name",
        key: "player_last_name",
        align: 'center'
      },
      {
        title: "Mobile No",
        dataIndex: "mobile_no",
        key: "mobile_no",
        align: 'center'
      },
      {
        title: "Birth Year",
        dataIndex: "birth_year",
        key: "birth_year",
        align: 'center'
      },
      {
        title: "Category",
        dataIndex: "category_name",
        key: "category_name",
        align: 'center',
        render: (record) => {
          return record != 'NA' ? record : <Tag color color={"red"}>NA</Tag>;
        }
      },
      {
        title: "Fees",
        dataIndex: "fees",
        key: "fees",
        align: 'center',
        render: (record) => {
          return record != 'NA' ? record : <Tag color={"red"}>NA</Tag>;
        }
      },
      {
        title: "Tournament year",
        dataIndex: "tournament_year",
        key: "tournament_year",
        align: 'center',
        render: tournament_year => <a>{new Date().getFullYear()}</a>
      },
      {
        title: "T-Shirt size",
        dataIndex: "t_shirt_size",
        key: "t_shirt_size",
        align: 'center',
        render: (record) => {
          return record != 'NA' ? record : <Tag color={"red"}>NA</Tag>;
        }
      },
      {
        title: "Registration No",
        dataIndex: "registration_no",
        key: "registration_no",
        align: 'center',
        render: (record) => {
          return record != 'NA' ? record : <Tag color={"red"}>NA</Tag>;
        }
      },
      {
        title: "Approve Status",
        dataIndex: "approve_status",
        key: "approve_status",
        align: 'center',
        render: approve_status => {
          let color;
          let status;
          if (approve_status == 1 || approve_status == 0) {
            color = approve_status == 1 ? "green" : "volcano";
            status = approve_status == 1 ? "Approved" : "Pending";
          } else {
            color = "red";
            status = "NA";
          }
          return (
            <Tag color={color} key={approve_status}>
              {status}
            </Tag>
          );
        },
      },
      {
        title: "Actions",
        dataIndex: "action",
        key: "action",
        render: (text, record) => {
          if (record.registration_no == "NA") {
            return (
              <div>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  this.setState({ memberRegModal: true });
                  this.setState({ first_name: record.player_first_name });
                  this.setState({ last_name: record.player_last_name });
                  this.setState({ gender: record.gender });
                  this.setState({ mobile_no: record.mobile_no });
                  this.setState({ birth_year: record.birth_year });
                  this.setState({ category_id: record.category_id });
                  this.setState({ fees: record.fees });
                  this.setState({ player_id: record.player_id });
                }}
              >
                Register
              </Button>
              <Divider type="vertical" />
              {
                this.state.owner_player_id == record.player_id ? null
                :
                <Popconfirm
                  title="Are you sure"
                  onConfirm={() => {
                    this.deletePlayer(record.player_id);
                  }}
                  okText="Yes"
                  cancelText="NO"
                  onCancel={() => {}}
                >
                    <Button type="danger" size="small">
                      Delete
                    </Button>
                </Popconfirm>
              }
              </div>
            );

          } else {
            let status;
            if (record.approve_status == 0) {
              return (
                <Popconfirm
                  title="Are you sure cancel registration?"
                  onConfirm={() => {
                    this.doCancelReg();
                  }}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="danger"
                    size="small"
                    onClick={() => {
                      this.setState({
                        registration_id: record.registration_id,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Popconfirm>
              );
            } else {
              return (
                <Tooltip color="green" title="Registration is approved">
                  <Button type="danger" disabled size="small">
                    Cancel
                  </Button>
                </Tooltip>
              );
            }
          }
        },
      },
    ];

    const { shirtSize, errorShirtSize, validate } = this.state;

    return (
      <div>
        {message}
        <div>
          {(this.props.loading) ? <Spin className = "loading"/> : <Table
            rowKey="player_id"
            className="family_table"
            columns={columns}
            dataSource={this.props.allPlayers}
            scroll={{ y: true }}
            scroll={{ x: true }}
            pagination={{ pageSize: 5 }}
          ></Table> }
        </div>
        <div>
          <Modal
            className="modalRegister"
            show={this.state.memberRegModal}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={this.showModal}
          >
            <Modal.Body>
              <button type="button" className="close" onClick={this.onHide}>
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
              <center>
                <h5>Registration Details</h5>
              </center>
              <div className="form-group">
                <Row>
                  <Col lg="4">
                    <label className="formInput">Tournament:</label>
                  </Col>
                  <Col lg="8">
                    {this.state.tournaments == "" ? (
                      <Tag color="volcano">No ongoing tournament</Tag>
                    ) : (
                      <Tag color="green">{this.state.tournament_name}</Tag>
                    )}
                  </Col>
                </Row>
              </div>
              <div className="form-group">
                <Row>
                  <Col lg="4">
                    <label className="formInput">Date :</label>
                  </Col>
                  <Col lg="8">
                    <Textbox
                      attributesInput={{
                        name: "today",
                        className: "form-control registration_input",
                        type: "text",
                      }}
                      value={valDate}
                      disabled={true}
                    />
                  </Col>
                </Row>
              </div>
              <div className="form-group">
                <Row>
                  <Col sm="4">
                    <label className="formInput">T-Shirt size :</label>
                  </Col>
                  <Col lg="8">
                    <Select
                      attributesWrapper={{}}
                      attributesInput={{
                        id: "shirtSize",
                        name: "shirtSize",
                      }}
                      value={shirtSize}
                      disabled={false}
                      showSearch={true}
                      optionList={t_shirt_size}
                      onChange={(res, e) => {
                        this.setState({ shirtSize: res.id });
                      }}
                      onBlur={() => {}}
                      validate={validate}
                      validationCallback={(res) =>
                        this.setState({ errorShirtSize: res, validate: false })
                      }
                      validationOption={{
                        name: "T-shirt size",
                        check: true,
                        required: true,
                      }}
                    />
                  </Col>
                </Row>
              </div>
              <form className="regForm">
                {this.state.tournament_EndDate > valDate &&
                this.state.tournament_StartDate <= valDate ? (
                  <Button
                    className="Confirm_button"
                    type="primary"
                    onClick={this.handlePlayerRegister}
                  >
                    Confirm Registration
                  </Button>
                ) : (
                  <Tooltip color={tooltip_color} title={tooltip_msg}>
                    <span className="tooltip_span">
                      <Button
                        className="Confirm_button_disabled"
                        type="default"
                        disabled
                      >
                        Confirm Registration
                      </Button>
                    </span>
                  </Tooltip>
                )}
              </form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}
export default Player_details;
