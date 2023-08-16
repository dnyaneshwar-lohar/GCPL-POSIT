import React, { Component } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Modal, Row, Col, Form } from "react-bootstrap";
import { Button } from "antd";
import ReactDOM from "react-dom";
import "../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Owner_login.css";
import RegForm from "../registration_form/Registration_form.jsx";
import Player from "../player_details/Player_details.jsx";
import jwt_decode from "jwt-decode";
import { Redirect, Link } from "react-router-dom";

class Owner_login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_id: "",
      addMemberModal: false,
      loggedIn: true,
      registrationTable: [],
      allPlayers: [],
      categoryTable: [],
      category_name: "NA",
      category_id: "NA",
      fees: "NA",
      shirtSizeTable: "NA",
      approve_status: "NA",
      registration_No: "NA",
      registration_id: "NA",
      loading: true
    };
    this.getPlayerDetails = this.getPlayerDetails.bind(this);
  }

  async componentDidMount() {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        var decoded = jwt_decode(token);
        await this.setState({
          token: token,
          account_id: decoded.userData.account_id
        });
        this.getPlayerDetails();
      } else {
        this.setState({
          loggedIn: false
        });
      }
    } catch (e) {
      console.log(e);
    }
    this.getPlayerDetails();
  }

  showModal = () => {
    this.setState({ addMemberModal: true });
  };
  onHide = () => {
    this.setState({ addMemberModal: false });
  };

  getPlayerDetails = () => {
    fetch(
      "http://localhost:4000/allPlayers?account_id=" + this.state.account_id
    )
      .then(response => response.json())
      .then(findresponse => {
        this.setState({ loading: true });
        this.setState({
          allPlayers: findresponse.data
        });
        this.setPlayerCategory();
        this.setShirtSize();
      });
  };

  setPlayerCategory = () => {
    fetch("http://localhost:4000/playerCategory")
      .then(response => response.json())
      .then(findresponse => {
        this.setState({ categoryTable: findresponse.data });
      })
      .then(findresponse => {
        this.state.allPlayers.map((player, index) => {
          var currentYear = new Date().getFullYear();
          var age = currentYear - parseInt(player.birth_year);
          this.state.categoryTable.map((category, index) => {
            if (
              player.gender == category.category_gender &&
              age >= category.min_age &&
              age <= category.max_age &&
              category.is_active == 1
            ) {
              this.setState({ category_name: category.category_name });
              this.setState({ category_id: category.category_id });
              this.setState({ fees: category.participation_fees });
              return false;
            }
          });

          var oldValue = {
            ...this.state.allPlayers[index]
          };
          oldValue.category_name = this.state.category_name;
          oldValue.category_id = this.state.category_id;
          oldValue.fees = this.state.fees;
          var newValue = [...this.state.allPlayers];
          newValue[index] = oldValue;
          this.setState({ allPlayers: newValue });
          this.setState({ category_name: "NA" });
          this.setState({ category_id: "NA" });
          this.setState({ fees: "NA" });
        });
      });
  };

  setShirtSize = () => {
    fetch(
      "http://localhost:4000/getRegistrationData?account_id=" +
      this.state.account_id +
      "&tournament_year=" +
      new Date().getFullYear()
    )
      .then(response => response.json())
      .then(findresponse => {
        this.setState({ registrationTable: findresponse.data });
      })
      .then(findresponse => {
        this.state.allPlayers.map((player, index) => {
          this.state.registrationTable.map((regDetails, index) => {
            if (player.player_id == regDetails.player_id) {
              this.setState({ shirtSizeTable: regDetails.t_shirt_size });
              this.setState({ approve_status: regDetails.approve_status });
              this.setState({ registration_id: regDetails.registration_no });
              this.setState({
                registration_No:
                  regDetails.game_id +
                  "/" +
                  regDetails.tournament_year +
                  "/" +
                  player.category_name +
                  "/" +
                  player.player_id
              });
            }
          });
          var oldValue = {
            ...this.state.allPlayers[index]
          };
          oldValue.t_shirt_size = this.state.shirtSizeTable;
          oldValue.registration_no = this.state.registration_No;
          oldValue.approve_status = this.state.approve_status;
          oldValue.registration_id = this.state.registration_id;
          var newValue = [...this.state.allPlayers];
          newValue[index] = oldValue;
          this.setState({ allPlayers: newValue });
          this.setState({ shirtSizeTable: "NA" });
          this.setState({ registration_No: "NA" });
          this.setState({ approve_status: "NA" });
          this.setState({ registration_id: "NA" });
        });
      })
      .then(findresponse => {
        this.setState({ loading: false });
      });
  };

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/login" />;
    }

    let no = this.state.account_id;
    return (
      <div className="container-fluid">
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
        <div>
          <h4 className="formTitle">Family Member Details</h4>
          <hr />
        </div>
        <div>
          <Modal
            className="modalRegister"
            show={this.state.addMemberModal}
            size="lg"
            onHide={this.showModal}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body>
              <button type="button" className="close" onClick={this.onHide}>
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
              <RegForm
                account_id={this.state.account_id}
                parentMethod={this.onHide}
                getPlayerDetails={this.getPlayerDetails}
              />
            </Modal.Body>
          </Modal>
        </div>
        <div>
          <Player
            getPlayerDetails={this.getPlayerDetails}
            allPlayers={this.state.allPlayers}
            loading={this.state.loading}
          />
        </div>
        <div className="mt-3">
          <center>
            <Button
              onClick={this.showModal}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add New Member
            </Button>
          </center>
        </div>
      </div>
    );
  }
}
export default Owner_login;
