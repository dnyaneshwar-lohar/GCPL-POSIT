import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Textbox, Radiobox } from "react-inputs-validation";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "./AdminReg.css";
import Tooltip from "react-tooltip-lite";
import Toast from "light-toast";
import validator from "validator";
import "antd/dist/antd.css";
import { message, notification } from "antd";
import Select from "react-select";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Message from "../shared/message";

const groupIdOptions = [
  {
    value: "1",
    label: "Super Admin",
  },
  {
    value: "2",
    label: "Admin",
  },
];
message.config({
  top: 100,
  duration: 1,
  maxCount: 1,
  rtl: false,
});

const customStyles = {
  border: "0px solid white",
  option: (provided, state) => ({
    ...provided,
    color: "#21bfb2",
    padding: 10,
    "&:hover": {
      color: "#FFF",
      backgroundColor: "#21bfb2",
    },
  }),
};

var myString = "";
var flagEmail = 0;
var arrayEmail = [];
var flagPhone = 0;
var arrayPhone = [];
var flagUserName = 0;
var arrayUserName = [];
var namePattern = /^[0-9!._@#\$%\^&\*]*$/;
var passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6})/;
var user = "";

class AdminReg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validate: false,
      allEmail: [],
      allPhone: [],
      allUserName: [],
      userName: "",
      password: "",
      userGroupId: "",
      approve_status: "",
      emailId: "",
      phoneNo: "",
      hasUserNameError: true,
      hasPasswordError: true,
      hasEmailIdError: true,
      hasPhoneNoError: true,
    };
  }

  componentDidMount() {
    this.getEmail();
    this.getPhone();
    this.getUserName();
    this.getAllData();
  }
  getAllData = async () => {
    await fetch("http://localhost:4000/api/adminAll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => await response.json())
      .then(
        async (response) =>
          await this.setState({
            authenticated: response.message,
          })
      )
      .catch((err) => console.error(err));
    if (this.state.authenticated === "Data") {
      this.setState({
        userGroupId: 2,
        approve_status: 0,
      });
    }
    if (this.state.authenticated === "Empty") {
      this.setState({
        userGroupId: 1,
        approve_status: 1,
      });
    }
  };

  getEmail = () => {
    fetch("http://localhost:4000/adminEmail")
      .then((response) => response.json())
      .then((findresponse) => {
        this.setState({
          allEmail: findresponse.data,
        });
      })
      .then((findresponse) => {
        this.state.allEmail.map((emailData) => {
          arrayEmail.push(emailData.email_id);
        });
      });
  };
  getPhone = () => {
    fetch("http://localhost:4000/adminPhone")
      .then((response) => response.json())
      .then((findresponse) => {
        this.setState({
          allPhone: findresponse.data,
        });
      })
      .then((findresponse) => {
        this.state.allPhone.map((phoneData) => {
          arrayPhone.push(phoneData.phone_no);
        });
      });
  };
  getUserName = () => {
    fetch("http://localhost:4000/adminUserName")
      .then((response) => response.json())
      .then((findresponse) => {
        this.setState({
          allUserName: findresponse.data,
        });
      })
      .then((findresponse) => {
        this.state.allUserName.map((userNameData) => {
          arrayUserName.push(userNameData.user_name);
        });
      });
  };

  toggleValidating = (validate) => {
    this.setState({
      validate,
    });
  };

  validateForm = (e) => {
    e.preventDefault();
    this.toggleValidating(true);

    const {
      hasUserNameError,
      hasPasswordError,
      hasEmailIdError,
      hasPhoneNoError,
    } = this.state;

    if (
      !hasUserNameError &&
      !hasPasswordError &&
      !hasEmailIdError &&
      !hasPhoneNoError
    ) {
      fetch(
        "http://localhost:4000/adminReg?user_name=" +
          this.state.userName +
          "&password=" +
          this.state.password +
          "&user_group_id=" +
          this.state.userGroupId +
          "&email_id=" +
          this.state.emailId +
          "&phone_no=" +
          this.state.phoneNo +
          "&approve_status=" +
          this.state.approve_status
      ).then((response) => response.json());
      var items = this.state.userName.split(" ");
      Message.success("Hello " + items[0] + ",Your account created successfully..!");
      this.props.history.push("/login");
    } else {
      message.error("Please Fill the Form correctly..!");
    }
  };

  render() {
    const { validate, userName, password, emailId, phoneNo } = this.state;
    return (
      <div className="container ">
        <div className="d-flex justify-content-center">
          <div className="signAdmin">
            <form className="regForm " id="myForm">
              <div className="form-group paddingInput">
                <Textbox
                  attributesInput={{
                    name: "userName",
                    className:
                      "form-control inputAdminFont border-top-0 border-left-0 border-right-0",
                    type: "text",
                    placeholder: "User Name",
                    required: true,
                  }}
                  value={userName}
                  validate={validate}
                  validationCallback={(res) =>
                    this.setState({
                      hasUserNameError: res,
                      validate: false,
                    })
                  }
                  onChange={(userName, e) => {
                    this.setState({
                      userName: userName,
                    });
                  }}
                  onKeyUp={(e) => {}}
                  onBlur={(e) => {}}
                  validationOption={{
                    name: "User Name",
                    reg: /^[a-zA-Z?_]*$/,
                    customFunc: (userName) => {
                      for (var i = 0; i < arrayUserName.length; i++) {
                        if (arrayUserName[i] != this.state.userName) {
                          flagUserName = 1;
                          break;
                        }
                      }
                      for (var i = 0; i < arrayUserName.length; i++) {
                        if (arrayUserName[i] == this.state.userName) {
                          flagUserName = 2;
                          break;
                        }
                      }

                      if (flagUserName == 1 || flagUserName == 0) {
                        return true;
                      }
                      if (flagUserName == 2) {
                        return "This User already exists..!";
                      }
                    },
                  }}
                />
              </div>
              <div className="form-group paddingInput">
                <Textbox
                  attributesInput={{
                    id: "password",
                    name: "password",
                    type: "password",
                    placeholder: "Password",
                    className:
                      "form-control inputAdminFont border-top-0 border-left-0 border-right-0",
                    required: true,
                  }}
                  value={password}
                  validate={validate}
                  validationCallback={(res) =>
                    this.setState({
                      hasPasswordError: res,
                      validate: false,
                    })
                  }
                  onChange={(password, e) => {
                    this.setState({
                      password: password,
                    });
                  }}
                  onBlur={(e) => {}}
                  validationOption={{
                    type: "string",
                    name: "Password",
                    customFunc: (password) => {
                      if (password.match(passPattern)) {
                        return true;
                      } else {
                        return "Password length must be 6,it must contain one capital letter,one small letter and one special character";
                      }
                    },
                  }}
                />
              </div>

              <div className="form-group paddingInput">
                <Textbox
                  attributesInput={{
                    id: "emailId",
                    name: "emailId",
                    type: "text",
                    placeholder: "Email Id",
                    className:
                      "form-control inputAdminFont border-top-0 border-left-0 border-right-0",
                    required: true,
                  }}
                  value={emailId}
                  validate={validate}
                  validationCallback={(res) =>
                    this.setState({
                      hasEmailIdError: res,
                      validate: false,
                    })
                  }
                  onChange={(emailId, e) => {
                    this.setState({
                      emailId: emailId,
                    });
                  }}
                  onBlur={(e) => {}}
                  validationOption={{
                    type: "string",
                    name: "Email",
                    reg: /^[a-zA-Z]+[._]?[a-zA-Z0-9]+\@[a-zA-Z0-9]((-\w+)|(\w*))\.(com|edu|info|gov|int|mil|net|org|biz|name|museum|coop|aero|pro|tv|[a-zA-Z]{2})\.*[a-z.]*$/,
                    customFunc: (emailId) => {
                      for (var i = 0; i < arrayEmail.length; i++) {
                        if (arrayEmail[i] != this.state.emailId) {
                          flagEmail = 1;
                          break;
                        }
                      }
                      for (var i = 0; i < arrayEmail.length; i++) {
                        if (arrayEmail[i] == this.state.emailId) {
                          flagEmail = 2;
                          break;
                        }
                      }

                      if (flagEmail == 1 || flagEmail == 0) {
                        return true;
                      }
                      if (flagEmail == 2) {
                        return "This Email already exists..!";
                      }
                    },
                  }}
                />
              </div>

              <div className="form-group paddingInput">
                <Textbox
                  attributesInput={{
                    id: "phoneNo",
                    name: "phoneNo",
                    type: "text",
                    placeholder: "Phone No",
                    className:
                      "form-control inputAdminFont border-top-0 border-left-0 border-right-0",
                    required: true,
                  }}
                  value={phoneNo}
                  validate={validate}
                  validationCallback={(res) =>
                    this.setState({
                      hasPhoneNoError: res,
                      validate: false,
                    })
                  }
                  onChange={(phoneNo, e) => {
                    this.setState({
                      phoneNo: phoneNo,
                    });
                  }}
                  onBlur={(e) => {}}
                  validationOption={{
                    type: "number",
                    name: "Phone No",
                    length: 10,
                    customFunc: (phoneNo) => {
                      for (var i = 0; i < arrayPhone.length; i++) {
                        if (arrayPhone[i] != this.state.phoneNo) {
                          flagPhone = 1;
                          break;
                        }
                      }
                      for (var i = 0; i < arrayPhone.length; i++) {
                        if (arrayPhone[i] == this.state.phoneNo) {
                          flagPhone = 2;
                          break;
                        }
                      }
                      if (flagPhone == 1 || flagPhone == 0) {
                        return true;
                      }
                      if (flagPhone == 2) {
                        return "This Phone No already exists..!";
                      }
                    },
                  }}
                />
              </div>
              <div className="row">
                <div className="col-sm-2"> </div>
                <div className="col-sm-8">
                  <Button
                    type="submit"
                    className="btn btn-primary btn-block adminRegister "
                    onClick={this.validateForm}
                  >
                    Register
                  </Button>
                </div>
                <div className="col-sm-2"> </div>
              </div>
            </form>
          </div>
        </div>
        <div className="divAdminBottom">
          <span className="txtAdminBottom">Already have an account ?</span>{" "}
          <Link className="txtAdminLogin" to="/login">
            Sign In
          </Link>
        </div>
      </div>
    );
  }
}

export default AdminReg;
