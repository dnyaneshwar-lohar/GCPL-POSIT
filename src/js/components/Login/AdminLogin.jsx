import React, { Component } from 'react';
import { Card, CardBody, Button, Form, FormGroup, Label, Input, NavLink } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import { message, notification } from "antd";
import '../Login/Login.css';
import { BrowserRouter as Route, Link, Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode";
window.Credentials = {
  AUTHENTICATION: process.env.AUTHENTICATION,
  ADMIN_EMAIL: "admin680@gmail.com",
  USER_ID: 1,
  ROLE: "super_admin",
  ADMIN_FIRSTNAME: "Super_Admin"
}
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

function validate(user_name, password) {
  return {
    user_name: user_name.length === 0,
    password: password.length < 6,
  };
}

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: "",
      password: "",
      isChecked: false,
      authenticated: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.displayLogin = this.displayLogin.bind(this);
    this.keyLogin = this.keyLogin.bind(this);
  }

  componentWillMount() {
    this.id = `toggle_${Math.random().toString().replace(/0\./, "")}`;
  }
  componentDidMount() {
    this.handleDummyLogin()
  }
  handleDummyLogin = () => {
    if (process.env.AUTHENTICATION == "OFF") {
      fetch("http://localhost:4000/api/adminLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Credentials: window.Credentials
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
                this.adminLoginHandler();
              }
            )
        )
        .catch((err) => console.error(err));
    }
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
    await fetch("http://localhost:4000/api/adminLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: this.state.user_name,
        password: this.state.password,
        Credentials:window.Credentials
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
              this.adminLoginHandler();
            }
          )
      )
      .catch((err) => console.error(err));
  };

  adminLoginHandler = () => {
    if (this.state.authenticated === "super-admin") {
      if (this.state.token) {
        var decoded = jwt_decode(this.state.token);
        localStorage.setItem("token", this.state.token);
        this.props.updateRole();
        this.props.history.push("/admin");
        notification.success({
          message: `Hey ${decoded.userData.first_name}, Welcome back!`,
        });
        this.setState({
          loggedIn: true,
        });
      } else {
        message.error("Already LogggedIn..!Please Logout");
      }
    } else if (this.state.authenticated === "admin") {
      if (this.state.token) {
        var decoded = jwt_decode(this.state.token);
        localStorage.setItem("token", this.state.token);
        this.props.updateRole();
        this.props.history.push("/admin");
        notification.success({
          message: `Hey ${decoded.userData.first_name}, Welcome back!`,
        });
        this.setState({
          loggedIn: true,
        });
      } else {
        message.error("Already LogggedIn..!Please Logout");
      }
    } else if (this.state.authenticated === "pass_not_match") {
      message.error("Invalid password. Try again");
    } else if (this.state.authenticated === "Pending") {
      message.error("Account Verification is pending");
    } else if (this.state.authenticated === "user_not_found") {
      message.error("Admin not found.Try again");
    }
  };

  handleUserNameChange = (e) => {
    this.setState({
      user_name: e.target.value,
    });
  };

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  render() {
    const { user_name, password } = this.state;
    const errors = validate(user_name, password);
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
                      placeholder="User Name"
                      name="user_name"
                      id="userName"
                      onChange={this.handleUserNameChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup className="form__group field">
                    <Input
                      type="password"
                      className="form__field border-top-0 border-left-0 border-right-0"
                      placeholder="Password"
                      name="password"
                      id="password"
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
                  <Link to="fp-admin" className="forgotpass_link">
                    Forgot Password ?
                  </Link>
                </Form>
              </CardBody>
            </Card>
          </div>
          <div className="text-center mt-2">
            <span className="txt1">Don’t have an account ? </span>
            <Link className="txt2" to="/adminReg">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AdminLogin);
