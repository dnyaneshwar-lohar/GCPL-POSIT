import React, { Component } from "react";
import { Card,CardBody,Button,Form,FormGroup,Label,Input,NavLink } from "reactstrap";
import "antd/dist/antd.css";
import { message,notification } from "antd";
import { withRouter } from "react-router-dom";
import "../Login/Login.css";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import jwt_decode from "jwt-decode";

message.config({
  top: 120,
  duration: 1,
  maxCount: 1,
  rtl: false,
});

notification.config({
  duration: 2,
  rtl: false,
  top: 56,
});

function validate(mobile_no, password) {
  return {
    mobile_no: mobile_no.length !== 10,
    password: password.length < 6,
  };
}

class PlayerLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile_no: "",
      password: "",
      authenticated: "",
      isChecked: false,
      loggedIn: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.displayLogin = this.displayLogin.bind(this);
    this.keyLogin = this.keyLogin.bind(this);
  }

  componentWillMount() {
    this.id = `toggle_${Math.random().toString().replace(/0\./, "")}`;
  }

  handleChange() {
    this.setState({ isChecked: !this.state.isChecked });
  }

  displayLogin(e) {
    e.preventDefault();
    this.getdata();
  }
  keyLogin(e) {
    e.preventDefault();
    if (e.key === "Enter") {
      if (this.state.password.length == 0) {
        message.error("Please Enter Password");
      } else {
        this.getdata();
      }
    }
  }

  getdata = async () => {
    await fetch("http://localhost:4000/api/playerLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile_no: this.state.mobile_no,
        password: this.state.password,
      }),
    })
      .then(async (response) => await response.json())
      .then(
        async (response) =>
          await this.setState(
            {
              authenticated: response.message,
              token: response.accessToken,
            },
            () => {
              this.playerLoginHandler();
            }
          )
      )
      .catch((err) => console.error(err));
  };

  playerLoginHandler = () => {
    if (this.state.authenticated === "success") {
      if (this.state.token) {
        var decoded = jwt_decode(this.state.token);
        localStorage.setItem("token", this.state.token);
        this.props.updateRole();
        this.props.history.push("/home");
        notification.success({
          message: `Hey ${decoded.userData.first_name}, Welcome back!`,
        });
        this.setState({
          loggedIn: true,
        });
      } else {
        message.error("Already LogggedIn..!Please Logout");
      }
    } else if (this.state.authenticated === "Pending") {
      message.error("Account Verification is pending");
    } else if (this.state.authenticated === "pass_not_match") {
      message.error("Invalid password. Try again");
    } else if (this.state.authenticated === "user_not_found") {
      message.error("User Not Found. Try again");
    }
  };

  handleMobileNoChange = (e) => {
    this.setState({
      mobile_no: e.target.value,
    });
  };

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  render() {
    const { mobile_no, password } = this.state;
    const errors = validate(mobile_no, password);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return (
      <div>
        <div className="container">
          <div className="d-flex justify-content-center">
            <Card className="cardLogin">
              <CardBody>
                <Form className="loginForm">
                  <span className="login-header ml-1 font-weight-bold">
                    SIGN IN
                  </span>
                  <FormGroup className="form__group field">
                    <Input
                      type="input"
                      className="form__field border-top-0 border-left-0 border-right-0"
                      placeholder="Mobile Number"
                      name="mobile_no"
                      onChange={this.handleMobileNoChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup className="form__group field">
                    <Input
                      type="password"
                      className="form__field border-top-0 border-left-0 border-right-0"
                      placeholder="Password"
                      name="password"
                      onChange={this.handlePasswordChange}
                      onKeyUp={this.keyLogin}
                      required
                    />
                  </FormGroup>
                  <FormGroup className="mt-4 remember_me float-left" check>
                    <Label check>
                      <Input
                        onChange={this.handleChange}
                        id={this.id}
                        type="checkbox"
                        checked={this.state.isChecked}
                        style={{ opacity: 9 }}
                      />
                      Remember Me
                    </Label>
                  </FormGroup>
                  <Button
                    className="loginBtn mt-2"
                    onClick={this.displayLogin}
                    disabled={isDisabled}
                  >
                    LOGIN
                  </Button>
                  <Link to="/fp-player" className="forgotpass_link">
                    Forgot Password ?
                  </Link>
                </Form>
              </CardBody>
            </Card>
          </div>
          <div className="text-center mt-2">
            <span className="txt1">Don’t have an account ?</span>
            <Link className="txt2" to="/ownerReg">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(PlayerLogin);
