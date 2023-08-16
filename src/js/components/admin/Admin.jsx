import React, { Component } from "react";
import Sidenav from "./sidenav/Sidenav.jsx";
import { Redirect } from "react-router-dom";
import axios from "axios";   
import jwt_decode from 'jwt-decode';    

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
    };
  }

  verifyToken = async (token) => {
    let res = await axios.post("http://localhost:4000/api/verifyToken", {
      accessToken: token,
    });
    if (res.data.verify === false) {
      this.props.handleLogout();
      return <Redirect to="/login" />;
    }
  };

  componentWillMount() {
    const token = localStorage.getItem("token");
    var decoded = jwt_decode(token);
    if (decoded.userData.email_id == window.Credentials.ADMIN_EMAIL && process.env.AUTHENTICATION == "ON") {
      this.setState({
        loggedIn: false,
      });
      this.props.handleLogout();

    }
    if (token == null || this.props.role === "player") {
      this.setState({
        loggedIn: false,
      });
    }
    this.verifyToken(token);
  }

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="wrapper">
        <Sidenav />
      </div>
    );
  }
}

export default Admin;
